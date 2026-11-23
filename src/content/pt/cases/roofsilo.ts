// Portuguese mirror of ../../cases/roofsilo.ts. Text only: images come from the English file.
import * as en from '../../cases/roofsilo';
import { translateBody } from './blocks';

export const meta: Record<keyof typeof en.meta, string> = { company: 'RoofSilo · pela Tempo Labs', year: '2025', role: 'Product Designer Sênior', team: 'Eu, um designer júnior e um desenvolvedor' };

export const original = { title: 'CRM com IA para empresas de telhados', subtitle: 'De um protótipo feito no vibe coding a um CRM em produção, em que a IA liga para os seus leads por você' };

export const body = translateBody(en.body, [
  { type: 'h2', text: 'Contextualizando o problema' },
  { type: 'p', text: 'Quem trabalha com telhados vende pelo telefone, mas passa o dia em cima dos telhados.' },
  { type: 'p', text: 'Imagina só: você está em cima de um telhado fazendo uma inspeção, e o celular toca. É um cliente cujo telhado vazou ontem à noite. Você não consegue atender. Quando você desce, ele já ligou para outra empresa.' },
  { type: 'p', text: 'Esse é o problema que a RoofSilo resolve. É um CRM, então tem tudo o que você espera: leads, pipelines, calendário, tarefas. Mas a grande ideia é **IA integrada em tudo, inclusive na voz: uma IA que liga para os seus leads em seu nome**, faz o follow-up e ajuda a fechar mais serviços.' },
  { type: 'img', alt: 'Sem a RoofSilo, a ligação do cliente fica sem resposta e o lead se perde. Com a RoofSilo, o SiloPilot atende em nome da empresa, agenda a inspeção e mantém o lead' },
  { type: 'p', text: 'E quem são esses clientes? O onboarding mostra melhor do que ninguém: empresas de impermeabilização de telhados, obras residenciais e comerciais, que encontram clientes por SEO, Google, Facebook, mala direta, Angi e Yelp.' },
  { type: 'img', alt: 'Para quem é a RoofSilo: o trabalho que fazem, onde encontram clientes, as ferramentas que já usam e o que querem da RoofSilo, a partir das opções do onboarding' },
  { type: 'p', text: 'O cliente vinha do mundo do marketing e trouxe essa ideia para a gente na Tempo, junto com um protótipo que ele tinha feito no vibe coding. Do nosso lado, éramos eu, um designer júnior me ajudando e um desenvolvedor.' },

  { type: 'h2', text: 'O ponto de partida: um protótipo feito no vibe coding' },
  { type: 'p', text: 'O protótipo ajudou muito. Mostrava, tela por tela, o que o cliente tinha em mente. Mas tinha aquela cara de vibe coding que você provavelmente já viu várias vezes, e **vários fluxos não eram fáceis de usar.**' },
  { type: 'p', text: 'Então o nosso trabalho tinha dois lados:' },
  { type: 'ol', items: [
      '**Dar à RoofSilo uma identidade própria.** Um design system e uma linguagem visual que deixassem a cara de vibe coding para trás.',
      '**Repensar o produto com o cliente.** Questionar fluxos que ele já tinha planejado quando a usabilidade não estava boa, e desenhar as partes que nem existiam no protótipo.',
    ] },
  { type: 'p', text: '“Transformar um protótipo feito no vibe coding em um CRM em que as empresas de telhados possam tocar o negócio, com IA em todas as partes.”' },

  { type: 'h2', text: 'Construindo junto' },
  { type: 'p', text: 'Quase tudo na RoofSilo saiu de conversas com o cliente. **A gente discutiu muito**: levamos propostas, discordamos quando algo não ia funcionar bem para o usuário e construímos as respostas juntos.' },
  { type: 'p', text: 'Também pesquisamos os concorrentes. E aqui tem um detalhe sobre CRMs: já existem muitos, e **os usuários já sabem como pipelines, contatos e calendários funcionam.** Então não tentamos reinventar a roda nas partes padrão. Olhamos o que já funciona em outros CRMs e guardamos a energia para o que torna a RoofSilo diferente: a IA.' },

  { type: 'h2', text: 'Onde a IA mora: SiloPilot' },
  { type: 'p', text: 'Na RoofSilo, a IA não é uma caixinha de chat no canto. Ela tem nome, **SiloPilot**, e um lugar próprio no menu, onde a empresa configura a voz da IA, os fluxos da IA, o chat da IA no site, um perfil e uma base de conhecimento.' },
  { type: 'p', text: 'A base de conhecimento é onde a empresa ensina a IA sobre o negócio: serviços, fabricantes, preços e unidades de medida. Assim, **quando a IA fala com um lead, ela fala dos serviços reais da empresa**, e não com respostas genéricas.' },
  { type: 'img', alt: 'Configurações do SiloPilot com as abas AI Voice, AI Workflow, AI Webchat, Profile e Knowledge Base, e uma base de conhecimento preenchida com serviços de telhado, fabricantes, preços e unidades' },
  { type: 'p', text: 'O plano com IA junta tudo isso: uma central de atendimento com IA para ligações recebidas e feitas, uma mensagem e um follow-up quando uma ligação não é atendida (lembra de quem estava em cima do telhado?), transcrição e resumo das ligações, sugestões de resposta, pontuação das mensagens e leads que passam sozinhos para a próxima etapa.' },

  { type: 'h2', text: 'Um CRM completo, não uma demo' },
  { type: 'p', text: 'O protótipo tinha a ideia. O produto precisava de tudo em volta dela. Desenhamos muitas telas, e o fluxo inteiro está documentado no Figma. Aqui estão as principais.' },
  { type: 'h3', text: 'Funil de vendas' },
  { type: 'p', text: 'Um quadro em que cada lead é um card. Cada card mostra o contato, o endereço, o tipo de serviço (reparo, inspeção, troca) e o valor, com **ações rápidas no próprio card**: ligar, mandar mensagem, contrato, agendar e tarefa. Etapas como “2nd Attempt”, “3rd Attempt” e “Drip Campaign” seguem o jeito como essas empresas correm atrás de um lead.' },
  { type: 'img', alt: 'Quadro de pipeline com um card de lead ampliado: origem do lead, contato e endereço, tipo de serviço e valor, e ações rápidas' },
  { type: 'h3', text: 'Conversas' },
  { type: 'p', text: 'SMS, WhatsApp e e-mail com cada lead, **tudo em uma conversa só**, com fotos e arquivos no mesmo lugar.' },
  { type: 'img', alt: 'Tela de conversa com um lead e as abas SMS, WhatsApp e Email em destaque' },
  { type: 'h3', text: 'Calendário e tarefas' },
  { type: 'p', text: 'Inspeções, ligações e visitas no local em um calendário só, sincronizado com o Google Agenda. Ao criar um evento, você busca pelo cliente ou pelo endereço e escolhe quem do time vai, porque a visita costuma ser na casa de alguém.' },
  { type: 'img', alt: 'Calendário na visão mensal com a janela de novo evento (inspeção, ligação, visita no local, cliente ou endereço, membros do time) e os detalhes de um evento' },
  { type: 'h3', text: 'Relatórios' },
  { type: 'p', text: 'Essa parte tem muitos dados, então o desafio era **deixar os números fáceis de entender** num relance.' },
  { type: 'p', text: 'O relatório de pipeline mostra o funil do lead novo ao serviço fechado, em número de serviços e em valor. O relatório de origem responde a uma pergunta que todo dono de negócio tem: **qual canal realmente traz serviços pagos?** Facebook, Google, o site ou ligações, cada um com leads, agendamentos, serviços ganhos, taxa de fechamento e ticket médio.' },
  { type: 'img', alt: 'Relatório de pipeline com o funil do lead novo ao serviço fechado, na frente do relatório de origem que compara Facebook, Google, site e ligações' },
  { type: 'h3', text: 'Automações e templates' },
  { type: 'p', text: 'Um editor visual em que a empresa monta as próprias automações: um gatilho (como “Contato criado”), condições e ações (como mandar um SMS), com rascunho, publicação e um botão “Test flow” antes de qualquer coisa ir ao ar. Os templates de mensagem e de e-mail mostram quantas automações usam cada um, para você saber o que vai afetar antes de editar.' },
  { type: 'img', alt: 'Editor de automações com um gatilho Contact Created, uma condição semanal e uma ação de SMS, ao lado dos painéis para escolher o gatilho e configurar o SMS' },
  { type: 'h3', text: 'Cadastro, onboarding e cobrança' },
  { type: 'p', text: 'Cadastro, verificação de e-mail e um onboarding em 3 passos: escolher um plano (com 14 dias grátis), falar sobre você e falar sobre a sua empresa. As perguntas (que ferramentas você usa hoje, onde você anuncia, que tipo de trabalho com telhados você faz) ajudam a adaptar a RoofSilo a cada negócio. Cobrança e faturas ficam nas configurações.' },
  { type: 'img', alt: 'Os três passos do onboarding: escolher um plano com 14 dias grátis, as ferramentas que a empresa quer e onde ela anuncia' },

  { type: 'h2', text: 'O design system' },
  { type: 'p', text: 'Usamos o **shadcn/ui como base** e adaptamos à identidade visual do cliente. Partir de uma base sólida e conhecida fez a gente não perder tempo redesenhando botões e campos, e focar nas partes específicas desse mercado.' },
  { type: 'p', text: 'As cores são tokens do shadcn/ui com o azul da RoofSilo como cor primária: **um azul só para toda ação e estado selecionado**, neutros em tons de ardósia para os dados, e verde e vermelho só para status. A tipografia é a **Segoe UI**, organizada em tokens semânticos, do display de 36px até o badge de 10px.' },
  { type: 'img', alt: 'Tokens de cor: azul primário, texto principal, textos secundários, bordas, barra lateral, sucesso e erro' },
  { type: 'img', alt: 'Escala tipográfica em Segoe UI, do display/default de 36px ao text/xxsmall de 10px' },
  { type: 'img', alt: 'Componentes reais recortados das telas: botões, abas, cards de métricas, tags de status, card de lead, formulário de cadastro, código de verificação, card de plano, chips de seleção e linhas de tabela' },
  { type: 'p', text: 'Funcionalidades que ainda estão a caminho, como Finance, Measurements e Analytics, aparecem no menu com uma tag “Soon”.' },

  { type: 'h2', text: 'Do Figma à produção com a Tempo' },
  { type: 'p', text: 'A RoofSilo foi construída com duas ferramentas: **Figma e Tempo.**' },
  { type: 'p', text: 'A Tempo é uma ferramenta de criação de software com IA que roda nos modelos da Anthropic, como o Claude. Pensa nela como um **Claude Code para designers, desenvolvedores e PMs**: você junta prompts com um editor visual, e ela escreve código React de verdade.' },
  { type: 'p', text: 'Começamos no Figma, usando o que o cliente já tinha como base, e desenhamos as telas lá. Depois levamos tudo de volta para a Tempo para construir a RoofSilo de fato. Ou seja, usamos o nosso próprio produto para dar vida ao produto de um cliente, e **colocamos o app em produção.** 💜' },

  { type: 'h2', text: 'Depois do lançamento' },
  { type: 'p', text: 'A RoofSilo continua no mercado. Em julho de 2026, mais de um ano depois do lançamento, ela ainda era oferecida a empresas de telhados, com o SiloPilot no centro.' },
  { type: 'p', text: 'Estas são as métricas que eu usaria para medir o sucesso:' },
  { type: 'ul', items: [
      'Quanto tempo um lead leva para receber a primeira resposta, de uma pessoa ou da IA',
      'Quantas ligações perdidas o follow-up da IA recupera',
      'Taxa de fechamento por origem (curiosidade: o próprio relatório de origem da RoofSilo seria a minha principal ferramenta para isso ;)',
      'Conversão do período grátis para o plano pago depois do onboarding',
    ] },
  { type: 'p', text: '“Um protótipo feito no vibe coding prova uma ideia. O design transforma ele em produto.”' },
], 'roofsilo');
