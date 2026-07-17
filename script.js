/**
 * Calculadora de margem — marketplace vs. e-commerce próprio.
 */
(function () {
  "use strict";

  // Premissas fixas do briefing
  var MARKETPLACE_COST = 0.35; // 35%
  var OWN_ECOMMERCE_COST = 0.23; // 23%
  var DIFFERENCE = MARKETPLACE_COST - OWN_ECOMMERCE_COST; // 12 pontos percentuais

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
      startBlock.classList.add("is-leaving");
      startBtn.setAttribute("aria-expanded", "true");

      var t = setTimeout(function () {
        startBlock.hidden = true;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
