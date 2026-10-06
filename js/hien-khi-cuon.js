/* ==========================================================================
   hien-khi-cuon.js — HIỆN KHI CUỘN (REVEAL-ON-SCROLL)
   Tách từ index.html, không đổi logic: script dòng 2140–2223.
   IntersectionObserver cho intro, sticky globe và timeline: thêm class .visible khi cuộn tới.
   ========================================================================== */
(function () {
  const globeTitle = document.getElementById('globeTitle');
  const globeStats = document.getElementById('globeStats');
  /* INTRO reveal */
  const introSection = document.getElementById('intro');
  if (introSection) {
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.25 });
    introObserver.observe(introSection);
  }

  /* GLOBE SECTION */
  const stickySection = document.getElementById('globeStickySection');
  function checkGlobeSection() {
    const rect = stickySection.getBoundingClientRect();
    const totalScrollable = stickySection.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const p = Math.max(0, Math.min(1, scrolled / totalScrollable));
    if (p > 0.10 && p < 0.90) {
      globeTitle.classList.add('active');
      globeStats.classList.add('active');
    } else {
      globeTitle.classList.remove('active');
      globeStats.classList.remove('active');
    }
  }
  window.addEventListener('scroll', checkGlobeSection, { passive: true });
  checkGlobeSection();

  /* TIMELINE reveal */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  timelineItems.forEach(item => journeyObserver.observe(item));
})();
