/* ==========================================================================
   tuong-tac.js — TƯƠNG TÁC NGƯỜI DÙNG + CUỘN
   Tách từ <script type="module"> của index.html. Chuyển thành factory nhận THREE
   và bean chia sẻ "trangThai" (do dieu-phoi.js tạo) qua ctx.
   Nội dung: kéo xoay quả cầu, hover hiện tooltip tên quốc gia theo ngôn ngữ,
   tính tiến độ cuộn qua vùng sticky globe + bật class .scrolled cho nav.
   API:   DTR.tuongTac.tao(THREE, { canvas, tooltip, camera, sizes, markers, trangThai })
            -> { updateScroll }
   ========================================================================== */
window.DTR = window.DTR || {};

DTR.tuongTac = {
  tao: function (THREE, ctx) {
    const canvas = ctx.canvas;
    const tooltip = ctx.tooltip;
    const camera = ctx.camera;
    const sizes = ctx.sizes;
    const markers = ctx.markers;
    const st = ctx.trangThai;

    /* --- kéo xoay bằng chuột + hover tooltip (trạng thái chung trong st) --- */
    function isTouch(e) { return e.pointerType === 'touch'; }

    canvas.addEventListener('pointerdown', (e) => {
      if (isTouch(e)) return;
      if (!st.globeVisible) return;
      st.isDragging = true;
      st.prevMouseX = e.clientX;
      st.prevMouseY = e.clientY;
      canvas.classList.add('dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (isTouch(e)) return;
      if (st.isDragging) {
        const dx = e.clientX - st.prevMouseX;
        const dy = e.clientY - st.prevMouseY;
        st.globeRotY += dx * 0.008;
        st.globeRotX += dy * 0.008;
        st.globeRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, st.globeRotX));
        st.prevMouseX = e.clientX;
        st.prevMouseY = e.clientY;
      }

      if (st.globeVisible && !st.isDragging) {
        let closestIdx = -1;
        let closestDist = 28;
        const worldPos = new THREE.Vector3();

        markers.forEach((m, i) => {
          m.dot.getWorldPosition(worldPos);
          const screenPos = worldPos.clone().project(camera);
          const sx = (screenPos.x + 1) / 2 * sizes.width;
          const sy = (-screenPos.y + 1) / 2 * sizes.height;
          const dist = Math.hypot(sx - e.clientX, sy - e.clientY);
          if (dist < closestDist && screenPos.z < 1) {
            closestDist = dist;
            closestIdx = i;
          }
        });

        if (closestIdx !== -1) {
          const nameObj = markers[closestIdx].name;
          tooltip.textContent = nameObj[st.currentLang] || nameObj['en-US'] || nameObj.vi;
          tooltip.style.left = (e.clientX + 16) + 'px';
          tooltip.style.top = (e.clientY - 12) + 'px';
          tooltip.classList.add('visible');
          canvas.style.cursor = 'pointer';
        } else {
          tooltip.classList.remove('visible');
          if (!st.isDragging) canvas.style.cursor = st.globeVisible ? 'grab' : 'default';
        }
      } else {
        tooltip.classList.remove('visible');
      }
    }, { passive: true });

    window.addEventListener('pointerup', (e) => {
      if (isTouch(e)) return;
      if (st.isDragging) {
        st.isDragging = false;
        canvas.classList.remove('dragging');
      }
    });

    /* --- kéo xoay bằng touch: chạm vào quả cầu = xoay cả 2 hướng,
           chạm vùng trống xung quanh = cuộn trang bình thường --- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function touchOnGlobe(clientX, clientY) {
      if (!st.globeVisible) return false;
      pointer.x = (clientX / sizes.width) * 2 - 1;
      pointer.y = -(clientY / sizes.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObject(ctx.sphere, false).length > 0;
    }

    let touchId = null;
    canvas.addEventListener('touchstart', (e) => {
      if (!st.globeVisible || e.touches.length !== 1) return;
      const t = e.touches[0];
      if (!touchOnGlobe(t.clientX, t.clientY)) return;
      touchId = t.identifier;
      st.isDragging = true;
      st.prevMouseX = t.clientX;
      st.prevMouseY = t.clientY;
      canvas.classList.add('dragging');
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (touchId === null) return;
      let t = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) { t = e.changedTouches[i]; break; }
      }
      if (!t) return;
      const dx = t.clientX - st.prevMouseX;
      const dy = t.clientY - st.prevMouseY;
      st.globeRotY += dx * 0.008;
      st.globeRotX += dy * 0.008;
      st.globeRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, st.globeRotX));
      st.prevMouseX = t.clientX;
      st.prevMouseY = t.clientY;
      e.preventDefault();
    }, { passive: false });

    function endTouch(e) {
      if (touchId === null) return;
      let release = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) { release = true; break; }
      }
      if (release) {
        touchId = null;
        st.isDragging = false;
        canvas.classList.remove('dragging');
      }
    }
    canvas.addEventListener('touchend', endTouch);
    canvas.addEventListener('touchcancel', endTouch);

    /* --- theo dõi cuộn qua vùng sticky globe --- */
    const stickySection = document.getElementById('globeStickySection');
    function updateScroll() {
      st.targetScroll = Math.min(1, window.scrollY / innerHeight);
      const rect = stickySection.getBoundingClientRect();
      const totalScrollable = stickySection.offsetHeight - innerHeight;
      const scrolled = Math.max(0, -rect.top);
      st.globeProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return { updateScroll: updateScroll };
  }
};
