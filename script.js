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
