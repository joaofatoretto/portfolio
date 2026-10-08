/* Portuguese mirror of ../profile.ts. Text only: numbers, sources, names and channel numbers come from the English file.
   Every claim comes from ../resume/master/career.md; don't add one that isn't there. */
import { CHANNELS as EN_CHANNELS, FACTS as EN_FACTS, HOME as EN_HOME, LOOP as EN_LOOP, PRODUCTS as EN_PRODUCTS, PROOF as EN_PROOF, STEPS as EN_STEPS } from '../profile';

const [p2x, p15, pMinutes, pMonths] = EN_PROOF;
export const PROOF: typeof EN_PROOF = [
  { ...p2x, what: 'Conversão de download do app em compra, em um ano' },
  { ...p15, what: 'Conversão de adição ao carrinho depois de um redesign das promoções' },
  { ...pMinutes, n: 'Minutos', what: 'E não semanas, para admins de estudos clínicos mudarem perguntas de perfil' },
  { ...pMonths, n: '<\u00a03 meses', what: 'Da ideia a um MVP de fintech no ar, liderando 3 designers' },
];

export const STEPS: typeof EN_STEPS = [
  { name: 'Escutar', text: 'Entrevistas, analytics, tickets de suporte e pesquisas. Na Syneos Health, uma pesquisa de interceptação revelou dores que ninguém no time conhecia.' },
  { name: 'Achar o sinal', text: 'Muitas entradas, um problema que vale resolver. Na Superopa, o CTO pediu um cronômetro de contagem regressiva. O funil mostrou que as pessoas nem encontravam as promoções.' },
  { name: 'Desenhar', text: 'Fluxos, estados e sistemas que um time pode reaproveitar. Meu template no Figma Make virou o jeito padrão do meu time de explorar ideias, dentro do design system, em horas em vez de semanas.' },
  { name: 'Construir', text: 'React e TypeScript em produção, ou um teste de viabilidade em código antes do handoff, para que os engenheiros recebam designs que dá para construir com bibliotecas comuns.' },
];

const [nikki, pixel, creative] = EN_PRODUCTS;
export const PRODUCTS: typeof EN_PRODUCTS = [
  { ...nikki, status: 'Beta · 2 empresas',
    text: 'Um sistema de IA no WhatsApp para pequenas empresas. Ele pede a opinião dos clientes, transforma os satisfeitos em avaliações no Google e manda o resto para o dono como feedback privado.',
    stack: 'Agentes Mastra · Node.js no Railway · PostgreSQL no Supabase · login com WhatsApp' },
  { ...pixel, status: 'Perto do lançamento',
    text: 'Modelos de imagem não conseguem desenhar pixel art de verdade. Meu próprio algoritmo transforma o que eles geram em pixel art limpa e consistente, para estúdios de games indie e artistas.',
    stack: 'React · TypeScript · Tailwind · o algoritmo roda no servidor, no Railway' },
  { ...creative, status: 'Em desenvolvimento',
    text: 'Agentes que criam sozinhos peças de anúncio fiéis à marca, para times de marketing.',
    stack: 'Agentes Mastra · TypeScript · PostgreSQL' },
];

const LOOP_TEXT = [
  'Eu escrevo os critérios de aceite e sou dono da arquitetura.',
  'Os testes vêm primeiro: TDD comportamental e ponta a ponta.',
  'O Claude Code escreve a implementação.',
  'Testes e checagem de tipos passam primeiro. Depois eu reviso.',
];
export const LOOP: typeof EN_LOOP = EN_LOOP.map(([n], i) => [n, LOOP_TEXT[i]]);

const FACTS_TEXT: [string, string][] = [
  ['Cargos', 'Product Designer Sênior · Design Engineer'],
  ['Trabalho', 'Remoto, com times dos EUA e do Canadá'],
  ['Idiomas', 'Inglês (fluente) · Português (nativo)'],
  ['Áreas', 'Saúde · Fintech · E-commerce · SaaS de IA · Corporativo'],
  ['Formação', 'Bacharelado em Ciência da Computação, UNICAMP · MBA em UX Research e Liderança em Design'],
];
export const FACTS: typeof EN_FACTS = EN_FACTS.map((_, i) => FACTS_TEXT[i]);

const CHANNEL_NAMES: Record<keyof typeof EN_CHANNELS, string> = {
  top: 'Início', work: 'Cases', build: 'Como eu construo', about: 'Sobre', contact: 'Contato', hire: 'Comece um projeto',
};
export const CHANNELS: typeof EN_CHANNELS = Object.fromEntries(
  Object.entries(EN_CHANNELS).map(([k, [ch]]) => [k, [ch, CHANNEL_NAMES[k]]]),
);

export const HOME: typeof EN_HOME = {
  hero: {
    label: 'Apresentação',
    title: 'Escute.',
    intro: 'Sou product designer sênior, com mais de 7 anos em produtos B2B e B2C. Começo por pessoas e dados reais, depois desenho e construo a solução eu mesmo, do Figma ao código em produção.',
    /** the two spaces are non-breaking, so the arrow never wraps alone */
    cta: 'Ver os cases  →',
    cv: 'Baixar CV',
    band: 'Muitas vozes (usuários, dados, stakeholders) desenhadas como linhas com ruído, convergindo em um sinal claro',
    cue: { noise: 'Muitas vozes', noiseLong: ' · usuários, dados, stakeholders', signal: 'Um sinal claro' },
  },
  proof: { label: 'Resultados', clients: 'Times e clientes' },
  work: {
    label: 'Cases', title: 'O problema, a minha parte e o que mudou',
    lede: 'Cada case abre com um resumo curto: o problema, o meu papel, o time e o resultado. O processo completo vem depois.',
  },
  method: {
    label: 'Como eu trabalho', title: 'Do ruído a uma decisão clara',
    lede: 'Todo projeto começa com ruído. O trabalho é escutar tudo, achar o padrão e transformar isso em algo que dá para construir.',
    /** `{n}` is the step number */
    step: 'Passo {n}',
  },
  build: {
    label: 'Como eu construo', title: 'Eu construo o que desenho',
    text: 'Sou formado em Ciência da Computação e programava antes de fazer design. Hoje desenho e programo sozinho meus próprios produtos de IA: front-end, back-end, agentes, banco de dados, autenticação e cobrança. O Claude Code é minha principal ferramenta. O julgamento continua comigo.',
    loop: 'Como mantenho sob controle o código escrito por IA',
  },
  about: {
    label: 'Sobre', title: 'Oi, eu sou o João',
    quote: 'Eu desenho e construo o produto, da pesquisa ao código em produção.',
    p1: 'Comecei como desenvolvedor em 2017 e migrei para UX/UI em 2018. Desde então, desenhei para startups, uma empresa de IA apoiada pela Y Combinator, clientes da Fortune 500 e uma empresa global de saúde, em B2B e B2C, na web e em apps nativos.',
    p2: 'Liderei e fui mentor de designers, criei design systems que os desenvolvedores de fato usaram e trabalhei no dia a dia com times de dados. Também dei aula para mais de 30 alunos como tutor de UX/UI na Coderhouse.',
    cv: 'Baixar CV (PDF)',
  },
};
