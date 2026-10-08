// Portuguese mirror of ../../cases/tempo-landing-page.ts. Text only: images and the prototype come from the English file.
import * as en from '../../cases/tempo-landing-page';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = { ...en.meta, team: 'Só eu' };

export const original = { title: 'Nova landing page da Tempo', subtitle: 'Nova landing page para a Tempo, startup de criação de software com IA, de acordo com seu novo posicionamento de mercado' };

export const body = translateBody(en.body, [
  { type: 'h2', text: 'Visão geral' },
  {
    type: 'p',
    text: 'A Tempo é uma plataforma para criar software com IA. Ela junta prompts de texto com um editor visual. No começo, atraía principalmente desenvolvedores e novos fundadores. Mas precisávamos mudar. Queríamos falar diretamente com designers. O objetivo era simples: acabar com o sofrimento de passar arquivos do Figma para os desenvolvedores. Queríamos uma linha reta do **design ao código final.**',
  },
  { type: 'img', alt: 'Landing page da Tempo: visão geral' },
  { type: 'h2', text: 'Pesquisa e estratégia' },
  {
    type: 'p',
    text: 'Não abri o Figma logo de cara. Primeiro, olhei os concorrentes e analisei cada seção e o storytelling que eles construíam. Também usei ferramentas como o SimilarWeb para ver o tráfego e a taxa de rejeição deles. Eu queria entender o que chamava a atenção das pessoas no mercado de IA.',
  },
  { type: 'p', text: 'Eu não queria reinventar a roda. Só queria descobrir o que funcionava para outras marcas.' },
  { type: 'p', text: 'Depois, usei esses aprendizados para dar forma à nossa página.' },
  { type: 'img', alt: 'Landing page da Tempo: pesquisa e estratégia' },
  { type: 'h2', text: 'Design visual e UI' },
  {
    type: 'p',
    text: 'Designers são um público difícil de agradar visualmente. A página tinha que ficar linda. Mantive a identidade central da marca Tempo, mas acrescentei um novo jogo de luzes e gradientes e algumas imagens novas, alinhadas à marca, que criei com IA.',
  },
  {
    type: 'p',
    text: 'Isso deu à página um **ar futurista**. Também caprichei nas animações: títulos em movimento e cursores atravessando a tela, igualzinho a pessoas trabalhando juntas no Figma.',
  },
  {
    type: 'p',
    text: 'Também fiz questão de mostrar todo o nosso conjunto de ferramentas: o criador de design systems, o plugin para Figma e a biblioteca de MCP.',
  },
  { type: 'img', alt: 'Landing page da Tempo: design visual e UI' },
  { type: 'h2', text: 'O processo' },
  {
    type: 'p',
    text: 'A base desta página veio de experiência real. Nós realmente usamos o nosso próprio produto: construímos projetos reais para clientes com a Tempo. Fizemos várias landing pages, produtos SaaS completos e sistemas complexos.',
  },
  {
    type: 'p',
    text: 'Isso nos ensinou exatamente do que os designers precisam e deu ao time uma visão compartilhada. Pegamos todo esse conhecimento prático e colocamos neste novo design.',
  },
  {
    type: 'p',
    text: 'Trabalhei com o CEO e com os outros designers para iterar a página o tempo todo. Esse conhecimento profundo do nosso próprio produto definiu o resultado final.',
  },
  { type: 'h2', text: 'O resultado' },
  {
    type: 'p',
    text: 'A nova landing page faz exatamente o que precisávamos. Ela muda como as pessoas veem a marca e conta aos designers uma história clara: você não precisa mais lidar com o handoff confuso para os desenvolvedores. Pode construir o código você mesmo.',
  },
  { type: 'p', text: 'Como a Tempo sempre diz, e agora a nova landing page traduz:' },
  { type: 'img', alt: 'Landing page da Tempo: o resultado' },
  { type: 'h2', text: 'Protótipo no Figma' },
  { type: 'embed', label: 'Protótipo interativo' },
], 'tempo-landing-page');
