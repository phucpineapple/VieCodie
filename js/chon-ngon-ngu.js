/* ==========================================================================
   chon-ngon-ngu.js — CHỌN NGÔN NGỮ
   Tách từ index.html, không đổi logic: script dòng 2225–2281.
   Dropdown ngôn ngữ: đọc/ghi localStorage (dtr_language), gọi applyLanguage, phát sự kiện dtr:language-change.
   ========================================================================== */
(function () {
  /* LANGUAGE */
  const langDropdown = document.getElementById('langDropdown');
  const langBtn = document.getElementById('langBtn');
  const langFlag = document.getElementById('langFlag');
  const langMenu = document.getElementById('langMenu');
  const langLinks = langMenu.querySelectorAll('a');

  function loadLanguage() {
    let saved = 'vi';
    let savedFlag = '🇻🇳';
    try {
      const stored = localStorage.getItem('dtr_language');
      if (stored) {
        const data = JSON.parse(stored);
        saved = data.lang || 'vi';
        savedFlag = data.flag || '🇻🇳';
      }
    } catch (e) {}
    langFlag.textContent = savedFlag;
    langLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.lang === saved);
    });
    window.applyLanguage(saved);
  }

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });

  langLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lang = link.dataset.lang;
      const flag = link.dataset.flag;
      langFlag.textContent = flag;
      langLinks.forEach(l => l.classList.toggle('active', l === link));
      langDropdown.classList.remove('open');
      try {
        localStorage.setItem('dtr_language', JSON.stringify({ lang, flag }));
      } catch (e) {}
      window.applyLanguage(lang);
      window.dispatchEvent(new CustomEvent('dtr:language-change', {
        detail: { lang, flag }
      }));
    });
  });

  document.addEventListener('click', (e) => {
    if (!langDropdown.contains(e.target)) langDropdown.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') langDropdown.classList.remove('open');
  });

  loadLanguage();
})();
