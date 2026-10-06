/* ==========================================================================
   dieu-phoi.js — ĐIỀU PHỐI CẢNH 3D (entry point)
   Tách từ <script type="module"> của index.html, CHUYỂN SANG SCRIPT CỔ ĐIỂN:
   - import("three") động qua importmap (giữ trong index.html) => chạy được trên file://.
   - Tạo scene/camera/renderer/đèn, gọi 3 factory con (vu-tru, dia-cau, tuong-tac),
     chạy vòng animate, xử lý resize, xuất window.setCurrentLang cho dich-thuat.js.
   Trạng thái dùng chung st được tạo ở đây rồi truyền cho tuong-tac.js.
   ========================================================================== */
(function () {
  window.DTR = window.DTR || {};

  /* Trạng thái dùng chung (tương ứng các biến toàn cục của module gốc) */
  const st = {
    isDragging: false, prevMouseX: 0, prevMouseY: 0,
    globeRotX: 0, globeRotY: 0, globeVisible: false,
    currentLang: 'vi',
    scrollProgress: 0, targetScroll: 0, globeProgress: 0
  };

  import('three').then(function (THREE) {
    /* --- scene, camera, renderer, ánh sáng --- */
    const canvas = document.getElementById('scene');
    const tooltip = document.getElementById('globeTooltip');
    const sizes = { width: innerWidth, height: innerHeight };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 500);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, -1.5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.35);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    /* --- dựng các thành phần --- */
    const vuTru = window.DTR.vuTru.tao(THREE, scene);
    const diaCau = window.DTR.diaCau.tao(THREE, scene);
    const tuongTac = window.DTR.tuongTac.tao(THREE, {
      canvas: canvas, tooltip: tooltip, camera: camera, sizes: sizes,
      markers: diaCau.markers,
      sphere: diaCau.hitSphere,
      trangThai: st
    });

    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();
        st.scrollProgress += (st.targetScroll - st.scrollProgress) * 0.08;
      vuTru.capNhat(t, st.scrollProgress);

      /* --- tiến độ hiện quả địa cầu theo cuộn --- */
        let globeAlpha = 0;
        let globeScaleFactor = 0;

        if (st.globeProgress <= 0) { globeAlpha = 0; globeScaleFactor = 0; }
        else if (st.globeProgress < 0.15) {
          const p = st.globeProgress / 0.15;
          globeAlpha = p; globeScaleFactor = 0.3 + p * 0.7;
        } else if (st.globeProgress < 0.85) {
          globeAlpha = 1; globeScaleFactor = 1;
        } else {
          const p = (st.globeProgress - 0.85) / 0.15;
          globeAlpha = 1 - p; globeScaleFactor = 1 - p * 0.5;
        }


        st.globeVisible = globeAlpha > 0.05;

      const canInteract = st.globeProgress > 0.15 && st.globeProgress < 0.85;
      if (canInteract) {
        canvas.classList.add('globe-interactive');
      } else {
        canvas.classList.remove('globe-interactive');
        canvas.classList.remove('dragging');
        tooltip.classList.remove('visible');
      }

      diaCau.capNhat(t, globeAlpha, globeScaleFactor, st.globeRotX, st.globeRotY);

      /* --- quay nguồn sáng mặt trời --- */
        sunLight.position.x = Math.cos(t * 0.15) * 6;
        sunLight.position.z = Math.sin(t * 0.15) * 6;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    /* --- co giãn theo cửa sổ --- */
    window.addEventListener('resize', () => {
      sizes.width = innerWidth;
      sizes.height = innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      tuongTac.updateScroll();
      if (typeof window.clampAllButton === 'function') window.clampAllButton();
    });

    /* --- cầu nối ngôn ngữ cho tooltip quốc gia (dich-thuat.js gọi) --- */
    window.setCurrentLang = function (lang) { st.currentLang = lang; };
  });
})();
