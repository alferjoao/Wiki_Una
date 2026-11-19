/**
 * Wiki Una - CONTEÚDO DO SITE (edite aqui, sem mexer no resto do código)
 *
 * Como adicionar um item:
 *   { id: 'unico-sem-espaco', titulo: 'Nome que o aluno procura',
 *     resumo: 'Uma frase curta',
 *     onde: 'Bloco A • Térreo, ao lado da escada'      // só em Localização
 *     foto: 'assets/fotos/nome-da-foto.jpg',           // opcional
 *     rota: [{ foto: '...', texto: 'Passo curto' }],   // opcional: caminho com fotos
 *     rotas: [{ nome: 'No celular', passos: [{ foto, texto }] }], // opcional: mais de um caminho
 *     passos: ['Passo 1', 'Passo 2'],                  // opcional
 *     dica: 'Algo útil',                               // opcional
 *     buscas: ['sinônimos', 'jeitos de pesquisar'] }   // ajuda a busca a encontrar
 *
 * A Una ocupa o 4º e o 5º andar do Centerminas: em "onde", comece pelo andar
 * e diga um ponto de referência (ex.: '4º andar • perto dos elevadores, à direita').
 *
 * Fotos: coloque o arquivo em assets/fotos/ e informe o caminho em "foto".
 * Itens sem "onde" ou sem "foto" mostram o aviso "em levantamento".
 * Em Ambiente virtual, troque revisado: false por true depois de conferir os
 * passos no app uLife (de preferência com prints).
 */
// Caminho da entrada até os banheiros do início da Una (4º andar)
const ROTA_BANHEIROS_4_INICIO = [
  { foto: 'assets/fotos/4andar-entrada.jpg', texto: 'Entre na Una pela entrada do 4º andar e passe pela catraca.' },
  { foto: 'assets/fotos/4andar-hall-cac-corredor.jpg', texto: 'No hall da CAC, siga a faixa no chão até o corredor à direita.' },
  { foto: 'assets/fotos/4andar-corredor-laboratorios.jpg', texto: 'Entre no corredor e siga a placa “sanitários”.' },
  { foto: 'assets/fotos/4andar-banheiros-inicio.jpg', texto: 'Chegou! Feminino à esquerda, PNE no meio e masculino à direita.' }
];

// Passos do uLife com print (assets/prints/ulife-passos/). O vermelho mostra onde clicar.
const U = (arquivo, texto) => ({ foto: 'assets/prints/ulife-passos/' + arquivo + '.jpg', texto });
const NO_ULIFE = passos => [{ nome: 'No uLife (computador)', passos }];
const ABRIR_AULAS = U('menu-aulas-0-abrir', 'Entre no uLife e clique no ícone “Aulas” (o primeiro da barra da esquerda).');
const ABRIR_CURSO = U('menu-curso-0-abrir', 'Clique no ícone “Curso” (o chapéu de formatura, na barra da esquerda).');
const ABRIR_SERVICOS = U('menu-servicos-0-abrir', 'Clique no ícone “Serviços” (o quarto da barra da esquerda).');
const ABRIR_PERFIL = U('menu-perfil-0-abrir', 'Clique no ícone de perfil, no canto superior direito.');
const IR_ATENDIMENTO = [ABRIR_SERVICOS, U('menu-servicos-atendimento', 'No menu que abriu, clique em “Atendimento”.')];

