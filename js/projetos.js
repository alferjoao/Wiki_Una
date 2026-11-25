/**
 * Wiki Una - Ferramentas da aba Projetos (só nesta aba):
 *  1. Inscrições agora  – situação de cada projeto, calculada pela data de hoje
 *  2. Horas de extensão – contador com a regra oficial (10% do curso)
 *  3. Jornada no curso  – o que aproveitar em cada fase
 *  4. Meus projetos     – favoritos ⭐ salvos no navegador
 * + botão "Adicionar à agenda" (.ics) nos eventos e aviso quando os dados ficam antigos.
 * Os dados (com fonte) ficam em js/conteudo.js → window.WIKI_PROJETOS.
 *
 * Heurísticas de Nielsen aplicadas: #1 status visível (selos, barra, aviso de data),
 * #3 controle (desfazer favorito, limpar contador), #5 prevenção de erros (validação
 * do contador), #6 reconhecimento (fonte e caminho sempre à vista), #7 atalhos
 * (setas do teclado nas abas, favoritos), #9 mensagens claras, #10 ajuda (textos curtos).
 */
window.WikiProjetos = (function () {
  'use strict';

  const P = window.WIKI_PROJETOS;
  const vazio = { statusDe: () => null, botaoFavorito: () => null, botaoAgenda: () => null };
  if (!P) return vazio;

  /* ======================= Funções puras (testadas em tests/projetos.test.js) ======================= */
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const hojeISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const dataBR = iso => iso.split('-').reverse().slice(0, 2).join('/');
  const dataBRCompleta = iso => iso.split('-').reverse().join('/');
  const diasEntre = (de, ate) => Math.round((Date.parse(ate + 'T12:00:00Z') - Date.parse(de + 'T12:00:00Z')) / 86400000);
  const CONFERIDO = dataBRCompleta(P.conferido);
  const DIAS_PARA_AVISO = 120; // depois de ~4 meses sem conferir, a aba avisa

  /** Situação de inscrição de um item. Retorna { cls, label, fonte, evento? } ou null. */
  function statusDe(item, hoje = hojeISO()) {
    const s = P.inscricoes[item.id];
    if (!s) return null;
    const base = { fonte: s.fonte };
    if (s.tipo === 'encerrado' || s.tipo === 'em-breve') {
      if (hoje > s.validoAte) return { ...base, cls: 'confira', label: 'Confira as datas no site' };
      return { ...base, cls: s.tipo === 'encerrado' ? 'fechado' : 'previsto', label: s.texto };
    }
    if (s.tipo === 'evento') {
      const prox = s.datas.find(([d]) => d >= hoje);
      if (!prox) return { ...base, cls: 'confira', label: 'Confira as próximas datas' };
      const [data, nome, hora] = prox;
      const quando = data === hoje ? 'hoje' : dataBR(data);
      return { ...base, cls: 'evento', label: `${nome}: ${quando}${hora ? ' às ' + hora.replace(':00', 'h') : ''}`, data, evento: { data, nome, hora } };
    }
    if (s.tipo === 'janela') {
      const mes = Number(hoje.slice(5, 7));
      if (s.meses.includes(mes)) return { ...base, cls: 'aberto', label: `Mês de edital (${MESES[mes - 1]}): confira` };
      const prox = s.meses.find(m => m > mes) || s.meses[0];
      return { ...base, cls: 'previsto', label: `Próximo edital previsto: ${MESES[prox - 1]}` };
    }
    return { ...base, cls: 'info', label: s.texto };
  }

  /**
   * Contador de horas (prevenção de erros: valida antes de mostrar o resultado).
   * Entrada: textos dos campos. Saída: { total, tem, falta, pct, erros: [{ campo, msg }] }
   */
  function calcularHoras({ exigidas = '', carga = '', feitas = '' }) {
    const erros = [];
    const num = (v, campo, nome, max) => {
      if (String(v).trim() === '') return null;
      const n = Number(String(v).replace(',', '.'));
      if (!Number.isFinite(n)) { erros.push({ campo, msg: `${nome}: use só números.` }); return null; }
      if (n < 0) { erros.push({ campo, msg: `${nome}: não pode ser negativo.` }); return null; }
      if (n > max) { erros.push({ campo, msg: `${nome}: o valor parece alto demais (máximo ${max} h). Confira.` }); return null; }
      return Math.round(n);
    };
    const c = num(carga, 'carga', 'Carga horária total', 20000);
    let total = c ? Math.ceil(c * 0.1) : num(exigidas, 'exigidas', 'Horas de extensão do curso', 2000);
    const tem = num(feitas, 'feitas', 'Horas que você já tem', 2000) || 0;
    total = total || 0;
    if (total && tem > total) erros.push({ campo: 'feitas', msg: 'Você informou mais horas do que o curso exige. Confira em Curso → Extensão.', aviso: true });
    const falta = Math.max(0, total - tem);
    const pct = total ? Math.min(100, Math.round((tem / total) * 100)) : 0;
    return { total, tem, falta, pct, erros };
  }

  /** Arquivo de calendário (.ics) de um evento. Horário de Brasília (UTC-3, sem horário de verão). */
  function gerarICS({ id, data, hora, titulo, descricao, url }, agora = new Date()) {
    const [h, m] = (hora || '00:00').split(':').map(Number);
    const inicio = new Date(Date.UTC(+data.slice(0, 4), +data.slice(5, 7) - 1, +data.slice(8, 10), h + 3, m));
    const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const esc = t => String(t || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    const dtStart = hora ? `DTSTART:${fmt(inicio)}` : `DTSTART;VALUE=DATE:${data.replace(/-/g, '')}`;
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wiki Una//Projetos//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${id}-${data}@wiki-una`,
      `DTSTAMP:${fmt(agora)}`,
      dtStart,
      `SUMMARY:${esc(titulo)}`,
      `DESCRIPTION:${esc(descricao)}`,
      url ? `URL:${url}` : null,
      'END:VEVENT', 'END:VCALENDAR'
    ].filter(Boolean).join('\r\n') + '\r\n';
  }

  /* ======================= Favoritos (salvos só neste navegador) ======================= */
  const FAV_KEY = 'wikiuna_projetos_favoritos';
  let aberta = null; // aba de ferramenta aberta (usada também pelos favoritos)
  let favoritos = [];
  try { favoritos = JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { favoritos = []; }
  const ehFavorito = id => favoritos.includes(id);
  function alternarFavorito(id) {
    favoritos = ehFavorito(id) ? favoritos.filter(x => x !== id) : [...favoritos, id];
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favoritos)); } catch (e) { /* sem storage: vale até recarregar */ }
    atualizarFavoritos();
  }
  function atualizarFavoritos() {
    document.querySelectorAll('[data-fav-id]').forEach(b => pintarFavorito(b, ehFavorito(b.dataset.favId)));
    const cont = document.getElementById('projFavCount');
    if (cont) cont.textContent = favoritos.length ? ` (${favoritos.length})` : '';
    if (aberta === 'favoritos') abrir('favoritos');
  }
  function pintarFavorito(b, ativo) {
    b.setAttribute('aria-pressed', String(ativo));
    const nome = b.dataset.favNome;
    b.setAttribute('aria-label', ativo ? `Remover ${nome} de Meus projetos` : `Salvar ${nome} em Meus projetos`);
    b.title = ativo ? 'Remover de Meus projetos' : 'Salvar em Meus projetos';
    if (b.classList.contains('is-texto')) b.textContent = ativo ? '★ Salvo em Meus projetos' : '☆ Salvar em Meus projetos';
    else b.textContent = ativo ? '★' : '☆';
  }
  /** Botão ⭐ (variante 'card' = só a estrela; 'texto' = com rótulo, para a janela de detalhes) */
  function botaoFavorito(item, variante = 'card') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `proj-fav ${variante === 'texto' ? 'is-texto' : 'is-card'}`;
    b.dataset.favId = item.id;
    b.dataset.favNome = item.titulo;
    pintarFavorito(b, ehFavorito(item.id));
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const antes = ehFavorito(item.id);
      alternarFavorito(item.id);
      avisar(antes ? `“${item.titulo}” saiu de Meus projetos.` : `“${item.titulo}” foi salvo em Meus projetos.`);
    });
    return b;
  }

  /* ======================= Agenda (.ics) ======================= */
  function baixarICS(item, ev) {
    const ics = gerarICS({
      id: item.id, data: ev.data, hora: ev.hora, titulo: ev.nome,
      descricao: `${item.titulo} – ${item.resumo || ''}\nFonte: ${(P.inscricoes[item.id].fonte || {}).texto || 'uLife'}. Confira o link do evento perto da data.`,
      url: (P.inscricoes[item.id].fonte || {}).url
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${item.id}-${ev.data}.ics`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    avisar(`Arquivo de agenda baixado: ${ev.nome}. Abra o arquivo para adicionar ao seu calendário.`);
  }
  /** Botão "Adicionar à agenda" — só aparece se o item tem um evento futuro com data */
  function botaoAgenda(item) {
    const st = statusDe(item);
    if (!st || !st.evento) return null;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'proj-agenda';
    b.textContent = `📅 Adicionar à agenda: ${st.label}`;
    b.title = 'Baixa um arquivo .ics que funciona no Google Agenda, Outlook e celular';
    b.addEventListener('click', (e) => { e.stopPropagation(); baixarICS(item, st.evento); });
    return b;
  }

  /* ======================= Montagem da aba ======================= */
  const root = typeof document !== 'undefined' && document.getElementById('projTools');
  const api = { statusDe, calcularHoras, gerarICS, botaoFavorito, botaoAgenda };
  if (!root) return api;

  const itens = {};
  ((window.WIKI_CONTEUDO || {}).projetos || []).forEach(c => c.itens.forEach(i => { itens[i.id] = i; }));
  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };
  const linkItem = (id, texto) => {
    const a = el('a', 'proj-link', texto || (itens[id] ? itens[id].titulo : id));
    a.href = `#projetos/${id}`;
    a.addEventListener('click', (e) => {
      if (window.wikiAbrirItem && window.wikiAbrirItem('projetos', id)) e.preventDefault();
    });
    return a;
  };
  const fonteEl = (texto, url) => {
    const p = el('p', 'proj-fonte');
    p.append('Fonte: ');
    if (url) {
      const a = el('a', null, texto);
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      p.append(a);
    } else p.append(texto);
    return p;
  };

  // Avisos curtos para leitor de tela e para quem enxerga (Nielsen #1)
  const anuncio = el('p', 'proj-anuncio');
  anuncio.setAttribute('role', 'status');
  anuncio.setAttribute('aria-live', 'polite');
  let anuncioTimer;
  function avisar(msg) {
    anuncio.textContent = msg;
    anuncio.classList.add('is-visivel');
    clearTimeout(anuncioTimer);
    anuncioTimer = setTimeout(() => anuncio.classList.remove('is-visivel'), 3500);
  }

  // Aviso quando os dados ficam antigos (Nielsen #1: status do sistema / honestidade da informação)
  const dias = diasEntre(P.conferido, hojeISO());
  if (dias > DIAS_PARA_AVISO) {
    const velho = el('p', 'proj-desatualizado');
    velho.setAttribute('role', 'note');
    velho.append(el('strong', null, '⚠️ Informações de ' + CONFERIDO + '.'),
      ` Já se passaram ${Math.floor(dias / 30)} meses: datas e inscrições podem ter mudado. Confira no uLife antes de se inscrever.`);
    root.appendChild(velho);
  }

  const ABAS = [
    { id: 'inscricoes', icone: '🗓️', nome: 'Inscrições agora', montar: montarInscricoes },
    { id: 'horas', icone: '⏱️', nome: 'Horas de extensão', montar: montarHoras },
    { id: 'jornada', icone: '🧭', nome: 'Jornada no curso', montar: montarJornada },
    { id: 'favoritos', icone: '⭐', nome: 'Meus projetos', montar: montarFavoritos }
  ];

  const tabs = el('div', 'proj-tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Ferramentas de projetos');
  const painel = el('div', 'proj-painel');
  painel.id = 'projPainel';
  painel.setAttribute('role', 'tabpanel');
  painel.tabIndex = 0;
  root.append(tabs, painel, anuncio);

  const botoes = ABAS.map((aba, i) => {
    const b = el('button', 'proj-tab');
    b.type = 'button';
    b.id = `projTab-${aba.id}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('aria-controls', 'projPainel');
    b.tabIndex = -1;
    const ic = el('span', null, aba.icone);
    ic.setAttribute('aria-hidden', 'true');
    b.append(ic, aba.nome);
    if (aba.id === 'favoritos') {
      const n = el('span', 'proj-fav-count');
      n.id = 'projFavCount';
      n.textContent = favoritos.length ? ` (${favoritos.length})` : '';
      b.appendChild(n);
    }
    b.addEventListener('click', () => abrir(aberta === aba.id ? null : aba.id));
    // Setas, Home e End trocam de aba (padrão WAI-ARIA de abas; Nielsen #7)
    b.addEventListener('keydown', (e) => {
      const ir = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ABAS.length - 1 }[e.key];
      if (ir === undefined) return;
      e.preventDefault();
      const alvo = (ir + ABAS.length) % ABAS.length;
      abrir(ABAS[alvo].id);
      botoes[alvo].focus();
    });
    tabs.appendChild(b);
    return b;
  });

  function abrir(id) {
    aberta = id;
    botoes.forEach((b, i) => {
      const ativa = ABAS[i].id === id;
      b.setAttribute('aria-selected', String(ativa));
      b.tabIndex = ativa || (!id && i === 0) ? 0 : -1;
    });
    painel.replaceChildren();
    painel.hidden = !id;
    if (!id) return;
    painel.setAttribute('aria-labelledby', `projTab-${id}`);
    ABAS.find(a => a.id === id).montar(painel);
  }

  /* ---------- 1. Inscrições agora ---------- */
  function montarInscricoes(box) {
    const grupos = [
      { cls: 'aberto', titulo: '🟢 Abertas ou em mês de edital' },
      { cls: 'evento', titulo: '📣 Próximos eventos' },
      { cls: 'previsto', titulo: '🔜 Em breve / previstas' },
      { cls: 'fechado', titulo: '🔴 Encerradas neste semestre' },
      { cls: 'confira', titulo: '🔎 Confira as datas' },
      { cls: 'info', titulo: '♾️ Sem data fixa' }
    ];
    const lista = Object.keys(P.inscricoes).filter(id => itens[id]).map(id => ({ id, st: statusDe(itens[id]) }));
    const grid = el('div', 'proj-insc-grid');
    grupos.forEach(g => {
      const doGrupo = lista.filter(x => x.st.cls === g.cls);
      if (g.cls === 'aberto' && !doGrupo.length) {
        const col = el('section', 'proj-insc-col is-aberto');
        col.append(el('h4', null, g.titulo), el('p', 'proj-vazio', `Nenhuma inscrição de projeto estava aberta quando conferimos (${CONFERIDO}).`));
        grid.appendChild(col);
        return;
      }
      if (!doGrupo.length) return;
      if (g.cls === 'evento') doGrupo.sort((a, b) => a.st.data.localeCompare(b.st.data));
      const col = el('section', `proj-insc-col is-${g.cls}`);
      col.appendChild(el('h4', null, g.titulo));
      const ul = el('ul');
      doGrupo.forEach(({ id, st }) => {
        const li = el('li');
        li.append(linkItem(id), el('span', `proj-status is-${st.cls}`, st.label));
        const ag = botaoAgenda(itens[id]);
        if (ag) { ag.textContent = '📅 Adicionar à agenda'; ag.classList.add('is-pequeno'); li.appendChild(ag); }
        ul.appendChild(li);
      });
      col.appendChild(ul);
      grid.appendChild(col);
    });
    box.append(
      el('p', 'proj-intro', 'A situação de cada projeto é calculada pela data de hoje. Quando uma informação vence, a wiki mostra “Confira as datas” em vez de uma data velha.'),
      grid,
      el('p', 'proj-fonte', `Conferido no uLife e nos sites oficiais em ${CONFERIDO}. A fonte de cada um aparece ao abrir o card.`)
    );
  }

  /* ---------- 2. Horas de extensão ---------- */
  function montarHoras(box) {
    const E = P.extensao;
    const KEY = 'wikiuna_extensao_horas';
    let salvo = {};
    try { salvo = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { salvo = {}; }

    const form = el('div', 'proj-horas-form');
    const campos = {};
    const campo = (chave, label, dica, valor) => {
      const id = `projHoras-${chave}`;
      const w = el('div', 'proj-campo');
      const lab = el('label', 'proj-campo-label', label);
      lab.htmlFor = id;
      const i = el('input');
      Object.assign(i, { type: 'number', id, min: '0', step: '1', inputMode: 'numeric', autocomplete: 'off' });
      if (valor != null && valor !== '') i.value = valor;
      const d = el('small', null, dica);
      d.id = `${id}-dica`;
      const erro = el('small', 'proj-campo-erro');
      erro.id = `${id}-erro`;
      i.setAttribute('aria-describedby', `${d.id} ${erro.id}`);
      w.append(lab, i, d, erro);
      form.appendChild(w);
      campos[chave] = { input: i, erro };
      return i;
    };
    const exigidas = campo('exigidas', 'Horas de extensão do seu curso',
      `Engenharia de Software: ${E.cursos[0].horas} h (${E.cursos[0].fonte}).`, salvo.exigidas ?? E.cursos[0].horas);
    const carga = campo('carga', 'Outro curso? Carga horária total',
      'A wiki calcula 10% (o mínimo exigido).', salvo.carga ?? '');
    const feitas = campo('feitas', 'Horas que você já tem',
      'Veja no uLife: Curso → Extensão → Visão Geral.', salvo.feitas ?? '');

    const limpar = el('button', 'proj-limpar', 'Limpar');
    limpar.type = 'button';
    limpar.addEventListener('click', () => {
      exigidas.value = E.cursos[0].horas; carga.value = ''; feitas.value = '';
      calcular(); feitas.focus();
      avisar('Contador limpo.');
    });

    const resultado = el('div', 'proj-horas-res');
    resultado.setAttribute('aria-live', 'polite');

    function calcular() {
      const r = calcularHoras({ exigidas: exigidas.value, carga: carga.value, feitas: feitas.value });
      if (carga.value.trim() && !r.erros.some(e => e.campo === 'carga')) exigidas.value = r.total;
      try { localStorage.setItem(KEY, JSON.stringify({ exigidas: exigidas.value, carga: carga.value, feitas: feitas.value })); } catch (e) { /* sem storage */ }

      Object.entries(campos).forEach(([chave, { input, erro }]) => {
        const e = r.erros.find(x => x.campo === chave);
        erro.textContent = e ? e.msg : '';
        erro.classList.toggle('is-aviso', !!(e && e.aviso));
        if (e && !e.aviso) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      });

      resultado.replaceChildren();
      if (!r.total) { resultado.appendChild(el('p', 'proj-vazio', 'Informe as horas do seu curso (ou a carga total) para calcular.')); return; }

      const barra = el('div', 'proj-barra');
      barra.setAttribute('role', 'progressbar');
      barra.setAttribute('aria-valuemin', '0');
      barra.setAttribute('aria-valuemax', '100');
      barra.setAttribute('aria-valuenow', String(r.pct));
      barra.setAttribute('aria-label', 'Horas de extensão concluídas');
      const fill = el('span');
      fill.style.width = `${r.pct}%`;
      barra.appendChild(fill);

      const resumo = el('p', 'proj-horas-resumo');
      resumo.append(el('strong', null, r.falta ? `Faltam ${r.falta} h` : 'Horas completas! 🎉'), ` · você tem ${r.tem} de ${r.total} h (${r.pct}%)`);
      resultado.append(resumo, barra);

      if (r.falta) {
        resultado.appendChild(el('h4', null, 'Projetos que dão horas de extensão (valor do site oficial):'));
        const ul = el('ul', 'proj-horas-lista');
        E.projetos.forEach(p => {
          const li = el('li');
          const cobre = Math.min(100, Math.round((p.horas / r.falta) * 100));
          li.append(linkItem(p.id, p.nome), el('span', 'proj-status is-horas', `${p.horas} h`),
            el('span', 'proj-cobre', cobre >= 100 ? 'cobre o que falta' : `cobre ${cobre}% do que falta`));
          ul.appendChild(li);
        });
        resultado.appendChild(ul);
        resultado.appendChild(el('p', 'proj-aviso', 'Também contam os cursos e projetos de extensão da plataforma do uLife. Quem valida as horas é o uLife: confira sempre em Curso → Extensão.'));
      }
    }
    exigidas.addEventListener('input', () => { carga.value = ''; calcular(); });
    carga.addEventListener('input', calcular);
    feitas.addEventListener('input', calcular);

    const topo = el('div', 'proj-horas-topo');
    topo.append(el('p', 'proj-intro', E.regra), limpar);
    box.append(topo, form, resultado, fonteEl(E.fonteRegra.texto, E.fonteRegra.url));
    calcular();
  }

  /* ---------- 3. Jornada no curso ---------- */
  function montarJornada(box) {
    const ol = el('ol', 'proj-jornada');
    P.jornada.forEach((f, i) => {
      const li = el('li', 'proj-fase');
      const head = el('div', 'proj-fase-head');
      const num = el('span', 'proj-fase-num', f.icone);
      num.setAttribute('aria-hidden', 'true');
      head.append(num, el('h4', null, `${i + 1}. ${f.fase}`));
      const ul = el('ul');
      f.itens.forEach(it => {
        const item = el('li');
        const st = itens[it.id] ? statusDe(itens[it.id]) : null;
        item.appendChild(linkItem(it.id, it.texto));
        if (st && st.cls !== 'info') item.appendChild(el('span', `proj-status is-${st.cls}`, st.label));
        ul.appendChild(item);
      });
      li.append(head, ul, el('p', 'proj-fonte', `Fonte: ${f.fonte}`));
      ol.appendChild(li);
    });
    box.append(
      el('p', 'proj-intro', 'O que dá para aproveitar em cada fase do curso. Não é obrigatório seguir esta ordem: clique em um item para ver o passo a passo.'),
      ol
    );
  }

  /* ---------- 4. Meus projetos (favoritos) ---------- */
  function montarFavoritos(box) {
    box.appendChild(el('p', 'proj-intro', 'Os projetos que você salvou com a estrela ☆. Ficam guardados só neste navegador.'));
    const salvos = favoritos.filter(id => itens[id]);
    if (!salvos.length) {
      const v = el('p', 'proj-vazio');
      v.append('Você ainda não salvou nenhum projeto. Toque na estrela ', el('strong', null, '☆'), ' no canto de um card para guardar aqui.');
      box.appendChild(v);
      return;
    }
    const ul = el('ul', 'proj-fav-lista');
    salvos.forEach(id => {
      const it = itens[id];
      const li = el('li');
      const txt = el('div', 'proj-fav-txt');
      txt.append(linkItem(id), el('span', 'proj-cobre', it.resumo || ''));
      const st = statusDe(it);
      if (st && st.cls !== 'info') txt.appendChild(el('span', `proj-status is-${st.cls}`, st.label));
      const acoes = el('div', 'proj-fav-acoes');
      const ag = botaoAgenda(it);
      if (ag) { ag.textContent = '📅 Agenda'; ag.classList.add('is-pequeno'); acoes.appendChild(ag); }
      const rm = el('button', 'proj-remover', 'Remover');
      rm.type = 'button';
      rm.setAttribute('aria-label', `Remover ${it.titulo} de Meus projetos`);
      rm.addEventListener('click', () => { alternarFavorito(id); avisar(`“${it.titulo}” saiu de Meus projetos.`); });
      acoes.appendChild(rm);
      li.append(txt, acoes);
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  abrir('inscricoes');
  return api;
})();
