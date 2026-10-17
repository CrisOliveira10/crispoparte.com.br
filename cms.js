/* Cris Pop Arte — carrega o conteúdo salvo no painel (data.json) e atualiza o site.
   Se data.json não existir, o site continua exibindo o conteúdo original do HTML. */
(async function () {
  let D = null;
  try {
    if (/[?&]preview/.test(location.search)) D = JSON.parse(localStorage.getItem('cpa_data') || 'null');
    else { const r = await fetch('data.json?v=' + Date.now(), { cache: 'no-store' }); if (r.ok) D = await r.json(); }
  } catch (e) {}
  if (!D || !D.cfg) return;

  const C = D.cfg, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // *itálico*  **negrito**  Enter = quebra de linha
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  const wa = (m) => 'https://wa.me/' + String(C.wpp || '').replace(/\D/g, '') + (m ? '?text=' + encodeURIComponent(m) : '');
  const isVid = s => /^data:video|\.(mp4|webm|mov|m4v|ogv)([?#]|$)/i.test(s || '');
  const yt = u => { u = (u || '').trim(); if (!u || u.includes('/embed/')) return u; let m;
    if ((m = u.match(/[?&]list=([\w-]+)/)) || (m = u.match(/^(PL[\w-]{10,})$/))) return 'https://www.youtube.com/embed/videoseries?list=' + m[1];
    if ((m = u.match(/(?:youtu\.be\/|[?&]v=|shorts\/)([\w-]{11})/)) || (m = u.match(/^([\w-]{11})$/))) return 'https://www.youtube.com/embed/' + m[1];
    return u; };
  const has = v => v !== undefined && v !== null;
  const html = (sel, v, root) => { const e = $(sel, root); if (e && has(v)) e.innerHTML = fmt(v); };
  const text = (sel, v, root) => { const e = $(sel, root); if (e && has(v)) e.textContent = v; };
  const setTxtNode = (a, t) => { [...a.childNodes].filter(n => n.nodeType === 3).forEach(n => n.remove()); a.append(' ' + t); };
  const link = (e, href) => { if (e && href) e.href = href; };

  /* ---------- Geral / topo ---------- */
  if (C.titulo_site) document.title = C.titulo_site;
  if (C.logo) $$('.nav-logo img, .hero-logo-wrap img').forEach(i => i.src = C.logo);
  $$('a[href^="https://wa.me/5571993233142"]').forEach(a => { if (!a.closest('.peca-card,.produto-card,.banner-cta-text,.hero-btns')) a.href = wa(''); });
  html('.hero-tag', C.hero_tag); html('.hero-title', C.hero_titulo); html('.hero-desc', C.hero_desc);
  const hb = $$('.hero-btns a');
  if (hb[0]) { hb[0].textContent = C.hero_btn1_txt || hb[0].textContent; link(hb[0], C.hero_btn1_link); }
  if (hb[1]) { hb[1].textContent = C.hero_btn2_txt || hb[1].textContent; hb[1].href = C.hero_btn2_link || wa(''); }
  const nl = $$('.nav-links a');
  ['nav1', 'nav2', 'nav3', 'nav4', 'nav_cta_txt'].forEach((k, i) => { if (nl[i] && C[k]) nl[i].textContent = C[k]; });
  link(nl[4], C.nav_cta_link);

  /* ---------- Peças ---------- */
  html('#pecas .section-tag', C.pecas_tag); html('#pecas .section-title', C.pecas_titulo);
  if (D.pecas_cats) {
    const bar = $('.pecas-categorias');
    bar.innerHTML = '<button class="pecas-cat-btn active" onclick="filtrarPecas(\'todos\',this)">Todos</button>' +
      D.pecas_cats.map(c => `<button class="pecas-cat-btn" onclick="filtrarPecas('${esc(c.slug)}',this)">${esc(c.label)}</button>`).join('');
  }
  if (D.pecas) {
    $('#pecasGrid').innerHTML = D.pecas.map((p, k) => {
      const i = k + 1, v = isVid(p.src);
      const midia = v ? `<video id="pecaVid${i}" src="${esc(p.src)}" preload="metadata" playsinline loop muted></video>
        <div class="peca-video-overlay" id="pecaOv${i}"><button class="peca-play-btn" onclick="togglePecaVid('pecaVid${i}','pecaOv${i}')" aria-label="Reproduzir"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg></button></div>
        <div class="peca-video-controls"><button class="pvc-btn" onclick="togglePecaVid('pecaVid${i}','pecaOv${i}')">
          <svg id="pvcPI${i}" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          <svg id="pvcPA${i}" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg></button>
          <div class="pvc-bar-wrap" onclick="seekPecaVid(event,'pecaVid${i}','pvcF${i}')"><div class="pvc-bg"></div><div class="pvc-fill" id="pvcF${i}"></div></div><span class="pvc-time" id="pvcT${i}">0:00</span></div>`
        : `<img src="${esc(p.src)}" alt="${esc((p.nome || '').replace(/\n/g, ' '))}" loading="lazy">`;
      const precos = (p.precos || []).map(x => `<span class="peca-preco-badge${x.verde ? ' verde' : ''}">${esc(x.t)}</span>` + (x.d ? `<p class="peca-desc-info">${esc(x.d)}</p>` : '')).join('');
      return `<div class="peca-card" data-categoria="${esc(p.cat)}">${p.badge ? `<span class="peca-badge ${p.badgeTipo === 'popular' ? 'popular' : 'mais-pedido'}">${esc(p.badge)}</span>` : ''}
        <div class="peca-info"><h3 class="peca-nome">${fmt(p.nome)}</h3><p class="peca-subtitulo">${fmt(p.sub)}</p>${precos}</div>
        <div class="peca-midia" style="min-height:300px;">${midia}</div>
        <div class="peca-footer"><a href="${esc(p.link || wa(p.msg))}" class="btn-wpp" target="_blank" rel="noopener noreferrer">${esc(p.btn || 'Encomendar')}</a></div></div>`;
    }).join('');
    D.pecas.forEach((p, k) => { if (isVid(p.src)) bindVid(k + 1); });
  }
  function bindVid(i) {
    const v = $('#pecaVid' + i), ov = $('#pecaOv' + i), fill = $('#pvcF' + i), tm = $('#pvcT' + i), pi = $('#pvcPI' + i), pa = $('#pvcPA' + i);
    const ui = playing => { ov.classList.toggle('hidden', playing); pi.style.display = playing ? 'none' : 'block'; pa.style.display = playing ? 'block' : 'none'; };
    v.muted = true;
    const w = v.closest('.peca-midia');
    w.addEventListener('mouseenter', () => { v.play().catch(() => {}); ui(true); });
    w.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; ui(false); });
    v.addEventListener('click', () => { v.muted = false; (v.requestFullscreen ? v : w).requestFullscreen?.(); v.play().catch(() => {}); });
    v.addEventListener('timeupdate', () => { if (!v.duration) return; fill.style.width = v.currentTime / v.duration * 100 + '%'; tm.textContent = Math.floor(v.currentTime / 60) + ':' + String(Math.floor(v.currentTime % 60)).padStart(2, '0'); });
    v.addEventListener('ended', () => ui(false));
  }

  /* ---------- Convites digitais ---------- */
  html('#produtos .section-tag', C.conv_tag); html('#produtos .section-title', C.conv_titulo);
  if (D.conv_cats) {
    const bar = $('#produtos .categorias');
    bar.innerHTML = '<button class="cat-btn active">Todos</button>' + D.conv_cats.map(c => `<button class="cat-btn">${esc(c.label)}</button>`).join('');
    bar.onclick = e => { const b = e.target.closest('.cat-btn'); if (!b) return;
      $$('.cat-btn', bar).forEach(x => x.classList.toggle('active', x === b));
      const f = b.textContent.trim().toLowerCase(), all = f === 'todos';
      $$('#grade-produtos .produto-card').forEach(c => c.style.display = all || c.dataset.cat.includes(f) ? '' : 'none'); };
  }
  if (D.conv) $('#grade-produtos').innerHTML = D.conv.map(p => `<article class="produto-card" data-cat="${esc((p.cat || '').toLowerCase())}">
      <div class="produto-img"><img src="${esc(p.img)}" alt="${esc(p.nome)}" loading="lazy">${p.link ? `<a class="produto-link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer"></a>` : ''}</div>
      <div class="produto-info"><span class="produto-categoria">${esc(p.cat)}</span><h3 class="produto-nome">${esc(p.nome)}</h3><p class="produto-desc">${esc(p.desc)}</p>
      <div class="produto-footer"><div class="produto-preco">${esc(p.preco)} <small>${esc(p.un)}</small></div>
      <a href="${esc(wa(p.msg))}" class="btn-wpp" target="_blank" rel="noopener noreferrer"><span>Encomendar</span></a></div></div></article>`).join('');

  /* ---------- Vídeo em destaque ---------- */
  html('#video-preview .section-tag', C.video_tag); html('#video-preview .section-title', C.video_titulo);
  const vp = $('#videoPlayer'); if (vp && C.video_src) { const s = $('source', vp); s.src = C.video_src; vp.load(); }

  /* ---------- Temas em vídeo ---------- */
  html('#catalogo-video .section-tag', C.temas_tag); html('#catalogo-video .section-title', C.temas_titulo);
  text('.catalogo-desc', C.temas_desc); text('.temas-destaque-titulo', C.temas_dest_titulo);
  const mb = $('#btn-mb'); if (mb && C.temas_mb_titulo) mb.firstChild.textContent = C.temas_mb_titulo + ' ';
  if (D.destaques) $('.temas-destaque-grid').innerHTML = D.destaques.map(d => `<div class="tema-destaque-card" data-playlist="${esc(yt(d.url))}" data-titulo="${esc(d.titulo)}" onclick="abrirPlaylist(this)">
      <img src="${esc(d.img)}" alt="${esc(d.titulo)}" loading="lazy"><span class="td-label">${esc(d.titulo)}</span><div class="td-play">▶</div></div>`).join('');
  if (D.mais) $('.mais-buscados-grid').innerHTML = D.mais.map(d => `<div class="tema-item" data-playlist="${esc(yt(d.url))}" data-titulo="${esc(d.titulo)}" onclick="abrirPlaylist(this)">${esc(d.titulo)}</div>`).join('');

  /* ---------- Avaliações ---------- */
  html('.avaliacoes-tag', C.aval_tag); html('.avaliacoes-title', C.aval_titulo); text('.avaliacoes-subtag p', C.aval_sub);
  if (D.aval) $('.avaliacoes-grid').innerHTML = D.aval.map(a => `<div class="avaliacao-card"><div class="avaliacao-estrelas">${'<span>★</span>'.repeat(Math.max(1, Math.min(5, +a.estrelas || 5)))}</div>
      <div class="avaliacao-aspas">"</div><p class="avaliacao-texto">${esc(a.texto)}</p><div class="avaliacao-autora"><strong>${esc(a.autora)}</strong>${a.tipo ? ' &mdash; ' + esc(a.tipo) : ''}</div></div>`).join('');

  /* ---------- Banner ---------- */
  html('.banner-cta-tag', C.banner_tag); html('.banner-cta-title', C.banner_titulo); html('.banner-cta-desc', C.banner_desc);
  const bb = $('.banner-cta-btn'); if (bb) { if (C.banner_btn) bb.textContent = C.banner_btn; bb.href = wa(C.banner_msg); }
  const bi = $('.banner-cta-img-wrap img'); if (bi && C.banner_img) bi.src = C.banner_img;

  /* ---------- Rodapé ---------- */
  html('.footer-tagline', C.f_tagline); html('.footer-cnpj', C.f_follow); html('.footer-horario', C.f_horario);
  text('.footer-bottom p', C.f_copy);
  $$('.footer-social-btn').forEach(a => { const k = 'r_' + (a.title || '').toLowerCase(); if (C[k]) a.href = C[k]; });
  const fc = $$('.footer-contact-item');
  if (fc[0]) { fc[0].href = wa(''); if (C.wpp_exibir) setTxtNode(fc[0], C.wpp_exibir); }
  if (fc[1] && C.email) { fc[1].href = 'mailto:' + C.email; setTxtNode(fc[1], C.email); }
  if (D.inst) $('.footer-nav-list').innerHTML = D.inst.map(it => `<li class="footer-acc-item"><button class="footer-acc-btn" onclick="toggleFooterAcc(this)"><span class="footer-acc-arrow">›</span> ${esc(it.t)}</button>
      <div class="footer-acc-body">${String(it.c || '').split(/\n\s*\n/).map(p => `<p>${fmt(p)}</p>`).join('')}</div></li>`).join('');
})();
