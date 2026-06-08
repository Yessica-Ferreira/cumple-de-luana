/**
 * script.js — Invitación Kawaii Gamer · Sistema de SLIDES
 * Luana Jazmín 🎀 8 años
 *
 * Módulos:
 *  1. Sistema de slides (botones, puntos, swipe táctil, teclado)
 *  2. Partículas flotantes de fondo
 *  3. Cuenta regresiva dinámica
 *  4. Botón WhatsApp
 *  5. Efecto sparkle al tocar
 */

/* ============================================================
   1. SISTEMA DE SLIDES
============================================================ */
(function initSlider() {
  const slides    = Array.from(document.querySelectorAll('.slide'));
  const dots      = Array.from(document.querySelectorAll('.nav-dot'));
  const btnPrev   = document.getElementById('btn-prev');
  const btnNext   = document.getElementById('btn-next');
  const labelEl   = document.getElementById('slide-label');
  const TOTAL     = slides.length;
  let current     = 0;      // índice activo
  let isAnimating = false;  // bloqueo durante transición

  /**
   * Navega al slide indicado.
   * @param {number} index  — índice destino
   */
  function goTo(index) {
    if (index === current || isAnimating) return;
    if (index < 0 || index >= TOTAL)      return;

    isAnimating = true;

    const prev = current;
    current    = index;

    // Marca el slide anterior como "passed" (sale a la izquierda)
    slides[prev].classList.remove('active');
    slides[prev].classList.add('passed');

    // Si retrocedemos: el anterior sale a la derecha, no a la izquierda
    if (index < prev) {
      slides[prev].classList.remove('passed');
      slides[prev].style.transform = 'translateX(100%)';
    }

    // Activa el nuevo slide
    slides[current].classList.add('active');

    // Quita transformaciones inline del anterior después de la transición
    setTimeout(() => {
      slides.forEach((s, i) => {
        if (i !== current) {
          s.classList.remove('active', 'passed');
          s.style.transform = '';
        }
      });
      isAnimating = false;
    }, 460); // debe coincidir con el transition del CSS

    updateUI();
  }

  /** Actualiza botones, puntos y etiqueta */
  function updateUI() {
    // Botones prev / next
    btnPrev.disabled = (current === 0);
    btnNext.disabled = (current === TOTAL - 1);

    // Puntos
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    // Etiqueta "X / 4"
    if (labelEl) labelEl.textContent = `${current + 1} / ${TOTAL}`;
  }

  /* Inicialización: activa el primer slide */
  slides.forEach((s, i) => {
    if (i === 0) s.classList.add('active');
    // Los demás quedan con transform: translateX(100%) del CSS
  });
  updateUI();

  /* ── Eventos de botones ── */
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* ── Puntos indicadores ── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  /* ── Teclado (←  →) ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goTo(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goTo(current - 1);
  });

  /* ── Swipe táctil ── */
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Solo cuenta como swipe horizontal si el movimiento X supera al Y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) goTo(current + 1); // swipe izquierda → siguiente
      else         goTo(current - 1); // swipe derecha  → anterior
    }
  }, { passive: true });

})();


/* ============================================================
   2. PARTÍCULAS FLOTANTES DE FONDO
============================================================ */
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const symbols = [
    '⭐','💜','🌸','✨','💫','🎮','🩷',
    '🌟','💕','🎀','🕹️','🌈','💖','⚡','🦋'
  ];

  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const el          = document.createElement('span');
    el.classList.add('particle');
    el.textContent    = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    const dur         = 9 + Math.random() * 13;
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = Math.random() * dur + 's';
    el.style.fontSize           = (11 + Math.random() * 13) + 'px';
    container.appendChild(el);
  }
})();


/* ============================================================
   3. CUENTA REGRESIVA DINÁMICA
============================================================ */
(function initCountdown() {
  // ─── FECHA OBJETIVO ───────────────────────────────────────
  const TARGET = new Date('2026-06-20T17:00:00');
  // ──────────────────────────────────────────────────────────

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const cdEl      = document.getElementById('countdown');
  const partyEl   = document.getElementById('party-msg');

  if (!daysEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function pop(el) {
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    setTimeout(() => el.classList.remove('pop'), 300);
  }

  let prev = { d: -1, h: -1, m: -1, s: -1 };

  function tick() {
    const diff = TARGET - new Date();

    if (diff <= 0) {
      cdEl.hidden    = true;
      partyEl.hidden = false;
      clearInterval(timer);
      launchConfetti();
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    if (d !== prev.d) { daysEl.textContent    = pad(d); pop(daysEl);    prev.d = d; }
    if (h !== prev.h) { hoursEl.textContent   = pad(h); pop(hoursEl);   prev.h = h; }
    if (m !== prev.m) { minutesEl.textContent = pad(m); pop(minutesEl); prev.m = m; }
    if (s !== prev.s) { secondsEl.textContent = pad(s); pop(secondsEl); prev.s = s; }
  }

  tick();
  const timer = setInterval(tick, 1000);
})();


/* ============================================================
   4. CONFETI (cuando llega el gran día)
============================================================ */
function launchConfetti() {
  const syms = ['🎉','🎊','🎀','💜','⭐','🌸','🥳','✨'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      Object.assign(el.style, {
        position:   'fixed',
        top:        '-30px',
        left:       Math.random() * 100 + 'vw',
        fontSize:   (18 + Math.random() * 18) + 'px',
        animation:  `floatP ${3 + Math.random() * 4}s ease forwards`,
        pointerEvents: 'none',
        zIndex:     '9999'
      });
      el.textContent = syms[Math.floor(Math.random() * syms.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 120);
  }
}


/* ============================================================
   5. BOTÓN WHATSAPP
============================================================ */
(function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  const phone   = '595986613236';
  const message = '¡Hola! Confirmo mi asistencia al cumpleaños de Luana Jazmín 🎉';
  btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
})();


/* ============================================================
   6. EFECTO SPARKLE AL TOCAR / CLIC
============================================================ */
(function initSparkle() {
  const symbols = ['✨','💜','🌸','⭐','💫','🩷','🎀'];

  function spawn(x, y) {
    const el = document.createElement('span');
    Object.assign(el.style, {
      position:      'fixed',
      left:          x + 'px',
      top:           y + 'px',
      fontSize:      (14 + Math.random() * 14) + 'px',
      pointerEvents: 'none',
      zIndex:        '9998',
      transform:     'translate(-50%,-50%)',
      animation:     'sparkleOut 0.7s ease forwards'
    });
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  // Inyecta animación sparkleOut si no existe
  if (!document.getElementById('sparkle-style')) {
    const s = document.createElement('style');
    s.id = 'sparkle-style';
    s.textContent = `
      @keyframes sparkleOut {
        0%   { opacity:1; transform:translate(-50%,-50%) scale(1);   }
        100% { opacity:0; transform:translate(-50%,-80%) scale(1.8); }
      }
    `;
    document.head.appendChild(s);
  }

  document.addEventListener('click', e => spawn(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    spawn(t.clientX, t.clientY);
  }, { passive: true });
})();