// Portuguese mirror of ../../cases/promotions-discoverability.ts. Text only: images and the prototype come from the
// English file.
import * as en from '../../cases/promotions-discoverability';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = { ...en.meta, team: 'Só eu' };

export const original = { title: 'Promoções mais fáceis de encontrar', subtitle: 'Aumento de 15% no evento de adição ao carrinho no e-commerce da Superopa' };

const deliverables = [
  '**Novas listas automáticas de produtos**, com as melhores ofertas e os produtos mais comprados;',
  'Novas telas no backoffice para **apoiar a criação e a configuração dessas listas**, de forma a **facilitar o trabalho do time de marketing** com uma interface simples e intuitiva;',
  '**Melhoria do mecanismo de busca** de produtos com [Elastic Search](https://medium.com/quantyca/reviving-an-e-commerce-search-engine-using-elasticsearch-e540751c6d99), que chegou a uma **taxa de sucesso de 90%** em todas as buscas feitas pelo mecanismo.',
];

export const body = translateBody(en.body, [
  { type: 'h2', text: 'Visão geral' },
  {
    type: 'p',
    text: 'Como transformamos o pedido "queremos um cronômetro para as promoções relâmpago no app" em uma solução que resolveu de verdade o problema de raiz, com um **aumento de 15% no evento de adição ao carrinho**, melhorando a encontrabilidade das promoções e dos produtos.',
  },
  { type: 'p', text: 'As 3 principais entregas deste projeto foram:' },
  { type: 'ul', items: deliverables },
  { type: 'p', text: 'Veja o processo de design usado neste projeto:' },
  { type: 'img', alt: 'Promoções mais fáceis de encontrar: visão geral' },
  { type: 'h2', text: 'Alinhamento com stakeholders e objetivo de discovery' },
  {
    type: 'p',
    text: 'Depois de conversar com os stakeholders para entender seus objetivos, entendi que o objetivo "escondido" por trás daquele pedido era **"aumentar o número de pedidos para no mínimo XXX por dia".** _(números confidenciais)_',
  },
  { type: 'p', text: 'O problema do cronômetro?' },
  {
    type: 'ul',
    items: [
      'Ele foca em poucas ofertas muito boas, em produtos que precisam mudar todo dia (**o que não conseguíamos fazer**);',
      'Ele exige muito **esforço do time de marketing**, e nós éramos uma empresa bem pequena;',
      'O problema que ele deveria resolver não estava nada claro.',
    ],
  },
  { type: 'p', text: 'Com isso em mente, definimos e planejamos uma pesquisa com o seguinte objetivo de discovery:' },
  { type: 'p', text: '"Decidir como podemos aumentar o número de pedidos por meio de campanhas e promoções."' },
  { type: 'img', alt: 'Promoções mais fáceis de encontrar: alinhamento com stakeholders e objetivo de discovery' },
  { type: 'h2', text: 'UX Research: espaço do problema, testes de usabilidade e tickets de CX' },
  {
    type: 'p',
    text: 'Analisando o funil, identificamos uma grande queda no evento de adição ao carrinho, o que podia indicar uma oportunidade de crescimento.',
  },
  { type: 'p', text: 'Então, decidimos analisar:' },
  {
    type: 'ul',
    items: [
      'Nosso espaço do problema, com todos os **problemas que coletamos em pesquisas anteriores;**',
      '**Testes de usabilidade** anteriores com foco no evento de adição ao carrinho;',
      '**Tickets de suporte (CX)** dos usuários.',
    ],
  },
  { type: 'p', text: 'No fim, chegamos a uma descoberta-chave que mostrava onde os usuários mais tinham dificuldade nessa etapa do funil:' },
  { type: 'p', text: '"Os usuários não encontravam as melhores promoções que tínhamos, nem os produtos que queriam comprar"' },
  { type: 'img', alt: 'Promoções mais fáceis de encontrar: UX Research, espaço do problema, testes de usabilidade e tickets de CX' },
  { type: 'h2', text: 'Ideação e priorização: construindo juntos' },
  {
    type: 'p',
    text: 'Era hora de focar na solução junto com os principais stakeholders. Para preparar a reunião, analisei concorrentes e salvei muitas referências de como eles resolviam esse problema, para dar um repertório mais amplo ao time.',
  },
  {
    type: 'p',
    text: 'Então, reuni o time de marketing e o tech lead para idear, priorizar e construir soluções juntos. Essa mistura de bagagens melhorou muito a qualidade da solução final e o seu impacto na experiência do usuário.',
  },
  { type: 'img', alt: 'Promoções mais fáceis de encontrar: ideação e priorização, construindo juntos' },
  { type: 'h2', text: 'A solução e o resultado' },
  {
    type: 'p',
    text: 'A solução final era um pouco técnica, mas muito fácil e rápida de implementar, o que fez de parte dela um verdadeiro quick win.',
  },
  { type: 'p', text: 'Como eu já disse, as 3 principais entregas deste projeto foram:' },
  { type: 'ul', items: deliverables },
  { type: 'p', text: 'No fim, rodamos um teste A/B e chegamos ao seguinte resultado:' },
  { type: 'p', text: 'Um aumento de 15% na taxa de conversão de adição ao carrinho!' },
  { type: 'h2', text: 'Figma interativo' },
  { type: 'p', text: 'Obs.: a única solução que precisou de protótipo foi a criação de listas no backoffice.' },
  { type: 'embed', label: 'Protótipo interativo' },
], 'promotions-discoverability');
