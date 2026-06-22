/* ══════════════════════════════════════════════════════
   OLUM v2 — main.js
   All animations, interactions & scroll effects
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PARTICLE CANVAS ── */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.2);
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = ['#4B6CF5','#7c3aed','#06b6d4','#93c5fd'][Math.floor(Math.random()*4)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  /* ── 2. SCROLL REVEAL (up / left / right) ── */
  const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.hiw-progress');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));


  /* ── 3. NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ── 4. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ── 5. EXAMPLE CHIPS ── */
  document.querySelectorAll('.ex-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('heroInput');
      if (input) { input.value = chip.dataset.domain; input.focus(); }
      chip.style.transform = 'scale(0.92)';
      setTimeout(() => chip.style.transform = '', 150);
    });
  });


  /* ── 6. ANALYZE BUTTON ── */
  document.querySelectorAll('.btn-analyse').forEach(btn => {
    btn.addEventListener('click', () => {
      const bar   = btn.closest('.domain-bar');
      const input = bar ? bar.querySelector('input') : null;
      if (!input || !input.value.trim()) {
        if (bar) { bar.classList.add('shake'); setTimeout(() => bar.classList.remove('shake'), 400); }
        if (input) input.focus();
        return;
      }
      const orig = btn.innerHTML;
      btn.innerHTML = `Analyzing…
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;
      btn.style.background = '#4B6CF5';
      btn.querySelector('svg').style.animation = 'spin 1s linear infinite';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2400);
    });
  });


  /* ── 7. COUNTER ANIMATION ── */
  function animateCount(el, target, duration) {
    const start = performance.now();
    const update = ts => {
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target, parseInt(e.target.dataset.target, 10), 950);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));


  /* ── 8. ACTION ITEMS STAGGER ── */
  const actItems = document.querySelectorAll('.act-item');
  const actObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      actItems.forEach((el, i) => setTimeout(() => el.classList.add('animated'), i * 110));
      actObs.disconnect();
    }
  }, { threshold: 0.15 });
  const actCard = document.querySelector('.actions-card');
  if (actCard) actObs.observe(actCard);


  /* ── 9. BRAND ROW STAGGER ── */
  const brands = document.querySelectorAll('.brand-row .bl');
  brands.forEach(b => {
    b.style.opacity = '0';
    b.style.transform = 'translateY(14px)';
    b.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  const brandObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      brands.forEach((b, i) => setTimeout(() => {
        b.style.opacity = '.7';
        b.style.transform = 'translateY(0)';
      }, i * 80));
      brandObs.disconnect();
    }
  }, { threshold: 0.2 });
  const brandRow = document.querySelector('.brand-row');
  if (brandRow) brandObs.observe(brandRow);


  /* ── 10. OUTPUT CARD ROWS STAGGER ── */
  const ocRows = document.querySelectorAll('.oc-row');
  ocRows.forEach(r => {
    r.style.opacity = '0';
    r.style.transform = 'translateX(-12px)';
    r.style.transition = 'opacity .38s ease, transform .38s ease';
  });
  const ocObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      ocRows.forEach((r, i) => setTimeout(() => {
        r.style.opacity = '1';
        r.style.transform = 'translateX(0)';
      }, i * 65));
      ocObs.disconnect();
    }
  }, { threshold: 0.1 });
  const ocCard = document.querySelector('.output-card');
  if (ocCard) ocObs.observe(ocCard);


  /* ── 11. CREATES LIST ITEMS STAGGER ── */
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach(li => {
    li.style.opacity = '0';
    li.style.transform = 'translateX(-16px)';
    li.style.transition = 'opacity .4s ease, transform .4s ease';
  });
  const listObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      listItems.forEach((li, i) => setTimeout(() => {
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
      }, i * 80));
      listObs.disconnect();
    }
  }, { threshold: 0.1 });
  const createsList = document.querySelector('.creates-list');
  if (createsList) listObs.observe(createsList);


  /* ── 12. TYPING PLACEHOLDER ── */
  const heroInput = document.getElementById('heroInput');
  if (heroInput) {
    const examples = ['saasapp.com', 'citydentalclinic.com', 'smartaccounting.com', 'mybrand.store'];
    let idx = 0, charIdx = 0, deleting = false, waiting = false;
    function type() {
      if (document.activeElement === heroInput || heroInput.value) {
        setTimeout(type, 400);
        return;
      }
      const cur = examples[idx];
      if (!deleting && !waiting) {
        charIdx++;
        heroInput.placeholder = 'Enter your domain (e.g. ' + cur.slice(0, charIdx) + (charIdx < cur.length ? '|' : ')');
        if (charIdx === cur.length) {
          waiting = true;
          setTimeout(() => { waiting = false; deleting = true; type(); }, 2200);
          return;
        }
      } else if (deleting) {
        charIdx--;
        heroInput.placeholder = charIdx > 0
          ? 'Enter your domain (e.g. ' + cur.slice(0, charIdx) + ')'
          : 'Enter your domain (e.g. yourbusiness.com)';
        if (charIdx === 0) { deleting = false; idx = (idx + 1) % examples.length; }
      }
      setTimeout(type, deleting ? 36 : 85);
    }
    setTimeout(type, 3000);
  }


  /* ── 13. DEMO CARDS SUBTLE PARALLAX ── */
  const demoPair = document.querySelector('.demo-cards-sidebyside');
  if (demoPair) {
    window.addEventListener('scroll', () => {
      const rect = demoPair.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.022;
        demoPair.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }


  /* ── 14. STEP CARDS MOUSE TILT ── */
  document.querySelectorAll('.step').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2)  / (r.width / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 15. LOCAL FEATS STAGGER ── */
  const feats = document.querySelectorAll('.lfeat');
  feats.forEach(f => {
    f.style.opacity = '0';
    f.style.transform = 'translateX(-14px)';
    f.style.transition = 'opacity .4s ease, transform .4s ease';
  });
  const featObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      feats.forEach((f, i) => setTimeout(() => {
        f.style.opacity = '1';
        f.style.transform = 'translateX(0)';
      }, i * 90));
      featObs.disconnect();
    }
  }, { threshold: 0.15 });
  const localLeft = document.querySelector('.local-left');
  if (localLeft) featObs.observe(localLeft);


  /* ── 16. HERO H1 TEXT SHIMMER — disabled, using plain white */


  /* ── 17. NAV LINK ACTIVE HIGHLIGHT on scroll ── */
  // (smooth section tracking — optional enhancement)


  /* ── 18. SERP RESULT TYPEWRITER EFFECT ── */
  const serpSnip = document.querySelector('.serp-snip');
  if (serpSnip) {
    const fullText = serpSnip.textContent;
    serpSnip.textContent = '';
    const serpObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let i = 0;
        const iv = setInterval(() => {
          serpSnip.textContent = fullText.slice(0, ++i);
          if (i >= fullText.length) clearInterval(iv);
        }, 22);
        serpObs.disconnect();
      }
    }, { threshold: 0.8 });
    serpObs.observe(serpSnip);
  }

});
