// ===== HERO VIDEO CAROUSEL =====
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const counter = document.querySelector('.hero-counter .current');
  const captionEl = document.querySelector('.slide-caption span');
  const progressBar = document.querySelector('.hero-progress');

  const captions = [
    'Passing Out Parade — Class of 2003',
    'Annual Reunion — Lagos, 2023',
    'Sports Day — School Grounds',
    'Alumni Gala Night — Abuja, 2022'
  ];

  let current = 0;
  let timer = null;
  const INTERVAL = 6000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    if (captionEl) captionEl.textContent = captions[current] || '';

    // Restart progress bar animation
    if (progressBar) {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // reflow
      progressBar.style.animation = `progress ${INTERVAL}ms linear`;
    }

    // Play video if present
    const video = slides[current].querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Arrow buttons
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

  // Touch/swipe support
  let touchStartX = 0;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft') { prev(); startTimer(); }
  });

  // Init
  goTo(0);
  startTimer();
})();
