// Portuguese mirror of ../../cases/benefits-card-app.ts. Text only: images and the prototype come from the English file.
import * as en from '../../cases/benefits-card-app';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = { ...en.meta, role: 'UX/UI Designer e Ilustrador', team: 'Eu e @Paula Fernandes' };

export const original = { title: 'App de Cartões de Benefícios', subtitle: 'Entrando em um novo negócio' };

export const body = translateBody(en.body, [
  {
    type: 'p',
    text: 'Para ampliar o portfólio que oferecemos às empresas na Foodpass, lançamos **cartões de crédito com benefícios flexíveis**: vale-refeição (usado em restaurantes), vale-alimentação (usado em supermercados), auxílio-mobilidade e flex (aceito em qualquer lugar). Nesse contexto, **desenhamos do zero uma interface de cartão de crédito** para que os funcionários aproveitassem todos os benefícios de um jeito simples e intuitivo, juntando os novos cartões à personalização das cestas de alimentos que já tínhamos no app.',
  },
  {
    type: 'p',
    text: 'Projeto feito em parceria com a [Paula Fernandes](https://www.linkedin.com/in/paulafernands/). _Fizemos praticamente tudo juntos! Aprendi muito sobre ilustração e pude ensinar muito a ela sobre UX/UI Design._',
  },
  { type: 'img', alt: 'App de Cartões de Benefícios: telas (1 de 4)' },
  { type: 'img', alt: 'App de Cartões de Benefícios: telas (2 de 4)' },
  { type: 'img', alt: 'App de Cartões de Benefícios: telas (3 de 4)' },
  { type: 'img', alt: 'App de Cartões de Benefícios: telas (4 de 4)' },
  { type: 'h2', text: 'Protótipo interativo' },
  { type: 'embed', label: 'Protótipo interativo' },
], 'benefits-card-app');
