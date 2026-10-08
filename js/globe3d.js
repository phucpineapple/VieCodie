/* ============================================================
   globe3d.js — 3D GLOBE & UNIVERSE
   ============================================================
   Based on the proven source.html implementation.
   Structure: DTR.vuTru (galaxy) + DTR.diaCau (globe) +
              DTR.tuongTac (interaction) + coordinator
   FIXES:
   - depthWrite: false on transparent materials
   - AdditiveBlending on points/lines
   - toneMapped: false on marker materials
   - hitSphere depthWrite: true (occludes back-face dots)
   - touch-action: pan-y + raycaster for mobile
   - Theme-aware lighting update
   ============================================================ */

window.DTR = window.DTR || {};

/* ============================================================
   STATE — shared across all sub-modules
   ============================================================ */
DTR.st = {
  isDragging: false, prevMouseX: 0, prevMouseY: 0,
  globeRotX: 0, globeRotY: 0, globeVisible: false,
  currentLang: 'en',
  scrollProgress: 0, targetScroll: 0, globeProgress: 0,
  theme: 'dark'
};

/* ============================================================
   VU TRU — DISABLED (no galaxy/stars, clean globe only)
   ============================================================ */
DTR.vuTru = {
  tao: function (THREE, scene) {
    // No-op: returns empty object with dummy capNhat
    return { group: null, capNhat: function () {} };
  }
};

/* ============================================================
   DIA CAU — Globe (dots, network, atmosphere, markers, routes)
   ============================================================ */
