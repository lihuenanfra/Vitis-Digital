/* =========================================================
   Vitis Digital — interacciones
   Pestañas · celular con perfiles · chat de preguntas · regalos
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Configuración ---------- */
  var CONFIG = {
    whatsapp: '5492613878157', // +54 9 2613 87-8157
    whatsappMsg: 'Hola Vitis, quiero coordinar una reunión.',
    // URL de la app web de Google Apps Script que guarda los contactos en tu hoja (ver README).
    leadsEndpoint: 'https://script.google.com/macros/s/AKfycbzFH-K_8JBmJVIV38zmZEbSo-7UjcsMChXe9_da-QT8jzZhOqgzqtaKTRmSohxK8jnRgw/exec'
  };

  /* Datos reales de cada perfil, posts y me gusta (Instagram, 13/11/2026). Julie oculta sus me gusta. */
  var PROFILES = [
    {
      key: 'julie', label: 'Julie Cyvonne', handle: 'juliecyvonne', name: 'JULIE | Micro-dosing Mentor',
      bio: 'Former attorney → Certified Coach → Psychedelic Facilitator', category: 'Coach',
      posts: '1.362', followers: '2.967', following: '689',
      hl: ['Microdosing', 'Testimonials', 'Retreats', 'Testimonials'],
      likes: ["", "", "", "", "", "", "", "", ""],
      captions: ["➡️ swipey swipe for a vibe check 🤗 are we on the same 🌊 length?! ✨ let me know 🩷", "Swipe ➡️ to see what a retreat with me is like, what kind of women sign up, what makes them want to attend, what past attendees have to…", "What a girl wants: a retreat that doesn’t stop when you arrive at the airport and a plan to help you feel better when reality sets back…", "Part 2 💖", "As I write this, I’m sitting next to my mom getting ready to board a plane to celebrate her 70th birthday in Florida together", "We’re running it back!!!", "The road to hell is paved with good intentions…", "The final installment, kitten!!!", "I know my role, and I play it well"]
    },
    {
      key: 'af', label: 'Aesthetic Fitness', handle: 'aestheticfitnessmendoza', name: 'Aesthetic Fitness | ElectroFitness • Thermocycling • Estética',
      bio: 'Transformá tu cuerpo en poco tiempo. Quema grasa, tonifica y más.', category: 'Martínez de Rosas 755, Mendoza',
      posts: '667', followers: '12,9 mil', following: '3.519',
      hl: ['Electrofitness', 'Clientes', 'Thermocycling', 'Depi Definitiva'],
      likes: ["30", "64", "73", "4", "118", "28", "14", "14", "31"],
      captions: ["No te pierdas esta promo para llegar al verano sintiendote tu mejor version!✨", "❌Derrotamos la excusa del “no tengo tiempo”.", "✨ El entrenamiento no tiene que ser aburrido ni eterno. Lo importante es encontrar una forma de ejercitarte que se adapte a tu estilo de…", "¿Querés bajar de peso o eliminar una grasa que no se va con dieta? 🤔", "Hoy le agradecemos al Papa que Mai vino 🙌🙏", "El equipo de marketing amenazó con renunciar si no venían a entrenar hoy. 🤣😭", "Ya llevamos el 80% del año 2026 y vos todavía no viniste a entrenar!", "Capítulo final de nuestra serie aniversario🫶", "🔥 Oferta Express de Thermo 🔥"]
    },
    {
      key: 'sofi', label: 'Sofi Nutri', handle: 'nutrisofi.ok', name: 'Lic. Sofía Cañadas | Nutrición Clínica y Deportiva',
      bio: 'Transformá tu bienestar con un enfoque integral. Nutrición deportiva, funcional y para regulación hormonal.', category: 'Nutricionista',
      posts: '228', followers: '2.315', following: '591',
      hl: ['Peso', 'Dietas', 'Invierno', 'Horarios'],
      likes: ["96", "155", "25", "46", "36", "30", "42", "19", "46"],
      captions: ["📢 ¡Descubrí todo lo que una consulta nutricional puede hacer por vos! 🌟", "¿Nunca fuiste a una consulta nutricional? 🤔", "Que un alimento sea saludable no significa que puedas comerlo sin medida. Algunos son muy nutritivos, pero también muy calóricos, y sin…", "Eat & Run presenta:", "El colesterol alto no da síntomas… hasta que es tarde 🫀", "No todo salió como esperaba. Pero no todo fue en vano.", "Arrancar un nuevo mes no tiene que ser sinónimo de restricciones imposibles ni de castigos en el plato.", "La menopausia no tiene por qué ser una etapa de dietas cada vez más estrictas.", "La balanza es solo un número, no el resumen de todo tu proceso. ⚖️"]
    }
  ];

  var FAQS = [
    { q: '¿Cuánto cuesta trabajar con ustedes?', a: 'Cada plan es a medida. Después de una primera reunión te enviamos la propuesta con el valor por WhatsApp, según lo que necesite tu marca.' },
    { q: '¿La pauta está incluida?', a: 'La inversión en pauta (lo que se le paga a Meta) va aparte y la definís vos. Nosotras armamos las campañas, las seguimos y te contamos los resultados.' },
    { q: '¿Cuánto tengo que invertir en pauta?', a: 'Depende de tu objetivo y de tu zona. En la reunión te recomendamos un monto inicial y lo ajustamos mes a mes con los resultados.' },
    { q: '¿Cuándo empiezo a ver resultados?', a: 'Los primeros cambios se notan en las primeras semanas. Cada mes te enviamos un reporte con lo que funcionó y lo que ajustamos.' },
    { q: '¿Trabajan con marcas de otros países?', a: 'Sí. Trabajamos de forma remota con marcas de Argentina y del exterior, en español y en inglés.' }
  ];

  var RESOURCES = [
    { title: 'Calendario de contenido mensual', meta: 'PDF · 5 páginas · para completar', desc: 'Organizá tus publicaciones en 4 semanas con una regla simple de reparto: educar, conectar, mostrar y vender.', includes: ['La regla de reparto para cada 10 publicaciones', 'Planner semana a semana con pilar, formato y tema', 'Revisión de fin de mes'], href: 'regalos/calendario-de-contenido-mensual.pdf', img: 'img/regalos/calendario.jpg' },
    { title: '30 ganchos para Reels que frenan el scroll', meta: 'PDF · 5 páginas · plantillas', desc: 'Plantillas para completar con tu negocio y empezar tus videos con fuerza desde los primeros 2 segundos.', includes: ['30 ganchos en 6 categorías', 'Ejemplos aplicados a distintos rubros', 'Qué tiene un buen gancho'], href: 'regalos/30-ganchos-para-reels.pdf', img: 'img/regalos/ganchos.jpg' },
    { title: 'Autodiagnóstico de tu perfil de Instagram', meta: 'PDF · 4 páginas · 10 minutos', desc: '10 criterios, una puntuación y 3 mejoras concretas para empezar hoy.', includes: ['10 criterios con puntaje de 0 a 2', 'Qué significa tu resultado', 'Tus 3 mejoras prioritarias'], href: 'regalos/autodiagnostico-perfil-instagram.pdf', img: 'img/regalos/autodiagnostico.jpg' }
  ];

  /* ---------- Utilidades ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(name, fill, size) {
    return '<svg class="ic' + (fill ? ' ic--fill' : '') + '"' + (size ? ' style="--s:' + size + 'px"' : '') + '><use href="#i-' + name + '"/></svg>';
  }
  function ph(src, label) {
    return '<div class="ph"><img src="' + esc(src) + '" alt="' + esc(label) + '" onerror="this.remove()"><span>' + esc(label) + '</span></div>';
  }

  /* ---------- WhatsApp ---------- */
  var waLink = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.whatsappMsg);
  $$('[data-wa]').forEach(function (a) {
    a.href = waLink;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Pestañas ---------- */
  var tabs = $$('.tab');
  var panels = $$('[data-panel]');
  var folder = $('#carpeta');

  function goTab(id, scroll) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
    if (folder) folder.classList.toggle('is-home', id === 'inicio');
    if (scroll !== false && folder && folder.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: window.scrollY + folder.getBoundingClientRect().top - 90, behavior: 'smooth' });
    }
    if (history.replaceState) history.replaceState(null, '', id === 'inicio' ? location.pathname : '#' + id);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { goTab(t.getAttribute('data-tab')); }); });
  $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { goTab(b.getAttribute('data-go')); }); });
  $$('[data-tab-link]').forEach(function (a) { a.addEventListener('click', function () { goTab(a.getAttribute('data-tab-link')); }); });

  if (folder) folder.classList.add('is-home');
  var initial = (location.hash || '').replace('#', '');
  if (['trabajos', 'servicios', 'recursos', 'preguntas', 'juego'].indexOf(initial) > -1) goTab(initial, false);

  /* ---------- Letras en bolitas (Servicios) ---------- */
  $$('[data-beads]').forEach(function (el) {
    el.innerHTML = el.getAttribute('data-beads').split('').map(function (ch) {
      return '<span class="bead">' + esc(ch) + '</span>';
    }).join('');
    el.setAttribute('aria-label', el.getAttribute('data-beads'));
  });

  /* ---------- Ventanas (formulario de descarga y pop up de salida) ---------- */
  var lastFocus = null;
  function openModal(m) { lastFocus = document.activeElement; m.hidden = false; document.body.classList.add('has-modal'); var f = m.querySelector('input, a.btn, button.btn'); if (f) setTimeout(function () { f.focus(); }, 30); }
  function closeModal(m) { m.hidden = true; document.body.classList.remove('has-modal'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.modal').forEach(function (m) { if (!m.hidden) closeModal(m); }); });

  /* ---------- Celular con perfiles ---------- */
  var phone = {
    prof: 0, view: 'profile', story: 0, likes: {},
    screen: $('#phone-screen'), chips: $('#profile-chips'), layer: null
  };

  function renderChips() {
    phone.chips.innerHTML = PROFILES.map(function (p, i) {
      return '<button class="chip' + (i === phone.prof ? ' is-active' : '') + '" data-prof="' + i + '">' + esc(p.label || p.name) + '</button>';
    }).join('');
  }

  function likesText(p, i, on) {
    var n = parseInt((p.likes || [])[i], 10);
    if (isNaN(n)) return on ? 'Te gusta' : '';
    return (n + (on ? 1 : 0)).toLocaleString('es-AR') + ' me gusta';
  }

  function imgPath(p, type, i) { return 'img/perfiles/' + p.key + '/' + type + '-' + (i + 1) + '.jpg'; }

  function renderPhone() {
    var p = PROFILES[phone.prof];
    if (phone.layer) phone.layer.remove();
    var layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0';

    var profile =
      '<div class="view view--scroll" data-view="profile">' +
        '<div class="ig-top"><b>' + esc(p.handle) + '</b>' + icon('message', false, 20) + '</div>' +
        '<div class="ig-head">' +
          '<div class="ig-avatar">' + ph('img/perfiles/' + p.key + '/avatar.jpg', 'Logo') + '</div>' +
          '<div class="ig-stats">' +
            '<div><b>' + esc(p.posts) + '</b><span>posts</span></div>' +
            '<div><b>' + esc(p.followers) + '</b><span>seguidores</span></div>' +
            '<div><b>' + esc(p.following) + '</b><span>seguidos</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="ig-bio"><b>' + esc(p.name) + '</b><br>' + esc(p.bio) + '<br><em>' + esc(p.category) + '</em></div>' +
        '<div class="ig-btns"><span>Seguir</span><span>Mensaje</span></div>' +
        '<div class="ig-hls">' + p.hl.map(function (label, i) {
          return '<button class="ig-hl" data-story="' + i + '"><span class="ig-hl__ring"><span class="ig-hl__in">' + icon('sparkle', true) + '<img src="' + imgPath(p, 'portada', i) + '" alt="" onerror="this.remove()"></span></span><span>' + esc(label) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="ig-gridtab">' + icon('grid', false, 20) + '</div>' +
        '<div class="ig-grid">' + p.captions.map(function (c, i) {
          return '<button class="ig-cell" data-post="' + i + '" aria-label="Abrir posteo ' + (i + 1) + '">' + ph(imgPath(p, 'post', i), 'Post') + '</button>';
        }).join('') + '</div>' +
      '</div>';

    var feed =
      '<div class="view view--feed" data-view="feed" hidden>' +
        '<div class="feed-bar"><button class="feed-back" data-back aria-label="Volver">‹</button>' +
          '<div class="feed-bar__t"><small>' + esc(p.handle) + '</small><b>Publicaciones</b></div></div>' +
        '<div class="feed">' + p.captions.map(function (c, i) {
          var id = p.key + '-' + i, on = !!phone.likes[id];
          return '<article class="post" data-feedpost="' + i + '">' +
            '<div class="post__head"><span class="post__av"></span><span>' + esc(p.handle) + '</span></div>' +
            '<div class="post__img">' + ph(imgPath(p, 'post', i), 'Post (4:5)') + '</div>' +
            '<div class="post__acts">' +
              '<button class="like' + (on ? ' is-on' : '') + '" data-like="' + i + '" aria-label="Me gusta">' + icon('heart', on) + '</button>' +
              icon('message') + icon('arrowUpRight') +
            '</div>' +
            '<div class="post__likes"><span data-likes="' + i + '">' + likesText(p, i, on) + '</span></div>' +
            (c ? '<div class="post__cap"><b>' + esc(p.handle) + '</b> ' + esc(c) + '</div>' : '') +
          '</article>';
        }).join('') + '</div>' +
      '</div>';

    var story =
      '<div class="story" data-view="story" hidden>' +
        p.hl.map(function (label, i) {
          return '<div data-storyimg="' + i + '" style="position:absolute;inset:0"' + (i === phone.story ? '' : ' hidden') + '>' + '<div class="ph"><img src="' + imgPath(p, 'historia', i) + '" alt="" data-fb="' + imgPath(p, 'post', i) + '" onerror="if(this.dataset.fb){this.src=this.dataset.fb;this.dataset.fb=\'\'}else{this.remove()}"><span>Historia destacada</span></div>' + '</div>';
        }).join('') +
        '<div class="story__bars">' + p.hl.map(function () { return '<span></span>'; }).join('') + '</div>' +
        '<div class="story__top"><span data-storylabel></span><span>×</span></div>' +
        '<div class="story__hint">Tocá para avanzar</div>' +
      '</div>';

    layer.innerHTML = profile + feed + story;
    phone.screen.appendChild(layer);
    phone.layer = layer;
    setView(phone.view);
  }

  function setView(v) {
    phone.view = v;
    $$('[data-view]', phone.layer).forEach(function (el) { el.hidden = el.getAttribute('data-view') !== v; });
    if (v === 'story') updateStory();
  }

  function updateStory() {
    var p = PROFILES[phone.prof];
    $$('[data-storyimg]', phone.layer).forEach(function (el) { el.hidden = +el.getAttribute('data-storyimg') !== phone.story; });
    $$('.story__bars span', phone.layer).forEach(function (b, i) { b.classList.toggle('is-on', i <= phone.story); });
    $('[data-storylabel]', phone.layer).textContent = p.hl[phone.story] || '';
  }

  function openPost(i) {
    setView('feed');
    var feed = $('.feed', phone.layer), el = $('[data-feedpost="' + i + '"]', phone.layer);
    if (feed && el) feed.scrollTop = el.offsetTop - feed.offsetTop;
  }

  function toggleLike(i) {
    var p = PROFILES[phone.prof], id = p.key + '-' + i, on = !phone.likes[id];
    phone.likes[id] = on;
    var btn = $('[data-like="' + i + '"]', phone.layer);
    btn.classList.toggle('is-on', on);
    btn.innerHTML = icon('heart', on);
    $('[data-likes="' + i + '"]', phone.layer).textContent = likesText(p, i, on);
  }

  function storyTap(e) {
    var box = phone.layer.querySelector('.story').getBoundingClientRect();
    var x = e.clientX - box.left, y = e.clientY - box.top;
    var count = PROFILES[phone.prof].hl.length;
    if (y < 100 && x > box.width - 60) return setView('profile');
    if (x < box.width / 3) { phone.story = Math.max(0, phone.story - 1); return updateStory(); }
    if (phone.story >= count - 1) { phone.story = 0; return setView('profile'); }
    phone.story += 1;
    updateStory();
  }

  if (phone.screen && phone.chips) {
    phone.chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-prof]');
      if (!b) return;
      phone.prof = +b.getAttribute('data-prof');
      phone.view = 'profile';
      phone.story = 0;
      renderChips();
      renderPhone();
    });
    phone.screen.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-post]'))) return openPost(+t.getAttribute('data-post'));
      if ((t = e.target.closest('[data-story]'))) { phone.story = +t.getAttribute('data-story'); return setView('story'); }
      if ((t = e.target.closest('[data-like]'))) return toggleLike(+t.getAttribute('data-like'));
      if (e.target.closest('[data-back]')) return setView('profile');
      if (e.target.closest('.story')) return storyTap(e);
    });
    renderChips();
    renderPhone();
  }

  /* ---------- Chat de preguntas frecuentes ---------- */
  var chat = { asked: [], typing: false, msgs: $('#chat-msgs'), chips: $('#chat-chips'), timer: null };

  function renderChat() {
    var html = '<div class="msg msg--bot">Hola. Somos Vitis. Elegí una pregunta y te respondemos.</div>';
    chat.asked.forEach(function (qi, k) {
      html += '<div class="msg msg--user">' + esc(FAQS[qi].q) + '</div>';
      if (!(chat.typing && k === chat.asked.length - 1)) html += '<div class="msg msg--bot">' + esc(FAQS[qi].a) + '</div>';
    });
    if (chat.typing) html += '<div class="msg msg--bot msg--typing">escribiendo…</div>';
    chat.msgs.innerHTML = html;
    chat.msgs.scrollTop = chat.msgs.scrollHeight;

    var chipsHtml = '';
    if (!chat.typing) {
      FAQS.forEach(function (f, i) {
        if (chat.asked.indexOf(i) === -1) chipsHtml += '<button class="qchip" data-q="' + i + '">' + esc(f.q) + '</button>';
      });
      if (chat.asked.length) chipsHtml += '<a class="btn btn--primary btn--md" href="' + waLink + '" target="_blank" rel="noopener">Seguir por WhatsApp</a>';
    }
    chat.chips.innerHTML = chipsHtml;
  }

  function askQuestion(i) {
    if (chat.asked.indexOf(i) > -1) return;
    chat.asked.push(i);
    chat.typing = true;
    renderChat();
    clearTimeout(chat.timer);
    chat.timer = setTimeout(function () { chat.typing = false; renderChat(); }, 750);
  }

  if (chat.msgs && chat.chips) {
    chat.chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]');
      if (b) askQuestion(+b.getAttribute('data-q'));
    });
    renderChat();
  }

  /* Preguntas en Inicio: abren la pestaña Preguntas con la respuesta */
  var peekQs = $('#peek-qs');
  if (peekQs) {
    peekQs.innerHTML = FAQS.map(function (f, i) {
      return '<button class="peek-q" data-ask="' + i + '"><span>' + esc(f.q) + '</span>' + icon('arrowUpRight', false, 16) + '</button>';
    }).join('');
    peekQs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ask]');
      if (!b) return;
      goTab('preguntas');
      var chatBox = $('.chat');
      if (chatBox) chatBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      askQuestion(+b.getAttribute('data-ask'));
    });
  }

  /* ---------- Regalos ---------- */
  var resList = $('#res-list');
  var resIndex = 0;

  function renderResources() {
    resList.innerHTML = RESOURCES.map(function (r, i) {
      return '<button class="res-row' + (i === resIndex ? ' is-active' : '') + '" data-res="' + i + '">' +
        '<span class="fic"></span>' +
        '<span class="res-row__txt"><b>' + esc(r.title) + '</b><small>' + esc(r.meta) + '</small></span>' +
        '<span class="res-row__free">Gratis</span>' +
      '</button>';
    }).join('');
    var r = RESOURCES[resIndex];
    $('#res-img').innerHTML = ph(r.img, 'Portada del recurso');
    $('#res-title').textContent = r.title;
    $('#res-desc').textContent = r.desc;
    $('#res-includes').innerHTML = r.includes.map(function (x) { return '<li>' + icon('sparkle', true) + '<span>' + esc(x) + '</span></li>'; }).join('');
    $('#res-dl').href = r.href;
    $('#res-dl').setAttribute('data-res-title', r.title);
  }

  if (resList) {
    resList.addEventListener('click', function (e) {
      var b = e.target.closest('[data-res]');
      if (!b) return;
      resIndex = +b.getAttribute('data-res');
      renderResources();
    });
    renderResources();
  }

  /* ---------- Formulario antes de descargar ---------- */
  var lead = { modal: $('#lead-modal'), form: $('#lead-form'), input: $('#lead-input'), err: $('#lead-err'), mode: 'whatsapp', href: '', title: '' };
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function startDownload(href) {
    var a = document.createElement('a'); a.href = href; a.download = ''; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function setMode(mode) {
    lead.mode = mode;
    $$('.seg-toggle button', lead.modal).forEach(function (b) { var on = b.getAttribute('data-mode') === mode; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    var i = lead.input; i.value = ''; lead.err.textContent = '';
    if (mode === 'email') { i.type = 'email'; i.inputMode = 'email'; i.autocomplete = 'email'; i.placeholder = 'tunombre@mail.com'; }
    else { i.type = 'tel'; i.inputMode = 'tel'; i.autocomplete = 'tel'; i.placeholder = 'Ej: 261 555 1234'; }
    i.focus();
  }
  function valid(mode, v) {
    if (mode === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    var d = v.replace(/\D/g, ''); return d.length >= 8 && d.length <= 15;
  }
  if (lead.modal) {
    $$('.seg-toggle button', lead.modal).forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
    $('#res-dl').addEventListener('click', function (e) {
      var a = e.currentTarget;
      if (read('vitis-lead')) return; // ya dejó su contacto antes: descarga directa
      e.preventDefault();
      lead.href = a.getAttribute('href'); lead.title = a.getAttribute('data-res-title') || '';
      $('#lead-res').textContent = lead.title;
      setMode('whatsapp'); openModal(lead.modal);
    });
    lead.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = lead.input.value.trim();
      if (!valid(lead.mode, v)) { lead.err.textContent = lead.mode === 'email' ? 'Revisá el mail, parece incompleto.' : 'Revisá el número: poné el código de área y el número, sin el 0 ni el 15.'; lead.input.focus(); return; }
      var data = new URLSearchParams({ tipo: lead.mode === 'email' ? 'Email' : 'WhatsApp', contacto: v, recurso: lead.title, pagina: location.href });
      if (CONFIG.leadsEndpoint) {
        try { fetch(CONFIG.leadsEndpoint, { method: 'POST', mode: 'no-cors', body: data }); } catch (err) {}
      }
      store('vitis-lead', '1');
      closeModal(lead.modal);
      startDownload(lead.href);
    });
  }

  /* ---------- Pop up de salida (una vez por visita) ---------- */
  var exitModal = $('#exit-modal'), exitShown = false, t0 = Date.now();
  function seen() { try { return sessionStorage.getItem('vitis-exit') === '1'; } catch (e) { return exitShown; } }
  function showExit() {
    if (exitShown || seen() || !exitModal) return;
    if ($$('.modal').some(function (m) { return !m.hidden; })) return;
    var game = document.querySelector('[data-panel="juego"]');
    if (game && !game.hidden) return; // no interrumpir a quien está jugando
    exitShown = true; try { sessionStorage.setItem('vitis-exit', '1'); } catch (e) {}
    openModal(exitModal);
  }
  if (exitModal) {
    // Compu: el mouse sale por arriba de la ventana (hacia las pestañas o la X)
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 6000) showExit();
    });
    // Celular: después de un rato navegando, si sube rápido hacia el inicio (gesto típico antes de salir)
    var lastY = window.scrollY, lastT = Date.now();
    window.addEventListener('scroll', function () {
      var y = window.scrollY, now = Date.now(), v = (lastY - y) / Math.max(1, now - lastT);
      if (window.matchMedia('(pointer:coarse)').matches && now - t0 > 25000 && v > 2.5 && y < 600) showExit();
      lastY = y; lastT = now;
    }, { passive: true });
  }
})();

/* Videos: se reproducen solo cuando están en pantalla (ahorra datos y batería) */
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('.reel video, .tile-main video'));
  if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.preload = 'metadata'; v.play && v.play().catch(function () {}); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();