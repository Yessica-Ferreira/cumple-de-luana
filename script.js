/**
 * script.js — Invitación Kawaii Gamer · Sistema de SLIDES
 * Luana Jazmín 🎀 8 años
 */

/* ============================================================
   1. SISTEMA DE SLIDES
============================================================ */
(function initSlider() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.nav-dot'));
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const labelEl = document.getElementById('slide-label');

  const TOTAL = slides.length;

  let current = 0;
  let isAnimating = false;

  function goTo(index) {
    if (index === current || isAnimating) return;
    if (index < 0 || index >= TOTAL) return;

    isAnimating = true;

    const prev = current;
    current = index;

    slides[prev].classList.remove('active');
    slides[prev].classList.add('passed');

    if (index < prev) {
      slides[prev].classList.remove('passed');
      slides[prev].style.transform = 'translateX(100%)';
    }

    slides[current].classList.add('active');

    setTimeout(() => {
      slides.forEach((slide, i) => {
        if (i !== current) {
          slide.classList.remove('active', 'passed');
          slide.style.transform = '';
        }
      });

      isAnimating = false;
    }, 460);

    updateUI();
  }

  function updateUI() {
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === TOTAL - 1;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    if (labelEl) {
      labelEl.textContent = `${current + 1} / ${TOTAL}`;
    }
  }

  slides.forEach((slide, i) => {
    if (i === 0) {
      slide.classList.add('active');
    }
  });

  updateUI();

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goTo(current + 1);
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goTo(current - 1);
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx < 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
    }
  }, { passive: true });
})();

/* ============================================================
   2. PARTÍCULAS FLOTANTES
============================================================ */
(function initParticles() {
  const container = document.getElementById('particles-container');

  if (!container) return;

  const symbols = [
    '⭐', '💜', '🌸', '✨', '💫', '🎮', '🩷',
    '🌟', '💕', '🎀', '🕹️', '🌈', '💖', '⚡', '🦋'
  ];

  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');

    el.classList.add('particle');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    el.style.left = Math.random() * 100 + 'vw';

    const duration = 9 + Math.random() * 13;

    el.style.animationDuration = duration + 's';
    el.style.animationDelay = Math.random() * duration + 's';
    el.style.fontSize = (11 + Math.random() * 13) + 'px';

    container.appendChild(el);
  }
})();

/* ============================================================
   3. CUENTA REGRESIVA DINÁMICA
============================================================ */
(function initCountdown() {
  const TARGET = new Date('2026-06-20T17:00:00');

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const countdownEl = document.getElementById('countdown');
  const partyEl = document.getElementById('party-msg');

  if (!daysEl) return;

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function pop(element) {
    element.classList.remove('pop');

    void element.offsetWidth;

    element.classList.add('pop');

    setTimeout(() => {
      element.classList.remove('pop');
    }, 300);
  }

  let previous = {
    d: -1,
    h: -1,
    m: -1,
    s: -1
  };

  function tick() {
    const diff = TARGET - new Date();

    if (diff <= 0) {
      countdownEl.hidden = true;
      partyEl.hidden = false;

      clearInterval(timer);
      launchConfetti();

      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (d !== previous.d) {
      daysEl.textContent = pad(d);
      pop(daysEl);
      previous.d = d;
    }

    if (h !== previous.h) {
      hoursEl.textContent = pad(h);
      pop(hoursEl);
      previous.h = h;
    }

    if (m !== previous.m) {
      minutesEl.textContent = pad(m);
      pop(minutesEl);
      previous.m = m;
    }

    if (s !== previous.s) {
      secondsEl.textContent = pad(s);
      pop(secondsEl);
      previous.s = s;
    }
  }

  tick();

  const timer = setInterval(tick, 1000);
})();

/* ============================================================
   4. CONFETI
============================================================ */
function launchConfetti() {
  const symbols = ['🎉', '🎊', '🎀', '💜', '⭐', '🌸', '🥳', '✨'];

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('span');

      Object.assign(el.style, {
        position: 'fixed',
        top: '-30px',
        left: Math.random() * 100 + 'vw',
        fontSize: (18 + Math.random() * 18) + 'px',
        animation: `floatP ${3 + Math.random() * 4}s ease forwards`,
        pointerEvents: 'none',
        zIndex: '9999'
      });

      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      document.body.appendChild(el);

      setTimeout(() => {
        el.remove();
      }, 8000);
    }, i * 120);
  }
}

/* ============================================================
   5. BOTÓN WHATSAPP
============================================================ */
(function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');

  if (!btn) return;

  const phone = '595986613236';
  const message = '¡Hola! Confirmo mi asistencia al cumpleaños de Luana Jazmín 🎉';

  btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
})();

/* ============================================================
   6. EFECTO SPARKLE AL TOCAR / CLIC
============================================================ */
(function initSparkle() {
  const symbols = ['✨', '💜', '🌸', '⭐', '💫', '🩷', '🎀'];

  function spawn(x, y) {
    const el = document.createElement('span');

    Object.assign(el.style, {
      position: 'fixed',
      left: x + 'px',
      top: y + 'px',
      fontSize: (14 + Math.random() * 14) + 'px',
      pointerEvents: 'none',
      zIndex: '9998',
      transform: 'translate(-50%, -50%)',
      animation: 'sparkleOut 0.7s ease forwards'
    });

    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 700);
  }

  if (!document.getElementById('sparkle-style')) {
    const style = document.createElement('style');

    style.id = 'sparkle-style';

    style.textContent = `
      @keyframes sparkleOut {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        100% {
          opacity: 0;
          transform: translate(-50%, -80%) scale(1.8);
        }
      }
    `;

    document.head.appendChild(style);
  }

  document.addEventListener('click', (e) => {
    spawn(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];

    spawn(touch.clientX, touch.clientY);
  }, { passive: true });
})();

/* ============================================================
   7. MÚSICA DE FONDO
============================================================ */
(function initMusic() {
  const audio = document.getElementById('musica-fondo');
  const btn = document.getElementById('music-btn');

  if (!audio || !btn) return;

  let isPlaying = false;

  audio.volume = 0.45;

  btn.addEventListener('click', async () => {
    try {
      if (!isPlaying) {
        await audio.play();

        isPlaying = true;
        btn.classList.add('playing');
        btn.textContent = '⏸️ Pausar Música';
        btn.setAttribute('aria-label', 'Pausar música');
      } else {
        audio.pause();

        isPlaying = false;
        btn.classList.remove('playing');
        btn.textContent = '🎵 Reproducir Música';
        btn.setAttribute('aria-label', 'Reproducir música');
      }
    } catch (error) {
      console.log('El navegador bloqueó la reproducción automática:', error);
    }
  });
})();