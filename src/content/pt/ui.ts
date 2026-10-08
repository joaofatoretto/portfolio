/* Portuguese mirror of ../ui.ts: navigation, buttons, form labels and messages, aria-labels, OSD words, the 404 and
   thank-you pages, case-page labels. `{name}`-style tokens are filled in by the component: keep them as they are.
   Non-breaking spaces ( ) keep an arrow from wrapping alone. */
import { UI as EN } from '../ui';

export const UI: typeof EN = {
  skip: 'Pular para o conteúdo',
  /** under the lockup in the footer and on the hero: name and role */
  eyebrow: 'João Fatoretto — Product Designer que entrega código',
  nav: { label: 'Principal', work: 'Cases', build: 'Como eu construo', about: 'Sobre', hire: 'Comece um projeto', talk: 'Fale comigo' },
  /** the language names are written in their own language, so they read the same on both sides */
  lang: { ...EN.lang, label: 'Idioma' },
  footer: { caption: 'Desenhado e construído por mim em React. Cada gráfico é gerado em código.', cv: 'CV (PDF)', top: 'Voltar ao topo ↑' },
  /** the TV's on-screen words (aria-hidden) */
  tv: { noSignal: 'SEM SINAL', searching: 'BUSCANDO', scroll: 'Role', sent: 'ENVIADO' },
  /** the placeholder picture of a case without a cover (TestCard); `{n}` is the case number (01) */
  testCard: { label: 'TELA DE TESTE · CASE {n}', cover: 'AQUI ENTRA A CAPA DO CASE' },
  contact: {
    title: 'Vamos conversar.',
    text: 'Contratando para product design ou design engineering? Me mande um e-mail sobre a vaga.',
    copy: 'Copiar e-mail', copied: 'E-mail copiado', send: 'Enviar um e-mail',
  },
  embed: { tune: 'Sintonize o protótipo', loads: 'Carrega um protótipo interativo do Figma', title: '{label} (Figma)' },
  case: {
    all: 'Todos os cases',
    /** `{n}` is the case number (01), `{client}` the client */
    study: 'Case {n} · {client}',
    summary: 'Resumo', problem: 'O problema', result: 'O resultado',
    company: 'Empresa', year: 'Ano', role: 'Meu papel', team: 'Time',
    toc: 'Seções deste case', tocLabel: 'Neste case',
    next: 'Próximo case',
    /** `{n}` is the next case's channel number */
    nextLabel: 'Próximo case · CH 02·{n}',
    /** `{alt}` is the image's alt text */
    open: '{alt} (abrir em tamanho real)',
  },
  /** B2B/B2C are said the same way in Portuguese */
  models: { ...EN.models },
  platforms: {
    'Native app': 'App nativo',
    'Web · mobile + desktop': 'Web · celular + computador',
    'Web · desktop': 'Web · computador',
    'Web admin': 'Painel web',
    'Landing page · desktop': 'Landing page · computador',
    'Landing page · mobile + desktop': 'Landing page · celular + computador',
  },
  notFound: {
    title: 'Este canal não existe.',
    text: 'A página pode ter mudado de lugar. Os cases estão na página inicial.',
    cta: 'Ver os cases  →',
  },
  thanks: {
    title: 'Pronto. Sua ideia chegou até mim.',
    /** `{name}` is the first name they typed */
    titleNamed: 'Pronto, {name}. Sua ideia chegou até mim.',
    text: 'Respondo em até 1 dia útil.',
    work: 'Ver meu trabalho',
  },
  form: {
    label: 'Me conta sua ideia',
    name: 'Seu nome',
    contact: 'E-mail ou telefone',
    message: 'Sua ideia, em uma linha (opcional)',
    /** the hidden field only bots fill in */
    website: 'Site',
    /** `{email}` becomes a link */
    failed: 'Não foi enviado. Suas respostas continuam aqui: tente de novo, ou me escreva em {email}.',
    send: 'Enviar minha ideia  →', sending: 'Enviando…',
  },
};
