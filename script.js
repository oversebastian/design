(() => {
  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 8800;
  const SECTION_Y = {
    about: 1116,
    portfolio: 3207,
    payment: 5699,
    links: 6538,
    contact: 7365
  };
  const stage = document.getElementById('landing');
  const viewport = document.getElementById('viewport');
  let scale = 1;

  function fitDesign() {
    scale = Math.min(1, window.innerWidth / DESIGN_WIDTH);
    const renderedWidth = DESIGN_WIDTH * scale;
    const left = Math.max(0, (window.innerWidth - renderedWidth) / 2);

    stage.style.left = `${left}px`;
    stage.style.transform = `scale(${scale})`;
    viewport.style.height = `${DESIGN_HEIGHT * scale}px`;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      const top = (SECTION_Y[target.id] ?? target.offsetTop) * scale;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  fitDesign();
  window.addEventListener('resize', fitDesign, { passive: true });
})();

(() => {
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const mobileSite = document.getElementById('mobile-site');
  if (!mobileSite) return;

  const panels = Array.from(mobileSite.querySelectorAll('.mobile-panel'));
  const menuButtons = Array.from(mobileSite.querySelectorAll('[data-mobile-target]'));
  let activeIndex = -1;
  let observer;

  function activatePanel(index) {
    if (!mobileQuery.matches || !Number.isInteger(index) || index < 0 || index >= panels.length || activeIndex === index) return;
    activeIndex = index;

    panels.forEach((panel, panelIndex) => {
      panel.classList.toggle('is-active', panelIndex === index);
      panel.classList.toggle('is-past', panelIndex < index);
      panel.classList.toggle('is-future', panelIndex > index);
      panel.classList.toggle('is-open', panelIndex <= index);
    });
  }

  function bindObserver() {
    if (observer) observer.disconnect();
    if (!mobileQuery.matches) return;

    observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * .28) - Math.abs(b.boundingClientRect.top - window.innerHeight * .28));

      if (visible.length) {
        const panel = visible[0].target.closest('.mobile-panel');
        activatePanel(Number(panel?.dataset.mobileIndex));
      }
    }, { rootMargin: '-18% 0px -64% 0px', threshold: 0 });

    panels.forEach((panel) => observer.observe(panel.querySelector('.m-title')));
  }

  menuButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.dataset.mobileTarget);
      if (!panel) return;
      const index = Number(panel.dataset.mobileIndex);
      activatePanel(index);
      window.scrollTo({ top: panel.offsetTop, behavior: 'smooth' });
    });
  });

  mobileQuery.addEventListener('change', () => {
    if (!mobileQuery.matches) {
      activeIndex = -1;
      panels.forEach((panel) => panel.classList.remove('is-active', 'is-past', 'is-future', 'is-open'));
    }
    bindObserver();
  });

  bindObserver();
})();
