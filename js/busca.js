/**
 * Wiki Una - Busca semântica
 *
 * Camada 1 (sempre ligada, instantânea, offline): entende o SIGNIFICADO por um
 * mapa de conceitos ("onde posso comer" -> cantina), ignora acentos e palavras
 * vazias, tolera erros de digitação e ordena por relevância.
 *
 * Camada 2 (IA, opcional): embeddings do modelo multilíngue
 * paraphrase-multilingual-MiniLM-L12-v2 rodando no próprio navegador
 * (transformers.js). Reordena pelo sentido da frase. Baixa ~118 MB uma vez
 * (fica em cache), por isso só liga sozinha no computador; no celular a pessoa
 * escolhe ativar.
 */
window.WikiBusca = (function () {
  'use strict';

  const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
  const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
  const MIN_SCORE = 0.34;

  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const STOP = new Set(('a o as os um uma uns umas de do da dos das no na nos nas em para pra pro por com sem e ou ' +
    'que qual quais onde como quando quero queria preciso gostaria posso consigo fazer faco tem tenho ter ' +
    'eu me meu minha meus minhas seu sua voce vc aqui ali la isso esse essa este esta fica ficam e ao aos ' +
    'se mais muito ja nao sim tipo coisa algum alguma achar acho encontrar saber ver vejo uns lugar local ' +
    'una faculdade campus app ulife').split(' '));

  // Mapa de significados: se a pergunta tem uma destas ideias, procura também estes termos
  const CONCEITOS = [
    [['comer', 'fome', 'almoco', 'almocar', 'lanchar', 'lanche', 'janta', 'jantar', 'cafe', 'comida', 'restaurante', 'salgado'], 'cantina lanche comida'],
    [['marmita', 'esquentar', 'aquecer', 'agua', 'sede', 'beber'], 'microondas bebedouro'],
    [['xixi', 'mijar', 'necessidade', 'banheiro', 'toalete', 'wc', 'sanitario', 'privada'], 'banheiro'],
    [['estudar', 'silencio', 'concentrar', 'ler', 'leitura', 'livro', 'livros'], 'biblioteca estudar livro'],
    [['palestra', 'evento', 'formatura', 'colacao', 'apresentacao', 'seminario'], 'auditorio evento'],
    [['perdi', 'faltei', 'perder', 'faltar', 'chamada', 'refazer'], 'segunda oportunidade prova'],
    [['discordo', 'injusta', 'errada', 'contestar', 'revisar', 'corrigiram'], 'recurso revisao nota'],
    [['provar', 'comprovar', 'comprovante', 'estagio', 'emprego', 'trabalho'], 'declaracao matricula'],
    [['pagar', 'pagamento', 'mensalidade', 'dinheiro', 'pix', 'boleto', 'fatura', 'cobranca'], 'boleto financeiro mensalidade'],
    [['devendo', 'atrasada', 'atrasado', 'divida', 'parcelar'], 'negociar mensalidade'],
    [['senha', 'logar', 'login', 'entrar', 'acesso', 'acessar', 'bloqueado', 'bloqueou'], 'senha acesso primeiro'],
    [['internet', 'wifi', 'conectar', 'rede'], 'wifi internet'],
    [['computador', 'pc', 'notebook', 'programar', 'codigo'], 'informatica laboratorio'],
    [['triste', 'ansiedade', 'ansioso', 'psicologo', 'emocional', 'apoio', 'dificuldade', 'tdah', 'autismo', 'autista', 'desabafar', 'conversar', 'sozinho', 'chorar'], 'napi apoio psicopedagogico'],
    [['cadeirante', 'cadeira', 'rodas', 'deficiencia', 'deficiente', 'surdo', 'cego', 'mobilidade', 'gravida', 'idoso'], 'acessivel elevador rampa pcd'],
    [['subir', 'descer', 'andar', 'escada'], 'elevador rampa'],
    [['carro', 'moto', 'estacionar', 'vaga'], 'estacionamento'],
    [['nota', 'notas', 'media', 'boletim', 'passei', 'reprovei', 'aprovado', 'reprovado'], 'notas boletim'],
    [['prova', 'provas', 'avaliacao', 'teste', 'exame'], 'prova avaliacao'],
    [['horas', 'certificado', 'certificados', 'complementar', 'complementares'], 'certificado horas complementares'],
    [['aula', 'aulas', 'professor', 'assistir'], 'aula'],
    [['horario', 'sala', 'grade', 'que horas'], 'horario quadro aulas sala'],
    [['trancar', 'parar', 'pausar', 'desistir', 'sair do curso'], 'trancamento'],
    [['renovar', 'proximo semestre', 'rematricular'], 'rematricula'],
    [['bolsa', 'desconto', 'fies', 'prouni', 'financiamento'], 'fies prouni bolsa'],
    [['documento', 'documentos', 'papel', 'secretaria', 'atendimento', 'duvida'], 'secretaria atendimento documento'],
    [['word', 'excel', 'powerpoint', 'office', 'teams', 'email'], 'microsoft office teams'],
    [['bebe', 'filho', 'fralda'], 'fraldario'],
    [['enfermagem', 'biomedicina', 'farmacia', 'nutricao', 'fisioterapia', 'saude'], 'laboratorio saude'],
    [['direito', 'advogado', 'juridico'], 'nucleo juridico direito'],
    [['jornalismo', 'publicidade', 'foto', 'filmar', 'video', 'podcast'], 'estudio comunicacao'],
    [['entrada', 'catraca', 'carteirinha', 'chegar', 'portaria'], 'entrada catraca'],
    [['coordenador', 'coordenadora', 'coordenacao'], 'coordenacao curso']
  ];

  // "laboratórios" e "laboratorio" viram a mesma raiz
  function stem(w) {
    if (w.length > 4 && w.endsWith('oes')) return w.slice(0, -3) + 'ao';
    if (w.length > 4 && w.endsWith('aes')) return w.slice(0, -3) + 'ao';
    if (w.length > 4 && w.endsWith('is')) return w.slice(0, -2) + 'l';
    if (w.length > 4 && w.endsWith('res')) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
    return w;
  }

  const tokens = s => norm(s).split(/[^a-z0-9]+/).filter(t => t.length > 1);
  const meaningful = s => tokens(s).filter(t => !STOP.has(t)).map(stem);

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        rowMin = Math.min(rowMin, cur[j]);
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  let docs = [];

  function init(entries) {
    docs = entries.map(e => {
      const title = new Set(meaningful(e.item.titulo));
      const body = new Set(meaningful([e.item.resumo, e.cat.nome, e.item.onde, ...(e.item.buscas || [])].join(' ')));
      const phrase = norm([e.item.titulo, e.item.resumo, ...(e.item.buscas || [])].join(' | '));
      // Para a IA: cada frase vira um vetor; vale a mais parecida com a pergunta
      const texts = [`${e.item.titulo}. ${e.item.resumo || ''}`, ...(e.item.buscas || [])];
      return { entry: e, title, body, phrase, texts };
    });
  }

  function tokenScore(t, d) {
    if (d.title.has(t)) return 1;
    if (d.body.has(t)) return 0.8;
    let best = 0;
    const tol = t.length >= 9 ? 2 : t.length >= 4 ? 1 : 0;
    // no título vale um pouco mais que na descrição
    for (const [set, bonus] of [[d.title, 0.05], [d.body, 0]]) {
      for (const w of set) {
        if (t.length >= 3 && w.startsWith(t)) best = Math.max(best, 0.7 + bonus);            // digitando ainda
        else if (tol && w[0] === t[0] && lev(t, w, tol) <= tol) best = Math.max(best, 0.6 + bonus); // erro de digitação
      }
    }
    return best;
  }

  // Grupos de termos das ideias que aparecem na pergunta
  function expand(qNorm, qTokens) {
    return CONCEITOS
      .filter(([gatilhos]) => gatilhos.some(g => g.includes(' ') ? qNorm.includes(g) : qTokens.includes(stem(g)) || qTokens.includes(g)))
      .map(([, termos]) => meaningful(termos));
  }

  /** Busca leve (instantânea). Retorna [{ entry, score }] do mais ao menos relevante. */
  function buscar(query, tab) {
    const qNorm = norm(query).trim();
    const q = meaningful(query);
    if (!qNorm) return [];
    const extra = expand(qNorm, q);

    return docs
      .filter(d => !tab || d.entry.tab === tab)
      .map(d => {
        let base = q.length ? q.reduce((s, t) => s + tokenScore(t, d), 0) / q.length : 0;
        // Conceito: quanto do grupo de ideias o item cobre (não pune quando falta)
        const conc = extra.length
          ? Math.max(...extra.map(g => g.reduce((s, t) => s + tokenScore(t, d), 0) / g.length))
          : 0;
        // A ideia por trás da pergunta desempata: "palestra" → Auditório antes de Certificado
        // ...e pesa menos quando o resto da pergunta não combina com o item
        const concEff = conc * (0.5 + 0.5 * base);
        let score = Math.min(1, Math.max(base, concEff * 0.85) + 0.05 * concEff);
        if (qNorm.length > 3 && d.phrase.includes(qNorm)) score = Math.max(score, 1.05); // frase exata ganha empates
        return { entry: d.entry, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter(cut);
  }

  // Mostra o que é relevante: acima do mínimo e não muito abaixo do melhor resultado
  function cut(r, i, all) {
    return r.score >= Math.max(MIN_SCORE, all[0].score * 0.6);
  }

  /* ------------------------- Camada IA ------------------------- */
  let status = { state: 'off', progress: 0 };
  const listeners = new Set();
  let extractor = null;
  let docVectors = null;
  let loading = null;

  function setStatus(s) {
    status = { ...status, ...s };
    listeners.forEach(fn => fn(status));
  }

  function onStatus(fn) { listeners.add(fn); fn(status); }

  // Celular ou "economia de dados": só liga se a pessoa pedir
  function podeLigarSozinha() {
    const c = navigator.connection;
    if (c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))) return false;
    return window.matchMedia('(pointer: fine)').matches;
  }

  function ativarIA() {
    if (loading) return loading;
    setStatus({ state: 'loading', progress: 0 });
    const files = {};
    loading = import(TRANSFORMERS_URL)
      .then(async ({ pipeline }) => {
        extractor = await pipeline('feature-extraction', MODEL, {
          dtype: 'q8',
          progress_callback: (p) => {
            if (p.status === 'progress' && p.total) {
              files[p.file] = [p.loaded, p.total];
              const [l, t] = Object.values(files).reduce((a, v) => [a[0] + v[0], a[1] + v[1]], [0, 0]);
              setStatus({ progress: Math.round((l / t) * 100) });
            }
          }
        });
        // Em lotes, para não travar a página enquanto prepara
        const all = docs.flatMap((d, i) => d.texts.map(t => [i, t]));
        docVectors = docs.map(() => []);
        for (let k = 0; k < all.length; k += 32) {
          const batch = all.slice(k, k + 32);
          const vecs = (await extractor(batch.map(b => b[1]), { pooling: 'mean', normalize: true })).tolist();
          batch.forEach(([i], j) => docVectors[i].push(vecs[j]));
          await new Promise(r => setTimeout(r));
        }
        setStatus({ state: 'ready', progress: 100 });
      })
      .catch((err) => {
        console.warn('Busca com IA indisponível:', err);
        loading = null;
        setStatus({ state: 'error' });
      });
    return loading;
  }

  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

  /** Busca com IA: combina significado (embeddings) com a busca leve. null se a IA não está pronta. */
  async function buscarIA(query, tab) {
    if (status.state !== 'ready' || !norm(query).trim()) return null;
    const qv = (await extractor(query, { pooling: 'mean', normalize: true })).tolist()[0];
    const lex = new Map(buscar(query, tab).map(r => [r.entry, r.score]));
    return docs
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => !tab || d.entry.tab === tab)
      .map(({ d, i }) => {
        const sim = Math.max(...docVectors[i].map(v => dot(qv, v)));
        // similaridade 0,30 → 0 ; 0,65 → 1
        const sem = Math.max(0, Math.min(1, (sim - 0.3) / 0.35));
        const l = lex.get(d.entry) || 0;
        return { entry: d.entry, score: Math.max(l, sem * 0.9, (l + sem) / 2 + 0.1 * Math.min(l, sem)), sim };
      })
      .sort((a, b) => b.score - a.score)
      .filter(cut);
  }

  return { init, buscar, buscarIA, ativarIA, onStatus, podeLigarSozinha, norm };
})();
