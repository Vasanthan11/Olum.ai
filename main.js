/* ══════════════════════════════════════════════════════
   OLUM — main.js  (final)
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PARTICLE CANVAS ── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
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
        this.x     = Math.random() * W;
        this.y     = init ? Math.random() * H : H + 10;
        this.r     = Math.random() * 2 + 0.5;
        this.vx    = (Math.random() - 0.5) * 0.3;
        this.vy    = -(Math.random() * 0.4 + 0.15);
        this.alpha = Math.random() * 0.35 + 0.05;
        this.color = ['#4B6CF5','#7c3aed','#06b6d4','#93c5fd'][Math.floor(Math.random()*4)];
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle  = this.color;
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
  }


  /* ── 2. SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.hiw-progress');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));


  /* ── 3. NAVBAR: transparent on hero, solid when scrolled ── */
  const navbar = document.getElementById('navbar');
  const hero   = document.getElementById('hero');

  function updateNav() {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });


  /* ── 4. HERO BG PARALLAX on scroll (Mac-style Ken Burns + scroll drift) ── */
  const heroBg = document.getElementById('heroBgParallax');
  if (heroBg && hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroH    = hero.offsetHeight;
      if (scrolled < heroH) {
        // Scroll down → image drifts up slower than page (parallax)
        const offset = scrolled * 0.35;
        heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
      }
    }, { passive: true });

    // Mouse parallax tilt — subtle Mac-style depth
    hero.addEventListener('mousemove', e => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 14;
      const cy = (e.clientY / window.innerHeight - 0.5) * 8;
      heroBg.style.transform = `translate(${cx}px, ${cy}px) scale(1.08)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = '';
    });
  }


  /* ── 5. HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
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
  }


  /* ── 6. SMOOTH SCROLL for anchor nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 68; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 7. EXAMPLE CHIPS ── */
  document.querySelectorAll('.ex-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('heroInput');
      if (input) { input.value = chip.dataset.domain; input.focus(); }
      chip.style.transform = 'scale(0.92)';
      setTimeout(() => chip.style.transform = '', 160);
    });
  });


  /* ── 8. ANALYZE BUTTONS ── */
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation:spin 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;
      btn.style.background = '#4B6CF5';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2400);
    });
  });


  /* ── 9. COUNTER ANIMATION ── */
  function animateCount(el, target, duration) {
    const start  = performance.now();
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


  /* ── 10. ACTION ITEMS STAGGER ── */
  const actItems = document.querySelectorAll('.act-item');
  const actCard  = document.querySelector('.actions-card');
  if (actCard) {
    const actObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        actItems.forEach((el, i) => setTimeout(() => el.classList.add('animated'), i * 110));
        actObs.disconnect();
      }
    }, { threshold: 0.15 });
    actObs.observe(actCard);
  }


  /* ── 11. BRAND ROW STAGGER ── */
  const brands = document.querySelectorAll('.brand-row .bl');
  brands.forEach(b => { b.style.opacity = '0'; b.style.transform = 'translateY(14px)'; b.style.transition = 'opacity .5s ease, transform .5s ease'; });
  const brandRow = document.querySelector('.brand-row');
  if (brandRow) {
    const brandObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        brands.forEach((b, i) => setTimeout(() => { b.style.opacity = '.7'; b.style.transform = 'translateY(0)'; }, i * 80));
        brandObs.disconnect();
      }
    }, { threshold: 0.2 });
    brandObs.observe(brandRow);
  }


  /* ── 12. OUTPUT CARD ROWS STAGGER ── */
  const ocRows = document.querySelectorAll('.oc-row');
  ocRows.forEach(r => { r.style.opacity = '0'; r.style.transform = 'translateX(-12px)'; r.style.transition = 'opacity .38s ease, transform .38s ease'; });
  const ocCard = document.querySelector('.output-card');
  if (ocCard) {
    const ocObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        ocRows.forEach((r, i) => setTimeout(() => { r.style.opacity = '1'; r.style.transform = 'translateX(0)'; }, i * 65));
        ocObs.disconnect();
      }
    }, { threshold: 0.1 });
    ocObs.observe(ocCard);
  }


  /* ── 13. CREATES LIST ITEMS STAGGER ── */
  const listItems = document.querySelectorAll('.list-item');
  listItems.forEach(li => { li.style.opacity = '0'; li.style.transform = 'translateX(-16px)'; li.style.transition = 'opacity .4s ease, transform .4s ease'; });
  const createsList = document.querySelector('.creates-list');
  if (createsList) {
    const listObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        listItems.forEach((li, i) => setTimeout(() => { li.style.opacity = '1'; li.style.transform = 'translateX(0)'; }, i * 80));
        listObs.disconnect();
      }
    }, { threshold: 0.1 });
    listObs.observe(createsList);
  }


  /* ── 14. TYPING PLACEHOLDER ── */
  const heroInput = document.getElementById('heroInput');
  if (heroInput) {
    const examples = ['saasapp.com', 'citydentalclinic.com', 'smartaccounting.com', 'mybrand.store'];
    let idx = 0, charIdx = 0, deleting = false, waiting = false;
    function type() {
      if (document.activeElement === heroInput || heroInput.value) { setTimeout(type, 400); return; }
      const cur = examples[idx];
      if (!deleting && !waiting) {
        charIdx++;
        heroInput.placeholder = 'Enter your domain (e.g. ' + cur.slice(0, charIdx) + (charIdx < cur.length ? '|' : ')');
        if (charIdx === cur.length) { waiting = true; setTimeout(() => { waiting = false; deleting = true; type(); }, 2200); return; }
      } else if (deleting) {
        charIdx--;
        heroInput.placeholder = charIdx > 0 ? 'Enter your domain (e.g. ' + cur.slice(0, charIdx) + ')' : 'Enter your domain (e.g. yourbusiness.com)';
        if (charIdx === 0) { deleting = false; idx = (idx + 1) % examples.length; }
      }
      setTimeout(type, deleting ? 36 : 85);
    }
    setTimeout(type, 3000);
  }


  /* ── 15. DEMO CARDS PARALLAX ── */
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


  /* ── 16. STEP CARDS MOUSE TILT ── */
  document.querySelectorAll('.step').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });


  /* ── 17. LOCAL FEATS STAGGER ── */
  const feats    = document.querySelectorAll('.lfeat');
  const localLeft = document.querySelector('.local-left');
  feats.forEach(f => { f.style.opacity = '0'; f.style.transform = 'translateX(-14px)'; f.style.transition = 'opacity .4s ease, transform .4s ease'; });
  if (localLeft) {
    const featObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        feats.forEach((f, i) => setTimeout(() => { f.style.opacity = '1'; f.style.transform = 'translateX(0)'; }, i * 90));
        featObs.disconnect();
      }
    }, { threshold: 0.15 });
    featObs.observe(localLeft);
  }


  /* ── 18. SERP SNIPPET TYPEWRITER ── */
  const serpSnip = document.getElementById('serpSnipText');
  if (serpSnip) {
    const fullText = serpSnip.textContent.trim();
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


  /* ── 19. CHATGPT ANSWER TYPEWRITER (equal-height card) ── */
  const chatAnswerEl = document.getElementById('chatAnswerText');
  const chatCard     = document.getElementById('chatgptCard') || document.querySelector('.demo-card-chat');
  const chatFullText = 'Olum is a great option for startups looking for an all-in-one solution for project management.';

  if (chatAnswerEl && chatCard) {
    const chatObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let i = 0;
        // Add cursor
        chatAnswerEl.innerHTML = '<span class="typewriter-cursor"></span>';
        setTimeout(() => {
          chatAnswerEl.innerHTML = '';
          const cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          chatAnswerEl.appendChild(cursor);

          const iv = setInterval(() => {
            const typed = chatFullText.slice(0, ++i);
            // Bold "Olum" and "project management."
            const formatted = typed
              .replace(/^(Olum)/, '<strong>$1</strong>')
              .replace(/(project management\.)$/, '<strong>$1</strong>');
            chatAnswerEl.innerHTML = formatted + '<span class="typewriter-cursor"></span>';
            if (i >= chatFullText.length) {
              clearInterval(iv);
              chatAnswerEl.innerHTML = formatted; // remove cursor at end
            }
          }, 28);
        }, 400);
        chatObs.disconnect();
      }
    }, { threshold: 0.7 });
    chatObs.observe(chatCard);
  }


  /* ── 20. AI OVERVIEW SNIPPET FADE IN ── */
  const aiSnip = document.getElementById('aiOverviewSnip');
  if (aiSnip) {
    aiSnip.style.opacity = '0';
    aiSnip.style.transition = 'opacity .8s ease .6s';
    const aiObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => aiSnip.style.opacity = '1', 300);
        aiObs.disconnect();
      }
    }, { threshold: 0.6 });
    aiObs.observe(aiSnip);
  }


  /* ── 21. MAP PIN LIVE RIPPLE ── */
  const mapPinWrap = document.querySelector('.map-pin-wrap');
  if (mapPinWrap) {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes pinRippleDyn {
        0%   { transform:translateX(-50%) scale(1);   opacity:.7; }
        100% { transform:translateX(-50%) scale(3.4); opacity:0;  }
      }`;
    document.head.appendChild(styleTag);
    function createRipple() {
      const r = document.createElement('span');
      r.style.cssText = `
        position:absolute; bottom:-4px; left:50%;
        width:16px; height:7px; border-radius:50%;
        background:rgba(229,57,53,.35);
        filter:blur(2px);
        animation:pinRippleDyn 1.5s ease-out forwards;
        pointer-events:none; z-index:2;`;
      mapPinWrap.appendChild(r);
      setTimeout(() => r.remove(), 1500);
    }
    setInterval(createRipple, 2000);
  }


  /* ── 22. PLAT ICONS STAGGER ── */
  const platItems = document.querySelectorAll('.plat');
  platItems.forEach(p => { p.style.opacity = '0'; p.style.transform = 'translateY(8px)'; p.style.transition = 'opacity .35s ease, transform .35s ease'; });
  const platsWrap = document.querySelector('.plats');
  if (platsWrap) {
    const platObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        platItems.forEach((p, i) => setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; }, i * 80));
        platObs.disconnect();
      }
    }, { threshold: 0.3 });
    platObs.observe(platsWrap);
  }

});