DTR.diaCau = {
  tao: function (THREE, scene) {
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, -0.6, 0);
    globeGroup.scale.setScalar(1);
    globeGroup.visible = true;
    scene.add(globeGroup);

    const R = 1.6;
    const NUM_POINTS = 800;

    // Fibonacci sphere
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = 1 - (i / (NUM_POINTS - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      points.push(new THREE.Vector3(
        Math.cos(theta) * radius * R, y * R, Math.sin(theta) * radius * R
      ));
    }

    // Dots
    const dotsGeo = new THREE.BufferGeometry();
    const dotsPos = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      dotsPos[i * 3] = p.x; dotsPos[i * 3 + 1] = p.y; dotsPos[i * 3 + 2] = p.z;
    });
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
    const dotsMat = new THREE.PointsMaterial({
      color: 0x4a9eff, size: 0.022, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false
    });
    globeGroup.add(new THREE.Points(dotsGeo, dotsMat));

    // Network lines
    const MAX_DIST = 0.28;
    const linePos = [], lineCol = [];
    const n1 = new THREE.Color(0x0a1a3a);
    const n2 = new THREE.Color(0x1a4a8a);
    const n3 = new THREE.Color(0x2d7fff);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < MAX_DIST) {
          linePos.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
          const t = (points[i].y + R) / (2 * R);
          const c1 = n1.clone().lerp(n2, t);
          const c2 = n2.clone().lerp(n3, t);
          lineCol.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    globeGroup.add(new THREE.LineSegments(lineGeo, lineMat));

    // Inner sphere — occludes back-face dots (depthWrite: true is the FIX)
    const hitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.97, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0a1e3c, transparent: true, opacity: 0.75, depthWrite: true })
    );
    globeGroup.add(hitSphere);

    // Atmosphere shader
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vPos;
        void main() {
          vec3 v = normalize(-vPos);
          float f = pow(1.0 - dot(vNormal, v), 3.0);
          gl_FragColor = vec4(0.15, 0.35, 0.75, f * 0.8);
        }`,
      transparent: true, blending: THREE.AdditiveBlending,
      side: THREE.BackSide, depthWrite: false
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.02, 48, 48), atmoMat));

    // Outer glow
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2d7fff, transparent: true, opacity: 0.08,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.25, 48, 48), glowMat));

    // Orbiting gold particles
    const P_COUNT = 1000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(P_COUNT * 3);
    const pVel = [];
    for (let i = 0; i < P_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const r = R * (1.15 + Math.random() * 0.7);
      pPos[i * 3] = r * Math.sin(ph) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.cos(ph);
      pPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(theta);
      pVel.push({ x: (Math.random() - 0.5) * 0.002, y: (Math.random() - 0.5) * 0.002, z: (Math.random() - 0.5) * 0.002 });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const globeParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xd4af37, size: 0.012, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false
    }));
    globeGroup.add(globeParticles);

    // Lat/lng to 3D
    function latLngToVector3(lat, lng, radius) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Country markers (14 countries)
    const markersData = [
      { lat: 40, lng: -100, code: 'US' },
      { lat: 35, lng: 105, code: 'CN' },
      { lat: 52, lng: -1, code: 'GB' },
      { lat: 51, lng: 10, code: 'DE' },
      { lat: 36, lng: 138, code: 'JP' },
      { lat: 37, lng: 128, code: 'KR' },
      { lat: 22, lng: 78, code: 'IN' },
      { lat: -25, lng: 134, code: 'AU' },
      { lat: 1, lng: 104, code: 'SG' },
      { lat: 60, lng: 100, code: 'RU' },
      { lat: 16, lng: 108, code: 'VN' },
      { lat: -10, lng: -55, code: 'BR' },
      { lat: -35, lng: -65, code: 'AR' },
      { lat: -30, lng: 25, code: 'ZA' }
    ];

    const markers = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    markersData.forEach((data, i) => {
      const pos = latLngToVector3(data.lat, data.lng, R * 1.01);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xc5ff3d, toneMapped: false })
      );
      dot.position.copy(pos);
      markerGroup.add(dot);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.052, 32),
        new THREE.MeshBasicMaterial({
          color: 0xc5ff3d, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
        })
      );
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      markerGroup.add(ring);
      markers.push({ dot, ring, phase: i * 0.5, code: data.code });
    });

    // Trade routes
    const tradeRoutes = [
      [0, 10], [1, 10], [4, 10], [5, 10], [3, 10],
      [8, 10], [6, 10], [7, 8], [11, 0], [2, 3],
      [9, 1], [12, 11], [13, 6]
    ];
    const arcLines = [];
    const routeColors = [0xc5ff3d, 0xd4af37, 0xa8842a, 0x5a9e00];

    tradeRoutes.forEach((route, idx) => {
      const from = markersData[route[0]];
      const to = markersData[route[1]];
      const start = latLngToVector3(from.lat, from.lng, R);
      const end = latLngToVector3(to.lat, to.lng, R);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.normalize().multiplyScalar(R + dist * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const color = routeColors[idx % routeColors.length];
      const arcMat = new THREE.LineBasicMaterial({
        color: color, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));
      const cargoDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 10, 10),
        new THREE.MeshBasicMaterial({ color: color, toneMapped: false, transparent: true, opacity: 0.8 })
      );
      globeGroup.add(cargoDot);
      arcLines.push({ curve, cargoDot, progress: Math.random(), speed: 0.003 + Math.random() * 0.004 });
    });

    return {
      markers: markers,
      hitSphere: hitSphere,
      atmoMat: atmoMat,
      dotsMat: dotsMat,
      lineMat: lineMat,
      glowMat: glowMat,
      capNhat: function (t, alpha, scale, rotX, rotY) {
        globeGroup.visible = alpha > 0.01;
        globeGroup.scale.setScalar(scale * 1.2);
        globeGroup.rotation.y = t * 0.08 + rotY;
        globeGroup.rotation.x = rotX;

        markers.forEach(function (m) {
          const p = t * 2 + m.phase;
          const s = 1 + Math.sin(p) * 0.3;
          m.ring.scale.set(s, s, s);
          m.ring.material.opacity = (0.35 + Math.sin(p) * 0.3) * alpha;
          const ds = 1 + Math.sin(p * 1.5) * 0.15;
          m.dot.scale.set(ds, ds, ds);
        });

        arcLines.forEach(function (arc) {
          arc.progress += arc.speed;
          if (arc.progress > 1) arc.progress = 0;
          const point = arc.curve.getPoint(arc.progress);
          arc.cargoDot.position.copy(point);
          const fade = Math.sin(arc.progress * Math.PI);
          arc.cargoDot.material.opacity = fade * alpha;
          arc.cargoDot.material.transparent = true;
          arc.cargoDot.scale.setScalar(0.8 + fade * 0.4);
        });

        // Gold particles drift (skip when invisible for performance)
        if (alpha > 0.01) {
          const posArr = globeParticles.geometry.attributes.position.array;
          for (let i = 0; i < P_COUNT; i++) {
            posArr[i * 3] += pVel[i].x;
            posArr[i * 3 + 1] += pVel[i].y;
            posArr[i * 3 + 2] += pVel[i].z;
            const x = posArr[i * 3], y = posArr[i * 3 + 1], z = posArr[i * 3 + 2];
            const rr = Math.sqrt(x * x + y * y + z * z);
            if (rr > R * 2 || rr < R * 1.1) {
              pVel[i].x *= -1; pVel[i].y *= -1; pVel[i].z *= -1;
            }
          }
          globeParticles.geometry.attributes.position.needsUpdate = true;
          globeParticles.rotation.y = t * 0.03;
        }
      }
    };
  }
};

/* ============================================================
   TUONG TAC — User interaction (drag, hover tooltip, touch, scroll)
   ============================================================ */
DTR.tuongTac = {
  tao: function (THREE, ctx) {
    const canvas = ctx.canvas;
    const tooltip = ctx.tooltip;
    const camera = ctx.camera;
    const sizes = ctx.sizes;
    const markers = ctx.markers;
    const st = ctx.trangThai;

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
          const code = markers[closestIdx].code;
          const name = window.DTR_I18N
            ? window.DTR_I18N.t('country.' + code, st.currentLang)
            : code;
          tooltip.textContent = name;
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

    // Touch: raycaster to detect touch ON globe
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

    // Scroll tracking — uses #network (the globe-sticky-section id)
    const stickySection = document.getElementById('globeStickySection') || document.getElementById('network');
    function updateScroll() {
      st.targetScroll = Math.min(1, window.scrollY / innerHeight);
      if (stickySection) {
        const rect = stickySection.getBoundingClientRect();
        const totalScrollable = stickySection.offsetHeight - innerHeight;
        const scrolled = Math.max(0, -rect.top);
        st.globeProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      }
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return { updateScroll: updateScroll };
  }
};

/* ============================================================
   DIEU PHOI — Coordinator (scene setup, animate loop, resize)
   ============================================================ */
(function () {
  const st = DTR.st;

  // Theme update — dynamically change scene colors
  DTR.updateTheme = function (theme) {
    st.theme = theme;
    if (!DTR._diaCau || !DTR._THREE) return;
    const THREE = DTR._THREE;

    if (theme === 'light') {
      DTR._diaCau.dotsMat.color.setHex(0x1a6aaa);
      DTR._diaCau.hitSphere.material.color.setHex(0xb8d4f0);
      DTR._diaCau.hitSphere.material.opacity = 0.6;
      DTR._diaCau.glowMat.color.setHex(0x4aa0ff);
      DTR._diaCau.lineMat.opacity = 0.25;
    } else {
      DTR._diaCau.dotsMat.color.setHex(0x4a9eff);
      DTR._diaCau.hitSphere.material.color.setHex(0x0a1e3c);
      DTR._diaCau.hitSphere.material.opacity = 0.75;
      DTR._diaCau.glowMat.color.setHex(0x2d7fff);
      DTR._diaCau.lineMat.opacity = 0.4;
    }

    if (DTR._scene) {
      const ambient = DTR._scene.getObjectByProperty('type', 'AmbientLight');
      if (ambient) ambient.intensity = theme === 'light' ? 0.9 : 0.6;
    }
  };

  // Language update
  DTR.setCurrentLang = function (lang) { st.currentLang = lang; };

  function init() {
    const canvas = document.getElementById('scene') || document.getElementById('globe-canvas');
    if (!canvas) return;

    let tooltip = document.getElementById('globeTooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'globe-tooltip';
      tooltip.id = 'globeTooltip';
      document.body.appendChild(tooltip);
    }

    import('three').then(function (THREE) {
      DTR._THREE = THREE;
      const sizes = { width: innerWidth, height: innerHeight };

      const scene = new THREE.Scene();
      DTR._scene = scene;
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

      const vuTru = DTR.vuTru.tao(THREE, scene);
      const diaCau = DTR.diaCau.tao(THREE, scene);
      DTR._diaCau = diaCau;
      const tuongTac = DTR.tuongTac.tao(THREE, {
        canvas: canvas, tooltip: tooltip, camera: camera, sizes: sizes,
        markers: diaCau.markers, sphere: diaCau.hitSphere, trangThai: st
      });

      const clock = new THREE.Clock();

      // Apply current theme
      const savedTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      DTR.updateTheme(savedTheme);

      // Globe only visible inside the globe-sticky section
      st.globeVisible = false;

      function animate() {
        const t = clock.getElapsedTime();
        st.scrollProgress += (st.targetScroll - st.scrollProgress) * 0.08;

        // Fade in/out based on scroll position within the globe section
        let globeAlpha = 0;
        let globeScaleFactor = 0;

        if (st.globeProgress <= 0) {
          // Outside the globe section — fully hidden
          globeAlpha = 0; globeScaleFactor = 0;
        } else if (st.globeProgress < 0.12) {
          // Entering — fade in + scale up
          const p = st.globeProgress / 0.12;
          globeAlpha = p; globeScaleFactor = 0.4 + p * 0.6;
        } else if (st.globeProgress < 0.88) {
          // Inside — fully visible
          globeAlpha = 1; globeScaleFactor = 1;
        } else {
          // Leaving — fade out + scale down
          const p = (st.globeProgress - 0.88) / 0.12;
          globeAlpha = 1 - p; globeScaleFactor = 1 - p * 0.4;
        }

        st.globeVisible = globeAlpha > 0.05;

        // Toggle canvas visibility + interactivity
        if (st.globeVisible) {
          canvas.classList.add('active');
          if (st.globeProgress > 0.12 && st.globeProgress < 0.88) {
            canvas.classList.add('globe-interactive');
          } else {
            canvas.classList.remove('globe-interactive');
            canvas.classList.remove('dragging');
            tooltip.classList.remove('visible');
          }
        } else {
          canvas.classList.remove('active');
          canvas.classList.remove('globe-interactive');
          canvas.classList.remove('dragging');
          tooltip.classList.remove('visible');
        }

        // Toggle globe-title + globe-stats visibility
        const globeTitle = document.getElementById('globeTitle');
        const globeStats = document.getElementById('globeStats');
        if (globeTitle) {
          if (st.globeProgress > 0.15) globeTitle.classList.add('active');
          else globeTitle.classList.remove('active');
        }
        if (globeStats) {
          if (st.globeProgress > 0.2) globeStats.classList.add('active');
          else globeStats.classList.remove('active');
        }

        diaCau.capNhat(t, globeAlpha, globeScaleFactor, st.globeRotX, st.globeRotY);

        sunLight.position.x = Math.cos(t * 0.15) * 6;
        sunLight.position.z = Math.sin(t * 0.15) * 6;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener('resize', () => {
        sizes.width = innerWidth;
        sizes.height = innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        tuongTac.updateScroll();
      });

      // Listen for language changes
      window.addEventListener('dtr:lang-change', (e) => {
        st.currentLang = e.detail.lang;
      });

      // Listen for theme changes
      window.addEventListener('dtr:theme-change', (e) => {
        DTR.updateTheme(e.detail.theme);
      });
    }).catch(err => {
      console.warn('[DTR] Three.js failed to load:', err);
    });
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
