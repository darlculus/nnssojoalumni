// ===== PRELOADER =====
(function () {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
    <div class="pre-inner">
      <svg class="pre-anchor" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle class="pre-ring" cx="40" cy="40" r="36"/>
        <g transform="translate(40,40)">
          <circle cx="0" cy="-12" r="5" fill="none" stroke="#FFD700" stroke-width="2.5"/>
          <line x1="0" y1="-7" x2="0" y2="14" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="-8" y1="-1" x2="8" y2="-1" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M-8,14 Q-14,14 -14,8 Q-14,2 -8,2" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M8,14 Q14,14 14,8 Q14,2 8,2" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
      <div class="pre-waves">
        <span></span><span></span><span></span>
      </div>
      <div class="pre-text">NNSS OJO ALUMNI</div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #preloader {
      position: fixed; inset: 0; z-index: 9999;
      background: linear-gradient(135deg, #001a33 0%, #003366 60%, #004080 100%);
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }
    #preloader.hide { opacity: 0; visibility: hidden; }
    .pre-inner { display: flex; flex-direction: column; align-items: center; gap: 24px; }
    .pre-anchor { width: 90px; height: 90px; animation: pre-bob 1.6s ease-in-out infinite; filter: drop-shadow(0 0 18px rgba(255,215,0,0.5)); }
    .pre-ring { fill: rgba(255,255,255,0.06); stroke: rgba(255,215,0,0.25); stroke-width: 2; }
    @keyframes pre-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .pre-waves { display: flex; gap: 8px; align-items: flex-end; height: 28px; }
    .pre-waves span {
      display: block; width: 5px; border-radius: 3px;
      background: linear-gradient(to top, #FFD700, rgba(255,215,0,0.3));
      animation: pre-wave 1.1s ease-in-out infinite;
    }
    .pre-waves span:nth-child(1){ height:14px; animation-delay:0s; }
    .pre-waves span:nth-child(2){ height:22px; animation-delay:0.18s; }
    .pre-waves span:nth-child(3){ height:14px; animation-delay:0.36s; }
    @keyframes pre-wave { 0%,100%{transform:scaleY(0.5);opacity:0.5} 50%{transform:scaleY(1);opacity:1} }
    .pre-text {
      font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 4px; color: rgba(255,255,255,0.45); text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(preloader);

  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 300);
  });
})();

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HAMBURGER + OVERLAY =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Inject overlay into DOM once
let overlay = document.querySelector('.nav-overlay');
if (!overlay && hamburger) {
  overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);
}

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
}

if (overlay) {
  overlay.addEventListener('click', closeMenu);
}

// Close on nav link click — let navigation happen, just clean up body state
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Close on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ===== SETS FILTER =====
document.querySelectorAll('.set-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.set-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ===== SCROLL TO TOP — ANCHOR WITH PROGRESS RING =====
(function () {
  // Inject the SVG button
  const btn = document.createElement('div');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');

  // circumference of circle r=20 => 2*PI*20 ≈ 125.66
  const C = 125.66;

  btn.innerHTML = `
    <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle class="ring-track" cx="26" cy="26" r="23"/>
      <!-- Progress ring -->
      <circle class="ring-progress" cx="26" cy="26" r="20"/>
      <!-- Inner disc -->
      <circle class="anchor-bg" cx="26" cy="26" r="18"/>
      <!-- Anchor icon -->
      <g class="anchor-icon" transform="translate(26,26)">
        <!-- Ring at top -->
        <circle cx="0" cy="-8" r="3.5" fill="none" stroke="#FFD700" stroke-width="1.8"/>
        <!-- Vertical bar -->
        <line x1="0" y1="-4.5" x2="0" y2="8" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Horizontal bar -->
        <line x1="-5" y1="-1" x2="5" y2="-1" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Left curl -->
        <path d="M-5,8 Q-9,8 -9,4.5 Q-9,1 -5,1" fill="none" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Right curl -->
        <path d="M5,8 Q9,8 9,4.5 Q9,1 5,1" fill="none" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Up arrow -->
        <polyline points="-3.5,-11 0,-15 3.5,-11" fill="none" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `;

  document.body.appendChild(btn);

  const ring = btn.querySelector('.ring-progress');
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C;

  // Show/hide + update progress ring on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;

    // Show after 300px
    btn.classList.toggle('visible', scrollTop > 300);

    // Update ring
    ring.style.strokeDashoffset = C - pct * C;
  }, { passive: true });

  // Click to scroll top
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard support
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
