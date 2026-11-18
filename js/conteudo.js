/**
 * Wiki Una - CONTEÚDO DO SITE (edite aqui, sem mexer no resto do código)
 *
 * Como adicionar um item:
 *   { id: 'unico-sem-espaco', titulo: 'Nome que o aluno procura',
 *     resumo: 'Uma frase curta',
 *     onde: 'Bloco A • Térreo, ao lado da escada'      // só em Localização
 *     foto: 'assets/fotos/nome-da-foto.jpg',           // opcional
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
window.WIKI_CONTEUDO = {
  localizacao: [
    {
      id: 'banheiros', nome: 'Banheiros', icone: '🚻',
      itens: [
        { id: 'banheiro-masc-fem', titulo: 'Banheiros masculino e feminino', resumo: 'Banheiros de uso geral do campus.', buscas: ['wc', 'toalete', 'sanitario', 'preciso ir ao banheiro'] },
        { id: 'banheiro-acessivel', titulo: 'Banheiro acessível (PCD)', resumo: 'Banheiro adaptado para pessoas com deficiência.', buscas: ['pcd', 'cadeirante', 'deficiencia', 'adaptado'] },
        { id: 'fraldario', titulo: 'Fraldário', resumo: 'Espaço para troca de fraldas.', buscas: ['bebe', 'trocador'] }
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
        { id: 'lab-engenharia', titulo: 'Laboratório de engenharia elétrica e mecânica', resumo: 'Um laboratório só, usado pelas engenharias elétrica e mecânica.', buscas: ['engenharia', 'eletrica', 'mecanica', 'circuito', 'motor', 'laboratorio de engenharia'] },
        { id: 'estudio-comunicacao', titulo: 'Estúdios de Comunicação', resumo: 'Fotografia, vídeo, rádio e jornalismo.', buscas: ['jornalismo', 'publicidade', 'foto', 'video', 'radio', 'estudio'] }
      ]
    },
    {
      id: 'atendimento', nome: 'Secretaria / Atendimento', icone: '🗂️',
      itens: [
        { id: 'secretaria', titulo: 'Secretaria / Central de Atendimento (CAA)', resumo: 'Documentos, matrícula, financeiro e requerimentos presenciais.', buscas: ['caa', 'secretaria', 'atendimento', 'documento', 'matricula', 'financeiro'] },
        { id: 'cad', titulo: 'CAD', resumo: 'Descrição a preencher pelo time.', buscas: ['cad'] },
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
        { id: 'entrada', titulo: 'Entrada e catracas', resumo: 'Como entrar no campus com sua carteirinha.', buscas: ['entrada', 'catraca', 'carteirinha', 'portaria', 'como chego na una'] }
      ]
    }
  ],

  // Passo a passo no app uLife. revisado: false = passos ainda não conferidos no app pelo time.
  ambiente: [
    {
      id: 'aulas', nome: 'Aulas', icone: '🎓',
      itens: [
        { id: 'assistir-aula', revisado: false, titulo: 'Assistir aula ao vivo', resumo: 'Entrar na aula on-line pelo uLife.', buscas: ['aula ao vivo', 'teams', 'link da aula', 'online'],
          passos: ['Abra o app uLife e entre com seu e-mail @ulife.com.br.', 'Na tela inicial, toque na disciplina do dia.', 'Toque no link da aula ao vivo para abrir no Teams.'], dica: 'Entre alguns minutos antes para testar áudio e câmera.' },
        { id: 'aulas-gravadas', revisado: false, titulo: 'Ver aulas gravadas', resumo: 'Assistir de novo uma aula que já aconteceu.', buscas: ['gravacao', 'gravada', 'rever aula', 'perdi a aula', 'assistir de novo a explicação do professor'],
          passos: ['Abra a disciplina no uLife.', 'Procure a área de gravações ou conteúdos da disciplina.', 'Escolha a data da aula para assistir.'] },
        { id: 'material-aula', revisado: false, titulo: 'Baixar material da disciplina', resumo: 'Slides, PDFs e conteúdos postados pelo professor.', buscas: ['slide', 'pdf', 'material', 'conteudo', 'apostila'],
          passos: ['Abra a disciplina no uLife.', 'Entre em conteúdos/materiais.', 'Toque no arquivo para abrir ou baixar.'] },
        { id: 'quadro-aulas', revisado: false, titulo: 'Ver meu horário (quadro de aulas)', resumo: 'Dias, horários e salas das suas aulas.', buscas: ['horario', 'sala', 'grade', 'quadro de aulas', 'que sala'],
          passos: ['No uLife, abra o menu principal.', 'Toque em quadro de aulas / horário.', 'Veja o dia, o horário e a sala de cada disciplina.'] },
        { id: 'enviar-atividade', revisado: false, titulo: 'Enviar trabalho ou atividade', resumo: 'Postar um arquivo de atividade para o professor.', buscas: ['entregar trabalho', 'postar atividade', 'upload', 'enviar arquivo'],
          passos: ['Abra a disciplina e a atividade desejada.', 'Toque em enviar/anexar arquivo e escolha o arquivo.', 'Confirme o envio e confira se aparece como entregue.'], dica: 'Não deixe para o último minuto: o envio pode demorar com internet lenta.' }
      ]
    },
    {
      id: 'notas-provas', nome: 'Notas e provas', icone: '📝',
      itens: [
        { id: 'ver-notas', revisado: false, titulo: 'Ver minhas notas', resumo: 'Notas de A1, A2, A3 e média final.', buscas: ['nota', 'boletim', 'media', 'resultado', 'passei'],
          passos: ['No uLife, abra o menu principal.', 'Toque em notas / boletim.', 'Escolha o semestre e a disciplina.'] },
        { id: 'fazer-prova', revisado: false, titulo: 'Fazer prova on-line', resumo: 'Avaliações A1, A2 e A3 pelo ambiente virtual.', buscas: ['prova', 'avaliacao', 'a1', 'a2', 'a3', 'teste'],
          passos: ['Confira a data da prova na aba Calendário Acadêmico.', 'Abra a disciplina no uLife no período da prova.', 'Entre na avaliação, responda e finalize o envio.'], dica: 'Use internet estável e não feche a prova antes de finalizar.' },
        { id: 'segunda-oportunidade', revisado: false, titulo: 'Pedir 2ª oportunidade de prova', resumo: 'Para quem perdeu a prova ou precisa refazer.', buscas: ['segunda chamada', '2 chamada', 'perdi a prova', 'segunda oportunidade', 'faltei prova'],
          passos: ['Veja o prazo de solicitação na aba Calendário Acadêmico.', 'Acesse o link de solicitação no regulamento da avaliação, dentro do uLife.', 'Preencha o pedido dentro do prazo.'] },
        { id: 'recurso-nota', revisado: false, titulo: 'Pedir revisão / recurso de nota', resumo: 'Quando você discorda da correção.', buscas: ['revisao', 'recurso', 'contestar nota', 'corrigir nota'],
          passos: ['Veja o prazo de recurso na aba Calendário Acadêmico.', 'Acesse o link de recurso no regulamento da avaliação, dentro do uLife.', 'Explique o motivo e envie.'] }
      ]
    },
    {
      id: 'certificados', nome: 'Certificados e horas', icone: '🏅',
      itens: [
        { id: 'postar-certificado', revisado: false, titulo: 'Postar certificado (atividades complementares)', resumo: 'Enviar certificados de cursos, palestras e eventos para contar horas.', buscas: ['certificado', 'horas complementares', 'atividade complementar', 'acc', 'enviar certificado', 'mandar o pdf do curso que eu fiz', 'fiz um curso e quero contar horas'],
          passos: ['Deixe o certificado salvo em PDF ou imagem.', 'No uLife, abra atividades complementares.', 'Toque em nova solicitação, preencha os dados e anexe o certificado.', 'Acompanhe se foi aprovado.'], dica: 'Confira no calendário o prazo de comprovação de atividades complementares.' },
        { id: 'horas-extensao', revisado: false, titulo: 'Horas de extensão', resumo: 'Projetos de extensão e como as horas são contadas.', buscas: ['extensao', 'projeto de extensao', 'horas de extensao'],
          passos: ['Veja os períodos de matrícula em projetos na aba Calendário Acadêmico.', 'No uLife, procure os projetos de extensão disponíveis.', 'Inscreva-se e acompanhe as atividades.'] },
        { id: 'acompanhar-horas', revisado: false, titulo: 'Ver quantas horas já tenho', resumo: 'Acompanhar o total de horas complementares.', buscas: ['quantas horas', 'saldo de horas', 'total de horas'],
          passos: ['No uLife, abra atividades complementares.', 'Veja o resumo das horas aprovadas e pendentes.'] }
      ]
    },
    {
      id: 'livros', nome: 'Biblioteca / Livros digitais', icone: '📖',
      itens: [
        { id: 'livros-digitais', revisado: false, titulo: 'Ler livros digitais (Biblioteca Pearson)', resumo: 'Milhares de livros on-line com seu login @ulife.com.br.', buscas: ['pearson', 'biblioteca virtual', 'livro digital', 'ebook', 'livro online'],
          passos: ['No uLife, abra a área de biblioteca.', 'Escolha a biblioteca digital (Pearson).', 'Pesquise o título e leia direto no navegador ou app.'] },
        { id: 'reservar-livro', revisado: false, titulo: 'Reservar ou renovar livro físico', resumo: 'Empréstimo na biblioteca do campus.', buscas: ['reservar livro', 'renovar', 'emprestimo', 'devolver livro'],
          passos: ['No uLife, abra a área de biblioteca.', 'Pesquise o livro no acervo físico.', 'Reserve ou renove o empréstimo.'], dica: 'Veja onde fica a biblioteca na aba Localização.' }
      ]
    },
    {
      id: 'secretaria-docs', nome: 'Documentos e secretaria', icone: '📄',
      itens: [
        { id: 'declaracao-matricula', revisado: false, titulo: 'Declaração de matrícula', resumo: 'Comprovante de que você estuda na Una.', buscas: ['declaracao', 'comprovante', 'atestado de matricula', 'provar que sou aluno', 'documento para o estágio ou trabalho'],
          passos: ['No uLife, abra a área de secretaria / requerimentos.', 'Escolha declaração de matrícula.', 'Baixe o documento ou acompanhe o pedido.'] },
        { id: 'historico', revisado: false, titulo: 'Histórico escolar', resumo: 'Lista das disciplinas cursadas e notas.', buscas: ['historico', 'disciplinas cursadas'],
          passos: ['No uLife, abra a área de secretaria / requerimentos.', 'Solicite o histórico escolar.', 'Acompanhe o pedido até ficar disponível.'] },
        { id: 'rematricula', revisado: false, titulo: 'Fazer rematrícula', resumo: 'Renovar a matrícula para o próximo semestre.', buscas: ['rematricula', 'renovar matricula', 'proximo semestre'],
          passos: ['Confira o período de rematrícula na aba Calendário Acadêmico.', 'No uLife, abra a área de rematrícula.', 'Confira as disciplinas e confirme.'] },
        { id: 'trancamento', revisado: false, titulo: 'Trancar matrícula', resumo: 'Pausar o curso por um período.', buscas: ['trancar', 'trancamento', 'pausar curso'],
          passos: ['Veja o prazo de trancamento na aba Calendário Acadêmico.', 'No uLife, abra a área de secretaria / requerimentos.', 'Solicite o trancamento e acompanhe a resposta.'] },
        { id: 'mudar-turno', revisado: false, titulo: 'Mudar de turno ou campus', resumo: 'Trocar manhã/noite ou de unidade.', buscas: ['mudar turno', 'trocar campus', 'transferencia interna'],
          passos: ['Veja o prazo na aba Calendário Acadêmico.', 'No uLife, abra a área de secretaria / requerimentos.', 'Escolha mudança de turno e/ou campus e envie o pedido.'] }
      ]
    },
    {
      id: 'financeiro', nome: 'Financeiro', icone: '💳',
      itens: [
        { id: 'boleto', revisado: false, titulo: 'Tirar boleto / 2ª via', resumo: 'Pagar a mensalidade.', buscas: ['boleto', 'mensalidade', 'pagar', 'segunda via', 'pix'],
          passos: ['No uLife, abra a área financeira.', 'Escolha a mensalidade em aberto.', 'Copie o código, pague por Pix ou baixe o boleto.'] },
        { id: 'negociar', revisado: false, titulo: 'Negociar mensalidades', resumo: 'Parcelar ou negociar valores em atraso.', buscas: ['negociar', 'divida', 'atraso', 'parcelar'],
          passos: ['No uLife, abra a área financeira.', 'Procure a opção de negociação.', 'Simule e confirme o acordo.'] },
        { id: 'fies-prouni', revisado: false, titulo: 'Fies, Prouni e bolsas', resumo: 'Informações sobre financiamentos e bolsas.', buscas: ['fies', 'prouni', 'bolsa', 'pravaler', 'desconto'],
          passos: ['No uLife, abra a área financeira.', 'Veja a situação do seu financiamento ou bolsa.', 'Em caso de dúvida, procure a Central de Atendimento.'] }
      ]
    },
    {
      id: 'conta', nome: 'Conta e acesso', icone: '🔑',
      itens: [
        { id: 'primeiro-acesso', revisado: false, titulo: 'Primeiro acesso ao uLife', resumo: 'Entrar no uLife pela primeira vez.', buscas: ['primeiro acesso', 'login', 'entrar', 'calouro'],
          passos: ['Baixe o app uLife ou acesse pelo navegador.', 'Entre com o e-mail @ulife.com.br recebido na matrícula.', 'Crie sua senha seguindo as instruções.'] },
        { id: 'esqueci-senha', revisado: false, titulo: 'Esqueci minha senha', resumo: 'Recuperar o acesso ao uLife.', buscas: ['senha', 'esqueci', 'recuperar', 'nao consigo entrar', 'bloqueado', 'meu login não funciona'],
          passos: ['Na tela de login do uLife, toque em esqueci minha senha.', 'Informe seu e-mail @ulife.com.br.', 'Siga as instruções recebidas.'] },
        { id: 'wifi', revisado: false, titulo: 'Conectar no Wi-Fi do campus', resumo: 'Internet da Una com seu login.', buscas: ['wifi', 'wi-fi', 'internet', 'rede'],
          passos: ['Procure a rede Wi-Fi da Una no seu celular.', 'Entre com seu login institucional.', 'Se não conectar, procure o suporte de TI.'] },
        { id: 'office-teams', revisado: false, titulo: 'Microsoft 365 e Teams grátis', resumo: 'Word, Excel, PowerPoint e Teams com o e-mail da Una.', buscas: ['office', 'word', 'excel', 'teams', 'microsoft', 'outlook'],
          passos: ['Acesse office.com.', 'Entre com seu e-mail @ulife.com.br.', 'Use on-line ou instale os aplicativos.'] }
      ]
    }
  ]
};
