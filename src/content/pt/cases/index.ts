/* The case studies in Portuguese, in the same order as ../../cases/index.ts. Each entry keeps the English entry's data
   (slug, client, model, platforms, images) and replaces its text. Claims must match ../resume/master/career.md. */
import { CASES as EN } from '../../cases';
import type { CaseStudy } from '../../cases/types';
import * as promotions from './promotions-discoverability';
import * as benefits from './benefits-card-app';
import * as photo from './photo-editing';
import * as tempo from './tempo-landing-page';

const strip = (s: string) => s.replace(/^@/, '').replace(/ @/g, ' ');
const [enPromotions, enBenefits, enPhoto, enTempo] = EN;

export const CASES: CaseStudy[] = [
  {
    ...enPromotions,
    title: promotions.original.title,
    summary: 'O CTO pediu um cronômetro de contagem regressiva. Os dados do funil e os tickets de suporte mostraram o problema real: as pessoas não encontravam as promoções. Redesenhei a home, dei ao marketing um backoffice para as listas de promoções e refiz a busca.',
    role: 'UX/UI Designer Sênior',
    result: '+15% de adição ao carrinho · 90% de sucesso na busca',
    problem: 'O CTO pediu um cronômetro para as promoções relâmpago. Conversando com os stakeholders, o objetivo real era ter mais pedidos por dia.',
    outcome: 'Um teste A/B mostrou um aumento de 15% na conversão de adição ao carrinho. A nova busca chegou a 90% de taxa de sucesso.',
    subtitle: promotions.original.subtitle,
    meta: { ...promotions.meta },
    body: promotions.body,
  },
  {
    ...enBenefits,
    title: benefits.original.title,
    summary: 'A Foodpass vendia cestas básicas personalizáveis para empresas como benefício para os funcionários. Liderei o design do seu segundo negócio, um cartão multibenefícios, lançado dentro do mesmo app em cerca de dois meses, para trabalhadores de chão de fábrica que usavam o celular só para ligar e mandar mensagem. Um ano depois, voltei como freelancer para lançar os cartões físicos.',
    role: 'UX/UI Designer Sênior',
    result: 'Abriu as vendas para empresas com 500+ funcionários',
    problem: 'Transformar um app feito para cestas básicas em um produto de fintech, rápido o bastante para pegar os clientes interessados, para pessoas que quase não usam tecnologia.',
    outcome: 'Um MVP lançado para os primeiros clientes enquanto eles ainda estavam interessados, depois levado a funcionários de várias empresas. Abriu as vendas para empresas com 500+ funcionários e deu a um time pequeno uma segunda fonte de receita.',
    subtitle: benefits.original.subtitle,
    meta: { ...benefits.meta, team: strip(benefits.meta.team) },
    body: benefits.body,
  },
  {
    ...enPhoto,
    title: photo.original.title,
    industry: 'Casamentos',
    summary: 'A edição de fotos era a dor número um do criador de sites de casamento e atingia cerca de 5.000 dos 30.000 casais todos os dias. Redesenhei o editor de imagens do criador de sites.',
    result: 'Redesenhei a dor nº 1, sentida por ~16% dos usuários',
    problem: 'Mais de 16% dos casais relatavam dificuldade para editar imagens. Era a maior dor do editor de sites, e o suporte muitas vezes corrigia as fotos à mão.',
    outcome: 'Uma solução enxuta, fácil de implementar com o menor esforço possível: usava só a API de imagens que o time já tinha. Pronta para desenvolver, com protótipos para desktop e celular, um plano de lançamento em fases e um documento de requisitos com critérios de aceite.',
    subtitle: photo.original.subtitle,
    meta: { ...photo.meta },
    body: photo.body,
  },
  {
    ...enTempo,
    title: tempo.original.title,
    industry: 'SaaS de IA',
    summary: 'Um redesign completo da landing page para reposicionar no mercado a Tempo, uma startup de IA apoiada pela Y Combinator.',
    result: 'Reposicionamento de mercado',
    problem: 'A Tempo estava trocando o foco de desenvolvedores e fundadores para designers, e a landing page precisava contar essa nova história.',
    outcome: 'Uma landing page que muda como as pessoas veem a marca e conta aos designers uma história clara: construa o código você mesmo, sem o handoff.',
    subtitle: tempo.original.subtitle,
    meta: { ...tempo.meta },
    body: tempo.body,
  },
];
