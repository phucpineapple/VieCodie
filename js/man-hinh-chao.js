/* ==========================================================================
   man-hinh-chao.js — MÀN HÌNH CHÀO (SPLASH + GÕ CHỮ)
   Tách từ index.html, không đổi logic: script dòng 2135–2183.
   Hiệu ứng gõ chữ; nếu có cấu hình từ manager.html (window.DTR.config.typed)
   thì gõ câu đó, ngược lại gõ "Digital Tech Resolution"; tô vàng chữ đầu
   mỗi cụm; mở splash khi tải xong trang.
   ========================================================================== */
(function () {
  const splashContent = document.getElementById('splashContent');
  const typedText = document.getElementById('typedText');
  const nav = document.getElementById('nav');
  const scrollHint = document.getElementById('scrollHint');
  const scene = document.getElementById('scene');
  const TARGET = (window.DTR && window.DTR.config && window.DTR.config.typed) || 'Digital Tech Resolution';
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  function accentWord(w) {
    return '<span class="dtr-letter">' + w.charAt(0) + '</span>' + w.slice(1);
  }

  function typeText() {
    return new Promise(resolve => {
      let i = 0;
      typedText.textContent = '';
      const timer = setInterval(() => {
        if (i < TARGET.length) {
          typedText.textContent += TARGET[i++];
        } else {
          clearInterval(timer);
          typedText.innerHTML = TARGET.split(' ').map(accentWord).join(' ');
          resolve();
        }
      }, 60);
    });
  }

  async function runSplash() {
    document.body.style.overflow = 'hidden';
    await delay(300);
    scene.classList.add('active');
    await delay(400);
    splashContent.classList.add('show');
    await delay(1200);
    await typeText();
    await delay(600);
    document.body.style.overflow = '';
    nav.classList.add('active');
    scrollHint.classList.add('active');
  }

  if (document.readyState === 'complete') {
    setTimeout(runSplash, 150);
  } else {
    window.addEventListener('load', () => setTimeout(runSplash, 150));
  }
})();