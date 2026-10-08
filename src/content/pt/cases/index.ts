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
    summary: 'Uma interface de cartão para benefícios flexíveis de alimentação, desenhada para clientes corporativos e seus funcionários, no celular e na web.',
    role: 'UX/UI Designer Sênior',
    result: 'Abriu as vendas para empresas com 500+ funcionários',
    problem: 'A Foodpass lançou cartões de crédito com benefícios flexíveis e precisava de um app em que os funcionários pudessem usar todos eles, ao lado das cestas de alimentos que já personalizavam.',
    outcome: 'Os cartões trouxeram os maiores clientes da Foodpass: empresas com mais de 500 funcionários.',
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
