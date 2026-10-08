/* Portuguese mirror of ../hire.ts (/pt-br/hire). Text only: logos, numbers, sources, slugs and initials come from the
   English file. Same rules as English: about 200 words, no tech words, no prices. The offer terms (free first chat,
   nothing upfront, pay after each shipped piece, reply in 1 business day) must say exactly what the English says. */
import {
  CALL as EN_CALL, HERO as EN_HERO, PATH as EN_PATH, PAY as EN_PAY, PICTURE as EN_PICTURE, PROOF as EN_PROOF,
  SEND as EN_SEND, TEMPO as EN_TEMPO, TRUST as EN_TRUST,
} from '../hire';

export const HERO: typeof EN_HERO = {
  title: 'Vamos tirar sua ideia do papel.',
  lede: 'Sites e aplicativos para pequenas empresas e novos empreendedores. Pensados e construídos por mim.',
  cta: 'Entre em contato',
  /** the hero's name for screen readers */
  label: 'Vamos tirar sua ideia do papel',
  shot: { alt: 'A página da Tempo, que eu redesenhei' },
  /** the trailing space is non-breaking, so the arrow never wraps alone */
  seeCase: 'Ver o case ',
};

const [s7, s30, s2x, s3mo] = EN_TRUST.stats;
export const TRUST: typeof EN_TRUST = {
  label: 'Empresas para quem já trabalhei',
  clients: EN_TRUST.clients,
  stats: [
    { ...s7, what: 'anos criando produtos que as pessoas usam' },
    { ...s30, what: 'empresas e times para quem já criei' },
    { ...s2x, what: 'mais downloads do app virando vendas' },
    { ...s3mo, n: '<\u00a03 meses', what: 'de uma ideia a um produto no ar' },
  ],
};

export const PATH: typeof EN_PATH = {
  title: 'Não sabe bem do que precisa? Deixa comigo.',
  steps: ['A gente conversa', 'A gente rascunha junto', 'A gente cria pra valer', 'A gente coloca no ar'],
  end: 'Seu negócio na internet.',
};

const reach = EN_PICTURE.screens.reach;
/** made-up people: the initials stay the English ones, so the names here start with the same letters */
const FEED: [string, string][] = [
  ['Ana M. se cadastrou', 'Achou você no Google'],
  ['Leo R. se cadastrou', 'Viu você no Instagram'],
  ['Júlia S. se cadastrou', 'Veio por indicação'],
  ['Mateus T. se cadastrou', 'Voltou pelo seu e-mail'],
];
export const PICTURE: typeof EN_PICTURE = {
  title: 'Imagine isso funcionando.',
  lede: 'Cada ideia é diferente. O objetivo é o mesmo: trabalhar a seu favor.',
  moments: ['Novos clientes encontram você', 'O trabalho repetitivo se resolve sozinho', 'Os clientes saem satisfeitos', 'O dinheiro entra'],
  screens: {
    reach: {
      head: 'Novos clientes', sub: 'Esta semana',
      days: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
      feed: reach.feed.map(([initials], i) => [initials, ...FEED[i]]),
    },
    busywork: {
      head: 'Hoje', sub: 'Feito para você',
      tasks: ['Mandar as cobranças da semana', 'Confirmar os pedidos novos', 'Lembrar os clientes de amanhã', 'Atualizar a planilha de vendas', 'Responder as perguntas de sempre'],
      done: 'Tudo feito', left: 'Nada pendente na sua lista',
    },
    happy: {
      head: 'Avaliações', sub: 'O que os clientes dizem',
      fresh: { text: '“Muito fácil. Resolvi em dois minutos.”', who: 'Ana M. · agora' },
      old: { text: '“Chega de esperar no telefone.”', who: 'Leo R. · ontem' },
    },
    paid: {
      clock: EN_PICTURE.screens.paid.clock, day: 'Hoje',
      /** the same made-up amounts as English, in reais */
      notes: [['+R$ 49 recebidos', 'Plano mensal · Ana M.'], ['+R$ 120 recebidos', 'Pedido nº 1042'], ['+R$ 80 recebidos', 'Sinal de reserva · Leo R.']],
    },
  },
};

const [c15, c3mo, c500] = EN_PROOF.cards;
export const PROOF: typeof EN_PROOF = {
  title: 'Já fiz isso antes.',
  /** a card's name for screen readers; `{n}` `{what}` `{client}` are that card's number, line and client */
  cardLabel: '{n} {what}. Case: {client}',
  cards: [
    { ...c15, what: 'mais itens no carrinho depois que redesenhei como as pessoas encontram as promoções', kind: 'App de supermercado' },
    { ...c3mo, n: '<\u00a03 meses', what: 'de uma ideia a um produto no ar, para pagamentos seguros na venda de carros', kind: 'Negócio novo' },
    { ...c500, what: 'funcionários: o tamanho dos novos clientes que o app de benefícios trouxe', kind: 'Cartões de benefícios' },
  ],
  /** hidden until a real client quote is confirmed (same as English) */
  quote: EN_PROOF.quote,
};

export const PAY: typeof EN_PAY = {
  title: 'Você paga conforme eu entrego.',
  lede: 'Nada adiantado. Cada pagamento vem depois de algo pronto e entregue.',
  pieces: [
    { label: 'Etapa 1', title: 'Site pronto' },
    { label: 'Etapa 2', title: 'Pedidos e pagamentos prontos' },
    { label: 'Etapa 3', title: 'No ar' },
  ],
  /** the two lanes of the timeline: what I deliver, then what you pay */
  lanes: { deliver: 'Entrega', pay: 'Pagamento' },
  /** the message of the section: each payment, placed after its piece is delivered */
  receipt: 'Você paga esta etapa',
};

export const CALL: typeof EN_CALL = {
  ask: 'O que está esperando?',
  title: 'Para começar, basta uma mensagem.',
  /** the arrow's name for screen readers */
  to: 'Ir para o formulário',
};

export const SEND: typeof EN_SEND = {
  title: 'Sua ideia começa aqui.',
  chips: ['Primeira conversa grátis', 'Nada adiantado', 'Tudo fica com você'],
  reply: 'Respondo em até 1 dia útil.',
};

/** The caption under the Tempo shot names the section on screen (Tempo's own page, in English). One per stop. */
export const TEMPO: typeof EN_TEMPO = {
  stops: ['Abertura', 'Produto', 'Conecte seu código', 'Design system', 'Tarefas e versões', 'Design à mão', 'Crie com IA', 'Envio para o Git', 'Depoimentos', 'Just Ship It'],
};
