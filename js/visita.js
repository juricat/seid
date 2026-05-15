(function () {
  const items = document.querySelectorAll('[data-faq-item]');
  items.forEach(item => {
    const toggle = item.querySelector('[data-faq-toggle]');
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();
