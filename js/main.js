/* SEID - GSAP animations */
gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Helpers ---------- */
function splitWords(el) {
  if (el.dataset.split === '1') return el.querySelectorAll('.word');
  const text = el.textContent;
  el.textContent = '';
  text.split(/(\s+)/).forEach((tok) => {
    if (/\s+/.test(tok)) {
      el.appendChild(document.createTextNode(tok));
    } else if (tok.length) {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.display = 'inline-block';
      span.textContent = tok;
      el.appendChild(span);
    }
  });
  el.dataset.split = '1';
  return el.querySelectorAll('.word');
}

/* ---------- Header state switcher (transparent over hero, solid after) ---------- */
const header = document.getElementById('siteHeader');
const heroBanner = document.getElementById('heroBanner');
if (header && heroBanner) {
  let currentState = 'transparent';
  const updateHeaderState = () => {
    const threshold = heroBanner.offsetHeight - 10;
    const next = window.scrollY >= threshold ? 'solid' : 'transparent';
    if (next !== currentState) {
      currentState = next;
      header.setAttribute('data-state', next);
    }
  };
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);
  updateHeaderState();
}

/* ---------- Right edge accent cursor: follows scroll progress ---------- */
const edgeInner = document.querySelector('.edge-accent__inner');
if (edgeInner) {
  gsap.to(edgeInner, {
    top: 'calc(100% - 72px)',
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.4 }
  });
}

/* ---------- Hero banner intro ---------- */
const heroTitleHi = document.querySelector('.js-hi');
const heroTitleText = document.querySelector('.js-hi-text');
if (heroTitleHi && heroTitleText && !reduceMotion) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  gsap.set([heroTitleHi, heroTitleText], { y: 60, opacity: 0 });
  tl.to(heroTitleHi, { y: 0, opacity: 1, duration: 0.9 }, 0.1)
    .to(heroTitleText, { y: 0, opacity: 1, duration: 1.1 }, 0.35)
    .from('.hero-banner__buttons .btn', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    }, 0.7);
}

/* ---------- Generic fade-up on scroll ---------- */
gsap.utils.toArray('.js-fade-up').forEach((el) => {
  gsap.fromTo(el,
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Reveal headings (mask-style) ---------- */
gsap.utils.toArray('.js-reveal').forEach((el) => {
  gsap.fromTo(el,
    { y: 80, opacity: 0, skewY: 3 },
    {
      y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Word-by-word reveal ---------- */
gsap.utils.toArray('.js-words').forEach((el) => {
  const words = splitWords(el);
  gsap.fromTo(words,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      stagger: 0.03,
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Cards stagger ---------- */
gsap.utils.toArray('.projects-grid, .data-grid').forEach((grid) => {
  gsap.fromTo(grid.querySelectorAll('.js-card'),
    { y: 60, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  );
});

/* ---------- Parallax images ---------- */
gsap.utils.toArray('.js-parallax img').forEach((img) => {
  gsap.to(img, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.js-parallax'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});

/* ---------- Counters ---------- */
gsap.utils.toArray('[data-counter]').forEach((el) => {
  const target = parseInt(el.dataset.target, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const numEl = el.querySelector('.num');
  const sufEl = el.querySelector('.suf');
  if (!numEl || !sufEl) return;
  sufEl.textContent = suffix;
  numEl.textContent = '00';
  const obj = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.to(obj, {
        val: target, duration: 1.8, ease: 'power3.out',
        onUpdate() {
          const v = Math.round(obj.val);
          numEl.textContent = v < 10 ? '0' + v : '' + v;
        }
      });
    }
  });
});

/* ---------- Accordion ---------- */
const items = document.querySelectorAll('[data-item]');
items.forEach((item) => {
  const header = item.querySelector('[data-header]');
  const body = item.querySelector('[data-body]');

  // Initialize open state
  if (item.classList.contains('is-open')) {
    gsap.set(body, { height: 'auto', opacity: 1 });
  } else {
    gsap.set(body, { height: 0, opacity: 0 });
  }

  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    // Close all others
    items.forEach((other) => {
      if (other !== item && other.classList.contains('is-open')) {
        const otherBody = other.querySelector('[data-body]');
        other.classList.remove('is-open');
        gsap.to(otherBody, {
          height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut'
        });
      }
    });

    if (isOpen) {
      item.classList.remove('is-open');
      gsap.to(body, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    } else {
      item.classList.add('is-open');
      gsap.fromTo(body,
        { height: 0, opacity: 0 },
        {
          height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.inOut',
          onComplete: () => ScrollTrigger.refresh()
        }
      );
    }
  });
});

/* ---------- Mobile drawer ---------- */
const burger = document.getElementById('hamburger');
const drawer = document.getElementById('mobileDrawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    drawer.classList.toggle('is-open', !expanded);
    drawer.setAttribute('aria-hidden', String(expanded));
    document.body.style.overflow = !expanded ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Button magnetic hover (light, desktop only) ---------- */
if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { y: -2, duration: 0.25, ease: 'power2.out' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { y: 0, duration: 0.35, ease: 'power3.out' }));
  });
}

/* ---------- Refresh ScrollTrigger after fonts load ---------- */
document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
