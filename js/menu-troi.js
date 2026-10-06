/* ==========================================================================
   menu-troi.js — MENU TRỜI (NÚT THẢ NỔI)
   Tách từ index.html, không đổi logic: script dòng 2283–2437.
   Nút tròn kéo thả + snap cạnh, mở bảng menu, clamp vị trí khi resize; xuất window.clampAllButton cho dieu-phoi.js.
   ========================================================================== */
(function () {
  /* ALL BUTTON */
  const allBtn = document.getElementById('allBtn');
  const allPanel = document.getElementById('allPanel');
  const allPanelOverlay = document.getElementById('allPanelOverlay');

  const BTN_SIZE = 48;
  const SNAP_OFFSET = 12;
  const DRAG_THRESHOLD = 5;

  let isDragging = false;
  let hasDragged = false;
  let startX = 0, startY = 0;
  let btnX = 0, btnY = 0;
  let panelOpen = false;

  function loadPosition() {
    try {
      const saved = localStorage.getItem('dtr_all_btn_pos');
      if (saved) {
        const pos = JSON.parse(saved);
        btnX = pos.x; btnY = pos.y;
      } else {
        btnX = window.innerWidth - BTN_SIZE - SNAP_OFFSET;
        btnY = window.innerHeight * 0.5 - BTN_SIZE / 2;
      }
    } catch (e) {
      btnX = window.innerWidth - BTN_SIZE - SNAP_OFFSET;
      btnY = window.innerHeight * 0.5 - BTN_SIZE / 2;
    }
    clampAllButton();
    applyBtnPosition();
  }

  function clampAllButton() {
    const maxX = window.innerWidth - BTN_SIZE - SNAP_OFFSET;
    const maxY = window.innerHeight - BTN_SIZE - SNAP_OFFSET;
    btnX = Math.max(SNAP_OFFSET, Math.min(maxX, btnX));
    btnY = Math.max(SNAP_OFFSET, Math.min(maxY, btnY));
  }

  function applyBtnPosition() {
    allBtn.style.left = btnX + 'px';
    allBtn.style.top = btnY + 'px';
  }

  function savePosition() {
    try {
      localStorage.setItem('dtr_all_btn_pos', JSON.stringify({ x: btnX, y: btnY }));
    } catch (e) {}
  }

  function snapToEdge() {
    const screenW = window.innerWidth;
    const btnCenterX = btnX + BTN_SIZE / 2;
    const distLeft = btnCenterX;
    const distRight = screenW - btnCenterX;
    if (distLeft <= distRight) btnX = SNAP_OFFSET;
    else btnX = screenW - BTN_SIZE - SNAP_OFFSET;
    clampAllButton();
    allBtn.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), top 0.1s';
    applyBtnPosition();
    setTimeout(() => { allBtn.style.transition = ''; }, 350);
    savePosition();
  }

  allBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDragging = true;
    hasDragged = false;
    startX = e.clientX; startY = e.clientY;
    btnX = allBtn.offsetLeft; btnY = allBtn.offsetTop;
    allBtn.classList.add('dragging');
    allBtn.setPointerCapture(e.pointerId);
  });

  allBtn.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!hasDragged && Math.hypot(dx, dy) > DRAG_THRESHOLD) hasDragged = true;
    if (hasDragged) {
      btnX = allBtn.offsetLeft + dx;
      btnY = allBtn.offsetTop + dy;
      btnX = Math.max(0, Math.min(window.innerWidth - BTN_SIZE, btnX));
      btnY = Math.max(0, Math.min(window.innerHeight - BTN_SIZE, btnY));
      allBtn.style.left = btnX + 'px';
      allBtn.style.top = btnY + 'px';
      startX = e.clientX; startY = e.clientY;
    }
  });

  allBtn.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    allBtn.classList.remove('dragging');
    allBtn.releasePointerCapture(e.pointerId);
    if (hasDragged) snapToEdge();
    else togglePanel();
  });

  allBtn.addEventListener('pointercancel', () => {
    isDragging = false;
    allBtn.classList.remove('dragging');
  });

  function togglePanel() {
    panelOpen = !panelOpen;
    if (panelOpen) openPanel(); else closePanel();
  }
  function openPanel() {
    panelOpen = true;
    allPanel.classList.add('open');
    allPanelOverlay.classList.add('open');
    positionPanel();
    requestAnimationFrame(positionPanel);
  }
  function closePanel() {
    panelOpen = false;
    allPanel.classList.remove('open');
    allPanelOverlay.classList.remove('open');
  }
  function positionPanel() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    if (btnX < screenW / 2) {
      allPanel.style.left = (btnX + BTN_SIZE + 12) + 'px';
      allPanel.style.right = 'auto';
    } else {
      allPanel.style.right = (screenW - btnX + 12) + 'px';
      allPanel.style.left = 'auto';
    }
    let panelTop = btnY;
    const panelH = allPanel.scrollHeight;
    if (panelTop + panelH > screenH - 20) panelTop = Math.max(20, screenH - panelH - 20);
    allPanel.style.top = panelTop + 'px';
  }

  allPanelOverlay.addEventListener('click', closePanel);
  document.addEventListener('pointerdown', (e) => {
    if (panelOpen && !allPanel.contains(e.target) && !allBtn.contains(e.target)) closePanel();
  });

  loadPosition();
  window.addEventListener('resize', () => {
    clampAllButton();
    applyBtnPosition();
    if (panelOpen) positionPanel();
  });
  window.clampAllButton = clampAllButton;

  allPanel.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      closePanel();
    });
  });
})();
