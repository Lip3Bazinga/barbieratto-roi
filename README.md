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

## Notas

- O formulário de lead não envia dados a lugar nenhum: o submit apenas avança para
  o diagnóstico. Integrar a um CRM exige implementar o envio em `script.js`.
- A calculadora depende de JavaScript; sem ele, um aviso aparece no lugar.
- A versão anterior em Next.js está no histórico, no commit `4d32cef`.
