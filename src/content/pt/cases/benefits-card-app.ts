// Portuguese mirror of ../../cases/benefits-card-app.ts. Text only: images and the prototype come from the English file.
import * as en from '../../cases/benefits-card-app';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = {
  ...en.meta,
  role: 'UX/UI Designer Sênior e líder de design (2024) · Product Designer freelancer (2025)',
  team: 'Eu e @Paula Fernandes',
};

export const original = { title: 'De cestas básicas a fintech em dois meses', subtitle: 'Lançando o segundo negócio da Foodpass dentro do app que ela já tinha' };

export const body = translateBody(en.body, [
  { type: 'h2', text: 'R$70 ou R$2.000' },
  { type: 'p', text: 'Uma cesta básica valia cerca de **R$70 por funcionário**. Um cartão de benefícios podia valer **mais de R$2.000.**' },
  { type: 'p', text: 'Essa era a oportunidade na frente da Foodpass. Já tínhamos os clientes, a marca e um app. O que não tínhamos era tempo: **os primeiros clientes estavam procurando um cartão naquele momento, e tínhamos cerca de dois meses para entregar um.**' },
  { type: 'p', text: 'E quem ia usar? Trabalhadores de chão de fábrica que **não tinham nenhuma familiaridade com tecnologia. O celular era para ligar e mandar mensagem, e só.**' },

  { type: 'h2', text: 'Uma cesta básica nada básica' },
  { type: 'p', text: 'A Foodpass nasceu de um pivô da **Superopa**, um e-commerce que vendia produtos perto da validade bem abaixo do preço de mercado. Ela precisava de logística própria e de um armazém cheio de produtos que não sabíamos se íamos vender, então **perdíamos muito estoque.**' },
  { type: 'p', text: 'A Foodpass trouxe **previsibilidade**. Vendíamos a **cesta básica**, que muitas empresas brasileiras dão aos funcionários, para empresas em vez de consumidores. Sabendo o que ia em cada cesta e quando ela seria enviada, precisávamos de menos capital de giro e planejávamos a logística em datas exatas.' },
  { type: 'p', text: 'E a nossa cesta não era tão básica: os funcionários podiam **trocar os itens que não queriam por outros de valor parecido, ou guardar o valor para o mês seguinte.**' },
  { type: 'h3', text: 'Os benefícios de alimentação no Brasil em 30 segundos' },
  { type: 'p', text: 'Empresas brasileiras costumam dar aos funcionários **vale-refeição, vale-alimentação, auxílio-mobilidade e flex** além do salário. Empresas como a [Flash](https://flashapp.com.br/) e a [Caju](https://www.caju.com.br/) juntam tudo em **um cartão multibenefícios**, gerenciado em um app.' },

  { type: 'h2', text: 'Uma porta que já estava aberta' },
  { type: 'p', text: 'Nossos clientes eram, na maioria, **empresas tradicionais, com grandes chãos de fábrica** e pouco contato com inovação. Ao escolher uma cesta personalizável, **elas tinham acabado de abrir a porta para algo novo**, e muitas também estavam procurando um cartão de benefícios.' },
  { type: 'p', text: 'Então por que não oferecer também? Era um **upsell** para os clientes da cesta e **uma segunda opção para os mesmos leads.** E, como você viu lá em cima, mudava o tamanho de cada negócio: uma cesta valia cerca de **R$70 a R$220 por funcionário**, enquanto um cartão costumava ficar entre **R$600 e R$900, às vezes mais de R$2.000.** Ganhávamos uma pequena porcentagem nos dois.' },
  { type: 'p', text: 'Para um time pequeno e com pouco investimento, **esse segundo produto era o que precisávamos para seguir em frente.** E tínhamos que lançá-lo enquanto esses clientes ainda estavam interessados.' },

  { type: 'h2', text: 'O desafio' },
  { type: 'p', text: '“Como poderíamos encaixar um novo negócio de fintech em um app feito para cestas básicas, em cerca de dois meses, para pessoas que quase não usam tecnologia?”' },
  { type: 'p', text: 'A infraestrutura do cartão vinha do [Stark Bank](https://starkbank.com/), um banco brasileiro que oferece serviços bancários para empresas por meio de APIs. Ele emitia os cartões e cuidava do dinheiro que as empresas depositavam. **Tudo o que desenhávamos tinha que caber no que o Stark Bank suportava.**' },
  { type: 'p', text: 'Em paralelo, desenhamos **do zero um backoffice** em que o pessoal de RH podia gerenciar as cestas e os cartões dos funcionários.' },

  { type: 'h2', text: 'Cinco trabalhadores, três pessoas de RH' },
  { type: 'p', text: 'Não tínhamos muito tempo, então fizemos **entrevistas semiestruturadas curtas com cerca de 5 trabalhadores e 2 ou 3 pessoas de RH.** Não era muito, mas foi o suficiente para mudar o produto:' },
  {
    type: 'ol',
    items: [
      '**Celular é para ligar e mandar mensagem.** A maioria dos trabalhadores não tinha nenhuma familiaridade com tecnologia. Muitos não tinham e-mail, ou tinham um que nunca abriam, e senhas não ficavam na cabeça. Cada passo tinha que ser curto, familiar e fácil de desfazer.',
      '**O WhatsApp era a única coisa que todo mundo conhecia.** Era o canal mais claro para códigos e instruções.',
      '**A segurança não pode depender de o usuário acertar.** Ninguém deveria conseguir ativar o cartão de outra pessoa, confundir códigos ou ter um código exposto.',
      '**O RH é uma pessoa fazendo tudo.** No fim do mês, a mesma pessoa cuida dos pagamentos e de todo o resto sobre os funcionários. Era fácil esquecer de incluir ou tirar alguém, e isso fazia o crédito ir para as pessoas erradas.',
    ],
  },

  { type: 'h2', text: 'O que ficou, e o que cortamos' },
  { type: 'p', text: 'Para cada funcionalidade, fazíamos a mesma pergunta: **qual é o essencial para lançar no menor tempo possível e validar esse modelo de negócio?**' },
  { type: 'p', text: '**O que ficou:**' },
  {
    type: 'ul',
    items: [
      '**CPF como login.** Em vez de e-mail, os funcionários entram com o CPF (que todo mundo sabe de cor) e um código enviado por SMS.',
      '**Um tutorial guiado** mostrando onde ver cada benefício e como criar um cartão virtual e adicioná-lo a uma carteira digital.',
      '**Um PIN de 4 dígitos** para pagar e abrir a área do cartão. Esqueceu? O RH da empresa ou o nosso suporte no WhatsApp ajudam.',
      '**Uma home para dois negócios.** O saldo do cartão e o saldo da cesta ficam lado a lado, então uma olhada mostra tudo.',
    ],
  },
  {
    type: 'img',
    alt: 'A home do app da Foodpass com o saldo do cartão e o saldo da cesta lado a lado, ao lado da área do cartão, onde o saldo aparece dividido em refeição, alimentação, flex e mobilidade',
    caption: 'A home junta os dois produtos. A área do cartão divide o saldo por benefício.',
  },
  {
    type: 'img',
    alt: 'Primeiro acesso: o mascote feijão dá as boas-vindas ao funcionário, a tela de criação do PIN de 4 dígitos e os dados do cartão, com opções para bloquear, excluir ou adicionar o cartão ao Google Wallet',
    caption: 'Primeiro acesso: boas-vindas calorosas, criação do PIN e os dados do cartão',
  },
  { type: 'p', text: '**O que cortamos, de propósito:**' },
  {
    type: 'ul',
    items: [
      '**Cartões físicos.** O MVP foi lançado **só com cartões virtuais, usados pelo Google Wallet e pelo Apple Wallet.** Sabíamos que um cartão físico seria mais fácil para os nossos usuários. Mas ele trazia custo, logística e uma experiência mais complexa no app.',
      '**WhatsApp.** Queríamos desde as primeiras entrevistas, mas custava mais esforço e dinheiro do que o SMS. Veio depois.',
      '**Ferramentas de backoffice para a correria de fim de mês do RH.** Desenhamos, mas deixamos fora da primeira versão.',
    ],
  },
  {
    type: 'img',
    alt: 'Criação de um cartão virtual em quatro telas: uma introdução com o mascote tomate, o nome do cartão, uma tela curta de carregamento e o cartão criado',
    caption: 'Cartões virtuais: dê um nome, espere alguns segundos, pronto.',
  },
  { type: 'p', text: 'Tudo foi construído sobre **o design system que já tínhamos**, para que os desenvolvedores andassem rápido com componentes que já conheciam. **O produto inteiro, backend incluído, foi construído em cerca de dois meses**, numa época em que a IA ainda não escrevia a maior parte do código para nós.' },

  { type: 'h2', text: 'Mais do que Figma' },
  { type: 'p', text: 'Meu trabalho não parou nas telas. **Participei de todas as discussões sobre cada funcionalidade e como ela seria construída**, incluindo a tecnologia por trás. Foi assim que decidimos o que entrava no MVP, e como **preparamos o design e o código para as versões que já tínhamos planejado.** Alguns atalhos são baratos hoje e caros demais para mudar depois!' },
  { type: 'p', text: 'Quando o app ficou pronto, **revisei cada tela comparando com o design**, testando cada fluxo e caçando cada pixel que não batia. Documentei cada diferença no Figma e corrigi com os desenvolvedores em calls.' },

  { type: 'h2', text: 'Fazendo uma designer crescer' },
  { type: 'p', text: 'Liderei o design com a **Paula Fernandes, uma designer júnior do meu time.** Ela vinha do Design Gráfico e era nova em UX/UI, então moldei o nosso processo em torno do crescimento dela:' },
  {
    type: 'ol',
    items: [
      '**Wireframes juntos,** para definir todo o conteúdo antes de qualquer visual.',
      '**Sessões de crítica** dos protótipos e ilustrações dela, seguidas de novas iterações.',
      '**Uma revisão de todo o trabalho dela,** com feedback a cada etapa.',
    ],
  },
  { type: 'p', text: 'Em cada etapa, dei a ela autonomia de verdade, para que ela se tornasse uma designer ainda melhor do que já era.' },

  { type: 'h2', text: 'Um feijão de terno de segurança' },
  { type: 'p', text: 'Foi aqui que a Paula me ensinou. **Ela tinha uma bagagem forte em ilustração, e aprendi muito com ela.** Viramos grandes amigos, e **recomendo ela para qualquer time em que ela entrar** 💜' },
  { type: 'p', text: 'O logo da Foodpass é um **feijão**, a base do prato brasileiro e de toda cesta básica. Transformamos ele em mascote, com um **tomate**, uma **batata** e o resto da cesta como amigos. Para pessoas com pouca experiência digital, **ilustrações explicam o que as palavras não conseguem.**' },
  { type: 'p', text: '**Na tela do PIN, o feijão usa terno preto e óculos escuros e guarda uma porta VIP.** Sem PIN, sem entrada. Sem uma linha de texto, ele diz que **este lugar é seguro, e o PIN é o que protege ele.**' },
  {
    type: 'img',
    alt: 'O mascote feijão nas telas de PIN: pescando um cadeado perdido na recuperação do PIN, de terno preto e óculos escuros guardando uma porta VIP na digitação do PIN, e segurando um cadeado na alteração do PIN',
    caption: 'O feijão de plantão: recuperação, digitação e alteração do PIN',
  },

  { type: 'h2', text: 'O problema que achamos que podia esperar' },
  { type: 'p', text: 'O beta provou que a nossa pesquisa estava certa antes do que esperávamos. **O RH esquecia de incluir ou tirar funcionários, e o crédito ia para as pessoas erradas.**' },
  { type: 'p', text: 'Os lembretes já existiam, e nunca iam ser suficientes: não tínhamos controle sobre quanta coisa cada pessoa de RH tinha nas mãos. Então a solução tinha que tornar os erros fáceis de desfazer. **O RH podia estornar um crédito recente e adicionar crédito a funcionários específicos.** Como **isso já estava desenhado**, conseguimos lançar rápido.' },

  { type: 'h2', text: 'Um código que só o dono vê' },
  { type: 'p', text: 'Alguns meses depois, a Foodpass lançou os **cartões físicos**, e **as regras de segurança do Stark Bank exigiam que cada cartão fosse ativado com um código que só o dono recebe.**' },
  { type: 'p', text: 'Em 2025, **a Foodpass me chamou de volta como freelancer, junto com a Paula, para desenhar essa experiência** online e offline. A Paula desenhou o cartão em si, com as minhas revisões e feedbacks. **O código de ativação vai na carta-berço**, o papel que segura o cartão dentro do envelope. A carta responde cada pergunta na ordem: _“Que cartão é esse? Qual app? Como eu entro?”_ Ela usa linguagem simples, passos visuais e **um QR code que leva direto para o app.**' },

  { type: 'h2', text: 'Resultados' },
  {
    type: 'ul',
    items: [
      '**Lançamos rápido o bastante para pegar os primeiros clientes** enquanto eles ainda procuravam um cartão. Conseguimos!',
      '**O cartão chegou a funcionários de várias empresas**, como o segundo produto da Foodpass ao lado das cestas.',
      '**Abriu as vendas para empresas com mais de 500 funcionários.**',
    ],
  },

  { type: 'h2', text: 'Próximos passos' },
  { type: 'p', text: 'Para validar o cartão como segundo negócio, eu mediria:' },
  {
    type: 'ul',
    items: [
      '**O mix de clientes:** a parcela de clientes que usa só cestas, só cartões ou os dois, e **a receita que cada grupo traz.**',
      '**O abandono durante o onboarding,** do CPF ao código.',
      '**Os pedidos de suporte sobre os cartões.**',
    ],
  },
  { type: 'p', text: 'Mas só números não bastariam. Pesquisas de intercepção, formulários e tickets de suporte não chegam de verdade a pessoas que não têm familiaridade com tecnologia. Então eu **conversaria direto com os funcionários**, para ter um retorno real, ao vivo.' },
  { type: 'p', text: 'E eu perguntaria ao RH. Quando os funcionários têm um problema, **o RH é a primeira pessoa que eles procuram.** Uma pesquisa com o pessoal de RH, ou uma pesquisa de intercepção no portal do RH, mostraria que reclamações eles recebem.' },

  { type: 'h2', text: 'Agradecimentos' },
  { type: 'p', text: 'À **Paula**, e ao **Eperson**, ao **Rafael** e ao **Henrique**, do time de desenvolvimento, que construíram um novo negócio com a gente em dois meses ;)' },

  { type: 'h2', text: 'Protótipo interativo' },
  { type: 'embed', label: 'Protótipo interativo' },
], 'benefits-card-app');
