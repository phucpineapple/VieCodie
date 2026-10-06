/* ==========================================================================
   dia-cau.js — QUẢ ĐỊA CẦU THƯƠNG MẠI
   Tách từ <script type="module"> của index.html. Chuyển thành factory (THREE
   được dieu-phoi.js nhét vào qua tham số, chạy được trên file://).
   Nội dung: 800 điểm lưới + mạng liên kết, lớp khí quyển (shader), quầng sáng,
   1.000 hạt vàng bay, 14 marker quốc gia + 14 tuyến thương mại cong.
   API:   DTR.diaCau.tao(THREE, scene)
            -> { markers, capNhat(t, alpha, scale, rotX, rotY) }
   ========================================================================== */
window.DTR = window.DTR || {};

DTR.diaCau = {
  tao: function (THREE, scene) {
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, -0.6, 0);
    globeGroup.scale.setScalar(0.001);
    globeGroup.visible = false;
    scene.add(globeGroup);

    const R = 1.6;
    const NUM_POINTS = 800;

    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = 1 - (i / (NUM_POINTS - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      points.push(new THREE.Vector3(Math.cos(theta) * radius * R, y * R, Math.sin(theta) * radius * R));
    }

    const dotsGeo = new THREE.BufferGeometry();
    const dotsPos = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      dotsPos[i * 3] = p.x; dotsPos[i * 3 + 1] = p.y; dotsPos[i * 3 + 2] = p.z;
    });
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
    globeGroup.add(new THREE.Points(dotsGeo, new THREE.PointsMaterial({
      color: 0x5a6a85, size: 0.022, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false,
    })));

    const MAX_DIST = 0.28;
    const linePos = [], lineCol = [];
    const n1 = new THREE.Color(0x1a1a1a);
    const n2 = new THREE.Color(0x2a3a55);
    const n3 = new THREE.Color(0x3b5998);
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
    globeGroup.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    const hitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.97, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x060a14, transparent: true, opacity: 0.45, depthWrite: false })
    );
    globeGroup.add(hitSphere);

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
          gl_FragColor = vec4(0.12, 0.22, 0.42, f * 0.7);
        }`,
      transparent: true, blending: THREE.AdditiveBlending,
      side: THREE.BackSide, depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.02, 48, 48), atmoMat));

    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.25, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x3b5998, transparent: true, opacity: 0.05, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
    ));

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
      blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false,
    }));
    globeGroup.add(globeParticles);

    function latLngToVector3(lat, lng, radius) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const markersData = [
      { lat: 40, lng: -100, name: { vi: 'Hoa Kỳ', 'en-US': 'United States', 'en-GB': 'United States', zh: '美国', ko: '미국', ja: 'アメリカ', fr: 'États-Unis', de: 'USA', es: 'Estados Unidos' } },
      { lat: 35, lng: 105, name: { vi: 'Trung Quốc', 'en-US': 'China', 'en-GB': 'China', zh: '中国', ko: '중국', ja: '中国', fr: 'Chine', de: 'China', es: 'China' } },
      { lat: 52, lng: -1, name: { vi: 'Anh Quốc', 'en-US': 'United Kingdom', 'en-GB': 'United Kingdom', zh: '英国', ko: '영국', ja: 'イギリス', fr: 'Royaume-Uni', de: 'Vereinigtes Königreich', es: 'Reino Unido' } },
      { lat: 51, lng: 10, name: { vi: 'Đức', 'en-US': 'Germany', 'en-GB': 'Germany', zh: '德国', ko: '독일', ja: 'ドイツ', fr: 'Allemagne', de: 'Deutschland', es: 'Alemania' } },
      { lat: 36, lng: 138, name: { vi: 'Nhật Bản', 'en-US': 'Japan', 'en-GB': 'Japan', zh: '日本', ko: '일본', ja: '日本', fr: 'Japon', de: 'Japan', es: 'Japón' } },
      { lat: 37, lng: 128, name: { vi: 'Hàn Quốc', 'en-US': 'South Korea', 'en-GB': 'South Korea', zh: '韩国', ko: '대한민국', ja: '韓国', fr: 'Corée du Sud', de: 'Südkorea', es: 'Corea del Sur' } },
      { lat: 22, lng: 78, name: { vi: 'Ấn Độ', 'en-US': 'India', 'en-GB': 'India', zh: '印度', ko: '인도', ja: 'インド', fr: 'Inde', de: 'Indien', es: 'India' } },
      { lat: -25, lng: 134, name: { vi: 'Úc', 'en-US': 'Australia', 'en-GB': 'Australia', zh: '澳大利亚', ko: '호주', ja: 'オーストラリア', fr: 'Australie', de: 'Australien', es: 'Australia' } },
      { lat: 1, lng: 104, name: { vi: 'Singapore', 'en-US': 'Singapore', 'en-GB': 'Singapore', zh: '新加坡', ko: '싱가포르', ja: 'シンガポール', fr: 'Singapour', de: 'Singapur', es: 'Singapur' } },
      { lat: 60, lng: 100, name: { vi: 'Nga', 'en-US': 'Russia', 'en-GB': 'Russia', zh: '俄罗斯', ko: '러시아', ja: 'ロシア', fr: 'Russie', de: 'Russland', es: 'Rusia' } },
      { lat: 16, lng: 108, name: { vi: 'Việt Nam', 'en-US': 'Vietnam', 'en-GB': 'Vietnam', zh: '越南', ko: '베트남', ja: 'ベトナム', fr: 'Vietnam', de: 'Vietnam', es: 'Vietnam' } },
      { lat: -10, lng: -55, name: { vi: 'Brazil', 'en-US': 'Brazil', 'en-GB': 'Brazil', zh: '巴西', ko: '브라질', ja: 'ブラジル', fr: 'Brésil', de: 'Brasilien', es: 'Brasil' } },
      { lat: -35, lng: -65, name: { vi: 'Argentina', 'en-US': 'Argentina', 'en-GB': 'Argentina', zh: '阿根廷', ko: '아르헨티나', ja: 'アルゼンチン', fr: 'Argentine', de: 'Argentinien', es: 'Argentina' } },
      { lat: -30, lng: 25, name: { vi: 'Nam Phi', 'en-US': 'South Africa', 'en-GB': 'South Africa', zh: '南非', ko: '남아프리카', ja: '南アフリカ', fr: 'Afrique du Sud', de: 'Südafrika', es: 'Sudáfrica' } },
    ];

    const markers = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    markersData.forEach((data, i) => {
      const pos = latLngToVector3(data.lat, data.lng, R * 1.01);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xd4af37, toneMapped: false })
      );
      dot.position.copy(pos);
      markerGroup.add(dot);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.052, 32),
        new THREE.MeshBasicMaterial({
          color: 0xd4af37, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
        })
      );
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      markerGroup.add(ring);
      markers.push({ dot, ring, phase: i * 0.5, name: data.name });
    });

    const tradeRoutes = [
      [0, 10], [1, 10], [4, 10], [5, 10], [3, 10],
      [8, 10], [6, 10], [7, 8], [11, 0], [2, 3],
      [9, 1], [12, 11], [13, 6],
    ];
    const arcLines = [];
    const routeColors = [0x1e3a8a, 0xd4af37, 0xa8842a, 0x2563eb];
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
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));
      const cargoDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 10, 10),
        new THREE.MeshBasicMaterial({ color: color, toneMapped: false })
      );
      globeGroup.add(cargoDot);
      arcLines.push({ curve, cargoDot, progress: Math.random(), speed: 0.003 + Math.random() * 0.004 });
    });
    return {
      markers: markers,
      hitSphere: hitSphere,
      /* capNhat: cập nhật từng khung hình theo cuộn + kéo của người dùng.
         t = thời gian; alpha/scale = độ trong/co của quả cầu;
         rotX/rotY = góc xoay do thao tác kéo. */
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
        /* --- hạt vàng bay quanh quả cầu --- */
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
    };
  }
};
