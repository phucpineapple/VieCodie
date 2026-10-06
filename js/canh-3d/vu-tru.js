/* ==========================================================================
   vu-tru.js — VŨ TRỤ / THIÊN HÀ NỀN
   Tách từ <script type="module"> của index.html. Đây là FILE TÁCH + CHUYỂN
   THÀNH KIỂU CỔ ĐIỂN: hơn 38.000 ngôi sao xoắn 3 nhánh + 2.000 sao nền.
   THREE được dieu-phoi.js NHÉT VÀO qua tham số (dependency injection) nên file
   này không dùng import() và chạy được trên file://.
   API:   DTR.vuTru.tao(THREE, scene) -> { group, capNhat(t, scrollProgress) }
   ========================================================================== */
window.DTR = window.DTR || {};

DTR.vuTru = {
  tao: function (THREE, scene) {
    /* --- texture phát sáng (glow) cho hạt sao --- */
    function createGlowTexture() {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.3)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const GLOW_TEX = createGlowTexture();

    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(0, -3.5, 0);
    scene.add(galaxyGroup);

    const G = {
      count: 38000, radius: 8, branches: 3, spin: 1.2,
      randomness: 0.55, randomnessPower: 4, size: 0.06,
    };

    const gGeo = new THREE.BufferGeometry();
    const gPos = new Float32Array(G.count * 3);
    const gCol = new Float32Array(G.count * 3);

    const cWhite = new THREE.Color(0xf5f5f5);
    const cWarm  = new THREE.Color(0xd4af37);
    const cNavy  = new THREE.Color(0x2563eb);

    for (let i = 0; i < G.count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.7) * G.radius;
      const branchAngle = ((i % G.branches) / G.branches) * Math.PI * 2;
      const spinAngle = r * G.spin;
      const rX = Math.pow(Math.random(), G.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * G.randomness * r;
      const rY = Math.pow(Math.random(), G.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * G.randomness * r * 0.3;
      const rZ = Math.pow(Math.random(), G.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * G.randomness * r;
      gPos[i3] = Math.cos(branchAngle + spinAngle) * r + rX;
      gPos[i3 + 1] = rY;
      gPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rZ;

      const rNorm = r / G.radius;
      let mixed;
      if (rNorm < 0.55) {
        mixed = cWhite.clone().lerp(cNavy, (rNorm / 0.55) * 0.35);
      } else {
        mixed = cWhite.clone().lerp(cWarm, ((rNorm - 0.55) / 0.45) * 0.5);
      }
      mixed.multiplyScalar(0.65 + Math.random() * 0.35);

      gCol[i3] = mixed.r; gCol[i3 + 1] = mixed.g; gCol[i3 + 2] = mixed.b;
    }
    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    gGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: G.size, sizeAttenuation: true, vertexColors: true, map: GLOW_TEX,
      transparent: true, opacity: 1, blending: THREE.AdditiveBlending,
      depthWrite: false, alphaTest: 0.001,
    });
    galaxyGroup.add(new THREE.Points(gGeo, galaxyMat));

    const sGeo = new THREE.BufferGeometry();
    const S_COUNT = 2000;
    const sPos = new Float32Array(S_COUNT * 3);
    for (let i = 0; i < S_COUNT; i++) {
      const i3 = i * 3;
      const r = 30 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      sPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i3 + 1] = r * Math.cos(phi);
      sPos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.15, sizeAttenuation: true,
      transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    galaxyGroup.add(new THREE.Points(sGeo, starMat));
    return {
      group: galaxyGroup,
      /* capNhat: xoay + phai màu thiên hà theo tiến độ cuộn. */
      capNhat: function (t, scrollProgress) {
        galaxyGroup.rotation.y = -t * 0.035;
        const galOpacity = Math.max(0, 1 - scrollProgress * 1.2);
        const galScaleX = 1 + scrollProgress * 3.5;
        const galScaleY = 1 - scrollProgress * 0.4;
        galaxyGroup.scale.set(galScaleX, galScaleY, 1);
        galaxyMat.opacity = galOpacity;
        starMat.opacity = 0.5 * galOpacity;
      }
    };
  }
};
