/* Portuguese mirror of ../seo.ts: the page heads and the schema.org text. Titles stay near 60 characters and
   descriptions under 155, the lengths Google shows. Hire's title names what Brazilian clients search for. */
import { PROFILE } from '../profile';
import { SEO as EN } from '../seo';

const HIRE_DESCRIPTION = 'Sites, aplicativos e agentes de IA para pequenas empresas e empreendedores, feitos por mim. Conversa grátis, nada adiantado: você paga a cada entrega.';

export const SEO: typeof EN = {
  title: `${PROFILE.name} · Product Designer que entrega código`,
  description: 'Product designer sênior, 7+ anos em B2B e B2C. Começo por pessoas e dados reais, depois desenho e construo a solução, do Figma ao código em produção.',
  imageAlt: `Escute. ${PROFILE.name}, Product Designer que entrega código`,
  /** schema.org jobTitle */
  jobTitle: 'Product Designer Sênior',
  hire: {
    title: `Criação de sites, apps e agentes de IA · ${PROFILE.name}`,
    description: HIRE_DESCRIPTION,
    /** schema.org name of the service, and the breadcrumb's name for the page */
    name: `${PROFILE.name}, sites, aplicativos e agentes de IA`,
    breadcrumb: 'Sites, aplicativos e agentes de IA',
    serviceType: ['Criação de sites', 'Landing pages', 'Aplicativos web e para celular', 'Agentes de IA', 'Automação com IA', 'Design de produto'],
  },
  thanks: { title: `Obrigado · ${PROFILE.name}`, description: 'Sua ideia chegou até mim. Respondo em até 1 dia útil.' },
  notFound: { title: `Sem sinal · ${PROFILE.name}`, description: 'Esta página não existe. Os cases estão na página inicial.' },
};
