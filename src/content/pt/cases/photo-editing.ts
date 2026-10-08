// Portuguese mirror of ../../cases/photo-editing.ts. Text only: images and the prototypes (and which one is tall) come
// from the English file.
import * as en from '../../cases/photo-editing';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = { ...en.meta, team: 'Só eu' };

export const original = { title: 'Nova experiência de edição de fotos', subtitle: 'Resolvendo o maior problema dos nossos casais no editor de sites' };

const problems = 'Problemas identificados:';

export const body = translateBody(en.body, [
  { type: 'h2', text: 'Contextualizando o problema' },
  {
    type: 'p',
    text: 'Mais de 16% dos usuários relataram dificuldade para editar imagens na plataforma do Casar.com. Essa era a maior dor que eles tinham ao editar o site.',
  },
  {
    type: 'p',
    text: 'No [Casar.com](http://casar.com/), os casais criam seus sites para anunciar o casamento e receber presentes dos convidados. Por isso, sempre foi muito claro para nós que os casais querem sites bonitos para os convidados verem.',
  },
  { type: 'p', text: 'O site é como a marca do casal!' },
  {
    type: 'p',
    text: 'Muitos até pagam fotógrafos profissionais para fazer um pré-wedding e tirar várias fotos lindas, para colocá-las no site e mostrar a todo mundo o quanto estão apaixonados.',
  },
  { type: 'p', text: 'Até aí, tudo bem! Mas imagine só:' },
  {
    type: 'p',
    text: 'Depois de tirar várias fotos incríveis e colocá-las no site, você encontra várias delas distorcidas e até cortadas, dependendo do dispositivo que está usando.',
  },
  {
    type: 'p',
    text: '**Você não tem controle real sobre como a foto aparece no site!** Depois de tentar bastante, talvez você até consiga deixá-la bonita no computador… mas talvez uma das suas convidadas não tenha a mesma sorte no celular.',
  },
  { type: 'p', text: 'Mas essa percepção não veio só do nosso "feeling". Como você viu acima:' },
  {
    type: 'p',
    text: 'Mais de 16% dos usuários relataram dificuldade para editar imagens! Essa era a maior dor que eles tinham ao editar o site.',
  },
  {
    type: 'p',
    text: 'Tiramos esse dado da nossa "pesquisa de edição do site", que pergunta, de 1 a 5, qual foi o nível de dificuldade na edição, os principais pontos de dificuldade, e traz um espaço aberto para a pessoa contar um pouco mais sobre a experiência.',
  },
  { type: 'img', alt: 'Edição de fotos: contextualizando o problema' },
  {
    type: 'p',
    text: 'Essa pesquisa é um **método de interceptação** e foi integrada à plataforma pelo Typeform. Ela aparece quando a pessoa faz a segunda edição e clica no botão de salvar. A pesquisa de edição, junto com outras pesquisas, **ajuda a alimentar o Problem Space do Casar** de forma contínua, o que foi e continua sendo muito importante para entender o usuário e priorizar as dores que vamos resolver.',
  },
  {
    type: 'p',
    text: '💡 Se você não conhece o termo "Problem Space", dê uma olhada no artigo abaixo, do [Renato Caliari](https://www.linkedin.com/in/renatocaliari/), sobre o **Triple Track Agile**. Garanto que você não vai se arrepender ;)',
  },
  {
    type: 'p',
    text: '[Triple Track Agile: a combinação do Problem Space com o Solution Space](https://medium.com/tentaculus/triple-track-agile-problem-space-solution-space-81c2c6b7bf24)',
  },
  {
    type: 'p',
    text: 'Além da pesquisa, o time de CX recebia reclamações diárias sobre a edição de imagens. Muitas vezes, o time chegava a **editar as imagens dos usuários à mão** para que as fotos ficassem do jeito que eles queriam, o que tomava muito tempo.',
  },
  { type: 'h2', text: 'Entendendo o que precisa ser construído' },
  {
    type: 'p',
    text: 'Analisando a pesquisa e reunindo a experiência do CX, **confirmamos a prioridade de resolver esse problema e conseguimos entendê-lo melhor.** Com isso, usei o framework How Might We (HMW), ou "Como poderíamos", para ajudar a direcionar a construção da solução:',
  },
  { type: 'img', alt: 'Edição de fotos: entendendo o que precisa ser construído' },
  { type: 'p', text: 'A maior parte dessa construção foi feita e documentada no Miro.' },
  { type: 'h2', text: 'Análise da solução atual' },
  {
    type: 'p',
    text: 'Com a direção definida, **analisei a solução atual para encontrar pontos de melhoria.** Descobri que a plataforma tinha experiências diferentes de edição de fotos em partes diferentes. Cada uma tinha problemas diferentes e precisava ser analisada separadamente. Para você ter uma ideia, uma delas não tinha edição nenhuma: a imagem era simplesmente inserida.',
  },
  { type: 'h3', text: 'Foto de capa do site' },
  { type: 'p', text: '_Extremamente relevante_' },
  { type: 'img', alt: 'Edição de fotos: análise da solução atual (1 de 4)' },
  { type: 'p', text: problems },
  {
    type: 'ul',
    items: [
      'Não há corte nem pré-visualização específicos para celular',
      'Não dá para cancelar a ação de trocar a imagem de capa',
      'O corte não segue a proporção do tema, ou seja, mesmo que o tema tenha uma imagem de capa quadrada, o corte continua nesse formato retangular e a imagem fica superampliada no tema _(obs.: cada usuário pode escolher um tema diferente para o site, mudando layout, cores, tipografia etc.)_',
      'Não dá para trabalhar a imagem: ela fica do jeito que foi enviada',
      'Os usuários dizem que é difícil escolher a imagem no computador',
      'Os usuários reclamam que a foto fica com baixa qualidade',
    ],
  },
  { type: 'h3', text: 'Imagens no corpo do site' },
  { type: 'p', text: '_Relevante_' },
  { type: 'img', alt: 'Edição de fotos: análise da solução atual (2 de 4)' },
  { type: 'p', text: problems },
  { type: 'ul', items: ['Não tem nem corte nem edição'] },
  { type: 'h3', text: 'Avatar dos noivos' },
  { type: 'p', text: '_Não tão relevante_' },
  { type: 'img', alt: 'Edição de fotos: análise da solução atual (3 de 4)' },
  { type: 'p', text: problems },
  {
    type: 'ul',
    items: [
      'Muito pequeno: é difícil selecionar um rosto numa foto grande',
      'Botões invertidos, o que causa estranhamento',
    ],
  },
  { type: 'h3', text: 'Criação de um novo presente personalizado com foto' },
  { type: 'p', text: '_Não tão relevante, já que temos vários presentes pré-selecionados para o usuário escolher_' },
  { type: 'img', alt: 'Edição de fotos: análise da solução atual (4 de 4)' },
  { type: 'p', text: problems },
  {
    type: 'ul',
    items: [
      'Dá para arrastar uma foto do computador e soltar ali, diferente das outras, mas não há nenhum feedback, enquanto ela é arrastada, de que isso vai funcionar',
      'Depois de colocar a foto uma vez, nada indica como substituí-la',
      'Não dá para aplicar nenhum corte nem edição',
    ],
  },
  { type: 'h2', text: 'Análise de concorrentes' },
  {
    type: 'p',
    text: 'Também era importante buscar referências de experiências de edição bem-feitas para **ampliar meu repertório no assunto.** Fui analisando concorrentes e outras referências e documentando com prints e post-its no Miro.',
  },
  {
    type: 'p',
    text: 'Daqui saíram **insights importantes para a ideação**, que ajudaram muito a resolver os problemas encontrados na análise da solução atual.',
  },
  { type: 'img', alt: 'Edição de fotos: análise de concorrentes' },
  { type: 'h2', text: 'Ideação e priorização' },
  {
    type: 'p',
    text: 'Usando os 3 HMWs definidos e as análises feitas, fiz uma **ideação para definir os caminhos possíveis para a nossa solução.** Nessa etapa, qualquer ideia vale: mesmo que pareça impossível no começo, ela ainda pode ser adaptada e se mostrar uma inovação de alto valor mais adiante.',
  },
  {
    type: 'p',
    text: 'Depois da ideação, **priorizei** cada uma das ideias numa **matriz de impacto x esforço** e **agrupei as ideias** para que fizessem sentido juntas. Assim, tínhamos várias propostas para a solução final, desde uma mais essencial e simples até uma com incrementos mais complicados, mas ainda relevantes.',
  },
  { type: 'img', alt: 'Edição de fotos: ideação e priorização' },
  { type: 'h2', text: 'Análise da API de edição' },
  {
    type: 'p',
    text: 'Para viabilizar algumas das minhas propostas de solução, decidi **pesquisar e analisar diferentes APIs de edição de imagem**. Mas logo percebi que a API que usávamos na época, o [Cropper.js](https://fengyuanchen.github.io/cropperjs/), já tinha vários dos recursos mais importantes de que precisávamos. Assim surgiu outra proposta de solução, **mais enxuta, mas com o essencial e com muito menos esforço do que as outras.**',
  },
  { type: 'img', alt: 'Edição de fotos: análise da API de edição' },
  { type: 'h2', text: 'Construindo a solução' },
  { type: 'h3', text: 'Propostas de solução com sketches' },
  {
    type: 'p',
    text: 'Apresentando as diferentes propostas de solução para o resto do time de produto, conseguimos **discutir nossas prioridades e o esforço de cada uma das soluções**, considerando a **alocação do time de desenvolvimento.**',
  },
  {
    type: 'p',
    text: 'Depois da discussão, o time concordou que, naquele momento, seguiríamos com a versão mais enxuta, mas essencial, da solução, já que ela resolveria grande parte da dor dos casais e usaria só os recursos da API atual.',
  },
  { type: 'img', alt: 'Edição de fotos: construindo a solução (1 de 2)' },
  {
    type: 'p',
    text: 'Para criar os sketches, também **pesquisei e documentei várias interfaces diferentes** de upload e edição de imagens, o que também ajudou na construção do protótipo no Figma.',
  },
  { type: 'img', alt: 'Edição de fotos: construindo a solução (2 de 2)' },
  { type: 'h2', text: 'Figma interativo' },
  { type: 'embed', label: 'Desktop' },
  { type: 'embed', label: 'Celular' },
  { type: 'h2', text: 'Adoção da ferramenta pelos usuários atuais' },
  { type: 'p', text: 'Vale lembrar que os novos usuários vão usar a ferramenta ao criar um site novo.' },
  { type: 'p', text: 'Mas e quem já editou todas as fotos? Vai ficar com as fotos antigas e distorcidas?' },
  {
    type: 'p',
    text: 'Pensando nisso, desenhei um modal com ícones personalizados para **divulgar a novidade aos usuários atuais** quando eles entrassem no site.',
  },
  { type: 'img', alt: 'Edição de fotos: adoção da ferramenta pelos usuários atuais' },
  { type: 'h2', text: 'Lançamento e documentação' },
  {
    type: 'p',
    text: 'Decidimos fazer um **lançamento em fases**, ou seja, liberar para os usuários aos poucos, em etapas diferentes. Assim, conseguiríamos **encontrar eventuais bugs na solução e corrigi-los enquanto ainda afetavam só uma parte dos usuários**, sem deixar o problema ganhar escala.',
  },
  {
    type: 'p',
    text: 'Além disso, a solução inteira e suas particularidades, como **o lançamento e os detalhes de interação com o usuário, foram detalhados num documento de requisitos** para o time de desenvolvimento, **com critérios de aceite**, para que a solução fosse aprovada antes do deploy. Mas vale esclarecer que isso não substitui o handoff ao time de desenvolvimento, com conversas para tirar dúvidas sobre a solução, nem o acompanhamento enquanto ela é desenvolvida.',
  },
  { type: 'h2', text: 'Próximos passos' },
  {
    type: 'p',
    text: 'O primeiro próximo passo deste projeto seria fazer **testes de usabilidade e corrigir os principais problemas encontrados.** Só então a solução iria para o time de desenvolvimento, comigo **acompanhando todo o processo e testando a solução final antes do lançamento** para os usuários.',
  },
  {
    type: 'p',
    text: 'Depois do lançamento, precisaríamos **analisar os resultados**, mas é importante dizer que **saí do Casar antes de a solução ser lançada**, então não pude fazer essa análise. Ainda assim, **as métricas que eu usaria são:**',
  },
  {
    type: 'ul',
    items: [
      'Redução de tickets sobre o tema no CX',
      'Redução de exclusões de sites (agora automatizada e com uma pesquisa que desenhei para ajudar a alimentar o Problem Space)',
      'Customer Satisfaction Score (CSAT), analisando essa etapa da jornada com a pesquisa de edição',
    ],
  },
], 'photo-editing');
