/**
 * script.js — Invitación de Cumpleaños Kawaii Gamer
 * Luana Jazmín 🎀 — 8 años
 *
 * Funcionalidades:
 *  1. Partículas flotantes de fondo
 *  2. Cuenta regresiva dinámica
 *  3. Botón de WhatsApp con mensaje predeterminado
 *  4. Scroll reveal (animación de entrada)
 */

/* ============================================================
   1. PARTÍCULAS FLOTANTES DE FONDO
============================================================ */
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  // Emojis kawaii / gamer que flotan
  const symbols = [
    '⭐', '💜', '🌸', '✨', '💫', '🎮',
    '🩷', '🌟', '💕', '🎀', '🕹️', '🌈',
    '💖', '⚡', '🦋', '🌙', '🪄', '🎵'
  ];

  const PARTICLE_COUNT = 28; // cantidad de partículas

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const el = document.createElement('span');
    el.classList.add('particle');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Posición horizontal aleatoria
    el.style.left = Math.random() * 100 + 'vw';

    // Duración de animación aleatoria (entre 8 y 22 segundos)
    const duration = 8 + Math.random() * 14;
    el.style.animationDuration = duration + 's';

    // Retraso aleatorio para que no salgan todas juntas
    el.style.animationDelay = Math.random() * duration + 's';

    // Tamaño levemente variable
    const size = 12 + Math.random() * 14;
    el.style.fontSize = size + 'px';

    container.appendChild(el);
  }
})();


/* ============================================================
   2. CUENTA REGRESIVA
============================================================ */
(function initCountdown() {
  // ─── FECHA OBJETIVO ───────────────────────────────────────
  // Formato ISO compatible con todos los navegadores móviles.
  // Ajustá la fecha aquí si cambia el evento.
  const TARGET_DATE = new Date('2026-06-20T17:00:00');
  // ──────────────────────────────────────────────────────────

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdown = document.getElementById('countdown');
  const partyMsg  = document.getElementById('party-msg');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  /**
   * Rellena un número con cero a la izquierda si es < 10.
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Aplica una animación "pop" al elemento cuando el valor cambia.
   * @param {HTMLElement} el
   */
  function pop(el) {
    el.classList.remove('pop');
    // fuerza reflow para reiniciar la animación CSS
    void el.offsetWidth;
    el.classList.add('pop');
    setTimeout(() => el.classList.remove('pop'), 300);
  }

  // Guardamos los valores anteriores para comparar
  let prev = { d: -1, h: -1, m: -1, s: -1 };

  /**
   * Actualiza el contador cada segundo.
   */
  function updateCountdown() {
    const now  = new Date();
    const diff = TARGET_DATE - now; // milisegundos restantes

    if (diff <= 0) {
      // ¡Llegó el gran día!
      countdown.hidden = true;
      partyMsg.hidden  = false;
      clearInterval(timer);
      launchConfetti(); // ¡celebración!
      return;
    }

    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor((diff / 1000 / 60 / 60) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    // Actualiza texto + animación solo si el valor cambió
    if (d !== prev.d) { daysEl.textContent    = pad(d); pop(daysEl);    prev.d = d; }
    if (h !== prev.h) { hoursEl.textContent   = pad(h); pop(hoursEl);   prev.h = h; }
    if (m !== prev.m) { minutesEl.textContent = pad(m); pop(minutesEl); prev.m = m; }
    if (s !== prev.s) { secondsEl.textContent = pad(s); pop(secondsEl); prev.s = s; }
  }

  // Corre de inmediato y luego cada segundo
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
})();


/* ============================================================
   3. CONFETI KAWAII (solo cuando llega el gran día)
============================================================ */
function launchConfetti() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const confettiSymbols = ['🎉', '🎊', '🎀', '💜', '⭐', '🌸', '🥳', '✨'];
  const COUNT = 40;

  for (let i = 0; i < COUNT; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.style.cssText = `
        position: fixed;
        top: -30px;
        left: ${Math.random() * 100}vw;
        font-size: ${20 + Math.random() * 20}px;
        animation: floatParticle ${3 + Math.random() * 4}s ease forwards;
        pointer-events: none;
        z-index: 9999;
      `;
      el.textContent = confettiSymbols[Math.floor(Math.random() * confettiSymbols.length)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 120);
  }
}


/* ============================================================
   4. BOTÓN WHATSAPP
============================================================ */
(function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;

  // Número sin caracteres especiales (solo dígitos, con código de país)
  const PHONE   = '595986613236';
  const MESSAGE = '¡Hola! Confirmo mi asistencia al cumpleaños de Luana Jazmín 🎉';

  const encoded = encodeURIComponent(MESSAGE);
  btn.href = `https://wa.me/${PHONE}?text=${encoded}`;
})();


/* ============================================================
   5. SCROLL REVEAL
============================================================ */
(function initScrollReveal() {
  // Agrega clase .reveal a todas las secciones
  const sections = document.querySelectorAll(
    '.countdown-section, .details-section, .rsvp-section, .site-footer'
  );

  sections.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // solo una vez
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. EFECTO SPARKLE AL TOCAR / HACER CLIC EN LA PANTALLA
============================================================ */
(function initSparkleClick() {
  const symbols = ['✨', '💜', '🌸', '⭐', '💫', '🩷'];

  function spawnSparkle(x, y) {
    const el = document.createElement('span');
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top:  ${y}px;
      font-size: ${16 + Math.random() * 14}px;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      animation: sparkleOut 0.7s ease forwards;
    `;
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  // Inyecta la animación sparkleOut dinámicamente
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkleOut {
      0%   { opacity: 1; transform: translate(-50%, -50%) scale(1);   }
      100% { opacity: 0; transform: translate(-50%, -80%) scale(1.8); }
    }
  `;
  document.head.appendChild(style);

  // Escucha clicks y toques
  document.addEventListener('click', (e) => spawnSparkle(e.clientX, e.clientY));
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    spawnSparkle(t.clientX, t.clientY);
  }, { passive: true });
})();