window.WIKI_CONTEUDO = {
  localizacao: [
    {
      id: 'banheiros', nome: 'Banheiros', icone: '🚻',
      itens: [
        { id: 'banheiro-masc-fem', titulo: 'Banheiros masculino e feminino', resumo: 'Logo no início da Una, no 4º andar. Tem bebedouro ao lado.',
          onde: '4º andar • início da Una, no corredor dos laboratórios', foto: 'assets/fotos/4andar-banheiros-inicio.jpg', rota: ROTA_BANHEIROS_4_INICIO,
          buscas: ['wc', 'toalete', 'sanitario', 'preciso ir ao banheiro', 'bebedouro', 'agua'] },
        { id: 'banheiro-acessivel', titulo: 'Banheiro acessível (PNE)', resumo: 'Banheiro adaptado, junto dos banheiros do início da Una.',
          onde: '4º andar • início da Una, entre o feminino e o masculino', foto: 'assets/fotos/4andar-banheiros-inicio.jpg', rota: ROTA_BANHEIROS_4_INICIO,
          buscas: ['pcd', 'pne', 'cadeirante', 'deficiencia', 'adaptado', 'acessivel'] }
      ]
    },
    {
      id: 'auditorio', nome: 'Auditório', icone: '🎤',
      itens: [
        { id: 'auditorio', titulo: 'Auditório', resumo: 'O auditório do campus: palestras, eventos e apresentações.', buscas: ['palestra', 'evento', 'colacao', 'formatura', 'banca', 'apresentacao', 'tcc'] }
      ]
    },
    {
      id: 'aulas-praticas', nome: 'Aulas práticas / Laboratórios', icone: '🧪',
      itens: [
        { id: 'lab-informatica', titulo: 'Laboratório de informática e redes', resumo: 'Computadores para as aulas de tecnologia e de redes.', buscas: ['computador', 'ti', 'programacao', 'ciencia da computacao', 'sistemas', 'redes', 'cisco', 'infraestrutura', 'usar um computador da faculdade'] },
        { id: 'lab-saude', titulo: 'Área da saúde', resumo: 'Espaço de aulas práticas dos cursos da saúde.', buscas: ['saude', 'enfermagem', 'biomedicina', 'farmacia', 'anatomia', 'nutricao', 'fisioterapia', 'laboratorio de saude'] },
        { id: 'lab-engenharia', titulo: 'Laboratório de engenharia elétrica e mecânica', resumo: 'Um laboratório só, usado pelas engenharias elétrica e mecânica.', buscas: ['engenharia', 'eletrica', 'mecanica', 'circuito', 'motor', 'laboratorio de engenharia'] }
      ]
    },
    {
      id: 'atendimento', nome: 'Secretaria / Atendimento', icone: '🗂️',
      itens: [
        { id: 'secretaria', titulo: 'Secretaria / Central de Atendimento (CAA)', resumo: 'Documentos, matrícula, financeiro e requerimentos presenciais.', buscas: ['caa', 'secretaria', 'atendimento', 'documento', 'matricula', 'financeiro'] },
        { id: 'cac', titulo: 'CAC – Central de Atendimento ao Candidato', resumo: 'Atendimento para quem quer entrar na Una: matrícula e dúvidas.',
          onde: '4º andar • logo depois da entrada, no hall', foto: 'assets/fotos/4andar-cac.jpg',
          rota: [
            { foto: 'assets/fotos/4andar-entrada.jpg', texto: 'Entre na Una pela entrada do 4º andar e passe pela catraca.' },
            { foto: 'assets/fotos/4andar-cac.jpg', texto: 'Chegou! A CAC fica logo à frente, no hall. É só entrar.' }
          ],
          buscas: ['cac', 'cad', 'candidato', 'vestibular', 'matricula', 'quero estudar na una', 'atendimento'] },
        { id: 'napi', titulo: 'NAPI – Apoio psicopedagógico e inclusão', resumo: 'Apoio a estudantes, adaptações de prova e atendimento especializado.', buscas: ['napi', 'aee', 'inclusao', 'psicopedagogico', 'adaptacao', 'conversar com alguém', 'estou passando por um momento difícil', 'preciso de apoio emocional', 'tenho TDAH ou autismo'] },
        { id: 'coordenacao', titulo: 'Coordenação de curso', resumo: 'Onde falar com a coordenação do seu curso.', buscas: ['coordenador', 'coordenacao'] }
      ]
    },
    {
      id: 'biblioteca', nome: 'Biblioteca', icone: '📚',
      itens: [
        { id: 'biblioteca-fisica', titulo: 'Biblioteca', resumo: 'A biblioteca do campus: livros, empréstimo e lugar para estudar.', buscas: ['livro', 'emprestimo', 'acervo', 'devolucao', 'estudar', 'silencio', 'cabine'] }
      ]
    },
    {
      id: 'acesso', nome: 'Entrada', icone: '🚪',
      itens: [
        { id: 'entrada', titulo: 'Entrada e catracas', resumo: 'A porta da Una no 4º andar. Passe pela catraca para entrar.',
          onde: '4º andar • entrada principal da Una', foto: 'assets/fotos/4andar-entrada.jpg',
          buscas: ['entrada', 'catraca', 'carteirinha', 'portaria', 'como chego na una', 'porta'] }
      ]
    }
  ],

  // Passo a passo no app uLife. revisado: true = rota conferida no uLife em 19/11/2026.
  ambiente: [
    {
      id: 'aulas', nome: 'Aulas', icone: '🎓',
      itens: [
        { id: 'assistir-aula', revisado: true, titulo: 'Assistir aula ao vivo', resumo: 'Entrar na aula on-line pelo uLife.', buscas: ['aula ao vivo', 'teams', 'link da aula', 'online'],
          rotas: NO_ULIFE([
            U('inicio-assistir-aula', 'Na página inicial, em “Meus compromissos”, ache o card da aula do dia e clique em “Assistir a aula”.')
          ]), dica: 'O card só aparece no dia da aula. Entre alguns minutos antes para testar áudio e câmera.' },
        { id: 'aulas-gravadas', revisado: true, titulo: 'Ver aulas gravadas', resumo: 'Assistir de novo uma aula que já aconteceu.', buscas: ['gravacao', 'gravada', 'rever aula', 'perdi a aula', 'assistir de novo a explicação do professor'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-minhas-ucs', 'No menu que abriu, clique em “Minhas UCs”.'),
            U('ucs-aba-gravadas', 'No topo da página, clique na aba “Aulas Gravadas”.'),
            U('gravadas-acessar', 'Ache a data da aula (dá para filtrar a disciplina em “Componente curricular”) e clique em “Acessar gravação”.')
          ]) },
        { id: 'material-aula', revisado: true, titulo: 'Baixar material da disciplina', resumo: 'Slides, PDFs e conteúdos postados pelo professor.', buscas: ['slide', 'pdf', 'material', 'conteudo', 'apostila'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-minhas-ucs', 'No menu que abriu, clique em “Minhas UCs”.'),
            U('ucs-abrir-disciplina', 'Em “Unidades Curriculares”, clique na disciplina.'),
            U('disciplina-conteudo', 'Escolha o tema na lista da esquerda e clique no arquivo para abrir ou baixar.')
          ]) },
        { id: 'quadro-aulas', revisado: true, titulo: 'Ver meu horário (quadro de aulas)', resumo: 'Dias, horários e salas das suas aulas.', buscas: ['horario', 'sala', 'grade', 'quadro de aulas', 'que sala'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-quadro', 'No menu que abriu, clique em “Quadro de Aulas”.'),
            U('quadro-dia', 'O dia de hoje fica destacado. Cada card mostra horário, disciplina, sala/andar e professor. Use as setas para trocar de semana.')
          ]) },
        { id: 'enviar-atividade', revisado: true, titulo: 'Enviar trabalho ou atividade', resumo: 'Postar um arquivo de atividade para o professor.', buscas: ['entregar trabalho', 'postar atividade', 'upload', 'enviar arquivo'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-atividades', 'No menu que abriu, clique em “Atividades Avaliativas”.'),
            U('atividades-abrir', 'Clique na atividade que você quer entregar. O prazo aparece em “Fim”.'),
            U('atividade-aberta', 'Leia o enunciado, anexe seu arquivo e envie. Use “Próximo” para ir para a próxima parte.')
          ]), dica: 'Não deixe para o último minuto: o envio pode demorar com internet lenta.' }
      ]
    },
    {
      id: 'notas-provas', nome: 'Notas e provas', icone: '📝',
      itens: [
        // a tela de notas estava em manutenção em 19/11: adicionar o print final quando voltar
        { id: 'ver-notas', revisado: false, titulo: 'Ver minhas notas', resumo: 'Notas de A1, A2, A3 e média final.', buscas: ['nota', 'boletim', 'media', 'resultado', 'passei'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-notas', 'No menu que abriu, clique em “Notas/Faltas”. Escolha o semestre e a disciplina.')
          ]) },
        { id: 'fazer-prova', revisado: true, titulo: 'Fazer prova on-line', resumo: 'Avaliações A1, A2 e A3 pelo ambiente virtual.', buscas: ['prova', 'avaliacao', 'a1', 'a2', 'a3', 'teste'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-agendamento', 'No menu que abriu, clique em “Agendamento de avaliações”.'),
            U('agendamento-lista', 'Suas provas agendadas aparecem aqui. Se estiver vazio, você não tem prova marcada no momento.')
          ]), dica: 'Confira a data na aba Calendário Acadêmico. Use internet estável e não feche a prova antes de finalizar.' },
        { id: 'segunda-oportunidade', revisado: false, titulo: 'Pedir 2ª oportunidade de prova', resumo: 'Para quem perdeu a prova ou precisa refazer.', buscas: ['segunda chamada', '2 chamada', 'perdi a prova', 'segunda oportunidade', 'faltei prova'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-iniciar', 'Desça até o fim da página e clique em “Iniciar Atendimento” para pedir pelo WhatsApp.')
          ]), dica: 'Veja o prazo na aba Calendário Acadêmico. O link de solicitação também aparece no regulamento da avaliação.' },
        { id: 'recurso-nota', revisado: false, titulo: 'Pedir revisão / recurso de nota', resumo: 'Quando você discorda da correção.', buscas: ['revisao', 'recurso', 'contestar nota', 'corrigir nota'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-todas-solicitacoes', 'Desça a página e clique em “Todas as Solicitações”.'),
            U('solicitacao-escolher-assunto', 'Em “Escolher assunto”, procure “Correção de Notas Semestres Concluídos”. Para o semestre atual, use “Iniciar Atendimento”.')
          ]), dica: 'Veja o prazo de recurso na aba Calendário Acadêmico.' }
      ]
    },
    {
      id: 'certificados', nome: 'Certificados e horas', icone: '🏅',
      itens: [
        { id: 'postar-certificado', revisado: true, titulo: 'Postar certificado (atividades complementares)', resumo: 'Enviar certificados de cursos, palestras e eventos para contar horas.', buscas: ['certificado', 'horas complementares', 'atividade complementar', 'acc', 'enviar certificado', 'mandar o pdf do curso que eu fiz', 'fiz um curso e quero contar horas'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-entrega-ac', 'Em “Solicitações mais procuradas”, clique em “Entrega de Atividades Complementares - Aluno Ativo”, preencha e anexe o certificado (PDF ou imagem).')
          ]), dica: 'Também dá pelo menu Curso → Atividades Complementares. Confira no calendário o prazo de comprovação.' },
        { id: 'horas-extensao', revisado: true, titulo: 'Horas de extensão', resumo: 'Projetos de extensão e como as horas são contadas.', buscas: ['extensao', 'projeto de extensao', 'horas de extensao'],
          rotas: NO_ULIFE([
            ABRIR_CURSO,
            U('menu-curso-extensao', 'No menu que abriu, clique em “Extensão”.'),
            U('extensao-visao-geral', 'A “Visão Geral” mostra quanto das horas você já fez. Em “Matrícula” aparecem as inscrições abertas.')
          ]) },
        { id: 'acompanhar-horas', revisado: false, titulo: 'Ver quantas horas já tenho', resumo: 'Acompanhar o total de horas complementares.', buscas: ['quantas horas', 'saldo de horas', 'total de horas'],
          rotas: NO_ULIFE([
            ABRIR_CURSO,
            U('menu-curso-atividades-complementares', 'No menu que abriu, clique em “Atividades Complementares” para ver as horas aprovadas e pendentes.'),
            U('menu-curso-progresso-geral', 'Para ver o andamento do curso todo, clique em “Progresso Geral”.')
          ]) }
      ]
    },
    {
      id: 'livros', nome: 'Biblioteca / Livros digitais', icone: '📖',
      itens: [
        { id: 'livros-digitais', revisado: true, titulo: 'Ler livros digitais (Biblioteca Pearson)', resumo: 'Milhares de livros on-line com seu login @ulife.com.br.', buscas: ['pearson', 'biblioteca virtual', 'livro digital', 'ebook', 'livro online', 'minha biblioteca'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-bibliotecas-online', 'No menu que abriu, clique em “Bibliotecas Online”.'),
            U('bibliotecas-pearson', 'Clique em “Pearson” (Biblioteca Virtual). Também tem Minha Biblioteca, EBSCO, Senac e Coleção ABNT.')
          ]) },
        { id: 'reservar-livro', revisado: false, titulo: 'Reservar ou renovar livro físico', resumo: 'Empréstimo na biblioteca do campus.', buscas: ['reservar livro', 'renovar', 'emprestimo', 'devolver livro'],
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-biblioteca-fisica', 'No menu que abriu, clique em “Biblioteca Física”. Pesquise o livro e reserve ou renove.')
          ]), dica: 'Veja onde fica a biblioteca na aba Localização.' }
      ]
    },
    {
      id: 'secretaria-docs', nome: 'Documentos e secretaria', icone: '📄',
      itens: [
        { id: 'declaracao-matricula', revisado: true, titulo: 'Declaração de matrícula', resumo: 'Comprovante de que você estuda na Una.', buscas: ['declaracao', 'comprovante', 'atestado de matricula', 'provar que sou aluno', 'documento para o estágio ou trabalho', 'regularidade academica'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-declaracao', 'Em “Documentos Acadêmicos”, clique em “Declaração de Regularidade Acadêmica”. É a declaração de matrícula, com emissão rápida.')
          ]) },
        { id: 'historico', revisado: true, titulo: 'Histórico escolar', resumo: 'Lista das disciplinas cursadas e notas.', buscas: ['historico', 'disciplinas cursadas'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-historico', 'Em “Documentos Acadêmicos”, clique em “Histórico Escolar” (emissão rápida).')
          ]), dica: 'Também está no menu Curso → Histórico Escolar.' },
        { id: 'rematricula', revisado: true, titulo: 'Fazer rematrícula', resumo: 'Renovar a matrícula para o próximo semestre.', buscas: ['rematricula', 'renovar matricula', 'proximo semestre'],
          rotas: NO_ULIFE([
            ABRIR_SERVICOS,
            U('menu-servicos-rematricula', 'No menu que abriu, clique em “Rematrícula”.'),
            U('rematricula-tela', 'No período de rematrícula, clique em “Minha Rematrícula”, confira as disciplinas e confirme. Fora do prazo ela fica bloqueada.')
          ]), dica: 'Confira o período de rematrícula na aba Calendário Acadêmico.' },
        { id: 'trancamento', revisado: false, titulo: 'Trancar matrícula', resumo: 'Pausar o curso por um período.', buscas: ['trancar', 'trancamento', 'pausar curso'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-iniciar', 'Não há pedido on-line de trancamento: desça até o fim e clique em “Iniciar Atendimento” (WhatsApp/videochamada).')
          ]), dica: 'Veja o prazo de trancamento na aba Calendário Acadêmico.' },
        { id: 'mudar-turno', revisado: false, titulo: 'Mudar de turno ou campus', resumo: 'Trocar manhã/noite ou de unidade.', buscas: ['mudar turno', 'trocar campus', 'transferencia interna'],
          rotas: NO_ULIFE([
            ...IR_ATENDIMENTO,
            U('atendimento-todas-solicitacoes', 'Desça a página e clique em “Todas as Solicitações”.'),
            U('solicitacao-escolher-assunto', 'Em “Escolher assunto”, calouro PROUNI escolhe “Mudança de Turno e/ou Campus - Calouro - PROUNI”. Nos outros casos, volte e use “Iniciar Atendimento”.')
          ]), dica: 'Veja o prazo na aba Calendário Acadêmico.' }
      ]
    },
    {
      id: 'financeiro', nome: 'Financeiro', icone: '💳',
      itens: [
        { id: 'boleto', revisado: true, titulo: 'Tirar boleto / 2ª via', resumo: 'Pagar a mensalidade.', buscas: ['boleto', 'mensalidade', 'pagar', 'segunda via', 'pix'],
          rotas: NO_ULIFE([
            ABRIR_PERFIL,
            U('menu-perfil-meus-pagamentos', 'No menu que abriu, clique em “Meus Pagamentos”.'),
            U('pagamentos-filtro', 'Deixe o status em “Aberto” para ver as mensalidades a pagar.'),
            U('pagamentos-meio', 'Em “Escolha um meio de pagamento”, gere o boleto ou o Pix.')
          ]), dica: 'Os boletos ficam disponíveis entre os dias 25 e 30 do mês anterior ao vencimento.' },
        { id: 'negociar', revisado: false, titulo: 'Negociar mensalidades', resumo: 'Parcelar ou negociar valores em atraso.', buscas: ['negociar', 'divida', 'atraso', 'parcelar'],
          rotas: NO_ULIFE([
            ABRIR_PERFIL,
            U('menu-perfil-meus-pagamentos', 'No menu que abriu, clique em “Meus Pagamentos” e procure a opção de negociação das parcelas em aberto.')
          ]) },
        // a Política de Bolsas deu erro em 19/11: adicionar o print final quando carregar
        { id: 'fies-prouni', revisado: false, titulo: 'Fies, Prouni e bolsas', resumo: 'Informações sobre financiamentos e bolsas.', buscas: ['fies', 'prouni', 'bolsa', 'pravaler', 'desconto'],
          rotas: NO_ULIFE([
            ABRIR_PERFIL,
            U('menu-perfil-politica-bolsas', 'No menu que abriu, clique em “Política de Bolsas” (ou “Meus Benefícios”, logo abaixo).')
          ]), dica: 'Em caso de dúvida, vá em Serviços → Atendimento.' }
      ]
    },
    {
      id: 'conta', nome: 'Conta e acesso', icone: '🔑',
      itens: [
        { id: 'login', revisado: true, titulo: 'Entrar no uLife (login)', resumo: 'Como fazer login no computador ou no app do celular.',
          buscas: ['login', 'entrar', 'logar', 'acessar', 'primeiro acesso', 'calouro', 'como entro no ulife', 'site do ulife', 'app do ulife'],
          rotas: [
            { nome: 'No computador', passos: [
              U('login-entrar', 'Abra o site do uLife. Digite só o seu login – o “@ulife.com.br” já aparece ao lado – e clique em Entrar.')
            ] },
            { nome: 'No celular (app uLife)', passos: [
              { foto: 'assets/prints/ulife-login-celular.jpg', texto: 'Abra o app uLife, digite seu login e sua senha e toque em Entrar.' }
            ] }
          ],
          dica: 'Com dúvida? Clique em “Como realizar o acesso”, embaixo do botão Entrar.' },
        { id: 'esqueci-senha', revisado: true, titulo: 'Esqueci minha senha', resumo: 'Recuperar o acesso ao uLife.', buscas: ['senha', 'esqueci', 'recuperar', 'nao consigo entrar', 'bloqueado', 'meu login não funciona'],
          rotas: NO_ULIFE([
            U('login-senha', 'Na tela de login, clique em “clique aqui para alterar sua senha”, informe seu login @ulife.com.br e siga as instruções.')
          ]) },
        { id: 'wifi', revisado: false, titulo: 'Conectar no Wi-Fi do campus', resumo: 'Internet da Una com seu login.', buscas: ['wifi', 'wi-fi', 'internet', 'rede'],
          passos: ['Procure a rede Wi-Fi da Una no seu celular.', 'Entre com seu login institucional.', 'Se não conectar, procure o suporte de TI.'] },
        { id: 'office-teams', revisado: false, titulo: 'Microsoft 365 e Teams grátis', resumo: 'Word, Excel, PowerPoint e Teams com o e-mail da Una.', buscas: ['office', 'word', 'excel', 'teams', 'microsoft', 'outlook'],
          passos: ['Acesse office.com.', 'Entre com seu e-mail @ulife.com.br.', 'Use on-line ou instale os aplicativos.'] }
      ]
    }
  ]
};
