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

  // "Laboratório" e "laboratorio" devem achar a mesma coisa
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // Índice plano de todos os itens, para as buscas
  const index = [];
  Object.entries(DATA).forEach(([tab, categorias]) => {
    categorias.forEach(cat => cat.itens.forEach(item => {
      index.push({
        tab, cat, item,
        texto: norm([item.titulo, item.resumo, cat.nome, item.onde, ...(item.buscas || [])].join(' '))
      });
    }));
  });

  function matches(entry, query) {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return words.every(w => entry.texto.includes(w));
  }

  function search(query, tab) {
    return index.filter(e => (!tab || e.tab === tab) && matches(e, query));
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
    if (item.foto) {
      const img = document.createElement('img');
      img.src = item.foto;
      img.alt = `Foto: ${item.titulo}`;
      img.loading = 'lazy';
      img.onerror = () => { foto.classList.add('is-empty'); foto.textContent = '📷 Foto não encontrada'; };
      foto.appendChild(img);
    } else if (tab === 'localizacao') {
      foto.classList.add('is-empty');
      foto.textContent = '📷 Foto em breve – o time está fotografando o campus';
    }
    if (item.foto || tab === 'localizacao') body.appendChild(foto);

    if (tab === 'localizacao') {
      const onde = document.createElement('p');
      onde.className = 'guia-onde';
      const strong = document.createElement('strong');
      strong.textContent = 'Onde fica: ';
      onde.append(strong, item.onde || 'local em levantamento.');
      body.appendChild(onde);
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

    function draw() {
      const q = input.value.trim();
      const found = q ? new Set(search(q, tab).map(e => e.item)) : null;
      columns.replaceChildren();
      let total = 0;

      categorias.forEach(cat => {
        const itens = found ? cat.itens.filter(i => found.has(i)) : cat.itens;
        if (!itens.length) return;
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
    draw();
  }

  document.querySelectorAll('.guia[data-guia]').forEach(renderGuia);

  /* ---------------- Busca geral (barra lateral) ---------------- */
  const globalInput = document.getElementById('inputSemanticSearch');
  const globalList = document.getElementById('globalSearchResults');
  if (!globalInput || !globalList) return;

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
    results = search(q).slice(0, 8);
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
  globalInput.addEventListener('focus', drawGlobal);
  globalInput.addEventListener('blur', () => setTimeout(closeGlobal, 120));
  globalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      drawGlobal();
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
