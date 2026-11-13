/* =========================================================
   Vitis Run — juego de la pestaña "Jugá"
   Un corazón con aro de historia corre por el feed: salta lo
   que está en el piso, se agacha bajo los carteles y junta
   me gusta. Con META me gusta gana una Auditoría Express,
   que se pide por WhatsApp con un código.
   ========================================================= */
(function () {
  'use strict';

  var META = 400;                     // me gusta necesarios para ganar la auditoría
  var WHATSAPP = '5492613878157';     // mismo número que el resto de la web

  var cv = document.getElementById('vr-canvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var panelGame = document.querySelector('[data-panel="juego"]');
  var W = 800, H = 300, GY = 244, PX = 84;

  var $ = function (id) { return document.getElementById(id); };
  var elScore = $('vr-score'), elBest = $('vr-best'), elLives = $('vr-lives').children,
      elStatus = $('vr-status'), elProg = $('vr-prog'), elComments = $('vr-comments'),
      result = $('vr-result'), elGoal = $('vr-goal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Paleta Vitis */
  var C = {
    stage: '#FFF6F1', fg: '#3A0E18', line: '#8C1230', heart: '#EE3C67', bordo: '#8C1230',
    bordoDeep: '#700724', rose: '#EE3C67', pink: '#F986A6', pinkSoft: '#F7B5C6', ink: '#3A0E18', white: '#FFFFFF'
  };

  var GROUND = ['Bio vacía', 'Sin CTA', 'Feed caótico', 'Foto sin editar', 'Sin estrategia', 'Cuenta abandonada', 'Logo ilegible'];
  var TOWER = ['Spam', 'Bots', 'DMs sin leer'];
  var SPIKE = ['Feed roto', 'Mala calidad', 'Sin constancia'];
  var AIR = ['Sin reels', 'Texto eterno', 'Mala luz', 'Sin hashtags'];
  var SIGN = ['Link roto', 'Sin horario', 'Sin contacto'];
  var HANDLES = ['algoritmo', 'tu_competencia', 'cliente_nuevo', 'seguidor_fiel', 'marca_vecina'];

  var state = 'ready', p, obs, hearts, parts, shards, amb, flash, speed, dist, heartN, lives, hits, inv, spawnIn, shake, overAt = 0, last = 0, frame = 0, commentN = 0, won = false;
  var best = 0;
  try { best = parseInt(localStorage.getItem('vitisrun-best') || '0', 10) || 0; } catch (e) {}
  elBest.textContent = best;
  elGoal.textContent = META;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = cv.clientWidth || W;
    cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr * H / W);
  }
  function reset() {
    p = { y: GY, vy: 0, duck: false, sq: 0 }; obs = []; hearts = []; parts = []; shards = []; amb = [];
    flash = 0; speed = 5.6; dist = 0; heartN = 0; lives = 3; hits = []; inv = 0; spawnIn = 420; shake = 0; commentN = 0; won = false;
    for (var i = 0; i < 3; i++) elLives[i].classList.remove('off');
    elScore.textContent = '0'; elProg.style.width = '0%';
    elComments.innerHTML = '<p class="vr-none">Todavía no hay comentarios. Los errores con los que tropieces aparecen acá.</p>';
  }
  function score() { return Math.floor(dist / 14) + heartN * 10; }
  function start() { reset(); state = 'running'; result.hidden = true; elStatus.textContent = ''; last = performance.now(); }

  function jump() {
    if (state === 'ready') start();
    else if (state === 'over') { if (performance.now() - overAt > 700) start(); return; }
    if (state === 'running' && p.y >= GY - 0.5) { p.vy = -12.7; p.sq = -0.22; puff(PX, GY, 5); }
  }
  function setDuck(v) { p.duck = v; }

  function puff(x, y, n) { for (var i = 0; i < n; i++) shards.push({ x: x + (Math.random() - 0.5) * 14, y: y, vx: (Math.random() - 0.5) * 2.4, vy: -Math.random() * 1.4, g: 0.05, life: 22, max: 22, sz: 2 + Math.random() * 2.5, col: null }); }
  function obColor(o) { return { bubble: C.ink, tower: C.bordo, spike: C.rose, toast: C.bordoDeep, sign: C.pink }[o.type]; }
  function obText(o) { return o.type === 'sign' ? C.ink : C.white; }
  function burst(o) {
    var cx = o.x + o.w / 2, cy = Math.min(GY - 20, o.y + o.h / 2);
    for (var i = 0; i < 14; i++) shards.push({ x: cx + (Math.random() - 0.5) * o.w * 0.6, y: cy, vx: (Math.random() - 0.5) * 9, vy: -1 - Math.random() * 6, g: 0.42, life: 38, max: 38, sz: 3 + Math.random() * 4, col: obColor(o) });
  }
  function pick(l) { return l[Math.floor(Math.random() * l.length)]; }
  function spawn() {
    var r = Math.random(), type;
    if (dist < 600) type = 'bubble';
    else if (dist < 1500) type = r < 0.5 ? 'bubble' : (r < 0.75 ? 'tower' : 'spike');
    else type = r < 0.26 ? 'bubble' : (r < 0.44 ? 'tower' : (r < 0.62 ? 'spike' : (r < 0.8 ? 'toast' : 'sign')));
    var label = type === 'bubble' ? pick(GROUND) : type === 'tower' ? pick(TOWER) : type === 'spike' ? pick(SPIKE) : type === 'toast' ? pick(AIR) : pick(SIGN);
    ctx.font = '600 13px Poppins,system-ui,sans-serif';
    var tw = Math.ceil(ctx.measureText(label).width), w, h, y, hb, x = W + 20;
    if (type === 'bubble') { w = tw + 28; h = 38; y = GY - h; hb = { dx: 3, y: y + 3, w: w - 6, h: h - 6 }; }
    else if (type === 'tower') { w = Math.max(64, tw + 30); h = 66; y = GY - h; hb = { dx: 4, y: y + 4, w: w - 8, h: h - 4 }; }
    else if (type === 'spike') { w = Math.max(112, tw + 44); h = 28; y = GY - h; hb = { dx: 4, y: y + 8, w: w - 8, h: h - 8 }; }
    else if (type === 'toast') { w = tw + 56; h = 30; y = GY - 26 - h; hb = { dx: 3, y: y + 3, w: w - 6, h: h - 6 }; }
    else { w = Math.max(104, tw + 36); h = 34; y = GY - 30 - h; hb = { dx: 3, y: 0, w: w - 6, h: GY - 30 }; }
    obs.push({ x: x, w: w, h: h, y: y, label: label, type: type, hb: hb, ph: Math.random() * 6.28, dy: 0 });
    spawnIn = w + speed * (40 + Math.random() * 30);
    if (Math.random() < 0.5) hearts.push({ x: W + 20 + spawnIn * 0.5, y: GY - 70 - Math.random() * 50 });
  }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.t < b.y + b.h && a.t + a.h > b.y; }
  function addComment(label) {
    if (commentN === 0) elComments.innerHTML = '';
    commentN++;
    var d = document.createElement('p'), b = document.createElement('b'), s = document.createElement('span');
    b.textContent = pick(HANDLES); s.textContent = ' ' + label;
    d.appendChild(b); d.appendChild(s); elComments.appendChild(d);
    while (elComments.children.length > 3) elComments.removeChild(elComments.firstChild);
  }

  function update(step) {
    speed = Math.min(11.5, 5.6 + dist * 0.00085);
    dist += speed * step;
    var g = (p.duck && p.y < GY) ? 1.5 : 0.66, was = p.y < GY - 0.5;
    p.vy += g * step; p.y += p.vy * step;
    if (p.y >= GY) { p.y = GY; p.vy = 0; if (was) { p.sq = 0.28; puff(PX, GY, 6); } }
    p.sq *= Math.pow(0.8, step);
    if (!reduce && p.y >= GY && speed > 7 && frame % 6 === 0) puff(PX - 8, GY, 1);
    if (Math.random() < 0.025 * step) amb.push({ x: W + 10, y: 70 + Math.random() * 130, s: 4 + Math.random() * 5 });
    spawnIn -= speed * step;
    if (spawnIn <= 0) spawn();
    var i;
    for (i = 0; i < obs.length; i++) { obs[i].x -= speed * step; if (obs[i].type === 'toast') obs[i].dy = -(1 + Math.sin(frame * 0.1 + obs[i].ph)) * 4; }
    for (i = 0; i < hearts.length; i++) hearts[i].x -= speed * step;
    for (i = 0; i < parts.length; i++) { parts[i].y -= 1.1 * step; parts[i].life -= step; }
    for (i = 0; i < shards.length; i++) { var sh = shards[i]; sh.x += sh.vx * step - speed * step * 0.55; sh.y += sh.vy * step; sh.vy += sh.g * step; sh.life -= step; }
    for (i = 0; i < amb.length; i++) { amb[i].x -= speed * step * 0.45; amb[i].y -= 0.35 * step; }
    shards = shards.filter(function (q) { return q.life > 0; });
    amb = amb.filter(function (q) { return q.x > -20 && q.y > -10; });
    obs = obs.filter(function (o) { return o.x + o.w > -20; });
    hearts = hearts.filter(function (s) { return s.x > -30; });
    parts = parts.filter(function (s) { return s.life > 0; });
    if (flash > 0) flash -= 0.09 * step;
    if (inv > 0) inv -= step;
    if (shake > 0) shake -= step;
    var ducking = p.duck && p.y >= GY - 0.5, ph = ducking ? 24 : 52;
    var box = { x: PX - 13, w: 26, t: p.y - ph, h: ph };
    for (i = obs.length - 1; i >= 0; i--) {
      var o = obs[i];
      if (inv <= 0 && hit(box, { x: o.x + o.hb.dx, y: o.hb.y + o.dy, w: o.hb.w, h: o.hb.h })) {
        burst(o); if (!reduce) flash = 1;
        obs.splice(i, 1); lives--; inv = 70; shake = 10;
        if (hits.indexOf(o.label) < 0) hits.push(o.label);
        addComment(o.label);
        for (var k = 0; k < 3; k++) elLives[k].classList.toggle('off', k >= lives);
        if (lives <= 0) { end(); return; }
      }
    }
    for (i = hearts.length - 1; i >= 0; i--) {
      var s = hearts[i];
      if (hit(box, { x: s.x - 12, w: 24, y: s.y - 12, h: 24 })) { hearts.splice(i, 1); heartN++; parts.push({ x: s.x, y: s.y, life: 34 }); }
    }
    var sc = score();
    elScore.textContent = sc;
    elProg.style.width = Math.min(100, sc / META * 100) + '%';
    if (!won && sc >= META) { won = true; elStatus.textContent = '¡Llegaste a ' + META + ' me gusta! Ya ganaste tu Auditoría Express. Seguí jugando para tu mejor marca.'; }
  }

  function rankFor(s) {
    if (s < 150) return 'Primeros pasos';
    if (s < META) return 'Perfil en marcha';
    if (s < 800) return 'Buen ritmo';
    return 'Estratega de redes';
  }
  function code() {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c = 'VR-';
    for (var i = 0; i < 5; i++) c += abc[Math.floor(Math.random() * abc.length)];
    return c;
  }
  function end() {
    state = 'over'; overAt = performance.now();
    var s = score();
    if (s > best) { best = s; try { localStorage.setItem('vitisrun-best', String(best)); } catch (e) {} }
    elBest.textContent = best; elScore.textContent = s;
    $('vr-rank').textContent = won ? '¡Ganaste una Auditoría Express!' : rankFor(s);
    $('vr-rScore').textContent = s; $('vr-rBest').textContent = best; $('vr-rHearts').textContent = heartN;
    var tags = $('vr-tags'); tags.innerHTML = '';
    hits.forEach(function (h) { var li = document.createElement('li'); li.textContent = h; tags.appendChild(li); });
    var cta = $('vr-cta'), msg;
    if (won) {
      var c = code();
      $('vr-note').textContent = 'Estos son los errores con los que tropezaste. Son puntos que revisamos en la auditoría, y seguramente algunos también aparecen en tu perfil.';
      $('vr-cta-title').textContent = 'Reclamá tu auditoría por WhatsApp';
      $('vr-cta-text').textContent = 'Tu código es ' + c + '. Tocá el botón y mandanos el mensaje con tu usuario de Instagram.';
      msg = 'Hola Vitis! Jugué Vitis Run, llegué a ' + s + ' me gusta y gané la Auditoría Express (código ' + c + '). Tropecé con: ' + (hits.join(', ') || 'nada') + '. Mi Instagram es @';
      cta.hidden = false;
    } else {
      $('vr-note').textContent = 'Te faltaron ' + (META - s) + ' me gusta para ganar la auditoría. Estos son los errores con los que tropezaste:';
      $('vr-cta-title').textContent = '¿Querés que revisemos tu perfil igual?';
      $('vr-cta-text').textContent = 'Jugá de nuevo para ganar la auditoría, o escribinos y te contamos cómo trabajamos.';
      msg = 'Hola Vitis! Jugué Vitis Run y llegué a ' + s + ' me gusta. Quiero saber más sobre la auditoría de perfil. Mi Instagram es @';
      cta.hidden = false;
    }
    $('vr-wa').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
    result.hidden = false;
    elStatus.textContent = 'Juego terminado. Puntaje: ' + s + '.';
    result.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- Dibujo ---------- */
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function heart(x, y, r) {
    ctx.beginPath(); ctx.moveTo(x, y + r * 0.9);
    ctx.bezierCurveTo(x - r * 1.5, y - r * 0.1, x - r * 0.9, y - r * 1.2, x, y - r * 0.45);
    ctx.bezierCurveTo(x + r * 0.9, y - r * 1.2, x + r * 1.5, y - r * 0.1, x, y + r * 0.9);
    ctx.closePath(); ctx.fill();
  }
  function sparkle(x, y, r) {
    ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.28, y - r * 0.28); ctx.lineTo(x + r, y); ctx.lineTo(x + r * 0.28, y + r * 0.28);
    ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.28, y + r * 0.28); ctx.lineTo(x - r, y); ctx.lineTo(x - r * 0.28, y - r * 0.28); ctx.closePath(); ctx.fill();
  }
  function drawFeed() {
    var span = W + 240, i, x, y, w, h;
    ctx.save();
    for (i = 0; i < 6; i++) {
      w = 104 + (i * 37) % 46; h = 92 + (i * 53) % 50;
      x = (((i * 190 - dist * 0.22) % span) + span) % span - 110; y = 30 + (i * 29) % 44;
      ctx.globalAlpha = 0.07; ctx.fillStyle = C.bordo; rr(x, y, w, h, 10); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 13, y + 13, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(x + 24, y + 10, w * 0.35, 3); ctx.fillRect(x + 8, y + h - 28, w - 30, 3); ctx.fillRect(x + 8, y + h - 20, (w - 16) * 0.6, 3);
      ctx.globalAlpha = 0.14; ctx.fillStyle = i % 2 ? C.pink : C.rose; rr(x + 8, y + 26, w - 16, h * 0.42, 6); ctx.fill();
      ctx.globalAlpha = 0.25; ctx.fillStyle = C.heart; heart(x + w - 16, y + h - 13, 4);
    }
    ctx.globalAlpha = 0.22; ctx.fillStyle = C.pink;
    for (i = 0; i < amb.length; i++) (i % 2 ? heart : sparkle)(amb[i].x, amb[i].y, amb[i].s);
    ctx.restore();
  }
  function badge(x, y, t, k) {
    ctx.fillStyle = C.heart; ctx.beginPath(); ctx.arc(x, y, 9 * (k || 1), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 10px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y + 1);
  }
  function drawObstacle(o) {
    var col = obColor(o), tt = frame * 0.12 + o.ph, pulse = 1 + 0.14 * Math.sin(tt * 1.6), f = '600 13px Poppins,system-ui,sans-serif';
    ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = col;
    if (o.type === 'bubble') {
      rr(o.x, o.y, o.w, o.h, 10); ctx.fill();
      ctx.beginPath(); ctx.moveTo(o.x + 10, o.y + o.h - 2); ctx.lineTo(o.x + 6, o.y + o.h + 7); ctx.lineTo(o.x + 20, o.y + o.h - 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = obText(o); ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, o.x + o.w / 2 - 3, o.y + o.h / 2 + 1);
      for (var d = 0; d < 3; d++) { ctx.globalAlpha = 0.35 + 0.5 * Math.max(0, Math.sin(tt * 2 - d * 0.8)); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(o.x + o.w - 28 + d * 7, o.y - 8, 2.2, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1; badge(o.x + o.w - 4, o.y + 3, '!', pulse);
    } else if (o.type === 'tower') {
      ctx.translate(Math.sin(tt * 6) * 1.2, 0);
      rr(o.x, o.y, o.w, o.h, 10); ctx.fill();
      ctx.fillStyle = obText(o); ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, o.x + o.w / 2 - 3, o.y + 17);
      for (var k = 0; k < 3; k++) { ctx.globalAlpha = 0.25 + 0.3 * Math.max(0, Math.sin(tt * 2.2 - k * 0.9)); rr(o.x + 10, o.y + o.h - 15 - k * 10, o.w - 20, 5, 2.5); ctx.fill(); }
      ctx.globalAlpha = 1; badge(o.x + o.w - 4, o.y + 3, '9+', pulse);
    } else if (o.type === 'spike') {
      rr(o.x, o.y + 8, o.w, o.h - 8, 6); ctx.fill();
      var n = Math.floor(o.w / 16), tw = o.w / n;
      ctx.beginPath();
      for (var i = 0; i < n; i++) { var tip = o.y - 1 + Math.sin(tt * 2 + i * 0.9) * 2.2; ctx.moveTo(o.x + i * tw, o.y + 9); ctx.lineTo(o.x + i * tw + tw / 2, tip); ctx.lineTo(o.x + (i + 1) * tw, o.y + 9); }
      ctx.fill();
      ctx.fillStyle = obText(o); ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 5);
    } else if (o.type === 'toast') {
      ctx.translate(0, o.dy);
      rr(o.x, o.y, o.w, o.h, 15); ctx.fill();
      ctx.fillStyle = obText(o);
      ctx.save(); ctx.translate(o.x + 17, o.y + 8); ctx.rotate(Math.sin(tt * 5) * 0.35);
      ctx.beginPath(); ctx.arc(0, 5, 6, Math.PI, 0); ctx.lineTo(6, 12); ctx.lineTo(-6, 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 16, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, o.x + o.w / 2 + 9, o.y + o.h / 2 + 1);
      badge(o.x + o.w - 4, o.y + 3, '1', pulse);
    } else {
      var sw = Math.sin(tt) * 4;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(o.x + 12, 0); ctx.lineTo(o.x + 12 + sw, o.y + 2); ctx.moveTo(o.x + o.w - 12, 0); ctx.lineTo(o.x + o.w - 12 + sw, o.y + 2); ctx.stroke();
      ctx.translate(sw, 0);
      rr(o.x, o.y, o.w, o.h, 8); ctx.fill();
      ctx.fillStyle = obText(o); ctx.font = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, o.x + o.w / 2, o.y + o.h / 2 + 1);
    }
    ctx.restore();
  }
  function limb(x0, y0, cx, cy, x1, y1) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); }
  function shoe(fx, fy) {
    ctx.fillStyle = C.bordo; ctx.beginPath(); ctx.ellipse(fx + 2, fy, 7.5, 4.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.ellipse(fx + 7, fy + 0.5, 3.4, 3.4, 0, 0, Math.PI * 2); ctx.fill();
  }
  function hand(hx, hy) {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = C.fg; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hx, hy, 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  function drawPlayer() {
    if (inv > 0 && Math.floor(inv / 5) % 2 === 0) return;
    var x = PX, y = p.y, air = y < GY - 1, duck = p.duck && !air, run = state === 'running' && !air ? Math.sin(dist * 0.09) : 0;
    var hAir = GY - y;
    ctx.fillStyle = 'rgba(58,14,24,.16)'; ctx.beginPath(); ctx.ellipse(x, GY + 3, Math.max(6, 18 - hAir * 0.09), Math.max(2, 4 - hAir * 0.02), 0, 0, Math.PI * 2); ctx.fill();
    var cy = duck ? y - 14 : y - 42, r = duck ? 15 : 23, sc = duck ? 0.62 : 1, s, ph2;
    ctx.save(); ctx.translate(x, y); ctx.scale(1 + p.sq, 1 - p.sq); ctx.translate(-x, -y);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = C.fg; ctx.lineWidth = 3;
    var feet = [], hands = [];
    if (!duck) {
      var hipY = cy + r - 3;
      for (var i = 0; i < 2; i++) {
        s = i ? 1 : -1; ph2 = run * s;
        var hx = x + s * 7, fx, fy;
        if (air) { fx = hx + s * 8; fy = y - 10; } else { fx = hx + ph2 * 8; fy = y - 4 - Math.max(0, -ph2) * 5; }
        limb(hx, hipY, hx + s * 4 + (fx - hx) / 2, (hipY + fy) / 2, fx, fy); feet.push([fx, fy]);
        var sx = x + s * (r - 5), hy, hxx;
        if (air) { hxx = x + s * (r + 8); hy = cy - 8; } else { hxx = x + s * (r + 7); hy = cy + 10 - ph2 * 5; }
        limb(sx, cy + 4, x + s * (r + 10), cy + 2, hxx, hy); hands.push([hxx, hy]);
      }
    } else {
      feet = [[x - 9, y - 4], [x + 9, y - 4]]; hands = [[x - r - 4, y - 12], [x + r + 4, y - 12]];
      ctx.beginPath(); ctx.moveTo(x - r + 4, y - 12); ctx.lineTo(x - r - 4, y - 12); ctx.moveTo(x + r - 4, y - 12); ctx.lineTo(x + r + 4, y - 12); ctx.stroke();
    }
    feet.forEach(function (f) { shoe(f[0], f[1]); });
    hands.forEach(function (h) { hand(h[0], h[1]); });
    /* aro de historia en colores Vitis */
    var gr = ctx.createLinearGradient(x - r, cy + r, x + r, cy - r);
    gr.addColorStop(0, C.bordo); gr.addColorStop(0.5, C.rose); gr.addColorStop(1, C.pink);
    ctx.strokeStyle = gr; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = C.stage; ctx.beginPath(); ctx.arc(x, cy, r - 2.5, 0, Math.PI * 2); ctx.fill();
    /* corazón con cara */
    ctx.save(); ctx.translate(x, cy); ctx.scale(sc, sc);
    ctx.fillStyle = C.rose; heart(0, 1, 13);
    ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.9; sparkle(-7, -7, 3); ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-5, 0, 3.3, 0, Math.PI * 2); ctx.arc(5, 0, 3.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(-4, 0.2, 1.6, 0, Math.PI * 2); ctx.arc(6, 0.2, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 4.5, 3.6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
  function draw() {
    var sx = cv.width / W;
    ctx.setTransform(sx, 0, 0, sx, 0, 0);
    ctx.fillStyle = C.stage; ctx.fillRect(0, 0, W, H);
    drawFeed();
    if (shake > 0 && !reduce) ctx.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, GY + 2); ctx.lineTo(W, GY + 2); ctx.stroke();
    ctx.globalAlpha = 0.4;
    for (var x = -(dist % 46); x < W; x += 46) { ctx.beginPath(); ctx.moveTo(x, GY + 14); ctx.lineTo(x + 14, GY + 14); ctx.stroke(); }
    ctx.globalAlpha = 1;
    for (var i = 0; i < obs.length; i++) drawObstacle(obs[i]);
    ctx.fillStyle = C.heart;
    for (var j = 0; j < hearts.length; j++) heart(hearts[j].x, hearts[j].y, 11);
    for (var k = 0; k < parts.length; k++) { ctx.globalAlpha = Math.max(0, parts[k].life / 34); ctx.fillStyle = C.heart; heart(parts[k].x, parts[k].y, 8); }
    ctx.globalAlpha = 1;
    drawPlayer();
    for (var q = 0; q < shards.length; q++) {
      var sh = shards[q];
      ctx.globalAlpha = Math.max(0, sh.life / sh.max);
      if (sh.col) { ctx.fillStyle = sh.col; ctx.fillRect(sh.x, sh.y, sh.sz, sh.sz * 0.6); }
      else { ctx.fillStyle = C.line; ctx.beginPath(); ctx.arc(sh.x, sh.y, sh.sz * 0.6, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    if (flash > 0 && !reduce) { ctx.globalAlpha = Math.min(1, flash) * 0.3; ctx.fillStyle = '#fff'; ctx.fillRect(-10, -10, W + 20, H + 20); ctx.globalAlpha = 1; }
    if (state === 'ready') {
      ctx.fillStyle = C.bordo; ctx.font = '700 18px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Tocá el juego o la flecha ↑ para empezar', W / 2, 92);
    }
  }

  /* El juego solo corre mientras su pestaña está a la vista */
  var running = false;
  function visible() { return panelGame && !panelGame.hidden; }
  function loop(t) {
    if (!visible()) { running = false; if (state === 'running') setDuck(false); return; }
    frame++;
    var dt = Math.min(50, t - (last || t)); last = t;
    if (state === 'running') update(dt / 16.667);
    draw();
    requestAnimationFrame(loop);
  }
  function wake() { if (!running && visible()) { running = true; resize(); last = 0; requestAnimationFrame(loop); } }
  if (panelGame && 'MutationObserver' in window) new MutationObserver(wake).observe(panelGame, { attributes: true, attributeFilter: ['hidden'] });

  /* ---------- Controles ---------- */
  var kUp = $('vr-kUp'), kDown = $('vr-kDown');
  function keyOn(el, on) { el.classList.toggle('on', on); }
  function onKey(e, down) {
    if (!visible()) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'TEXTAREA' || tag === 'INPUT') return;
    // Solo toma las teclas si el juego tiene el foco o está corriendo, así no traba el scroll del resto de la web
    if (document.activeElement !== cv && state !== 'running') return;
    var c = e.code;
    if (c === 'ArrowUp' || c === 'Space' || c === 'KeyW') { e.preventDefault(); if (down && !e.repeat) jump(); keyOn(kUp, down); }
    else if (c === 'ArrowDown' || c === 'KeyS') { e.preventDefault(); setDuck(down); keyOn(kDown, down); }
  }
  document.addEventListener('keydown', function (e) { onKey(e, true); });
  document.addEventListener('keyup', function (e) { onKey(e, false); });
  window.addEventListener('blur', function () { if (p) setDuck(false); keyOn(kDown, false); keyOn(kUp, false); });
  var pt = null;
  cv.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    try { cv.focus({ preventScroll: true }); } catch (err) {}
    if (e.pointerType === 'mouse') { jump(); return; }
    pt = { y: e.clientY, done: false, duck: false };
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  });
  cv.addEventListener('pointermove', function (e) {
    if (!pt || pt.done) return;
    var dy = e.clientY - pt.y;
    if (dy < -18) { pt.done = true; jump(); }
    else if (dy > 18 && !pt.duck) { pt.duck = true; setDuck(true); keyOn(kDown, true); }
  });
  cv.addEventListener('pointerup', function () {
    if (!pt) return;
    if (pt.duck) { setDuck(false); keyOn(kDown, false); } else if (!pt.done) jump();
    pt = null;
  });
  cv.addEventListener('pointercancel', function () { if (pt && pt.duck) { setDuck(false); keyOn(kDown, false); } pt = null; });
  var bj = $('vr-jump'), bd = $('vr-duck');
  bj.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); keyOn(kUp, true); });
  bj.addEventListener('pointerup', function () { keyOn(kUp, false); });
  bd.addEventListener('pointerdown', function (e) { e.preventDefault(); if (state === 'ready') start(); setDuck(true); keyOn(kDown, true); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { bd.addEventListener(n, function () { setDuck(false); keyOn(kDown, false); }); });
  $('vr-again').addEventListener('click', function (e) { e.currentTarget.blur(); start(); try { cv.focus({ preventScroll: true }); } catch (err) {} });
  window.addEventListener('resize', function () { if (visible()) resize(); });

  reset(); wake();
})();
