/**
 * Calculadora de margem — marketplace vs. e-commerce próprio.
 */
(function () {
  "use strict";

  // Premissas fixas do briefing
  var MARKETPLACE_COST = 0.35; // 35%
  var OWN_ECOMMERCE_COST = 0.23; // 23%
  var DIFFERENCE = MARKETPLACE_COST - OWN_ECOMMERCE_COST; // 12 pontos percentuais

  var WEBHOOK_URL = "https://hooksfrontx.frontxdigital.com/webhook/calculadora-barbieratto";

  var SCHEDULE_URL = "https://api.leadconnectorhq.com/widget/bookings/barbieratto-consultoria";

  // Tempo com o modal de agradecimento na tela antes do site reiniciar.
  var THANKS_DURATION = 4000;

  var MIN_REVENUE = 10000;

  var marketplaces = [
    { id: "mercado-livre", label: "Mercado Livre" },
    { id: "shopee", label: "Shopee" },
    { id: "amazon", label: "Amazon" },
    { id: "magalu", label: "Magalu" },
    { id: "tiktok-shop", label: "TikTok Shop" },
    { id: "outro", label: "Outro" },
  ];

  var niches = [
    { id: "moda", label: "Moda e acessórios" },
    { id: "beleza", label: "Beleza" },
    { id: "casa", label: "Casa e decoração" },
    { id: "eletronicos", label: "Eletrônicos" },
    { id: "infantil", label: "Infantil" },
    { id: "alimentos", label: "Alimentos" },
    { id: "pet", label: "Pet" },
    { id: "autopecas", label: "Autopeças" },
    { id: "outro", label: "Outro" },
  ];

  var processingMessages = [
    "Analisando seu faturamento...",
    "Comparando os custos do marketplace com uma operação própria...",
    "Calculando sua margem potencial...",
    "Preparando seu diagnóstico...",
  ];

  var STEP_ORDER = ["marketplace", "revenue", "niche"];

  var state = {
    step: "marketplace",
    marketplace: "",
    marketplaceOther: "",
    revenue: "",
    niche: "",
    nicheOther: "",
    name: "",
    email: "",
    whatsapp: "",
  };

  var timers = [];

  // -- Formatação -----------------------------------------------------------

  var brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  /** Formata o que foi digitado como moeda, tratando os dígitos como centavos. */
  function formatCurrencyInput(value) {
    var digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return brl.format(parseInt(digits, 10) / 100);
  }

  function parseCurrency(value) {
    var digits = value.replace(/\D/g, "");
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
  }

  /** Máscara progressiva de telefone BR: (11) 91234-5678. */
  function formatPhone(value) {
    var d = value.replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Conta de 0 até o valor em BRL; vai direto ao fim se o usuário pediu menos movimento. */
  function countUp(el, target) {
    if (reducedMotion.matches) {
      el.textContent = brl.format(target);
      return;
    }
    var DURATION = 1100;
    var start = null;
    var tick = function (now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = brl.format(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // -- Elementos ------------------------------------------------------------

  var $ = function (id) {
    return document.getElementById(id);
  };

  var steps = document.querySelectorAll("[data-step]");
  var calc = $("calc");
  var startBtn = $("start");
  var startBlock = $("start-block");
  var progress = $("progress");
  var progressBars = $("progress-bars");
  var revenueInput = $("revenue");
  var revenueError = $("revenue-error");
  var leadForm = $("lead-form");
  var leadSubmit = $("lead-submit");

  // -- Render ---------------------------------------------------------------

  var ANIM_CLASSES = [
    "animate-in-forward",
    "animate-in-back",
    "animate-out-forward",
    "animate-out-back",
    "animate-in-zoom",
  ];

  var FLOW = ["marketplace", "revenue", "niche", "processing", "preview", "capture", "diagnosis"];

  function stepEl(name) {
    return document.querySelector('[data-step="' + name + '"]');
  }

  /**
   * Troca de passo: anima a saída do atual, então a entrada do novo.
   * A altura do card é travada durante a troca pra não haver salto.
   */
  function setStep(next) {
    var current = stepEl(state.step);
    var incoming = stepEl(next);
    var back = FLOW.indexOf(next) < FLOW.indexOf(state.step);
    var first = !current || current.hidden;

    state.step = next;

    var enter = function () {
      // Trava a altura atual e anima até a nova, evitando o salto do card.
      var from = calc.getBoundingClientRect().height;

      steps.forEach(function (el) {
        el.hidden = el !== incoming;
      });

      ANIM_CLASSES.forEach(function (c) {
        incoming.classList.remove(c);
      });
      void incoming.offsetWidth;

      var zooms = next === "preview" || next === "diagnosis";
      incoming.classList.add(
        zooms ? "animate-in-zoom" : back ? "animate-in-back" : "animate-in-forward"
      );

      syncProgress(next);

      var to = calc.getBoundingClientRect().height;
      if (!first && Math.abs(to - from) > 1) {
        calc.style.height = from + "px";
        void calc.offsetHeight;
        calc.style.height = to + "px";
        var done = setTimeout(function () {
          calc.style.height = "";
        }, 420);
        timers.push(done);
      }

      if (next === "processing") runProcessing();
      if (next === "diagnosis") renderDiagnosis();

      // O botão clicado acabou de sumir; devolve o foco ao passo que entrou.
      // Passos com campo visível focam o campo, os demais focam a seção.
      var field = incoming.querySelector(".field:not([hidden]) .input");
      (field || incoming).focus({ preventScroll: true });
    };

    if (first) {
      enter();
      return;
    }

    ANIM_CLASSES.forEach(function (c) {
      current.classList.remove(c);
    });
    void current.offsetWidth;
    current.classList.add(back ? "animate-out-back" : "animate-out-forward");

    var t = setTimeout(enter, 200);
    timers.push(t);
  }

  function syncProgress(next) {
    var index = STEP_ORDER.indexOf(next);
    progress.hidden = index < 0;

    if (index >= 0) {
      Array.prototype.forEach.call(progressBars.children, function (bar, i) {
        bar.classList.toggle("is-active", i <= index);
      });
    }
  }

  function buildOptions(container, items, key) {
    items.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.textContent = item.label;
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", function () {
        state[key] = item.id;

        Array.prototype.forEach.call(container.children, function (el) {
          el.setAttribute("aria-pressed", String(el === btn));
          el.classList.remove("is-picked");
        });

        // Reinicia a animação de pulso mesmo se a opção já estava marcada.
        void btn.offsetWidth;
        btn.classList.add("is-picked");

        var otherField = $(key + "-other-field");
        otherField.hidden = item.id !== "outro";
        if (item.id === "outro") {
          otherField.classList.add("animate-fade");
          $(key + "-other").focus({ preventScroll: true });
        } else {
          state[key + "Other"] = "";
          $(key + "-other").value = "";
        }

        syncGate(key);
      });

      container.appendChild(btn);
    });
  }

  /** Habilita o "Continuar" do passo: exige escolha e, se "Outro", o texto livre. */
  function syncGate(key) {
    var chosen = state[key];
    var other = state[key + "Other"].trim();
    $(key === "marketplace" ? "marketplace-next" : "niche-next").disabled = !(
      chosen &&
      (chosen !== "outro" || other)
    );
  }

  function syncLeadGate() {
    leadSubmit.disabled = !(
      $("name").value.trim() &&
      $("email").value.trim() &&
      $("whatsapp").value.trim()
    );
  }

  // -- Passos ---------------------------------------------------------------

  function validateRevenue() {
    var value = parseCurrency(state.revenue);
    var message = "";

    if (value <= 0) {
      message = "Informe um faturamento válido maior que zero.";
    } else if (value < MIN_REVENUE) {
      message =
        "Confira se você informou o faturamento total dos últimos 12 meses, e não apenas o faturamento de um mês.";
    }

    revenueError.textContent = message;
    revenueError.hidden = !message;
    revenueInput.classList.toggle("has-error", Boolean(message));
    if (message) revenueError.classList.add("animate-fade");

    return !message;
  }

  function runProcessing() {
    var message = $("processing-message");
    var dots = $("processing-dots");
    var index = 0;

    var paint = function () {
      message.textContent = processingMessages[index];
      message.classList.remove("animate-fade");
      void message.offsetWidth;
      message.classList.add("animate-fade");

      Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.classList.toggle("is-active", i <= index);
      });
    };

    paint();

    var interval = setInterval(function () {
      if (index >= processingMessages.length - 1) {
        clearInterval(interval);
        return;
      }
      index++;
      paint();
    }, 900);

    var timeout = setTimeout(function () {
      setStep("preview");
    }, 3600);

    timers.push(interval, timeout);
  }

  function renderDiagnosis() {
    var revenue = parseCurrency(state.revenue);
    var annual = revenue * DIFFERENCE;

    $("lead-name").textContent = state.name.split(" ")[0] || "Olá";
    countUp($("annual-value"), annual);
    countUp($("monthly-value"), annual / 12);
  }

  /** Mostra/limpa o erro de um campo do formulário de captura. */
  function fieldError(id, message) {
    var el = $(id + "-error");
    el.textContent = message;
    el.hidden = !message;
    $(id).classList.toggle("has-error", Boolean(message));
    if (message) el.classList.add("animate-fade");
  }

  // -- Intro das logos ------------------------------------------------------

  /**
   * Entrada estilo Apple: as logos surgem grandes no centro e encolhem até a
   * posição real delas no topo.
   *
   * FLIP (First, Last, Invert, Play): em vez de adivinhar coordenadas, mede a
   * caixa final das placas já renderizadas, clona-as num overlay e aplica a
   * transformação inversa (centro + escala grande). Ao soltar, elas "caem" no
   * lugar exato — o destino continua certo em qualquer viewport ou resize.
   */
  function runIntro() {
    var intro = $("intro");
    var stage = $("intro-stage");
    var plates = document.querySelectorAll(".hero__initiative--top .hero__initiative-plate");

    if (!intro || !stage || !plates.length) return;

    var root = document.documentElement;
    root.classList.add("is-intro");
    intro.hidden = false;

    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var first = [];
    plates.forEach(function (plate) {
      first.push(plate.getBoundingClientRect());
    });

    // Caixa que envolve o conjunto das placas na posição final.
    var groupLeft = Math.min.apply(null, first.map(function (r) { return r.left; }));
    var groupRight = Math.max.apply(null, first.map(function (r) { return r.right; }));
    var groupTop = Math.min.apply(null, first.map(function (r) { return r.top; }));
    var groupBottom = Math.max.apply(null, first.map(function (r) { return r.bottom; }));

    var groupWidth = groupRight - groupLeft;
    var groupHeight = groupBottom - groupTop;
    if (!groupWidth || !groupHeight) return;

    // Ocupa o centro da tela: alvo limitado pela largura e pela altura, para
    // não estourar em telas estreitas nem em telas baixas (paisagem no mobile).
    var targetWidth = Math.min(vw * 0.72, 900);
    var targetHeight = Math.min(vh * 0.55, targetWidth * (groupHeight / groupWidth));
    var scale = Math.min(targetWidth / groupWidth, targetHeight / groupHeight);

    // Centros: do conjunto (posição final) e da viewport (posição herói).
    var gcx = (groupLeft + groupRight) / 2;
    var gcy = (groupTop + groupBottom) / 2;
    var vcx = vw / 2;
    var vcy = vh / 2;

    var clones = [];

    plates.forEach(function (plate, i) {
      var rect = first[i];
      var clone = plate.cloneNode(true);
      clone.className = "hero__initiative-plate intro__plate";

      // O clone nasce exatamente sobre o destino final...
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";

      // ...e "inverte" para o estado grande e centralizado. Cada placa é
      // escalada em torno do centro do conjunto e o conjunto é levado ao
      // centro da tela — assim as duas mantêm o mesmo arranjo, só que enorme.
      // Com transform-origin no canto, tx/ty são o quanto o canto superior
      // esquerdo precisa andar até a sua posição ampliada.
      var mappedLeft = gcx + scale * (rect.left - gcx) + (vcx - gcx);
      var mappedTop = gcy + scale * (rect.top - gcy) + (vcy - gcy);
      var tx = mappedLeft - rect.left;
      var ty = mappedTop - rect.top;

      clone.style.transform =
        "translate(" + tx + "px, " + ty + "px) scale(" + scale + ")";

      stage.appendChild(clone);
      clones.push(clone);
    });

    // Movimento reduzido: mantemos uma abertura, mas sem o voo/escala das
    // placas — só um fade delas no lugar final e a revelação da página. Fade
    // é considerado seguro para quem pede menos movimento; o que evitamos é o
    // deslocamento grande. Os clones ficam parados (transform já é o final).
    if (reducedMotion.matches) {
      clones.forEach(function (clone) {
        clone.style.transform = "translate(0, 0) scale(1)";
      });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          intro.classList.add("is-live");
        });
      });

      var revealCalm = setTimeout(function () {
        root.classList.add("is-intro-revealing");
      }, 700);

      var doneCalm = setTimeout(function () {
        finishIntro(intro, root);
      }, 1100);

      timers.push(revealCalm, doneCalm);
      return;
    }

    // Coreografia (ms a partir daqui):
    //   0    → placas grandes e paradas no centro (o "momento herói")
    //   HOLD → começam a encolher rumo à posição final
    //   +DUR → chegaram; a página já apareceu por baixo no meio do caminho
    var HOLD = 850; // tempo paradas, grandes, antes de encolher
    var DURATION = 1400; // duração do encolhimento
    var REVEAL_LEAD = 550; // quanto antes do fim a página surge

    // Uma classe extra na intro dispara a entrada dos clones (fade+leve zoom),
    // para eles não "piscarem" prontos no primeiro frame com o cache quente.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        intro.classList.add("is-live");
      });
    });

    // Play: só depois do HOLD soltamos a transformação. Como a transição é
    // definida agora (e não no primeiro frame), o navegador tem certeza do
    // estado inicial pintado e interpola de verdade — sem pular direto ao fim.
    var play = setTimeout(function () {
      clones.forEach(function (clone, i) {
        clone.style.transition =
          "transform " + DURATION + "ms cubic-bezier(0.62, 0.02, 0.16, 1) " + i * 0.09 + "s";
        clone.style.transform = "translate(0, 0) scale(1)";
      });
    }, HOLD);

    // Revela a página um pouco antes do pouso: as logos chegam sobre o
    // conteúdo já visível, em vez de tudo aparecer de uma vez.
    var reveal = setTimeout(function () {
      root.classList.add("is-intro-revealing");
    }, HOLD + DURATION - REVEAL_LEAD);

    var done = setTimeout(function () {
      finishIntro(intro, root);
    }, HOLD + DURATION);

    timers.push(play, reveal, done);
  }

  function finishIntro(intro, root) {
    root.classList.add("is-intro-revealing");
    intro.classList.add("is-done");

    var t = setTimeout(function () {
      intro.hidden = true;
      root.classList.remove("is-intro", "is-intro-revealing");
    }, 520);

    timers.push(t);
  }

  // -- Webhook --------------------------------------------------------------

  /** Rótulo legível da opção escolhida; "Outro" vira o texto que a pessoa digitou. */
  function labelFor(items, id, other) {
    if (id === "outro") return other.trim();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i].label;
    }
    return "";
  }

  /** Parâmetros de campanha da URL — os que vierem vazios não vão no payload. */
  function trackingParams() {
    var keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
    ];
    var params = new URLSearchParams(window.location.search);
    var out = {};

    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) out[key] = value;
    });

    return out;
  }

  function buildPayload() {
    var revenue = parseCurrency(state.revenue);
    var annual = revenue * DIFFERENCE;
    var phoneDigits = state.whatsapp.replace(/\D/g, "");

    return {
      // Dados de captação
      nome: state.name.trim(),
      email: state.email.trim(),
      whatsapp: state.whatsapp.trim(),
      whatsapp_e164: phoneDigits ? "+55" + phoneDigits : "",

      // Respostas da calculadora
      marketplace: labelFor(marketplaces, state.marketplace, state.marketplaceOther),
      marketplace_id: state.marketplace,
      nicho: labelFor(niches, state.niche, state.nicheOther),
      nicho_id: state.niche,
      faturamento_12m: revenue,
      faturamento_12m_formatado: brl.format(revenue),

      // Resultado apresentado
      margem_recuperavel_percentual: Math.round(DIFFERENCE * 100),
      valor_anual: Math.round(annual * 100) / 100,
      valor_anual_formatado: brl.format(annual),
      valor_mensal: Math.round((annual / 12) * 100) / 100,
      valor_mensal_formatado: brl.format(annual / 12),

      // Contexto
      origem: "calculadora-barbieratto",
      pagina: window.location.href,
      referrer: document.referrer || "",
      enviado_em: new Date().toISOString(),
      tracking: trackingParams(),
    };
  }

  /**
   * Envia o lead sem bloquear o fluxo: o diagnóstico aparece na hora e a
   * falha de rede não trava a pessoa numa tela de erro. keepalive garante
   * a entrega mesmo se a aba for fechada logo após o submit.
   */
  function sendLead() {
    var payload = buildPayload();

    try {
      return fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      })["catch"](function () {
        /* rede indisponível — o diagnóstico segue normalmente */
      });
    } catch (err) {
      return null;
    }
  }

  // -- Reinício e agradecimento --------------------------------------------

  /** Zera o estado e todos os campos, deixando o fluxo pronto pra recomeçar. */
  function resetState() {
    state.step = "marketplace";
    state.marketplace = "";
    state.marketplaceOther = "";
    state.revenue = "";
    state.niche = "";
    state.nicheOther = "";
    state.name = "";
    state.email = "";
    state.whatsapp = "";

    // Opções: tira a marcação e some com os campos "Outro".
    ["marketplace", "niche"].forEach(function (key) {
      Array.prototype.forEach.call($(key + "-options").children, function (el) {
        el.setAttribute("aria-pressed", "false");
        el.classList.remove("is-picked");
      });
      $(key + "-other").value = "";
      $(key + "-other-field").hidden = true;
      syncGate(key);
    });

    // Campos de texto e seus erros.
    ["revenue", "name", "email", "whatsapp"].forEach(function (id) {
      $(id).value = "";
      $(id).classList.remove("has-error");
    });
    ["revenue", "email", "whatsapp"].forEach(function (id) {
      var err = $(id + "-error");
      err.textContent = "";
      err.hidden = true;
    });
    leadSubmit.disabled = true;
  }

  /** Volta o site para a primeira tela (hero + botão "Começar a análise"). */
  function resetToStart() {
    var heroContent = document.querySelector(".hero__content");

    // Esconde a calculadora e reexibe o hero como estava no início.
    calc.hidden = true;
    calc.classList.remove("is-entering");
    calc.parentElement.classList.remove("is-revealed");

    startBlock.hidden = false;
    startBlock.classList.remove("is-leaving");
    heroContent.hidden = false;
    heroContent.classList.remove("is-leaving");
    startBtn.setAttribute("aria-expanded", "false");

    resetState();
    setStep("marketplace");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  var thanks = $("thanks");
  var thanksTimer = null;

  function closeThanks() {
    if (thanks.hidden) return;
    if (thanksTimer) {
      clearTimeout(thanksTimer);
      thanksTimer = null;
    }

    thanks.classList.add("is-leaving");
    var t = setTimeout(function () {
      thanks.hidden = true;
      thanks.classList.remove("is-leaving");
      resetToStart();
    }, 300);
    timers.push(t);
  }

  function openThanks() {
    thanks.hidden = false;
    thanks.classList.remove("is-leaving");
    $("thanks-close").focus({ preventScroll: true });

    // Fecha sozinho e reinicia; o usuário também pode fechar antes no botão.
    thanksTimer = setTimeout(closeThanks, THANKS_DURATION);
    timers.push(thanksTimer);
  }

  // -- Ligações -------------------------------------------------------------

  function init() {
    // Alvo de foco programático na troca de passos.
    steps.forEach(function (el) {
      el.setAttribute("tabindex", "-1");
    });

    STEP_ORDER.forEach(function () {
      var bar = document.createElement("div");
      bar.className = "calc__progress-bar";
      progressBars.appendChild(bar);
    });

    processingMessages.forEach(function () {
      var dot = document.createElement("div");
      dot.className = "calc__dot";
      $("processing-dots").appendChild(dot);
    });

    buildOptions($("marketplace-options"), marketplaces, "marketplace");
    buildOptions($("niche-options"), niches, "niche");

    $("marketplace-other").addEventListener("input", function (e) {
      state.marketplaceOther = e.target.value;
      syncGate("marketplace");
    });

    $("niche-other").addEventListener("input", function (e) {
      state.nicheOther = e.target.value;
      syncGate("niche");
    });

    revenueInput.addEventListener("input", function (e) {
      var formatted = formatCurrencyInput(e.target.value);
      e.target.value = formatted;
      state.revenue = formatted;

      revenueError.hidden = true;
      revenueInput.classList.remove("has-error");
    });

    // Enter avança, como o usuário espera num fluxo de perguntas.
    revenueInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        $("revenue-next").click();
      }
    });

    ["marketplace", "niche"].forEach(function (key) {
      $(key + "-other").addEventListener("keydown", function (e) {
        var next = $(key + "-next");
        if (e.key === "Enter" && !next.disabled) {
          e.preventDefault();
          next.click();
        }
      });
    });

    startBtn.addEventListener("click", function () {
      var heroContent = document.querySelector(".hero__content");

      startBlock.classList.add("is-leaving");
      heroContent.classList.add("is-leaving");
      startBtn.setAttribute("aria-expanded", "true");

      var t = setTimeout(function () {
        startBlock.hidden = true;
        heroContent.hidden = true;
        calc.hidden = false;
        calc.parentElement.classList.add("is-revealed");
        calc.classList.add("is-entering");

        // Sem o scroll, o card pode nascer fora da tela no mobile.
        // inline:"nearest" evita que o container desvie na horizontal.
        calc.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

        var focusable = calc.querySelector("button");
        if (focusable) focusable.focus({ preventScroll: true });
      }, 300);

      timers.push(t);
    });

    $("marketplace-next").addEventListener("click", function () {
      setStep("revenue");
    });

    $("revenue-next").addEventListener("click", function () {
      if (validateRevenue()) setStep("niche");
    });

    $("niche-next").addEventListener("click", function () {
      setStep("processing");
    });

    $("reveal").addEventListener("click", function () {
      setStep("capture");
    });

    $("schedule").addEventListener("click", function () {
      // Mostra o agradecimento primeiro: assim o modal aparece mesmo que o
      // navegador bloqueie o popup ou window.open falhe por alguma política.
      openThanks();

      // Abre a agenda em nova aba; se o popup for bloqueado, não trava o fluxo.
      try {
        window.open(SCHEDULE_URL, "_blank", "noopener");
      } catch (err) {
        /* popup bloqueado — o modal e o reinício seguem normalmente */
      }
    });

    $("thanks-close").addEventListener("click", closeThanks);

    // Esc fecha o modal (e reinicia), como esperado num diálogo.
    thanks.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeThanks();
    });

    document.querySelectorAll("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setStep(state.step === "revenue" ? "marketplace" : "revenue");
      });
    });

    // A máscara roda antes do gate: os listeners disparam na ordem de registro.
    $("whatsapp").addEventListener("input", function (e) {
      e.target.value = formatPhone(e.target.value);
    });

    ["email", "whatsapp"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        fieldError(id, "");
      });
    });

    ["name", "email", "whatsapp"].forEach(function (id) {
      $(id).addEventListener("input", syncLeadGate);
    });

    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($("email").value.trim());
      var phoneOk = $("whatsapp").value.replace(/\D/g, "").length >= 10;

      fieldError("email", emailOk ? "" : "Confira o e-mail — parece incompleto.");
      fieldError(
        "whatsapp",
        phoneOk ? "" : "Informe um WhatsApp com DDD, ex.: (11) 91234-5678."
      );

      var firstInvalid = !emailOk ? $("email") : !phoneOk ? $("whatsapp") : null;
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      state.name = $("name").value;
      state.email = $("email").value;
      state.whatsapp = $("whatsapp").value;

      sendLead();
      setStep("diagnosis");
    });

    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("is-hidden-tab", document.hidden);
    });

    window.addEventListener("pagehide", function () {
      timers.forEach(clearTimeout);
      timers.forEach(clearInterval);
    });

    setStep("marketplace");

    // As logos são imagens: medir antes de carregarem daria caixas erradas.
    // window.load garante layout estável; o timeout evita que uma imagem
    // lenta segure a intro para sempre.
    if (document.readyState === "complete") {
      runIntro();
    } else {
      var started = false;
      var start = function () {
        if (started) return;
        started = true;
        runIntro();
      };
      window.addEventListener("load", start, { once: true });
      timers.push(setTimeout(start, 1200));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
