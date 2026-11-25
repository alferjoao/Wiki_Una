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
 *     perto: ['biblioteca'],   // opcional (no item ou em cada rota): ids de WIKI_LOCAIS
 *                              // usados na busca "banheiro perto da biblioteca"
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
  { foto: 'assets/fotos/4andar-corredor-laboratorios.jpg', texto: 'Vire à direita e entre neste corredor. Siga a placa “sanitários”.' },
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

// Aba Projetos: caminhos no uLife até a Academia de Futuros Profissionais (AFP) e a Extensão
const ABRIR_AFP = [
  U('menu-afp-0-abrir', 'Entre no uLife e clique no ícone “Academia de Futuros Profissionais” (a maleta, na barra da esquerda).'),
  U('menu-afp-portal', 'No menu que abriu, clique em “Portal Academia de Futuros Profissionais”. O portal abre com o mesmo login.')
];
const AFP_INOVACAO = [...ABRIR_AFP, U('afp-menu-inovacao', 'No menu da esquerda do portal, clique em “Inovação & Empreendedorismo”.')];
const IR_HUB = texto => [...AFP_INOVACAO, U('afp-inovacao-hub', texto)];
const IR_NEST = texto => [...AFP_INOVACAO, U('afp-inovacao-nest', texto)];
const IR_EXTENSAO = [ABRIR_CURSO, U('menu-curso-extensao', 'No menu que abriu, clique em “Extensão”. A plataforma abre em outra página, com o mesmo login.')];

// Começo das rotas do corredor da esquerda (Atende+, Coordenação e Biblioteca)
const ENTRAR_NA_UNA = { foto: 'assets/fotos/4andar-entrada.jpg', texto: 'Entre na Una pela entrada do 4º andar e passe pela catraca.' };
const CORREDOR_ESQUERDA = { foto: 'assets/fotos/4andar-corredor-biblioteca.jpg', texto: 'Vire à esquerda e siga por este corredor (o mesmo da biblioteca).' };
const ATENDE_MAIS = 'assets/fotos/4andar-atende-mais.jpg';
const PASSAR_SALAS_423 = { foto: 'assets/fotos/4andar-corredor-salas-423-424.jpg', texto: 'Siga reto pelo corredor, passando pelas salas 423 e 424.' };
const BANHEIROS_CORREDOR = 'assets/fotos/4andar-banheiros-corredor-feminino-pne.jpg';
const ROTA_BANHEIROS_4_FUNDO = [
  ENTRAR_NA_UNA,
  CORREDOR_ESQUERDA,
  { foto: 'assets/fotos/4andar-corredor-apos-biblioteca.jpg', texto: 'Siga reto pelo corredor, passando pela biblioteca.' },
  { foto: 'assets/fotos/4andar-corredor-vermelho-cadeiras.jpg', texto: 'Continue pelo corredor da parede vermelha, com as cadeiras.' },
  { foto: 'assets/fotos/4andar-corredor-parede-madeira.jpg', texto: 'Vá até o fim, onde fica a parede de madeira.' },
  { foto: 'assets/fotos/4andar-corredor-mesas.jpg', texto: 'Na parede de madeira, vire à esquerda e siga pelo corredor das mesas.' },
  { foto: 'assets/fotos/4andar-banheiros-fundo.jpg', texto: 'Chegou! Feminino à esquerda, com bebedouro, e masculino à direita. A porta do meio é a sala de resíduos, não é banheiro.' }
];
const ROTA_BANHEIROS_4_CORREDOR = [
  ENTRAR_NA_UNA,
  CORREDOR_ESQUERDA,
  PASSAR_SALAS_423,
  { foto: BANHEIROS_CORREDOR, texto: 'Chegou! O feminino fica à esquerda, com bebedouro do lado, e o PNE logo depois.' },
  { foto: 'assets/fotos/4andar-banheiros-corredor-pne-masculino.jpg', texto: 'O masculino fica do lado do PNE.' }
];

// 5º andar: sobe pela escada do hall da CAC e segue o corredor da parede verde
const F5 = 'assets/fotos/';
const IR_5_ANDAR = [
  ENTRAR_NA_UNA,
  { foto: F5 + '4andar-hall-cac-escada.jpg', texto: 'No hall da CAC, siga para a direita, onde fica a escada.' },
  { foto: F5 + '4andar-escada-5andar.jpg', texto: 'Suba por esta escada, com a placa “acesso ao 5º andar”.' },
  { foto: F5 + 'escada-subindo-5andar.jpg', texto: 'Continue subindo até o 5º andar.' },
  { foto: F5 + '5andar-corredor.jpg', texto: 'No 5º andar, siga pelo corredor da parede verde.' }
];
const ATE_AUDITORIO = [
  ...IR_5_ANDAR,
  { foto: F5 + '5andar-sala-501.jpg', texto: 'Passe pela sala 501 (Laboratório de Corpo e Movimento)…' },
  { foto: F5 + '5andar-sala-504.jpg', texto: '…e pela sala 504 (Laboratório de Práticas Estéticas). Siga até o fim do corredor.' },
  { foto: F5 + '5andar-auditorio.jpg', texto: 'O auditório fica no fim do corredor, na porta dupla de madeira.' }
];
const ROTA_BANHEIROS_5 = [
  ...ATE_AUDITORIO,
  { foto: F5 + '5andar-auditorio-banheiros.jpg', texto: 'Os banheiros ficam à esquerda do auditório, passando pela abertura.' },
  { foto: F5 + '5andar-banheiros.jpg', texto: 'Chegou! Tem banheiro unissex, feminino/masculino e PNE.' }
];

