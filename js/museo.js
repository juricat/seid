(function () {
  const burger = document.getElementById('mvBurger');
  const drawer = document.getElementById('mvDrawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
    });
    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      })
    );
  }

  document.querySelectorAll('.mv-amount').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mv-amount').forEach(b => b.classList.remove('mv-amount--active'));
      btn.classList.add('mv-amount--active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
