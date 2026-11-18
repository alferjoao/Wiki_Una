/**
 * Wiki Una - Guias em colunas com busca (abas Localização e Ambiente virtual)
 * e busca geral da barra lateral. O conteúdo vem de js/conteudo.js.
 */
(function () {
  'use strict';

  const DATA = window.WIKI_CONTEUDO;
  if (!DATA) return;

  const TAB_NAMES = { localizacao: 'Localização', ambiente: 'Ambiente virtual' };
  const dialog = document.getElementById('guiaDialog');

  const Busca = window.WikiBusca;

  // Índice plano de todos os itens, para a busca semântica
  const index = [];
  Object.entries(DATA).forEach(([tab, categorias]) => {
    categorias.forEach(cat => cat.itens.forEach(item => index.push({ tab, cat, item })));
  });
  Busca.init(index);

  /**
   * Busca em duas etapas: responde na hora com a busca leve e, se a IA estiver
   * pronta, refina pelo significado e chama render de novo.
   */
  function search(query, tab, render) {
    const token = {};
    search.last = token;
    render(Busca.buscar(query, tab), false);
    Busca.buscarIA(query, tab).then(r => {
      if (r && search.last === token) render(r, true);
    }).catch(() => {});
  }

  /* Status da IA em todos os lugares que mostram a busca (Nielsen #1: status visível) */
  function bindStatus(el) {
    if (!el) return;
    Busca.onStatus(({ state, progress }) => {
      el.dataset.state = state;
      el.replaceChildren();
      const label = document.createElement('span');
      if (state === 'ready') label.textContent = '✨ Busca com IA ativa: entende frases como “onde posso comer?”';
      else if (state === 'loading') label.textContent = `✨ Preparando a IA… ${progress || 0}% (só na primeira vez)`;
      else if (state === 'error') label.textContent = 'Busca inteligente ativa (IA indisponível agora)';
      else label.textContent = 'Busca inteligente ativa: escreva do seu jeito.';
      el.appendChild(label);
      if (state === 'off' || state === 'error') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ia-btn';
        btn.textContent = state === 'error' ? 'Tentar de novo' : 'Ativar IA (~118 MB, uma vez)';
        btn.addEventListener('click', () => Busca.ativarIA());
        el.appendChild(btn);
      }
    });
  }

  /* ---------------- Visualizador de fotos (ampliar) ---------------- */
  const viewer = document.getElementById('fotoDialog');
  let fotos = [];
  let atual = 0;

  function zoomButton(img, list, index) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'foto-zoom';
    btn.setAttribute('aria-label', `Ampliar foto: ${list[index].legenda}`);
    const hint = document.createElement('span');
    hint.className = 'foto-zoom-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = '🔍 Ampliar';
    btn.append(img, hint);
    btn.addEventListener('click', () => abrirFoto(list, index));
    return btn;
  }

  function abrirFoto(list, index) {
    fotos = list;
    mostrarFoto(index);
    viewer.showModal();
  }

  function mostrarFoto(index) {
    atual = (index + fotos.length) % fotos.length;
    const f = fotos[atual];
    const img = viewer.querySelector('.foto-viewer-img');
    img.src = f.src;
    img.alt = f.legenda;
    viewer.querySelector('.foto-viewer-stage').classList.remove('is-zoomed');
    viewer.querySelector('.foto-viewer-caption').textContent = f.legenda;
    viewer.querySelector('.foto-viewer-count').textContent = fotos.length > 1 ? `${atual + 1} de ${fotos.length}` : '';
    viewer.querySelectorAll('.foto-viewer-nav').forEach(b => { b.hidden = fotos.length < 2; });
  }

  if (viewer) {
    viewer.querySelector('.foto-viewer-close').addEventListener('click', () => viewer.close());
    viewer.querySelector('.foto-viewer-prev').addEventListener('click', () => mostrarFoto(atual - 1));
    viewer.querySelector('.foto-viewer-next').addEventListener('click', () => mostrarFoto(atual + 1));
    // Toque/clique na foto: aproxima ainda mais (e afasta de novo)
    const stage = viewer.querySelector('.foto-viewer-stage');
    viewer.querySelector('.foto-viewer-img').addEventListener('click', (e) => {
      const zoom = !stage.classList.contains('is-zoomed');
      stage.classList.toggle('is-zoomed', zoom);
      if (zoom) {
        // centraliza no ponto clicado
        const r = e.target.getBoundingClientRect();
        requestAnimationFrame(() => {
          stage.scrollLeft = ((e.clientX - r.left) / r.width) * stage.scrollWidth - stage.clientWidth / 2;
          stage.scrollTop = ((e.clientY - r.top) / r.height) * stage.scrollHeight - stage.clientHeight / 2;
        });
      }
    });
    viewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') mostrarFoto(atual - 1);
      if (e.key === 'ArrowRight') mostrarFoto(atual + 1);
    });
    let x0 = null;
    stage.addEventListener('touchstart', (e) => { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (x0 === null || stage.classList.contains('is-zoomed')) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50 && fotos.length > 1) mostrarFoto(atual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------------- Janela de detalhes ---------------- */
  function openItem(entry) {
    const { tab, cat, item } = entry;
    const body = dialog.querySelector('.guia-dialog-body');
    body.replaceChildren();

    const tag = document.createElement('span');
    tag.className = 'guia-dialog-tag';
    tag.textContent = `${cat.icone} ${cat.nome}`;

    const title = document.createElement('h3');
    title.className = 'guia-dialog-title';
    title.id = 'guiaDialogTitle';
    title.textContent = item.titulo;

    const resumo = document.createElement('p');
    resumo.className = 'guia-dialog-resumo';
    resumo.textContent = item.resumo || '';

    body.append(tag, title, resumo);

    // Foto (ou aviso de que ainda está sendo tirada)
    const foto = document.createElement('div');
    foto.className = 'guia-foto';
    if (item.foto && !item.rota) {   // com rota, a foto final já aparece no último passo
      const img = document.createElement('img');
      img.src = item.foto;
      img.alt = `Foto: ${item.titulo}`;
      img.loading = 'lazy';
      img.onerror = () => { foto.classList.add('is-empty'); foto.textContent = '📷 Foto não encontrada'; };
      foto.appendChild(zoomButton(img, [{ src: item.foto, legenda: item.titulo }], 0));
    } else if (tab === 'localizacao') {
      foto.classList.add('is-empty');
      foto.textContent = '📷 Foto em breve – o time está fotografando o campus';
    }
    if (!item.rota && (item.foto || tab === 'localizacao')) body.appendChild(foto);

    if (tab === 'localizacao') {
      const onde = document.createElement('p');
      onde.className = 'guia-onde';
      const strong = document.createElement('strong');
      strong.textContent = 'Onde fica: ';
      onde.append(strong, item.onde || 'local em levantamento.');
      body.appendChild(onde);
    }

    if (item.rota && item.rota.length) {
      const h = document.createElement('h4');
      h.className = 'guia-dialog-sub';
      h.textContent = 'Como chegar';
      const ol = document.createElement('ol');
      ol.className = 'guia-rota';
      const lista = item.rota.map((passo, i) => ({ src: passo.foto, legenda: `Passo ${i + 1}: ${passo.texto}` }));
      item.rota.forEach((passo, i) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = passo.foto;
        img.alt = `Passo ${i + 1}: ${passo.texto}`;
        img.loading = 'lazy';
        const p = document.createElement('p');
        const n = document.createElement('span');
        n.className = 'guia-rota-num';
        n.textContent = i + 1;
        p.append(n, passo.texto);
        li.append(zoomButton(img, lista, i), p);
        ol.appendChild(li);
      });
      body.append(h, ol);
    }

    if (item.passos && item.passos.length) {
      const h = document.createElement('h4');
      h.className = 'guia-dialog-sub';
      h.textContent = 'Passo a passo';
      const ol = document.createElement('ol');
      ol.className = 'guia-passos';
      item.passos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        ol.appendChild(li);
      });
      body.append(h, ol);
    }

    if (item.dica) {
      const dica = document.createElement('p');
      dica.className = 'guia-dica';
      dica.textContent = `💡 ${item.dica}`;
      body.appendChild(dica);
    }

    if (item.revisado === false) {
      const aviso = document.createElement('p');
      aviso.className = 'guia-aviso';
      aviso.textContent = 'Passo a passo em revisão: os nomes dos menus podem mudar um pouco no app uLife.';
      body.appendChild(aviso);
    }

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  dialog?.querySelector('.guia-dialog-close')?.addEventListener('click', () => dialog.close());
  // Clique fora do cartão fecha (ESC já é nativo do <dialog>)
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  /* ---------------- Colunas por categoria ---------------- */
  function renderGuia(root) {
    const tab = root.dataset.guia;
    const categorias = DATA[tab];
    const input = root.querySelector('.guia-search input');
    const columns = root.querySelector('.guia-columns');
    const count = root.querySelector('.guia-count');
    const empty = root.querySelector('.guia-empty');
    const clear = root.querySelector('.guia-clear');

    bindStatus(root.querySelector('.ia-status'));

    function draw() {
      const q = input.value.trim();
      if (!q) return paint(null, '');
      search(q, tab, (results) => paint(results, q));
    }

    function paint(results, q) {
      const score = results ? new Map(results.map(r => [r.entry.item, r.score])) : null;
      columns.replaceChildren();
      let total = 0;

      // Na busca, as colunas e os itens mais relevantes vêm primeiro
      const cats = categorias
        .map(cat => {
          const itens = score
            ? cat.itens.filter(i => score.has(i)).sort((a, b) => score.get(b) - score.get(a))
            : cat.itens;
          return { cat, itens, best: itens.length && score ? score.get(itens[0]) : 0 };
        })
        .filter(c => c.itens.length);
      if (score) cats.sort((a, b) => b.best - a.best);

      cats.forEach(({ cat, itens }) => {
        total += itens.length;

        const col = document.createElement('section');
        col.className = 'guia-col';
        const head = document.createElement('h3');
        head.className = 'guia-col-title';
        const icon = document.createElement('span');
        icon.className = 'guia-col-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = cat.icone;
        const name = document.createElement('span');
        name.textContent = cat.nome;
        const n = document.createElement('span');
        n.className = 'guia-col-count';
        n.textContent = itens.length;
        head.append(icon, name, n);

        const ul = document.createElement('ul');
        ul.className = 'guia-list';
        itens.forEach(item => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'guia-item';
          const t = document.createElement('span');
          t.className = 'guia-item-title';
          t.textContent = item.titulo;
          const r = document.createElement('span');
          r.className = 'guia-item-resumo';
          r.textContent = item.resumo || '';
          if (item.foto) {
            const thumb = document.createElement('img');
            thumb.className = 'guia-item-thumb';
            thumb.src = item.foto;
            thumb.alt = '';
            thumb.loading = 'lazy';
            btn.classList.add('has-thumb');
            btn.append(thumb);
          }
          btn.append(t, r);
          btn.addEventListener('click', () => openItem({ tab, cat, item }));
          li.appendChild(btn);
          ul.appendChild(li);
        });

        col.append(head, ul);
        columns.appendChild(col);
      });

      empty.hidden = total > 0;
      clear.hidden = !q;
      count.textContent = q ? `${total} resultado${total === 1 ? '' : 's'} para “${q}”` : '';
    }

    input.addEventListener('input', draw);
    input.addEventListener('focus', () => { if (Busca.podeLigarSozinha()) Busca.ativarIA(); }, { once: true });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { input.value = ''; draw(); }
      if (e.key === 'Enter') {
        e.preventDefault();
        root.querySelector('.guia-item')?.click();
      }
    });
    clear.addEventListener('click', () => { input.value = ''; draw(); input.focus(); });
    root.querySelectorAll('.guia-chip').forEach(chip => chip.addEventListener('click', () => {
      input.value = chip.textContent;
      draw();
      input.focus();
    }));
    // Se a IA terminar de carregar com uma busca digitada, refaz já com a IA
    Busca.onStatus(({ state }) => { if (state === 'ready' && input.value.trim()) draw(); });
    draw();
  }

  document.querySelectorAll('.guia[data-guia]').forEach(renderGuia);

  /* ---------------- Busca geral (barra lateral) ---------------- */
  const globalInput = document.getElementById('inputSemanticSearch');
  const globalList = document.getElementById('globalSearchResults');
  if (!globalInput || !globalList) return;
  bindStatus(document.getElementById('globalIaStatus'));

  let results = [];
  let active = -1;

  function openResult(entry) {
    document.querySelector(`.nav-tab-button[data-tab="${entry.tab}"]`)?.click();
    closeGlobal();
    openItem(entry);
  }

  function closeGlobal() {
    globalList.hidden = true;
    globalInput.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function drawGlobal() {
    const q = globalInput.value.trim();
    if (!q) { closeGlobal(); return; }
    search(q, null, (r) => paintGlobal(r.slice(0, 8).map(x => x.entry)));
  }

  function paintGlobal(list) {
    results = list;
    if (active >= results.length) active = -1;
    globalList.replaceChildren();

    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'global-empty';
      li.textContent = 'Nada encontrado. Tente outra palavra, como “banheiro” ou “certificado”.';
      globalList.appendChild(li);
    }
    results.forEach((entry, i) => {
      const li = document.createElement('li');
      li.id = `gsr-${i}`;
      li.setAttribute('role', 'option');
      li.className = 'global-result' + (i === active ? ' is-active' : '');
      li.setAttribute('aria-selected', i === active);
      const t = document.createElement('strong');
      t.textContent = entry.item.titulo;
      const meta = document.createElement('span');
      meta.textContent = `${TAB_NAMES[entry.tab]} · ${entry.cat.nome}`;
      li.append(t, meta);
      li.addEventListener('mousedown', (e) => { e.preventDefault(); openResult(entry); });
      globalList.appendChild(li);
    });
    globalList.hidden = false;
    globalInput.setAttribute('aria-expanded', 'true');
    globalInput.setAttribute('aria-activedescendant', active >= 0 ? `gsr-${active}` : '');
  }

  globalInput.addEventListener('input', () => { active = -1; drawGlobal(); });
  globalInput.addEventListener('focus', () => {
    if (Busca.podeLigarSozinha()) Busca.ativarIA();
    drawGlobal();
  });
  globalInput.addEventListener('blur', () => setTimeout(closeGlobal, 120));
  globalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      paintGlobal(results);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const entry = results[active >= 0 ? active : 0];
      if (entry) openResult(entry);
    } else if (e.key === 'Escape') {
      globalInput.value = '';
      closeGlobal();
    }
  });
})();
