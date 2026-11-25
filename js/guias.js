/**
 * Wiki Una - Guias em colunas com busca (abas Localização e Ambiente virtual)
 * e busca geral da barra lateral. O conteúdo vem de js/conteudo.js.
 */
(function () {
  'use strict';

  const DATA = window.WIKI_CONTEUDO;
  if (!DATA) return;

  const TAB_NAMES = { localizacao: 'Localização', ambiente: 'Ambiente virtual', projetos: 'Projetos' };
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
    const leve = Busca.buscarPerto(query, tab);
    render(leve.results, false, leve.local);
    Busca.buscarIAPerto(query, tab).then(r => {
      if (r && search.last === token) render(r.results, true, r.local);
    }).catch(() => {});
  }

  /* Chip da IA dentro do campo de busca (Nielsen #1: status sempre visível, sem poluir) */
  function bindChip(btn) {
    if (!btn) return;
    btn.addEventListener('click', () => Busca.ativarIA());
    Busca.onStatus(({ state, progress }) => {
      btn.dataset.state = state;
      btn.disabled = state === 'loading' || state === 'ready';
      btn.textContent = {
        ready: '✨ IA ativa',
        loading: `✨ ${progress || 0}%`,
        error: '✨ Tentar IA de novo',
        off: '✨ Ativar IA'
      }[state];
      btn.title = {
        ready: 'Busca com IA ativa: entende frases como “onde fica o banheiro?”',
        loading: 'Preparando a IA (só na primeira vez)…',
        error: 'A IA não carregou. A busca normal continua funcionando.',
        off: 'Liga a busca com IA (baixa ~118 MB uma vez). A busca normal já funciona sem ela.'
      }[state];
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

  /* Selos do card (aba Projetos): o que ganha, quem pode e quando abre */
  const SELOS = [['horas', '⏱️'], ['quem', '👥'], ['inscricao', '🗓️']];
  function criarSelos(item) {
    if (!item.selos) return null;
    const box = document.createElement('span');
    box.className = 'guia-selos';
    SELOS.forEach(([tipo, icone]) => {
      if (!item.selos[tipo]) return;
      const s = document.createElement('span');
      s.className = `guia-selo is-${tipo}`;
      s.textContent = `${icone} ${item.selos[tipo]}`;
      box.appendChild(s);
    });
    return box;
  }

  /* Situação da inscrição (aba Projetos, calculada pela data de hoje em js/projetos.js) */
  function criarStatus(item, comFonte) {
    const st = window.WikiProjetos && window.WikiProjetos.statusDe(item);
    if (!st) return null;
    if (!comFonte && st.cls === 'info') return null; // no card, o selo 🗓️ já diz isso
    const s = document.createElement('span');
    s.className = `proj-status is-${st.cls}`;
    s.textContent = st.label;
    if (!comFonte || !st.fonte) return s;
    const p = document.createElement('p');
    p.className = 'proj-status-linha';
    const f = document.createElement('small');
    f.append(' Fonte: ');
    if (st.fonte.url) {
      const a = document.createElement('a');
      a.href = st.fonte.url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = st.fonte.texto;
      f.append(a);
    } else f.append(st.fonte.texto);
    p.append(s, f);
    return p;
  }

  /* ---------------- Janela de detalhes ---------------- */
  const LOCAIS = window.WIKI_LOCAIS || [];

  function openItem(entry, fromLink, local) {
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
    const selosDialog = criarSelos(item);
    if (selosDialog) body.appendChild(selosDialog);
    const statusDialog = criarStatus(item, true);
    if (statusDialog) body.appendChild(statusDialog);

    // Foto (ou aviso de que ainda está sendo tirada)
    const foto = document.createElement('div');
    foto.className = 'guia-foto';
    const rotas = item.rotas || (item.rota ? [{ nome: 'Como chegar', passos: item.rota }] : []);
    if (item.foto && !rotas.length) {   // com rota, a foto final já aparece no último passo
      const img = document.createElement('img');
      img.src = item.foto;
      img.alt = `Foto: ${item.titulo}`;
      img.loading = 'lazy';
      img.onerror = () => { foto.classList.add('is-empty'); foto.textContent = '📷 Foto não encontrada'; };
      foto.appendChild(zoomButton(img, [{ src: item.foto, legenda: item.titulo }], 0));
    } else if (tab === 'localizacao') {
      foto.classList.add('is-empty');
      foto.textContent = '📷 Foto em breve';
    }
    if (!rotas.length && (item.foto || tab === 'localizacao')) body.appendChild(foto);

    if (tab === 'localizacao') {
      const onde = document.createElement('p');
      onde.className = 'guia-onde';
      const strong = document.createElement('strong');
      strong.textContent = 'Onde fica: ';
      onde.append(strong, item.onde || 'local em levantamento.');
      body.appendChild(onde);
    } else if (tab === 'projetos' && item.onde) {
      const onde = document.createElement('p');
      onde.className = 'guia-onde';
      const strong = document.createElement('strong');
      strong.textContent = 'Onde no uLife: ';
      onde.append(strong, item.onde);
      body.appendChild(onde);
    }

    // Vários caminhos marcados com "perto": a pessoa escolhe onde está e o mais perto vem primeiro
    const locaisDoItem = LOCAIS.filter(l => rotas.some(r => (r.perto || []).includes(l.id)));
    const rotasBox = document.createElement('div');
    if (rotas.length > 1 && locaisDoItem.length > 1) {
      const onde = document.createElement('div');
      onde.className = 'guia-perto';
      onde.setAttribute('role', 'group');
      onde.setAttribute('aria-label', 'Onde você está agora?');
      const lbl = document.createElement('span');
      lbl.textContent = '📍 Onde você está?';
      onde.appendChild(lbl);
      const chips = locaisDoItem.map(l => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'guia-perto-chip';
        b.textContent = l.nome;
        b.setAttribute('aria-pressed', !!local && local.id === l.id);
        b.addEventListener('click', () => {
          const ativo = b.getAttribute('aria-pressed') === 'true';
          chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
          b.setAttribute('aria-pressed', String(!ativo));
          desenharRotas(ativo ? null : l);
        });
        onde.appendChild(b);
        return b;
      });
      body.appendChild(onde);
    }
    body.appendChild(rotasBox);

    function desenharRotas(perto) {
      rotasBox.replaceChildren();
      const ordem = perto
        ? [...rotas.filter(r => (r.perto || []).includes(perto.id)), ...rotas.filter(r => !(r.perto || []).includes(perto.id))]
        : rotas;
      ordem.forEach(r => desenharRota(r, perto && (r.perto || []).includes(perto.id)));
      if (perto && !ordem.some(r => (r.perto || []).includes(perto.id))) {
        const aviso = document.createElement('p');
        aviso.className = 'guia-perto-aviso';
        aviso.textContent = `Nenhuma destas opções fica perto de ${perto.nome}. Veja todas abaixo ou busque de novo.`;
        rotasBox.prepend(aviso);
      }
    }

    function desenharRota({ nome, passos }, maisPerto) {
      const h = document.createElement('h4');
      h.className = 'guia-dialog-sub' + (maisPerto ? ' is-perto' : '');
      h.textContent = nome;
      if (maisPerto) {
        const selo = document.createElement('span');
        selo.className = 'guia-perto-selo';
        selo.textContent = '📍 Mais perto de você';
        h.appendChild(selo);
      }
      const ol = document.createElement('ol');
      // prints de tela aparecem inteiros; fotos do campus podem ser recortadas
      ol.className = tab === 'localizacao' ? 'guia-rota' : 'guia-rota is-print';
      const lista = passos.map((passo, i) => ({ src: passo.foto, legenda: `${nome} – passo ${i + 1}: ${passo.texto}` }));
      passos.forEach((passo, i) => {
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
      rotasBox.append(h, ol);
    }
    desenharRotas(local && locaisDoItem.some(l => l.id === local.id) ? local : null);

    if (item.passos && item.passos.length) {
      const h = document.createElement('h4');
      h.className = 'guia-dialog-sub';
      // com rota de prints acima, a lista de texto explica o programa
      h.textContent = rotas.length ? 'Como funciona' : 'Passo a passo';
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

    // Sites oficiais (abrem em outra aba)
    if (item.links && item.links.length) {
      const box = document.createElement('div');
      box.className = 'guia-links';
      item.links.forEach(({ url, texto }) => {
        const a = document.createElement('a');
        a.className = 'guia-link';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = `${texto} ↗`;
        box.appendChild(a);
      });
      body.appendChild(box);
    }

    if (item.revisado === false) {
      const aviso = document.createElement('p');
      aviso.className = 'guia-aviso';
      aviso.textContent = 'Passo a passo em revisão: os nomes dos menus podem mudar um pouco no app uLife.';
      body.appendChild(aviso);
    }

    // aba Projetos: adicionar à agenda (se tem evento) e salvar em "Meus projetos"
    if (tab === 'projetos' && window.WikiProjetos) {
      const acoes = document.createElement('div');
      acoes.className = 'proj-acoes-dialog';
      const ag = window.WikiProjetos.botaoAgenda(item);
      const fav = window.WikiProjetos.botaoFavorito(item, 'texto');
      [ag, fav].forEach(b => b && acoes.appendChild(b));
      if (acoes.children.length) body.appendChild(acoes);
    }

    // Compartilhar: manda o link direto deste item
    const share = document.createElement('button');
    share.type = 'button';
    share.className = 'guia-share';
    share.textContent = '🔗 Compartilhar';
    share.addEventListener('click', async () => {
      const url = `${location.origin}${location.pathname}#${tab}/${item.id}`;
      try {
        if (navigator.share && matchMedia('(pointer: coarse)').matches) {
          await navigator.share({ title: `Wiki Una – ${item.titulo}`, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        share.textContent = '✓ Link copiado!';
      } catch (e) {
        share.textContent = 'Não deu para copiar';
      }
      setTimeout(() => { share.textContent = '🔗 Compartilhar'; }, 2200);
    });
    body.appendChild(share);

    // O item vai para o endereço; o botão Voltar do celular fecha a janela
    const hash = `#${tab}/${item.id}`;
    if (!fromLink && location.hash !== hash) history.pushState({ wikiItem: true }, '', hash);

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    body.scrollTop = 0;
  }

  dialog?.addEventListener('close', () => {
    const tabHash = `#${location.hash.slice(1).split('/')[0]}`;
    if (history.state && history.state.wikiItem) history.back();
    else if (location.hash.includes('/')) history.replaceState(null, '', tabHash);
  });
  window.addEventListener('popstate', () => {
    if (dialog.open && !location.hash.includes('/')) dialog.close();
  });

  // Abre o item de um link (ex.: #localizacao/cac), inclusive links da aba Ajuda
  function openFromHash() {
    const [tab, idLink] = location.hash.slice(1).split('/');
    const id = { coordenacao: 'secretaria' }[idLink] || idLink; // links antigos de itens que foram unidos
    if (!id) {   // voltou para uma aba (ex.: botão Voltar depois de um link da Ajuda)
      if (window.wikiActivateTab && document.getElementById(`content-${tab}`)) window.wikiActivateTab(tab);
      return;
    }
    const entry = index.find(e => e.tab === tab && e.item.id === id);
    if (!entry) return;
    if (window.wikiActivateTab) window.wikiActivateTab(tab);
    if (!dialog.open) openItem(entry, true);
  }
  window.addEventListener('hashchange', openFromHash);

  // Abre um item direto (usado pelas ferramentas da aba Projetos, em js/projetos.js)
  window.wikiAbrirItem = (tab, id) => {
    const entry = index.find(e => e.tab === tab && e.item.id === id);
    if (!entry) return false;
    if (dialog.open) dialog.close();
    openItem(entry, false);
    return true;
  };

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

    bindChip(root.querySelector('.ia-chip'));

    // Filtro por categoria (Todos | Banheiros | …)
    let filtro = null;
    const cats = root.querySelector('.guia-cats');
    const catBtns = [{ id: null, nome: 'Todos', icone: '✦' }, ...categorias].map(cat => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'guia-cat';
      b.setAttribute('aria-pressed', cat.id === null);
      const ic = document.createElement('span');
      ic.setAttribute('aria-hidden', 'true');
      ic.textContent = cat.icone;
      b.append(ic, cat.nome);
      b.addEventListener('click', () => {
        filtro = cat.id;
        catBtns.forEach(x => x.setAttribute('aria-pressed', x === b));
        draw();
      });
      cats.appendChild(b);
      return b;
    });
    const comFoto = tab === 'localizacao'; // lugares sempre mostram miniatura (ou o espaço dela)
    // data-layout="cards": cada categoria vira uma faixa com os itens em cards lado a lado
    if (root.dataset.layout === 'cards') columns.classList.add('is-cards');

    function draw() {
      const q = input.value.trim();
      if (!q) return paint(null, '');
      search(q, tab, (results, ia, local) => paint(results, q, local));
    }

    function paint(results, q, local) {
      // posição na busca (respeita a ordem de "mais perto"), não só a nota
      const score = results ? new Map(results.map((r, i) => [r.entry.item, results.length - i])) : null;
      columns.replaceChildren();
      let total = 0;

      // Na busca, as colunas e os itens mais relevantes vêm primeiro
      const lista = categorias
        .filter(cat => !filtro || cat.id === filtro)
        .map(cat => {
          const itens = score
            ? cat.itens.filter(i => score.has(i)).sort((a, b) => score.get(b) - score.get(a))
            : cat.itens;
          return { cat, itens, best: itens.length && score ? score.get(itens[0]) : 0 };
        })
        .filter(c => c.itens.length);
      if (score) lista.sort((a, b) => b.best - a.best);

      lista.forEach(({ cat, itens }) => {
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
        col.appendChild(head);
        if (cat.desc) {
          const desc = document.createElement('p');
          desc.className = 'guia-col-desc';
          desc.textContent = cat.desc;
          col.appendChild(desc);
        }

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
          const fotoThumb = item.foto || (item.rota && item.rota[item.rota.length - 1].foto);
          if (comFoto) {
            let thumb;
            if (fotoThumb) {
              thumb = document.createElement('img');
              thumb.src = fotoThumb;
              thumb.alt = '';
              thumb.loading = 'lazy';
            } else {
              thumb = document.createElement('span');
              thumb.classList.add('is-empty');
              thumb.setAttribute('aria-hidden', 'true');
              thumb.textContent = '📷';
            }
            thumb.classList.add('guia-item-thumb');
            btn.classList.add('has-thumb');
            btn.append(thumb);
          }
          const txt = document.createElement('span');
          txt.className = 'guia-item-text';
          txt.append(t, r);
          const selos = criarSelos(item);
          if (selos) txt.appendChild(selos);
          const status = criarStatus(item, false);
          if (status) txt.appendChild(status);
          btn.append(txt);
          if (local && Busca.pertoDe(item, local.id)) {
            const selo = document.createElement('span');
            selo.className = 'guia-perto-selo';
            selo.textContent = `📍 Perto de: ${local.nome}`;
            txt.appendChild(selo);
          }
          btn.addEventListener('click', () => openItem({ tab, cat, item }, false, local));
          li.appendChild(btn);
          // aba Projetos: estrela para salvar em "Meus projetos" (fora do botão do card)
          if (tab === 'projetos' && window.WikiProjetos) {
            const fav = window.WikiProjetos.botaoFavorito(item);
            if (fav) { li.classList.add('has-fav'); li.appendChild(fav); }
          }
          ul.appendChild(li);
        });

        col.appendChild(ul);
        columns.appendChild(col);
      });

      // as colunas entram uma a uma, de leve
      columns.querySelectorAll('.guia-col').forEach((c, i) => c.style.setProperty('--i', i));
      empty.hidden = total > 0;
      clear.hidden = !q;
      count.textContent = q
        ? `${total} resultado${total === 1 ? '' : 's'} para “${q}”` + (local ? ` · os mais perto de ${local.nome} primeiro` : '')
        : '';
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
    // Se a IA terminar de carregar com uma busca digitada, refaz já com a IA
    Busca.onStatus(({ state }) => { if (state === 'ready' && input.value.trim()) draw(); });
    draw();
  }

  document.querySelectorAll('.guia[data-guia]').forEach(renderGuia);

  /* ---------------- Busca geral (barra lateral) ---------------- */
  const globalInput = document.getElementById('inputSemanticSearch');
  const globalList = document.getElementById('globalSearchResults');
  if (!globalInput || !globalList) return;
  openFromHash();

  // Atalho "/" para buscar de qualquer lugar (Nielsen #7: atalhos para quem já conhece)
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const el = document.activeElement;
    if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;
    if (document.querySelector('dialog[open]')) return;
    const aba = document.querySelector('.tab-content-panel.active .guia-search input');
    const alvo = aba || (globalInput.offsetParent ? globalInput : null);
    if (!alvo) return;
    e.preventDefault();
    alvo.focus();
  });

  let results = [];
  let active = -1;
  let globalLocal = null;

  function openResult(entry) {
    document.querySelector(`.nav-tab-button[data-tab="${entry.tab}"]`)?.click();
    closeGlobal();
    openItem(entry, false, globalLocal);
  }

  function closeGlobal() {
    globalList.hidden = true;
    globalInput.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function drawGlobal() {
    const q = globalInput.value.trim();
    if (!q) { closeGlobal(); return; }
    search(q, null, (r, ia, local) => { globalLocal = local; paintGlobal(r.slice(0, 8).map(x => x.entry)); });
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
      meta.textContent = `${TAB_NAMES[entry.tab]} · ${entry.cat.nome}`
        + (globalLocal && Busca.pertoDe(entry.item, globalLocal.id) ? ` · 📍 perto de ${globalLocal.nome}` : '');
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
