/**
 * Wiki Una - Calendário Acadêmico interativo (aba "Calendário Acadêmico")
 * Datas retiradas dos PDFs oficiais 2026 em https://www.una.br/sou-estudante/calendario/
 */
(function () {
  'use strict';

  const grid = document.getElementById('calGrid');
  if (!grid) return;

  const PREFS_KEY = 'wikiuna_calendar_prefs';
  const PDF_BASE = 'https://estaticos.animaeducacao.com.br/medias/';

  // [início, fim (ou null), título, categoria]
  const FERIADOS = [
    ['2026-01-01', null, 'Ano Novo', 'feriado'],
    ['2026-02-16', null, 'Recesso escolar', 'feriado'],
    ['2026-02-17', null, 'Carnaval', 'feriado'],
    ['2026-02-18', null, 'Quarta-feira de Cinzas', 'feriado'],
    ['2026-04-02', null, 'Quinta-feira Santa', 'feriado'],
    ['2026-04-03', null, 'Sexta-feira Santa', 'feriado'],
    ['2026-04-21', null, 'Tiradentes', 'feriado'],
    ['2026-05-01', null, 'Dia do Trabalho', 'feriado'],
    ['2026-06-04', null, 'Corpus Christi', 'feriado'],
    ['2026-09-07', null, 'Independência do Brasil', 'feriado'],
    ['2026-10-12', null, 'Nossa Senhora Aparecida', 'feriado'],
    ['2026-10-15', null, 'Dia do Professor (recesso acadêmico)', 'feriado'],
    ['2026-11-02', null, 'Finados', 'feriado'],
    ['2026-11-15', null, 'Proclamação da República', 'feriado'],
    ['2026-11-20', null, 'Consciência Negra', 'feriado'],
    ['2026-12-25', null, 'Natal', 'feriado']
  ];

  // Feriados municipais de Belo Horizonte (aparecem só para BH)
  const FERIADOS_BH = [
    ['2026-08-15', null, 'Assunção de Nossa Senhora (BH)', 'feriado'],
    ['2026-12-08', null, 'Nossa Senhora da Conceição (BH)', 'feriado']
  ];

  const PRESENCIAL = [
    ['2026-01-01', '2026-02-08', 'Férias escolares', 'ferias'],
    ['2026-01-15', null, 'Início da rematrícula', 'prazo'],
    ['2026-02-02', '2026-03-30', 'Período de trancamento de matrícula', 'prazo'],
    ['2026-02-04', '2026-02-07', 'Avaliação Integrada (AI)', 'avaliacao'],
    ['2026-02-09', null, 'Início do semestre letivo', 'letivo'],
    ['2026-02-09', null, 'Término da rematrícula', 'prazo'],
    ['2026-02-14', null, 'Início dos sábados letivos', 'letivo'],
    ['2026-02-15', '2026-03-31', 'Mudança de turno e/ou campus (veteranos)', 'prazo'],
    ['2026-05-04', '2026-05-16', 'A1 – 1ª oportunidade', 'avaliacao'],
    ['2026-05-25', '2026-05-30', 'A1 – 2ª oportunidade', 'avaliacao'],
    ['2026-06-02', '2026-06-03', 'A2 – 1ª oportunidade', 'avaliacao'],
    ['2026-06-08', '2026-06-20', 'A3', 'avaliacao'],
    ['2026-06-17', null, 'A2 – 2ª oportunidade', 'avaliacao'],
    ['2026-06-29', '2026-07-02', 'Avaliação Integrada (AI)', 'avaliacao'],
    ['2026-07-04', null, 'Término do semestre letivo', 'letivo'],
    ['2026-07-05', '2026-08-09', 'Férias escolares', 'ferias'],
    ['2026-07-14', null, 'Início da colação de grau', 'letivo'],
    ['2026-07-17', '2026-08-10', 'Rematrícula 2026.2', 'prazo'],
    ['2026-07-20', '2026-09-25', 'Mudança de turno e/ou campus (veteranos)', 'prazo'],
    ['2026-08-03', '2026-08-07', 'Avaliação Integrada (2ª janela)', 'avaliacao'],
    ['2026-08-03', '2026-09-30', 'Período de trancamento de matrícula', 'prazo'],
    ['2026-08-10', null, 'Início do período letivo – veteranos', 'letivo'],
    ['2026-08-13', null, 'Início do período letivo – calouros', 'letivo'],
    ['2026-08-22', null, 'Início dos sábados letivos', 'letivo'],
    ['2026-10-19', '2026-10-24', 'A1 – 1ª oportunidade', 'avaliacao'],
    ['2026-11-04', '2026-12-11', 'Avaliação da Academia Futuros Profissionais (AFP)', 'avaliacao'],
    ['2026-11-09', '2026-11-14', 'A1 – 2ª oportunidade', 'avaliacao'],
    ['2026-11-30', '2026-12-05', 'A3', 'avaliacao'],
    ['2026-12-07', '2026-12-09', 'A2 – 1ª oportunidade', 'avaliacao'],
    ['2026-12-12', null, 'Término dos sábados letivos', 'letivo'],
    ['2026-12-15', null, 'A2 – 2ª oportunidade', 'avaliacao'],
    ['2026-12-16', null, 'Avaliação Integrada (AI 2026.2)', 'avaliacao'],
    ['2026-12-18', null, 'Término do semestre letivo', 'letivo'],
    ['2026-12-19', '2026-12-31', 'Recesso acadêmico', 'ferias']
  ];

  const SEMIPRESENCIAL = [
    ['2026-01-01', '2026-02-08', 'Férias escolares', 'ferias'],
    ['2026-02-09', null, 'Início do semestre letivo', 'letivo'],
    ['2026-02-14', null, 'Início dos sábados letivos', 'letivo'],
    ['2026-04-22', '2026-05-25', 'Avaliação Processual A1 (online)', 'avaliacao'],
    ['2026-05-11', '2026-05-25', 'Avaliação Processual A2 (online)', 'avaliacao'],
    ['2026-06-01', '2026-06-06', 'A3 – 1ª oportunidade (presencial)', 'avaliacao'],
    ['2026-06-29', '2026-07-02', 'Avaliação Integrada (AI) presencial', 'avaliacao'],
    ['2026-07-04', null, 'Término do semestre letivo', 'letivo'],
    ['2026-07-05', '2026-07-31', 'Férias escolares', 'ferias'],
    ['2026-07-16', null, 'Início da mudança de turno e/ou campus', 'prazo'],
    ['2026-08-03', '2026-12-11', 'Solicitação do passe escolar', 'prazo'],
    ['2026-08-10', null, 'Início do período letivo – veteranos', 'letivo'],
    ['2026-08-13', null, 'Início do período letivo – calouros', 'letivo'],
    ['2026-08-22', null, 'Encontro síncrono C1 (1º encontro) – manhã', 'encontro'],
    ['2026-08-29', null, 'Encontro síncrono C2 (1º encontro) – manhã', 'encontro'],
    ['2026-09-12', null, 'Encontro síncrono C3 (1º encontro) – manhã', 'encontro'],
    ['2026-09-19', null, 'Encontro síncrono C4 (manhã) e C6 (tarde) – 1º encontro', 'encontro'],
    ['2026-09-26', null, 'Encontro síncrono C5 (manhã) e C7 (tarde) – 1º encontro', 'encontro'],
    ['2026-10-03', null, 'Encontro síncrono C1 (2º encontro) – manhã', 'encontro'],
    ['2026-10-17', null, 'Encontro síncrono C2 (2º encontro) – manhã', 'encontro'],
    ['2026-10-19', '2026-10-24', 'Avaliação A1', 'avaliacao'],
    ['2026-10-24', null, 'Encontro síncrono C3 (2º encontro) – manhã', 'encontro'],
    ['2026-11-04', '2026-12-11', 'Avaliação da Academia Futuros Profissionais (AFP)', 'avaliacao'],
    ['2026-11-07', null, 'Encontro síncrono C4 (manhã) e C6 (tarde) – 2º encontro', 'encontro'],
    ['2026-11-09', '2026-11-14', 'Avaliação A2', 'avaliacao'],
    ['2026-11-14', null, 'Encontro síncrono C5 (manhã) e C7 (tarde) – 2º encontro', 'encontro'],
    ['2026-11-30', '2026-12-05', 'A3 – 1ª oportunidade', 'avaliacao'],
    ['2026-12-15', null, 'A3 – 2ª oportunidade', 'avaliacao'],
    ['2026-12-16', null, 'Avaliação Integrada (AI)', 'avaliacao'],
    ['2026-12-18', null, 'Término do período letivo', 'letivo']
  ];

  const EAD = [
    ['2026-08-10', null, 'Início do semestre letivo (veteranos – Bloco 1)', 'letivo'],
    ['2026-08-13', null, 'Início do Bloco 1 (calouros)', 'letivo'],
    ['2026-08-29', null, 'Encontro síncrono com o docente – Bloco 1 (9h às 11h50)', 'encontro'],
    ['2026-08-31', '2026-09-09', 'A1 – Bloco 1 (dissertativa)', 'avaliacao'],
    ['2026-09-01', '2026-09-21', 'A3 – Bloco 1 (dissertativa)', 'avaliacao'],
    ['2026-09-10', '2026-09-13', 'Solicitação de 2ª oportunidade A1 – Bloco 1', 'prazo'],
    ['2026-09-11', '2026-09-17', 'A2 – Bloco 1 (objetiva)', 'avaliacao'],
    ['2026-09-17', '2026-09-19', 'Solicitação de recurso A1 – Bloco 1', 'prazo'],
    ['2026-09-18', '2026-09-20', 'Recurso e 2ª oportunidade A2 – Bloco 1', 'prazo'],
    ['2026-09-21', '2026-09-23', '2ª oportunidade A1 – Bloco 1', 'avaliacao'],
    ['2026-09-28', '2026-09-30', '2ª oportunidade A2 – Bloco 1', 'avaliacao'],
    ['2026-10-07', '2026-10-08', 'Avaliação Integrada (AI) – Bloco 1', 'avaliacao'],
    ['2026-10-09', null, 'Término do Bloco 1', 'letivo'],
    ['2026-10-13', null, 'Início do Bloco 2', 'letivo'],
    ['2026-11-02', '2026-11-11', 'A1 – Bloco 2 (dissertativa)', 'avaliacao'],
    ['2026-11-04', '2026-12-11', 'Avaliação AFP / Vida & Carreira', 'avaliacao'],
    ['2026-11-05', '2026-12-02', 'A3 – Bloco 2 (dissertativa)', 'avaliacao'],
    ['2026-11-07', null, 'Encontro síncrono com o docente – Bloco 2 (9h às 11h50)', 'encontro'],
    ['2026-11-12', '2026-11-15', 'Solicitação de 2ª oportunidade A1 – Bloco 2', 'prazo'],
    ['2026-11-12', '2026-11-18', 'A2 – Bloco 2 (banco de questões)', 'avaliacao'],
    ['2026-11-18', '2026-11-20', 'Solicitação de recurso A1 – Bloco 2', 'prazo'],
    ['2026-11-19', '2026-11-22', 'Recurso e 2ª oportunidade A2 – Bloco 2', 'prazo'],
    ['2026-12-01', '2026-12-03', '2ª oportunidade A1 – Bloco 2', 'avaliacao'],
    ['2026-12-08', '2026-12-10', '2ª oportunidade A2 – Bloco 2', 'avaliacao'],
    ['2026-12-16', '2026-12-17', 'Avaliação Integrada (AI) – Bloco 2', 'avaliacao'],
    ['2026-12-18', null, 'Término do semestre letivo', 'letivo']
  ];

  // Cidades e PDFs oficiais (caminho após PDF_BASE)
  const PDFS = {
    presencial: {
      'Belo Horizonte': '20260908182452/Calendario_Acadmico_UNA_BELO_HORIZONTE_08-09-2026.pdf',
      'Betim': '20260923094758/Calendario_Acadmico_UNA_BETIM_22-09-2026.pdf',
      'Bom Despacho': '20260923094758/Calendario_Acadmico_UNA_BOM_DESPACHO_22-09-2026.pdf',
      'Catalão': '20260908182452/Calendario_Acadmico_UNA_CATAL%C3%A2O_08-09-2026.pdf',
      'Conselheiro Lafaiete': '20260923094758/Calendario_Acadmico_UNA_CONSELHEIRO_LAFAETTE_22-09-2026.pdf',
      'Contagem': '20260923094758/Calendario_Acadmico_UNA_CONTAGEM_22-09-2026.pdf',
      'Divinópolis': '20260908182452/Calendario_Acadmico_UNA_DIVINOPOLIS_08-09-2026.pdf',
      'Itabira': '20260908182453/Calendario_Acadmico_UNA_ITABIRA_08-09-2026.pdf',
      'Itumbiara': '20260908182452/Calendario_Acadmico_UNA_ITUMBIARA_08-09-2026.pdf',
      'Jataí': '20260908182452/Calendario_Acadmico_UNA_JATA%C3%AC_08-09-2026.pdf',
      'Pouso Alegre': '20260908182452/Calendario_Acadmico_UNA_POUSO_ALEGRE_08-09-2026.pdf',
      'Sete Lagoas': '20260923094758/Calendario_Acadmico_UNA_SETE_LAGOAS_22-09-2026.pdf',
      'Uberlândia': '20260923094758/Calendario_Acadmico_UNA_UBERL%C3%A9NDIA_22-09-2026.pdf'
    },
    semipresencial: {
      'Belo Horizonte': '20260820094557/Calendario_Acadmico_UNA_Belo_Horizonte_Semipresencial_para_alunos__ekiel2s.pdf',
      'Betim': '20260820094556/Calendario_Acadmico_UNA_Betim_Semipresencial_para_alunos_matricula_rMUKn1x.pdf',
      'Bom Despacho': '20260820094556/Calendario_Acadmico_UNA_Bom_Despacho_Semipresencial_para_alunos_ma_7w47iAq.pdf',
      'Catalão': '20260820094557/Calendario_Acadmico_UNA_Catalao_Semipresencial_para_alunos_matricu_d2jOAK8.pdf',
      'Conselheiro Lafaiete': '20260820094557/Calendario_Acadmico_UNA_Conselheiro_Lafaiete_Semipresencial_para_a_CLOpm7d.pdf',
      'Contagem': '20260820094557/Calendario_Acadmico_UNA_Contagem_Semipresencial_para_alunos_matric_DZpwFqA.pdf',
      'Divinópolis': '20260820094557/Calendario_Acadmico_UNA_Divinopolis_Semipresencial_para_alunos_mat_6KfG4Gq.pdf',
      'Itabira': '20260820094557/Calendario_Acadmico_UNA_Itabira_Semipresencial_para_alunos_matricu_Wlynfyl.pdf',
      'Itumbiara': '20260820094558/Calendario_Acadmico_UNA_Itumbiara_Semipresencial_para_alunos_matri_OzAqbLm.pdf',
      'Jataí': '20260820094558/Calendario_Acadmico_UNA_Jatai_Semipresencial_para_alunos_matricula_O8BHQDI.pdf',
      'Pouso Alegre': '20260820094557/Calendario_Acadmico_UNA_Pouso_Alegre_Semipresencial_para_alunos_ma_4DhWu8O.pdf',
      'Sete Lagoas': '20260820094557/Calendario_Acadmico_UNA_Sete_Lagoas_Semipresencial_para_alunos_mat_PrcCtLs.pdf',
      'Uberlândia': '20260820094557/Calendario_Acadmico_UNA_Uberlandia_Semipresencial_para_alunos_matr_UVyPyph.pdf'
    },
    ead: {
      'Nacional (todas as regiões)': '20260824153616/UNA_Calend%C3%ADrio_Acadmico_Modalidades_EAD_2026_pdf.pdf'
    }
  };

  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const CAT_ORDER = ['feriado', 'avaliacao', 'prazo', 'encontro', 'letivo', 'ferias'];

  const el = {
    title: document.getElementById('calMonthTitle'),
    city: document.getElementById('calCity'),
    cityWrap: document.getElementById('calCityWrap'),
    pdf: document.getElementById('calPdfLink'),
    agendaDate: document.getElementById('calAgendaDate'),
    agendaList: document.getElementById('calAgendaList'),
    upcoming: document.getElementById('calUpcoming'),
    note: document.getElementById('calNote'),
    segBtns: document.querySelectorAll('.cal-seg-btn')
  };

  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let prefs = { mode: 'presencial', city: 'Belo Horizonte' };
  try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(PREFS_KEY)) }; } catch (e) { /* usa padrão */ }
  if (!PDFS[prefs.mode]) prefs.mode = 'presencial';

  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = new Date(today);

  function events() {
    const base = { presencial: PRESENCIAL, semipresencial: SEMIPRESENCIAL, ead: EAD }[prefs.mode];
    const local = prefs.mode !== 'ead' && prefs.city === 'Belo Horizonte' ? FERIADOS_BH : [];
    return FERIADOS.concat(local, base);
  }

  function eventsOn(dayIso, list) {
    return list
      .filter(([start, end]) => dayIso >= start && dayIso <= (end || start))
      .sort((a, b) => CAT_ORDER.indexOf(a[3]) - CAT_ORDER.indexOf(b[3]));
  }

  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  function formatRange(start, end) {
    const f = s => { const [, m, d] = s.split('-'); return `${d}/${m}`; };
    return end ? `${f(start)} a ${f(end)}` : f(start);
  }

  function li(ev) {
    const item = document.createElement('li');
    item.className = `cal-agenda-item cat-${ev[3]}`;
    const title = document.createElement('strong');
    title.textContent = ev[2];
    const when = document.createElement('span');
    when.textContent = formatRange(ev[0], ev[1]);
    item.append(title, when);
    return item;
  }

  function renderCities() {
    const cities = Object.keys(PDFS[prefs.mode]);
    if (!cities.includes(prefs.city)) prefs.city = cities[0];
    el.city.innerHTML = '';
    cities.forEach(c => el.city.add(new Option(c, c, false, c === prefs.city)));
    el.city.disabled = cities.length === 1;
    el.pdf.href = PDF_BASE + PDFS[prefs.mode][prefs.city];
    el.segBtns.forEach(b => b.setAttribute('aria-checked', b.dataset.mode === prefs.mode));

    // shortcut: só os PDFs de BH e do EAD foram transcritos; demais cidades usam a base de BH sem feriados municipais. Transcrever cada PDF quando precisar de exatidão local.
    el.note.textContent = prefs.mode === 'ead'
      ? 'Calendário EAD 2026.2 (Unidades Curriculares Digitais). Sujeito a alterações – confira sempre o PDF oficial.'
      : prefs.city === 'Belo Horizonte'
        ? 'Datas do calendário oficial 2026 de Belo Horizonte. Sujeito a alterações.'
        : `Datas gerais da Una (base: Belo Horizonte). Feriados municipais de ${prefs.city} podem variar – confira o PDF oficial.`;
  }

  function renderGrid(direction) {
    const list = events();
    const y = view.getFullYear();
    const m = view.getMonth();
    el.title.textContent = `${MONTHS[m]} ${y}`;

    const first = new Date(y, m, 1);
    const start = new Date(y, m, 1 - first.getDay());
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const dIso = iso(d);
      const dayEvents = eventsOn(dIso, list);
      // Na grade, eventos longos (> 14 dias) só aparecem no dia em que começam; o painel lateral mostra tudo
      const gridEvents = dayEvents.filter(([s, e]) => !e || dIso === s || daysBetween(s, e) <= 14);

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';
      cell.dataset.date = dIso;
      if (d.getMonth() !== m) cell.classList.add('is-outside');
      if (d.getDay() === 0) cell.classList.add('is-sunday');
      if (dIso === iso(today)) cell.classList.add('is-today');
      if (dIso === iso(selected)) cell.classList.add('is-selected');
      if (dayEvents.some(e => e[3] === 'feriado')) cell.classList.add('is-holiday');
      cell.setAttribute('aria-label', `${d.getDate()} de ${MONTHS[d.getMonth()]}${dayEvents.length ? `, ${dayEvents.length} evento(s)` : ''}`);
      if (dIso === iso(selected)) cell.setAttribute('aria-pressed', 'true');

      const num = document.createElement('span');
      num.className = 'cal-day-num';
      num.textContent = d.getDate();
      cell.appendChild(num);

      if (gridEvents.length) {
        const wrap = document.createElement('span');
        wrap.className = 'cal-day-events';
        gridEvents.slice(0, 2).forEach(ev => {
          const pill = document.createElement('span');
          pill.className = `cal-pill cat-${ev[3]}`;
          pill.textContent = ev[2];
          wrap.appendChild(pill);
        });
        if (gridEvents.length > 2) {
          const more = document.createElement('span');
          more.className = 'cal-more';
          more.textContent = `+${gridEvents.length - 2}`;
          wrap.appendChild(more);
        }
        // No celular, só bolinhas coloridas
        const dots = document.createElement('span');
        dots.className = 'cal-day-dots';
        [...new Set(gridEvents.map(e => e[3]))].slice(0, 3).forEach(cat => {
          const dot = document.createElement('i');
          dot.className = `cal-dot cat-${cat}`;
          dots.appendChild(dot);
        });
        cell.append(wrap, dots);
      }
      frag.appendChild(cell);
    }

    grid.replaceChildren(frag);
    if (direction) {
      grid.classList.remove('slide-left', 'slide-right');
      void grid.offsetWidth; // reinicia a animação
      grid.classList.add(direction > 0 ? 'slide-left' : 'slide-right');
    }
    renderAgenda(list);
  }

  function renderAgenda(list) {
    const label = selected.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    el.agendaDate.textContent = label.charAt(0).toUpperCase() + label.slice(1);

    const dayEvents = eventsOn(iso(selected), list);
    el.agendaList.replaceChildren(...dayEvents.map(li));
    if (!dayEvents.length) {
      const empty = document.createElement('li');
      empty.className = 'cal-empty';
      empty.textContent = 'Nenhum evento acadêmico neste dia.';
      el.agendaList.appendChild(empty);
    }

    // Eventos que começam no mês exibido, a partir de hoje
    const monthPrefix = `${view.getFullYear()}-${pad(view.getMonth() + 1)}`;
    const fromIso = iso(today);
    const upcoming = list
      .filter(([s, e]) => s.startsWith(monthPrefix) && (e || s) >= fromIso)
      .sort((a, b) => a[0].localeCompare(b[0]));
    el.upcoming.replaceChildren(...upcoming.map(li));
    if (!upcoming.length) {
      const empty = document.createElement('li');
      empty.className = 'cal-empty';
      empty.textContent = 'Nada pendente neste mês.';
      el.upcoming.appendChild(empty);
    }
  }

  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* sem persistência */ }
  }

  function goMonth(delta) {
    view = new Date(view.getFullYear(), view.getMonth() + delta, 1);
    // Mantém o mesmo dia selecionado no novo mês (como no app Calendário do Mac)
    const lastDay = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    selected = new Date(view.getFullYear(), view.getMonth(), Math.min(selected.getDate(), lastDay));
    renderGrid(delta);
  }

  function selectDate(d) {
    const delta = (d.getFullYear() - view.getFullYear()) * 12 + d.getMonth() - view.getMonth();
    selected = d;
    if (delta) {
      view = new Date(d.getFullYear(), d.getMonth(), 1);
      renderGrid(delta);
    } else {
      renderGrid(0);
    }
    grid.querySelector('.is-selected')?.focus({ preventScroll: true });
  }

  // Eventos de interface
  document.getElementById('calPrev').addEventListener('click', () => goMonth(-1));
  document.getElementById('calNext').addEventListener('click', () => goMonth(1));
  document.getElementById('calToday').addEventListener('click', () => selectDate(new Date(today)));

  grid.addEventListener('click', (e) => {
    const cell = e.target.closest('.cal-day');
    if (!cell) return;
    const [y, m, d] = cell.dataset.date.split('-').map(Number);
    selectDate(new Date(y, m - 1, d));
  });

  // Teclado: setas movem o dia, PageUp/PageDown trocam o mês
  grid.addEventListener('keydown', (e) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (moves[e.key]) {
      e.preventDefault();
      selectDate(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + moves[e.key]));
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      goMonth(e.key === 'PageDown' ? 1 : -1);
    }
  });

  // Deslizar no celular / trackpad
  let touchX = null;
  grid.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) goMonth(dx < 0 ? 1 : -1);
  });
  let wheelLock = false;
  grid.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) < Math.abs(e.deltaY) || wheelLock) return;
    e.preventDefault();
    wheelLock = true;
    goMonth(e.deltaX > 0 ? 1 : -1);
    setTimeout(() => { wheelLock = false; }, 450);
  }, { passive: false });

  el.segBtns.forEach(btn => btn.addEventListener('click', () => {
    prefs.mode = btn.dataset.mode;
    savePrefs();
    renderCities();
    renderGrid(0);
  }));

  el.city.addEventListener('change', () => {
    prefs.city = el.city.value;
    savePrefs();
    renderCities();
    renderGrid(0);
  });

  renderCities();
  renderGrid(0);
})();
