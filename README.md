# barbieratto-roi

Calculadora de margem — compara o custo de vender em marketplaces com o de uma
operação de e-commerce própria e estima quanto de margem o lojista deixa na mesa.

Página única em HTML, CSS e JavaScript puros. Sem dependências, sem build.

## Como rodar

Abra `index.html` no navegador.

Para servir via HTTP (opcional):

```bash
python -m http.server 8000
# ou
npx serve .
```

## Estrutura

```
index.html      marcação da página e dos 7 passos da calculadora
styles.css      estilos, variáveis de tema e animações
script.js       máquina de estados dos passos, formatação de moeda e cálculo
assets/         imagens (logos, foto do especialista, favicons)
```

## A conta

A calculadora usa premissas fixas de briefing:

| Canal              | Custo médio |
| ------------------ | ----------- |
| Marketplace        | 35%         |
| E-commerce próprio | 23%         |

A diferença de 12 pontos percentuais é aplicada sobre o faturamento informado dos
últimos 12 meses. Para R$ 1.200.000, o resultado é R$ 144.000 no ano (R$ 12.000/mês).

As premissas ficam no topo de `script.js` (`MARKETPLACE_COST`, `OWN_ECOMMERCE_COST`).

## Envio do lead

No submit do formulário, os dados vão por `POST` (JSON) para o webhook definido em
`WEBHOOK_URL`, no topo de `script.js`.

O envio não bloqueia a interface: o diagnóstico aparece na hora e uma falha de rede
não prende a pessoa numa tela de erro. O `keepalive` mantém a entrega mesmo se a aba
for fechada logo após o envio.

O payload leva os dados de captação (`nome`, `email`, `whatsapp` e `whatsapp_e164`),
todas as respostas da calculadora (`marketplace`, `nicho`, `faturamento_12m` — com os
`*_id` e o texto livre quando a escolha é "Outro"), o resultado apresentado
(`valor_anual`, `valor_mensal`, `margem_recuperavel_percentual`, em número e
formatado) e o contexto (`origem`, `pagina`, `referrer`, `enviado_em` e `tracking`
com UTMs, `gclid` e `fbclid` quando presentes na URL).

## Notas

- A calculadora depende de JavaScript; sem ele, um aviso aparece no lugar.
- O botão "Quero agendar uma reunião" ainda não tem ação: falta definir o destino
  (link do Calendly, WhatsApp etc.).
- A versão anterior em Next.js está no histórico, no commit `4d32cef`.