// Pontos de referência para "perto de" (ex.: "banheiro perto da biblioteca").
// termos: como a pessoa escreve, sem acento. Os ids vão no campo "perto" das rotas.
window.WIKI_LOCAIS = [
  { id: 'entrada', nome: 'Entrada / CAC', termos: ['entrada', 'catraca', 'cac', 'hall', 'inicio da una', 'recepcao'] },
  { id: 'biblioteca', nome: 'Biblioteca / Atende+', termos: ['biblioteca', 'atende+', 'atende mais', 'atende', 'coordenacao', 'secretaria', 'sala 423', 'sala 424', '423', '424'] },
  { id: 'napi', nome: 'NAPI / sala 436', termos: ['napi', 'sala 436', '436'] },
  { id: 'fundo', nome: 'Fundo do 4º andar', termos: ['parede de madeira', 'corredor vermelho', 'corredor das mesas', 'fundo do andar', 'fundo do 4', 'mesas'] },
  { id: '5andar', nome: '5º andar / Auditório', termos: ['quinto andar', '5º andar', '5o andar', '5 andar', 'quinto', 'auditorio', 'sala 501', 'sala 504', '501', '504', 'estetica', 'corpo e movimento'] }
];

window.WIKI_CONTEUDO = {
  localizacao: [
    {
      id: 'banheiros', nome: 'Banheiros', icone: '🚻',
      itens: [
        { id: 'banheiro-masc-fem', titulo: 'Banheiros do 4º andar', resumo: 'Masculino e feminino em três lugares: no início da Una, no corredor da biblioteca e no fundo do andar. Todos têm bebedouro.',
          onde: '4º andar • início da Una (corredor da direita), corredor da biblioteca e fundo do andar (depois da parede de madeira)', foto: 'assets/fotos/4andar-banheiros-inicio.jpg',
          rotas: [
            { nome: 'Opção 1: no início da Una', passos: ROTA_BANHEIROS_4_INICIO, perto: ['entrada'] },
            { nome: 'Opção 2: no corredor da biblioteca', passos: ROTA_BANHEIROS_4_CORREDOR, perto: ['biblioteca', 'napi'] },
            { nome: 'Opção 3: no fundo do andar', passos: ROTA_BANHEIROS_4_FUNDO, perto: ['fundo'] }
          ],
          buscas: ['wc', 'toalete', 'sanitario', 'preciso ir ao banheiro', 'bebedouro', 'agua'] },
        { id: 'banheiros-5', titulo: 'Banheiros do 5º andar', resumo: 'Unissex, feminino/masculino e PNE, do lado esquerdo do auditório.',
          onde: '5º andar • fim do corredor, à esquerda do auditório', foto: F5 + '5andar-banheiros.jpg', rota: ROTA_BANHEIROS_5, perto: ['5andar'],
          buscas: ['wc', 'toalete', 'sanitario', 'banheiro unissex', 'banheiro quinto andar', 'banheiro perto do auditorio'] },
        { id: 'banheiro-acessivel', titulo: 'Banheiro acessível (PNE)', resumo: 'Banheiro adaptado. Tem nos dois banheiros do 4º andar e no do 5º andar.',
          onde: '4º andar (início da Una e corredor da biblioteca) e 5º andar (ao lado do auditório)', foto: 'assets/fotos/4andar-banheiros-inicio.jpg',
          rotas: [
            { nome: '4º andar – opção 1: no início da Una', passos: ROTA_BANHEIROS_4_INICIO, perto: ['entrada'] },
            { nome: '4º andar – opção 2: no corredor da biblioteca', passos: ROTA_BANHEIROS_4_CORREDOR, perto: ['biblioteca', 'napi'] },
            { nome: '5º andar: ao lado do auditório', passos: ROTA_BANHEIROS_5, perto: ['5andar'] }
          ],
          buscas: ['pcd', 'pne', 'cadeirante', 'deficiencia', 'adaptado', 'acessivel'] }
      ]
    },
    {
      id: 'auditorio', nome: 'Auditório', icone: '🎤',
      itens: [
        { id: 'auditorio', titulo: 'Auditório', resumo: 'O auditório do campus: palestras, eventos e apresentações.',
          onde: '5º andar • no fim do corredor', foto: F5 + '5andar-auditorio.jpg', rota: ATE_AUDITORIO,
          buscas: ['palestra', 'evento', 'colacao', 'formatura', 'banca', 'apresentacao', 'tcc'] }
      ]
    },
    {
      id: 'aulas-praticas', nome: 'Aulas práticas / Laboratórios', icone: '🧪',
      itens: [
        { id: 'lab-informatica', titulo: 'Laboratório de informática e redes', resumo: 'Computadores para as aulas de tecnologia e de redes.', buscas: ['computador', 'ti', 'programacao', 'ciencia da computacao', 'sistemas', 'redes', 'cisco', 'infraestrutura', 'usar um computador da faculdade'] },
        { id: 'lab-saude', titulo: 'Área da saúde', resumo: 'Espaço de aulas práticas dos cursos da saúde.', buscas: ['saude', 'enfermagem', 'biomedicina', 'farmacia', 'anatomia', 'nutricao', 'fisioterapia', 'laboratorio de saude'] },
        { id: 'lab-501', titulo: 'Laboratório de Corpo e Movimento (501)', resumo: 'Aulas práticas de movimento. Use jaleco, calça comprida e sapato fechado.',
          onde: '5º andar • início do corredor', foto: F5 + '5andar-sala-501.jpg',
          rota: [...IR_5_ANDAR, { foto: F5 + '5andar-sala-501.jpg', texto: 'Chegou! A sala 501 é a porta de vidro com a placa verde.' }],
          buscas: ['sala 501', 'corpo e movimento', 'educacao fisica', 'fisioterapia', 'laboratorio de movimento'] },
        { id: 'lab-504', titulo: 'Laboratório de Práticas Estéticas (504)', resumo: 'Aulas práticas de estética. Use jaleco, calça comprida e sapato fechado.',
          onde: '5º andar • corredor, depois da sala 501', foto: F5 + '5andar-sala-504.jpg',
          rota: [...IR_5_ANDAR, { foto: F5 + '5andar-sala-501.jpg', texto: 'Passe pela sala 501.' }, { foto: F5 + '5andar-sala-504.jpg', texto: 'Chegou! A sala 504 é esta porta de madeira com a placa verde.' }],
          buscas: ['sala 504', 'estetica', 'praticas esteticas', 'estetica e cosmetica', 'laboratorio de estetica'] },
        { id: 'lab-engenharia', titulo: 'Laboratório de engenharia elétrica e mecânica', resumo: 'Um laboratório só, usado pelas engenharias elétrica e mecânica.', buscas: ['engenharia', 'eletrica', 'mecanica', 'circuito', 'motor', 'laboratorio de engenharia'] }
      ]
    },
    {
      id: 'atendimento', nome: 'Secretaria / Atendimento', icone: '🗂️',
      itens: [
        { id: 'cac', titulo: 'CAC – Central de Atendimento ao Candidato', resumo: 'Atendimento para quem quer entrar na Una: matrícula e dúvidas.',
          onde: '4º andar • logo depois da entrada, no hall', foto: 'assets/fotos/4andar-cac.jpg',
          rota: [
            { foto: 'assets/fotos/4andar-entrada.jpg', texto: 'Entre na Una pela entrada do 4º andar e passe pela catraca.' },
            { foto: 'assets/fotos/4andar-cac.jpg', texto: 'Chegou! A CAC fica logo à frente, no hall. É só entrar.' }
          ],
          buscas: ['cac', 'cad', 'candidato', 'vestibular', 'matricula', 'quero estudar na una', 'atendimento'] },
        { id: 'napi', titulo: 'NAPI – Apoio psicopedagógico e inclusão', resumo: 'Apoio a estudantes, adaptações de prova e atendimento especializado.',
          onde: '4º andar • corredor da biblioteca, depois dos banheiros, à direita', foto: 'assets/fotos/4andar-napi.jpg',
          rota: [
            ENTRAR_NA_UNA,
            CORREDOR_ESQUERDA,
            PASSAR_SALAS_423,
            { foto: BANHEIROS_CORREDOR, texto: 'Passe pelos banheiros e continue em frente.' },
            { foto: 'assets/fotos/4andar-corredor-sala-436.jpg', texto: 'Siga pela faixa no chão, passando pela sala 436.' },
            { foto: 'assets/fotos/4andar-corredor-napi.jpg', texto: 'Continue pelo corredor. O NAPI fica mais à frente, à direita.' },
            { foto: 'assets/fotos/4andar-napi.jpg', texto: 'Chegou! É esta porta de madeira, com a placa “NAPI – núcleo de apoio psicopedagógico e inclusão”.' }
          ],
          buscas: ['napi', 'aee', 'inclusao', 'psicopedagogico', 'adaptacao', 'conversar com alguém', 'estou passando por um momento difícil', 'preciso de apoio emocional', 'tenho TDAH ou autismo'] },
        { id: 'atende-mais', titulo: 'Atende+ (atendimento ao aluno)', resumo: 'Espaço de atendimento presencial da Una.',
          onde: '4º andar • corredor da esquerda, antes da biblioteca', foto: ATENDE_MAIS,
          rota: [
            ENTRAR_NA_UNA,
            CORREDOR_ESQUERDA,
            { foto: ATENDE_MAIS, texto: 'Chegou! O Atende+ é a sala de vidro com a faixa roxa “atende+”, antes de chegar na biblioteca.' }
          ],
          buscas: ['atende', 'atende mais', 'atende+', 'espaco atende', 'atendimento presencial', 'falar com alguem', 'duvida', 'ajuda'] },
        { id: 'secretaria', titulo: 'Secretaria e Coordenação', resumo: 'Secretaria e coordenação de curso ficam juntas: documentos, matrícula e falar com o coordenador.',
          onde: '4º andar • corredor da esquerda, do lado do Atende+', foto: 'assets/fotos/4andar-coordenacao.jpg',
          rota: [
            ENTRAR_NA_UNA,
            CORREDOR_ESQUERDA,
            { foto: ATENDE_MAIS, texto: 'Procure o Atende+ (a sala com a faixa roxa). A secretaria e a coordenação ficam do lado.' },
            { foto: 'assets/fotos/4andar-coordenacao.jpg', texto: 'Chegou! É esta porta de vidro, com a plaquinha “coordenação” na parede. A secretaria fica no mesmo lugar.' }
          ],
          buscas: ['secretaria', 'caa', 'coordenacao', 'coordenador', 'coordenadora', 'falar com o coordenador', 'documento', 'matricula', 'requerimento'] }
      ]
    },
    {
      id: 'biblioteca', nome: 'Biblioteca', icone: '📚',
      itens: [
        { id: 'biblioteca-fisica', titulo: 'Biblioteca', resumo: 'Livros, empréstimo, autoatendimento e mesas para estudar.',
          onde: '4º andar • à esquerda depois da catraca', foto: 'assets/fotos/4andar-biblioteca-entrada.jpg',
          rota: [
            { foto: 'assets/fotos/4andar-entrada.jpg', texto: 'Entre na Una pela entrada do 4º andar e passe pela catraca.' },
            { foto: 'assets/fotos/4andar-corredor-biblioteca.jpg', texto: 'Vire à esquerda. No corredor, procure o letreiro vermelho “BIBLIOTECA” na parede da esquerda.' },
            { foto: 'assets/fotos/4andar-biblioteca-entrada.jpg', texto: 'A entrada é esta porta de vidro, logo abaixo do letreiro.' },
            { foto: 'assets/fotos/4andar-biblioteca-dentro.jpg', texto: 'Chegou! Aqui tem mesas para estudar, o autoatendimento e as estantes de livros.' }
          ],
          buscas: ['livro', 'emprestimo', 'acervo', 'devolucao', 'estudar', 'silencio', 'cabine', 'autoatendimento', 'pegar livro'] }
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
  ],

  // Projetos. Levantado no uLife e no site una.br em 24/11/2026 (veja assets/prints/ulife-rotas/PROJETOS.md).
  // desc = frase da categoria · onde = caminho no uLife/site · links = sites oficiais (abrem em outra aba)
  // selos = etiquetas do card: horas (o que ganha), quem (quem pode), inscricao (quando abre)
  projetos: [
    {
      id: 'disciplina', nome: 'Na sua disciplina', icone: '📐',
      desc: 'Projetos que fazem parte das suas UCs. O professor avisa a turma e orienta.',
      itens: [
        { id: 'projeto-a3', titulo: 'Projeto A3', resumo: 'A avaliação de projeto de cada UC, feita em equipe e apresentada no fim do semestre.',
          selos: { quem: 'Todas as UCs', inscricao: 'Todo semestre' },
          onde: 'Aulas → Minhas UCs → abra a disciplina (as orientações vêm do professor)',
          rotas: NO_ULIFE([
            ABRIR_AULAS,
            U('menu-aulas-minhas-ucs', 'No menu que abriu, clique em “Minhas UCs”.'),
            U('ucs-abrir-disciplina', 'Em “Unidades Curriculares”, clique na disciplina. As orientações do A3 ficam no conteúdo e nos avisos do professor.')
          ]),
          passos: [
            'No começo do semestre, o professor explica o tema do A3 e como as equipes serão formadas.',
            'Monte a equipe e combine com o professor o problema que vocês vão resolver.',
            'Acompanhe as entregas e orientações dentro da disciplina, em Minhas UCs.',
            'Apresente o projeto na data marcada. As datas da A3 estão na aba Calendário Acadêmico.'
          ],
          dica: 'Algumas UCs fazem o A3 pelo Ânima Hub (UC Hub) ou pelo Ânima Nest (UC Nest). Aí o projeto também dá 80 horas de extensão.',
          buscas: ['a3', 'projeto integrador', 'projeto da disciplina', 'projeto em grupo', 'avaliacao de projeto', 'apresentacao do projeto', 'equipe'] },
        { id: 'uc-hub', titulo: 'UC Hub (A3 com o Ânima Hub)', resumo: 'O A3 vira um projeto de inovação com protótipo e pitch, junto com alunos de outros cursos.',
          selos: { horas: '80 h de extensão', quem: 'UCs convidadas', inscricao: 'O professor avisa' },
          onde: 'O professor avisa se a sua UC é UC Hub. Entregas no WAY HUB.',
          rotas: NO_ULIFE(IR_HUB('Clique em “Acessar o Ânima Hub”. No site do Hub, abra “UC Hub”: lá estão o guia e o link do WAY HUB.')),
          passos: [
            'Se o professor conectar a disciplina ao Hub, ele avisa a turma.',
            'Cadastre-se no WAY HUB (mesmo login do uLife) e entre na sua equipe.',
            'Entregas: pré-projeto, canvas adaptado, protótipos de telas, pitch e relatório final.',
            'As entregas podem valer na A3, conforme o professor definir.'
          ],
          dica: 'O Hub não muda a nota do professor nem a ementa da UC.',
          links: [{ url: 'https://www.animahub.com.br/uc-hub', texto: 'Saiba mais sobre a UC Hub' }, { url: 'https://www.animahub.com.br/materiais', texto: 'Modelos de pitch, canvas e SWOT' }],
          buscas: ['uc hub', 'a3 hub', 'pitch', 'canvas', 'prototipo', 'mvp'] },
        { id: 'uc-nest', titulo: 'UC Nest (A3 empreendedor)', resumo: 'O A3 vira uma proposta de negócio, com workshops e mentorias do Ânima Nest.',
          selos: { horas: '80 h de extensão', quem: 'UCs convidadas', inscricao: 'Semestral' },
          onde: 'Academia de Futuros Profissionais → Inovação & Empreendedorismo → Acessar o Ânima Nest',
          rotas: NO_ULIFE(IR_NEST('Clique em “Acessar o Ânima Nest”. No site do Nest, abra “UC Nest” para ler o edital e se inscrever.')),
          passos: [
            'Algumas UCs são convidadas para o Nest. Se o professor aderir, ele avisa a turma.',
            'Leia o edital e faça a inscrição da equipe no site do Nest.',
            'Em cerca de 8 semanas: workshops, 2 Imersões Empreendedoras (aulas com convidados) e tutorias opcionais pelo Teams.',
            'Os melhores projetos vão para a Final Nest.'
          ],
          dica: 'Exemplos de UCs Nest: Design de Interfaces e Realidades Imersivas, Exploração Digital e Fundamentos Tecnológicos, Projeto de graduação e Práticas profissionais.',
          links: [{ url: 'https://www.animanest.com.br/uc-nest', texto: 'Página da UC Nest' }],
          buscas: ['nest', 'anima nest', 'uc nest', 'empreendedorismo', 'startup', 'negocio', 'ideia de negocio', 'abrir empresa'] },
        { id: 'engajamento-social', titulo: 'Projeto de Engajamento Social (Vida & Carreira)', resumo: 'Desafio social proposto pelo professor tutor na UC Vida & Carreira, a porta de entrada do curso.',
          selos: { quem: 'Calouros', inscricao: 'Na UC Vida & Carreira' },
          passos: [
            'Vida & Carreira é a UC do início do curso, com acompanhamento de um professor tutor.',
            'Nela, a turma recebe um desafio de engajamento social ligado a temas globais e aos interesses dos alunos.',
            'Vocês planejam e fazem uma ação real para a comunidade.'
          ],
          links: [{ url: 'https://www.una.br/nosso-curriculo/vida-e-carreira/', texto: 'Vida & Carreira no site da Una' }],
          buscas: ['vida e carreira', 'engajamento social', 'projeto de vida', 'tutor', 'calouro', 'primeiro periodo'] }
      ]
    },
    {
      id: 'extensao', nome: 'Extensão e impacto social', icone: '🌱',
      desc: 'Projetos com a comunidade. Abertos a todos os cursos e contam horas para o diploma.',
      itens: [
        { id: 'extensao-o-que-e', titulo: 'O que é extensão (e quantas horas preciso)', resumo: 'É obrigatória: no mínimo 10% da carga horária do curso. Em Engenharia de Software são 320 horas.',
          selos: { horas: '10% do curso', quem: 'Todos os cursos' },
          onde: 'Curso → Extensão → Visão Geral',
          rotas: NO_ULIFE([
            ...IR_EXTENSAO,
            U('extensao-visao-geral', 'Em “Visão Geral” você vê quanto das horas de extensão já fez e quanto falta.')
          ]),
          passos: [
            'Extensão é onde você aplica o que aprende em projetos com impacto real na comunidade.',
            'É requisito para o diploma (regra do MEC): pelo menos 10% da carga horária do curso. Ex.: curso de 3.600 h = 360 h de extensão.',
            'Contam horas: cursos de extensão, projetos de extensão e outras atividades.',
            'Em Curso → Extensão → Visão Geral você vê o % já feito, as horas cursadas e as que faltam.'
          ],
          dica: 'Ânima Hub, Ânima Nest e UC Hub também dão horas de extensão.',
          links: [{ url: 'https://www.una.br/sou-estudante/extensao-universitaria/', texto: 'Extensão no site da Una' }],
          buscas: ['extensao', 'horas de extensao', 'quantas horas de extensao', 'extensao obrigatoria', 'projeto de extensao', 'curso de extensao', 'comunidade'] },
        { id: 'extensao-inscrever', titulo: 'Me inscrever em um projeto de extensão', resumo: 'As vagas abrem a cada semestre na plataforma de Extensão do uLife.',
          selos: { quem: 'Todos os cursos', inscricao: 'Semestral' },
          onde: 'Curso → Extensão → Matrícula',
          rotas: NO_ULIFE([
            ...IR_EXTENSAO,
            U('extensao-matricula', 'No card “Matrícula”, clique em “Ir para Matrícula” e escolha um curso ou projeto com inscrição aberta.'),
            U('extensao-historico', 'Depois de se inscrever, acompanhe em “Ver Histórico” (matrículas efetivadas e inscrições submetidas).')
          ]),
          dica: 'Fora do período aparece “Neste momento não temos inscrições abertas”. O calendário de extensão está no site da Una.',
          buscas: ['inscrever extensao', 'matricula extensao', 'vagas de extensao', 'participar de projeto', 'historico de extensao'] },
        { id: 'hub-sociais', titulo: 'Jovem Tech, Mulheres Tech e SOS RS', resumo: 'Projetos sociais do Ânima Hub em que alunos ensinam tecnologia e ajudam a comunidade.',
          selos: { quem: 'Ecossistema Ânima' },
          passos: [
            'Jovem Tech: ensina tecnologia e programação para jovens; já passou por mais de 15 favelas em 3 estados.',
            'Mulheres Tech: letramento digital para trabalhadoras domésticas, com aulas dadas por alunos.',
            'SOS RS / Salva RS: app de geolocalização que ligou voluntários a pessoas atingidas pelas enchentes do Rio Grande do Sul.'
          ],
          links: [{ url: 'https://www.animahub.com.br/a%C3%A7%C3%B5es', texto: 'Ações e eventos do Hub' }],
          buscas: ['jovem tech', 'mulheres tech', 'sos rs', 'projeto social', 'voluntario', 'voluntariado', 'ensinar programacao'] },
        { id: 'incentivo-cultura', titulo: 'Patrocínio para projetos culturais', resumo: 'A Una patrocina projetos culturais pela Lei de Incentivo à Cultura, por edital.',
          selos: { quem: 'Quem tem projeto aprovado', inscricao: 'Por edital' },
          passos: [
            'A Una usa parte dos impostos para patrocinar projetos culturais (leis federais, estaduais ou municipais).',
            'Se você tem um projeto cultural aprovado para captação, pode concorrer nos editais de cultura da Una.',
            'O edital traz prazos, critérios e áreas de interesse.'
          ],
          dica: 'Exemplos já apoiados: Cine Cipó, Embaúba Play e MIBH.',
          links: [{ url: 'https://www.una.br/servicos-a-comunidade/lei-de-incentivo-a-cultura/', texto: 'Editais de cultura da Una' }],
          buscas: ['cultura', 'lei de incentivo', 'patrocinio', 'arte', 'musica', 'cinema', 'teatro', 'projeto cultural'] }
      ]
    },
    {
      id: 'inovacao', nome: 'Inovação e empreendedorismo', icone: '💡',
      desc: 'Para quem quer criar soluções, testar ideias ou abrir o próprio negócio.',
      itens: [
        { id: 'hub-squads', titulo: 'Squads do Ânima Hub', resumo: 'Equipes de alunos de vários cursos resolvendo problemas reais de empresas parceiras.',
          selos: { horas: '100 h ext. + 40 h pesquisa', quem: 'Todos os cursos', inscricao: 'Semestral' },
          onde: 'Academia de Futuros Profissionais → Inovação & Empreendedorismo → Acessar o Ânima Hub',
          rotas: NO_ULIFE(IR_HUB('Clique em “Acessar o Ânima Hub”. No site do Hub, vá em “Inscreva-se” para ler o edital e se inscrever.')),
          passos: [
            'O Hub é uma rede com mais de 110 laboratórios de inovação. Cada squad junta alunos de cursos diferentes (TI, saúde, direito, engenharia…).',
            'A squad trabalha num desafio real de uma empresa parceira, com métodos ágeis e pesquisa.',
            'Leia o edital e se inscreva na página “Inscreva-se” do site do Hub.',
            'As entregas são feitas na plataforma WAY HUB (login igual ao do uLife).'
          ],
          links: [{ url: 'https://www.animahub.com.br/inscreva-se', texto: 'Inscrição no Ânima Hub' }, { url: 'https://www.animahub.com.br/squads', texto: 'Ver as squads' }],
          buscas: ['hub', 'anima hub', 'squad', 'inovacao', 'laboratorio de inovacao', 'desafio de empresa', 'way hub'] },
        { id: 'casa-una', titulo: 'Casa Una (hub de inovação da Una)', resumo: 'Espaço aberto para alunos, professores, empresas e startups criarem soluções juntos.',
          selos: { quem: 'Todos os cursos', inscricao: 'Veja a programação' },
          passos: [
            'A Casa Una é o hub de inovação da Una, um espaço de “ocupação aberta e orientada por problemas”.',
            'Ela trabalha eixos como empregabilidade, impacto social, habilidades tech, saúde e bem-estar e inovação aberta.',
            'Acompanhe a programação de eventos e o Programa Residentes no site.'
          ],
          links: [{ url: 'https://www.una.br/servicos-a-comunidade/casa-una/', texto: 'Casa Una no site da Una' }],
          buscas: ['casa una', 'hub da una', 'espaco de inovacao', 'startup', 'residentes', 'coworking'] },
        { id: 'nest-acelera', titulo: 'Nest Acelera', resumo: 'Pré-aceleração para quem já tem uma ideia de negócio e quer tirá-la do papel.',
          selos: { horas: '80 h de extensão', quem: 'Todos os cursos', inscricao: 'Semestral' },
          onde: 'Academia de Futuros Profissionais → Inovação & Empreendedorismo → Acessar o Ânima Nest',
          rotas: NO_ULIFE(IR_NEST('Clique em “Acessar o Ânima Nest”. No site do Nest, abra “Nest Acelera” para ler o edital e se inscrever.')),
          passos: [
            'Leia o edital e inscreva seu projeto no período de inscrições.',
            'Faça os workshops: canvas do modelo de negócios, plano de negócios e simulador financeiro.',
            'Os modelos vêm em PDF ou no Canva, com vídeos explicando cada um.'
          ],
          dica: 'A jornada completa do Nest dá certificado, além das horas de extensão.',
          links: [{ url: 'https://www.animanest.com.br/nest-acelera', texto: 'Página do Nest Acelera' }],
          buscas: ['nest acelera', 'aceleradora', 'pre aceleracao', 'plano de negocios', 'modelo de negocio', 'empreender'] },
        { id: 'shark-hub', titulo: 'Shark Hub (competição de projetos)', resumo: 'Mostra de inovação em que as melhores squads apresentam para uma banca.',
          selos: { quem: 'Squads do Hub' },
          onde: 'Academia de Futuros Profissionais → Início → Eventos',
          rotas: NO_ULIFE([
            ...ABRIR_AFP,
            U('afp-eventos', 'Na página inicial do portal, desça até “Eventos”. Lá aparecem as datas da semifinal e da final do Shark Hub.')
          ]),
          passos: [
            'As squads que mais se destacam no semestre vão para a semifinal e depois para a final.',
            'A final é híbrida: presencial em uma unidade e transmitida no YouTube.',
            'A final do Shark Hub 10 foi na Una Aimorés, em 17/09/2026.'
          ],
          links: [{ url: 'https://www.animahub.com.br/shark-hub', texto: 'Página do Shark Hub' }],
          buscas: ['shark hub', 'shark', 'competicao', 'premiacao', 'banca', 'final'] },
        { id: 'nest-premiados', titulo: 'Projetos premiados da Una', resumo: 'Pulse Care, Pontua Eco e Facul Driver: projetos de alunos da Una que ganharam no Nest.',
          selos: { quem: 'Para se inspirar' },
          passos: [
            'Pulse Care – Una Betim – 2º lugar na UC Nest 2025/2.',
            'Pontua Eco – Una Betim – 2º lugar na UC Nest 2025/1.',
            'Facul Driver – Una Contagem – 3º lugar na UC Nest 2025/1.'
          ],
          dica: 'As apresentações das finais estão gravadas na Vitrine do Ânima Nest.',
          links: [{ url: 'https://www.animanest.com.br/vitrine/momento_nest', texto: 'Vencedores do Nest' }],
          buscas: ['premiado', 'vencedor', 'exemplo de projeto', 'pulse care', 'pontua eco', 'facul driver', 'final nest'] }
      ]
    },
    {
      id: 'pesquisa', nome: 'Pesquisa científica', icone: '🔬',
      desc: 'Para quem gosta de investigar um tema a fundo, com orientação de um professor.',
      itens: [
        { id: 'pro-ciencia', titulo: 'Iniciação científica (Pró-Ciência)', resumo: 'Pesquise um tema do seu curso com um professor pesquisador, por até 12 meses.',
          selos: { horas: 'Até 12 meses', quem: 'Alunos de graduação', inscricao: 'Por edital' },
          passos: [
            'O Pró-Ciência é o programa de iniciação científica da Ânima.',
            'Os projetos abrem por edital, duram um semestre e podem ser prorrogados por mais seis meses com relatório de atividades.',
            'Você pesquisa sob a supervisão de um professor pesquisador.',
            'Pesquisas com pessoas passam pelo Comitê de Ética em Pesquisa (CEP).'
          ],
          dica: 'A iniciação científica ajuda muito em intercâmbio e pós-graduação. As squads do Ânima Hub também dão 40 h de pesquisa.',
          links: [{ url: 'https://www.una.br/nosso-curriculo/iniciacao-cientifica/', texto: 'Pró-Ciência e editais' }, { url: 'https://pesquisaic.animaeducacao.com.br/', texto: 'Portal de pesquisa' }],
          buscas: ['iniciacao cientifica', 'ic', 'pro ciencia', 'pesquisa', 'pesquisador', 'cientifico', 'artigo', 'orientador'] },
        { id: 'runa', titulo: 'Publicar trabalhos no RUNA', resumo: 'Repositório da Ânima com artigos, TCCs e pesquisas de alunos. Você também pode enviar os seus.',
          selos: { quem: 'Todos os cursos', inscricao: 'Prazo do seu curso' },
          passos: [
            'Acesse o RUNA e entre com seu e-mail e senha.',
            'Clique em “Meu Espaço”: você vai para a área do seu curso.',
            'Clique no “+” e envie o documento em PDF. Atenção ao prazo de submissão.',
            'Esqueceu a senha? Use “redefinir senha” e confira o e-mail (inclusive o spam).'
          ],
          dica: 'Tem estudos de caso, artigos, monografias, relatórios de pesquisa e teses. Ótimo para buscar referências e exemplos de TCC.',
          links: [{ url: 'https://repositorio.animaeducacao.com.br/', texto: 'Acessar o RUNA' }, { url: 'https://portaldeperiodicos.animaeducacao.com.br/', texto: 'Portal de Periódicos Ânima' }],
          buscas: ['runa', 'repositorio', 'tcc', 'monografia', 'publicar artigo', 'trabalho de conclusao', 'periodicos'] }
      ]
    },
    {
      id: 'internacional', nome: 'Internacional e idiomas', icone: '🌍',
      desc: 'Intercâmbio, cursos de férias no exterior e idiomas com desconto. Cuidado do International Office.',
      itens: [
        { id: 'intercambio', titulo: 'Intercâmbio acadêmico', resumo: 'Estude 1 ou 2 semestres em uma universidade parceira no exterior.',
          selos: { quem: 'Todos os cursos', inscricao: 'Abril e setembro' },
          passos: [
            'Os editais abrem duas vezes por ano, em abril e em setembro, na página “Inscrições Abertas” do International Office.',
            'Leia o edital e mande os documentos pelo link indicado, no prazo. Comprovantes de iniciação científica e prêmios contam.',
            'O coordenador do curso aprova seu plano de estudos.',
            'Planeje os gastos: moradia, alimentação, seguro-saúde, passagens e visto ficam por sua conta.'
          ],
          dica: 'Às vezes saem bolsas (Santander, CAPES, Erasmus…), sem data fixa. Elas aparecem na mesma página.',
          links: [{ url: 'https://www.una.br/sobre/internacional/', texto: 'International Office da Una' }],
          buscas: ['intercambio', 'estudar fora', 'exterior', 'internacional', 'international office', 'mobilidade', 'outro pais'] },
        { id: 'curta-duracao', titulo: 'Programas de férias no exterior', resumo: 'Cursos de idioma, visitas técnicas e módulos internacionais de até 4 semanas.',
          selos: { quem: 'Comunidade Ânima', inscricao: 'Por edital' },
          passos: [
            'Acontecem nas férias (janeiro e julho) e duram no máximo 4 semanas.',
            'São abertos a alunos, ex-alunos, professores, colaboradores e dependentes.',
            'A inscrição segue o edital de cada programa, na página do International Office.'
          ],
          dica: 'Exemplo recente: “Vivências práticas na França”, com edital para graduação.',
          links: [{ url: 'https://www.una.br/sobre/internacional/', texto: 'Ver programas abertos' }],
          buscas: ['curso de ferias', 'visita tecnica', 'viagem', 'curso no exterior', 'franca', 'curta duracao'] },
        { id: 'idiomas', titulo: 'Idiomas com desconto (Programa Autodidata)', resumo: 'Projeto criado por estudantes para aprender idiomas com descontos e editais de proficiência.',
          selos: { quem: 'Alunos da Una', inscricao: 'Desconto por e-mail' },
          passos: [
            'O Programa Autodidata foi criado por estudantes para estudantes e reúne descontos em escolas de idiomas.',
            'Tem opções de japonês (Aliança Cultural Brasil-Japão), mandarim (Instituto Confúcio), alemão (Goethe) e a plataforma LingoPass.',
            'O International Office também abre editais de testes de proficiência, como o TOEFL.'
          ],
          dica: 'Para pedir o desconto, normalmente é preciso enviar um comprovante de matrícula (veja como emitir na aba Ambiente virtual).',
          links: [{ url: 'https://cnatd.my.canva.site/programa-autodidata', texto: 'Programa Autodidata' }, { url: 'https://www.una.br/sobre/internacional/', texto: 'Editais de proficiência' }],
          buscas: ['idioma', 'ingles', 'espanhol', 'japones', 'mandarim', 'alemao', 'toefl', 'autodidata', 'lingua estrangeira'] }
      ]
    },
    {
      id: 'carreira', nome: 'Carreira e mercado', icone: '💼',
      desc: 'Projetos com empresas e conteúdos para dar o primeiro passo na profissão.',
      itens: [
        { id: 'duale', titulo: 'Duale (projetos com empresas)', resumo: 'Projetos e desafios com empresas reais, com foco em conseguir emprego.',
          onde: 'Academia de Futuros Profissionais → Duale',
          rotas: NO_ULIFE([
            ...ABRIR_AFP,
            U('afp-menu-duale', 'No menu da esquerda do portal, clique em “Duale”.'),
            U('afp-duale', 'Em “Programas Duale”, veja as opções e clique na que te interessa.')
          ]),
          passos: [
            'Você atua em projetos e desafios propostos por empresas parceiras.',
            'Programas: Aceleradora Profissional Duale, Unidade Curricular Duale, Duale Atemporal e Curso Duale.',
            'Também prepara para processos seletivos exclusivos dessas empresas.'
          ],
          dica: 'Na mesma Academia de Futuros Profissionais tem vagas, estágios e um simulador de entrevistas (3 por mês).',
          buscas: ['duale', 'empresa', 'empregabilidade', 'mercado de trabalho', 'estagio', 'vaga', 'carreira', 'emprego'] },
        { id: 'mentorias', titulo: 'Mentorias ao vivo (Vida & Carreira)', resumo: 'Lives semanais com líderes de mercado. Cada uma dá certificado de 5 horas.',
          selos: { horas: '5 h por live', quem: 'Todos os cursos', inscricao: 'Toda semana' },
          passos: [
            'Toda semana tem live com profissionais e líderes de mercado.',
            'Cada live dá um certificado de 5 horas, que vale como atividade complementar.',
            'Perdeu alguma? As gravações desde 2021 ficam na plataforma Vida & Carreira.'
          ],
          dica: 'Depois, poste o certificado como atividade complementar (veja o passo a passo na aba Ambiente virtual).',
          links: [{ url: 'https://www.una.br/nosso-curriculo/vida-e-carreira/', texto: 'Mentorias Vida & Carreira' }],
          buscas: ['mentoria', 'live', 'palestra online', 'lider de mercado', 'soft skills', 'networking'] }
      ]
    }
  ]
};

/**
 * Aba Projetos – ferramentas (contador de horas, inscrições e jornada).
 * Tudo aqui tem fonte. Conferido no uLife e nos sites oficiais em 24/11/2026.
 * Ao atualizar, troque "conferido" e as datas.
 */
window.WIKI_PROJETOS = {
  conferido: '2026-11-24',

  // Contador de horas de extensão
  extensao: {
    regra: 'No mínimo 10% da carga horária total do curso (Resolução CNE/CES nº 7/2018).',
    fonteRegra: { texto: 'una.br – Extensão Universitária', url: 'https://www.una.br/sou-estudante/extensao-universitaria/' },
    // horas exigidas que vimos no uLife (Curso → Extensão → Histórico: cursadas + a cursar)
    cursos: [{ nome: 'Engenharia de Software', horas: 320, fonte: 'uLife → Curso → Extensão → Histórico' }],
    // projetos que dão horas de extensão, com o valor que aparece no site oficial
    projetos: [
      { id: 'hub-squads', nome: 'Squads do Ânima Hub', horas: 100, fonte: 'animahub.com.br/inscreva-se' },
      { id: 'uc-hub', nome: 'UC Hub', horas: 80, fonte: 'animahub.com.br/uc-hub' },
      { id: 'uc-nest', nome: 'UC Nest', horas: 80, fonte: 'animanest.com.br/os-programas' },
      { id: 'nest-acelera', nome: 'Nest Acelera', horas: 80, fonte: 'animanest.com.br/os-programas' }
    ]
  },

  // Situação das inscrições. tipo:
  //   'encerrado' / 'em-breve' → vale até "validoAte"; depois disso a wiki mostra "Confira as datas"
  //   'evento'   → datas: [['AAAA-MM-DD', 'nome', 'HH:MM' (horário de Brasília)]]; mostra o próximo
  //   'janela'   → meses (1–12) em que os editais costumam abrir
  //   'info'     → texto fixo (sem data)
  inscricoes: {
    'uc-nest': { tipo: 'encerrado', texto: 'Inscrições 2026.2 encerradas', validoAte: '2026-12-31', fonte: { texto: 'animanest.com.br', url: 'https://www.animanest.com.br/inscri%C3%A7%C3%B5es' } },
    'nest-acelera': { tipo: 'encerrado', texto: 'Inscrições 2026.2 encerradas', validoAte: '2026-12-31', fonte: { texto: 'animanest.com.br', url: 'https://www.animanest.com.br/inscri%C3%A7%C3%B5es' } },
    'hub-squads': { tipo: 'encerrado', texto: 'Encerradas: squads de 2026.2 já formadas', validoAte: '2026-12-31', fonte: { texto: 'animahub.com.br', url: 'https://www.animahub.com.br/inscreva-se' } },
    'extensao-inscrever': { tipo: 'encerrado', texto: 'Sem inscrições abertas no momento', validoAte: '2026-12-31', fonte: { texto: 'uLife → Curso → Extensão → Matrícula' } },
    'pro-ciencia': { tipo: 'em-breve', texto: 'Novo edital: “em breve”', validoAte: '2026-12-31', fonte: { texto: 'una.br – Iniciação Científica', url: 'https://www.una.br/nosso-curriculo/iniciacao-cientifica/' } },
    'shark-hub': { tipo: 'evento', datas: [['2026-12-09', 'Semifinal Shark Hub 11', '19:00']], fonte: { texto: 'uLife → Academia de Futuros Profissionais → Eventos' } },
    'nest-premiados': { tipo: 'evento', datas: [['2026-11-25', 'Final Nest', '19:00']], fonte: { texto: 'uLife → Academia de Futuros Profissionais → Eventos' } },
    'intercambio': { tipo: 'janela', meses: [4, 9], texto: 'Editais abrem em abril e setembro', fonte: { texto: 'una.br – International Office', url: 'https://www.una.br/sobre/internacional/' } },
    'curta-duracao': { tipo: 'info', texto: 'Por edital (programas em janeiro e julho)', fonte: { texto: 'una.br – International Office', url: 'https://www.una.br/sobre/internacional/' } },
    'incentivo-cultura': { tipo: 'info', texto: 'Por edital de cultura', fonte: { texto: 'una.br – Lei de Incentivo à Cultura', url: 'https://www.una.br/servicos-a-comunidade/lei-de-incentivo-a-cultura/' } },
    'uc-hub': { tipo: 'info', texto: 'O professor avisa a turma', fonte: { texto: 'animahub.com.br/uc-hub', url: 'https://www.animahub.com.br/uc-hub' } },
    'projeto-a3': { tipo: 'info', texto: 'Todo semestre, em cada UC', fonte: { texto: 'una.br – Guia do aluno (A1, A2 e A3)', url: 'https://www.una.br/sou-estudante/' } },
    'mentorias': { tipo: 'info', texto: 'Lives toda semana', fonte: { texto: 'una.br – Vida & Carreira', url: 'https://www.una.br/nosso-curriculo/vida-e-carreira/' } }
  },

  // Jornada: o que aproveitar em cada fase. Cada fase diz de onde veio a informação.
  jornada: [
    { fase: 'Começo do curso', icone: '🌱',
      fonte: 'una.br – Vida & Carreira é “a porta de entrada do aluno” nos cursos',
      itens: [
        { id: 'engajamento-social', texto: 'Projeto de Engajamento Social, na UC Vida & Carreira' },
        { id: 'mentorias', texto: 'Mentorias ao vivo com certificado' }
      ] },
    { fase: 'Todo semestre', icone: '🔁',
      fonte: 'una.br – Guia do aluno (A1, A2 e A3) · uLife → Extensão (“próximo período de inscrições”)',
      itens: [
        { id: 'projeto-a3', texto: 'Projeto A3 em cada UC' },
        { id: 'extensao-inscrever', texto: 'Inscrições de extensão, no período aberto' },
        { id: 'uc-hub', texto: 'UC Hub ou UC Nest, se a sua UC participar' }
      ] },
    { fase: 'Quando quiser, ao longo do curso', icone: '🧭',
      fonte: 'Editais e páginas oficiais de cada programa (Hub, Nest, Pró-Ciência, International Office)',
      itens: [
        { id: 'hub-squads', texto: 'Squads do Ânima Hub' },
        { id: 'nest-acelera', texto: 'Nest Acelera, se você tem uma ideia de negócio' },
        { id: 'pro-ciencia', texto: 'Iniciação científica (Pró-Ciência)' },
        { id: 'intercambio', texto: 'Intercâmbio (editais em abril e setembro)' },
        { id: 'idiomas', texto: 'Idiomas com desconto' }
      ] },
    { fase: 'Antes de se formar', icone: '🎓',
      fonte: 'una.br – a extensão é requisito para o diploma · RUNA é onde os trabalhos dos alunos são enviados',
      itens: [
        { id: 'extensao-o-que-e', texto: 'Fechar as horas de extensão (mínimo de 10% do curso)' },
        { id: 'runa', texto: 'Publicar seu trabalho no RUNA, no prazo do curso' }
      ] }
  ]
};
