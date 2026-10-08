/* ============================================================
   livetrack.js — LIVE DELIVERY TRACKER (Domestic Map)
   ============================================================
   Mô phỏng xe giao hàng chạy trên bản đồ 2D trong 1 quốc gia.
   Nguyên lý:
   - Mỗi shipment có route (từ kho -> đích)
   - Xe di chuyển dọc route, vị trí cập nhật real-time
   - Người vận chuyển cập nhật trạng thái (picked_up, in_transit, near_dropoff, delivered)
   - Hệ thống quản lý theo dõi telemetry (tốc độ, vị trí, ETA)
   - Demo simulation: tự động chạy, không cần backend
   ============================================================ */

const DTR_LIVETRACK = (function () {
  'use strict';

  /* ============================================================
     FICTIONAL WAREHOUSES & DROP-OFF POINTS (Vietnam map)
     ============================================================ */
  const WAREHOUSES = [
    { id: 'WH-HN', name: 'Kho HN', x: 590, y: 200, city: 'Hà Nội' },
    { id: 'WH-HCM', name: 'Kho HCM', x: 510, y: 680, city: 'TP.HCM' },
    { id: 'WH-DA', name: 'Kho ĐN', x: 660, y: 520, city: 'Đà Nẵng' },
    { id: 'WH-HP', name: 'Kho HP', x: 640, y: 150, city: 'Hải Phòng' }
  ];

  /* ============================================================
     DELIVERY ROUTES — đa tuyến đường nội địa
     Mỗi route là chuỗi điểm {x, y} nối từ kho đến đích
     ============================================================ */
  const ROUTES = [
    // HN -> HCM (qua ĐN)
    { id: 'R1', from: 'WH-HN', to: 'WH-HCM', via: [590, 280, 600, 360, 620, 440, 660, 500, 660, 520, 600, 600, 520, 660, 510, 680],
      points: [{ x: 590, y: 200 }, { x: 590, y: 280 }, { x: 600, y: 360 }, { x: 620, y: 440 }, { x: 660, y: 500 }, { x: 660, y: 520 }, { x: 600, y: 600 }, { x: 520, y: 660 }, { x: 510, y: 680 }],
      distance: 1200, road: 'QL1A North-South' },
    // HN -> HP
    { id: 'R2', from: 'WH-HN', to: 'WH-HP', points: [{ x: 590, y: 200 }, { x: 600, y: 180 }, { x: 620, y: 160 }, { x: 640, y: 150 }],
      distance: 120, road: 'QL5 Hanoi-Haiphong' },
    // HCM -> ĐN
    { id: 'R3', from: 'WH-HCM', to: 'WH-DA', points: [{ x: 510, y: 680 }, { x: 520, y: 640 }, { x: 560, y: 580 }, { x: 620, y: 540 }, { x: 660, y: 520 }],
      distance: 960, road: 'QL1A Central Coast' },
    // ĐN -> HN
    { id: 'R4', from: 'WH-DA', to: 'WH-HN', points: [{ x: 660, y: 520 }, { x: 640, y: 460 }, { x: 620, y: 400 }, { x: 600, y: 320 }, { x: 590, y: 260 }, { x: 590, y: 200 }],
      distance: 760, road: 'QL1A Northbound' },
    // HCM -> Cần Thơ (mở rộng)
    { id: 'R5', from: 'WH-HCM', to: 'WH-CT', points: [{ x: 510, y: 680 }, { x: 490, y: 720 }, { x: 450, y: 740 }, { x: 420, y: 760 }],
      distance: 170, road: 'QL1A Mekong Delta' },
  ];

  /* ============================================================
     SHIPMENTS — đơn hàng đang giao
     ============================================================ */
  const SHIPMENTS = [
    {
      id: 'DTR-LIVE-001',
      trackingId: 'DTR-TRK-001-VN',
      customer: 'Tr** V** H***',
      cargo: 'Electronics — 15 parcels',
      route: ROUTES[0],
      progress: 0.35,
      speed: 55, // km/h
      carrier: 'DTR SkyFreight',
      status: 'in_transit',
      eta: '14:30',
      events: []
    },
    {
      id: 'DTR-LIVE-002',
      trackingId: 'DTR-TRK-002-VN',
      customer: 'Ng** T** A***',
      cargo: 'Pharmaceuticals — cold chain',
      route: ROUTES[2],
      progress: 0.68,
      speed: 48,
      carrier: 'AeroNova Global',
      status: 'in_transit',
      eta: '15:00',
      events: []
    },
    {
      id: 'DTR-LIVE-003',
      trackingId: 'DTR-TRK-003-VN',
      customer: 'Le** M** D***',
      cargo: 'Industrial parts — 2 pallets',
      route: ROUTES[1],
      progress: 0.85,
      speed: 60,
      carrier: 'DTR SkyFreight',
      status: 'near_dropoff',
      eta: '09:45',
      events: []
    },
    {
      id: 'DTR-LIVE-004',
      trackingId: 'DTR-TRK-004-VN',
      customer: 'Ph** Q** T***',
      cargo: 'Eco-packaging — 40 boxes',
      route: ROUTES[3],
      progress: 0.12,
      speed: 52,
      carrier: 'Orient Pacific Cargo',
      status: 'in_transit',
      eta: '18:00',
      events: []
    }
  ];

  /* ============================================================
     I18N STATUS LABELS
     ============================================================ */
  const STATUS_LABELS = {
    picked_up: { vi: 'Đã lấy hàng', en: 'Picked Up', ja: '集荷完了', zh: '已取件', ko: '픽업 완료' },
    in_transit: { vi: 'Đang giao', en: 'In Transit', ja: '配送中', zh: '运输中', ko: '배송 중' },
    near_dropoff: { vi: 'Sắp giao', en: 'Near Drop-off', ja: '配達間近', zh: '即将送达', ko: '배달 임박' },
    delivered: { vi: 'Đã giao', en: 'Delivered', ja: '配達完了', zh: '已送达', ko: '배송 완료' }
  };

  let currentLang = 'en';
  let canvas, ctx, W, H;
  let animationId = null;
  let T = 0;

  /* ============================================================
     VIETNAM MAP OUTLINE (simplified polygon)
     ============================================================ */
  const VN_OUTLINE = [
    [590, 130], [610, 140], [625, 160], [640, 150], [650, 170],
    [660, 200], [670, 240], [680, 280], [685, 320], [690, 360],
    [695, 400], [700, 440], [690, 480], [680, 520], [670, 540],
    [660, 560], [640, 580], [620, 600], [590, 620], [560, 660],
    [530, 690], [510, 710], [490, 730], [460, 745], [430, 750],
    [410, 740], [400, 720], [410, 700], [430, 680], [440, 660],
    [450, 640], [440, 620], [430, 600], [440, 580], [460, 560],
    [480, 540], [500, 520], [510, 500], [500, 480], [490, 460],
    [480, 440], [470, 420], [480, 400], [500, 380], [520, 360],
    [540, 340], [560, 320], [570, 300], [580, 280], [585, 260],
    [580, 240], [575, 220], [580, 200], [585, 180], [588, 160]
  ];

  /* ============================================================
     GET POSITION ON ROUTE (linear interpolation along points)
     ============================================================ */
  function getRoutePos(route, progress) {
    const pts = route.points;
    const totalSegs = pts.length - 1;
    const exact = progress * totalSegs;
    const segIdx = Math.min(Math.floor(exact), totalSegs - 1);
    const segT = exact - segIdx;
    const a = pts[segIdx];
    const b = pts[segIdx + 1];
    return {
      x: a.x + (b.x - a.x) * segT,
      y: a.y + (b.y - a.y) * segT,
      heading: Math.atan2(b.y - a.y, b.x - a.x)
    };
  }

  /* ============================================================
     DRAW — Map + Routes + Vehicles + Info
     ============================================================ */
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0a0e14');
    bgGrad.addColorStop(1, '#0d1218');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Vietnam land
    ctx.save();
    ctx.beginPath();
    VN_OUTLINE.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();

    // Land fill
    const landGrad = ctx.createLinearGradient(0, 100, 0, 760);
    landGrad.addColorStop(0, 'rgba(40, 60, 50, 0.6)');
    landGrad.addColorStop(0.5, 'rgba(50, 70, 55, 0.5)');
    landGrad.addColorStop(1, 'rgba(35, 50, 40, 0.6)');
    ctx.fillStyle = landGrad;
    ctx.fill();

    // Land border
    ctx.strokeStyle = 'rgba(197, 255, 61, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Routes
    ROUTES.forEach(route => {
      ctx.strokeStyle = 'rgba(197, 255, 61, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      route.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Warehouses
    WAREHOUSES.forEach(wh => {
      ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wh.x, wh.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#8a95a3';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(wh.city, wh.x + 10, wh.y + 4);
    });

    // Active shipments
    SHIPMENTS.forEach(s => {
      const pos = getRoutePos(s.route, s.progress);

      // Route highlight for this shipment
      ctx.strokeStyle = s.status === 'delivered'
        ? 'rgba(90, 158, 0, 0.4)'
        : s.status === 'near_dropoff'
        ? 'rgba(240, 176, 58, 0.5)'
        : 'rgba(197, 255, 61, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      const pts = s.route.points;
      const totalSegs = pts.length - 1;
      // Draw completed portion
      ctx.moveTo(pts[0].x, pts[0].y);
      const exact = s.progress * totalSegs;
      const segIdx = Math.min(Math.floor(exact), totalSegs - 1);
      for (let i = 0; i < segIdx; i++) {
        ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
      }
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // Vehicle icon (truck)
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.heading);

      // Glow
      ctx.shadowColor = s.status === 'delivered' ? '#5a9e00' : '#c5ff3d';
      ctx.shadowBlur = 12;

      // Truck body
      ctx.fillStyle = s.status === 'delivered' ? '#5a9e00' : s.status === 'near_dropoff' ? '#f0b03a' : '#c5ff3d';
      ctx.fillRect(-5, -3, 10, 6);

      // Truck cabin
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(3, -2.5, 4, 5);

      ctx.shadowBlur = 0;
      ctx.restore();

      // Pulse ring for near_dropoff
      if (s.status === 'near_dropoff') {
        const pulse = 0.5 + 0.5 * Math.sin(T * 4);
        ctx.strokeStyle = `rgba(240, 176, 58, ${0.3 + 0.3 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12 + 4 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#e8e8e8';
      ctx.font = '600 9px JetBrains Mono, monospace';
      ctx.fillText(s.trackingId, pos.x + 8, pos.y - 8);
    });

    // Legend
    ctx.fillStyle = 'rgba(138, 149, 163, 0.6)';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText('● Kho phân phối  ◆ Xe giao hàng  --- Tuyến đường', 12, H - 12);
  }

  /* ============================================================
     SIMULATION STEP — update vehicle positions + carrier events
     ============================================================ */
  function step(dt) {
    T += dt;

    SHIPMENTS.forEach(s => {
      if (s.status === 'delivered') return;

      // Move forward based on speed
      const routeKm = s.route.distance;
      const kmPerSec = s.speed / 3600; // km/s (simulated time)
      const progressPerSec = kmPerSec / routeKm;
      s.progress += progressPerSec * dt * 100; // 100x speed for demo

      // Status transitions based on progress
      if (s.progress >= 0.95 && s.status !== 'near_dropoff') {
        s.status = 'near_dropoff';
        addEvent(s, 'near_dropoff', 'Gần điểm giao hàng — liên hệ khách hàng');
      }

      if (s.progress >= 1) {
        s.progress = 1;
        s.status = 'delivered';
        addEvent(s, 'delivered', 'Đã giao hàng thành công — ký nhận bởi ' + s.customer);
      }

      // Random carrier updates (telemetry)
      if (Math.random() < 0.01) {
        const speedVar = s.speed + Math.floor((Math.random() - 0.5) * 10);
        s.speed = Math.max(30, Math.min(80, speedVar));
      }
    });
  }

  /* ============================================================
     ADD EVENT to shipment timeline
     ============================================================ */
  function addEvent(shipment, type, note) {
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    shipment.events.push({ type, time, note });
    // Update panel if this shipment is selected
    renderShipmentList();
  }

  /* ============================================================
     RENDER SHIPMENT LIST (sidebar)
     ============================================================ */
  function renderShipmentList() {
    const list = document.getElementById('livetrack-list');
    if (!list) return;

    let html = '';
    SHIPMENTS.forEach((s, i) => {
      const stLabel = STATUS_LABELS[s.status]
        ? STATUS_LABELS[s.status][currentLang] || STATUS_LABELS[s.status].en
        : s.status;
      const stColor = s.status === 'delivered' ? '#5a9e00'
        : s.status === 'near_dropoff' ? '#f0b03a'
        : '#c5ff3d';
      const pct = Math.round(s.progress * 100);

      html += `<div class="lt-shipment" data-idx="${i}">
        <div class="lt-header">
          <span class="lt-id">${s.trackingId}</span>
          <span class="lt-status" style="color:${stColor};border-color:${stColor}">${stLabel}</span>
        </div>
        <div class="lt-route">${s.route.road}</div>
        <div class="lt-bar"><div class="lt-bar-fill" style="width:${pct}%;background:${stColor}"></div></div>
        <div class="lt-meta">
          <span>📦 ${s.cargo}</span>
          <span>🚚 ${s.carrier}</span>
          <span>⏱️ ETA ${s.eta}</span>
        </div>
      </div>`;
    });

    list.innerHTML = html;

    // Click handlers
    list.querySelectorAll('.lt-shipment').forEach(el => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.idx;
        showShipmentDetail(SHIPMENTS[idx]);
      });
    });
  }

  /* ============================================================
     SHOW SHIPMENT DETAIL (modal/panel)
     ============================================================ */
  function showShipmentDetail(s) {
    const panel = document.getElementById('livetrack-detail');
    if (!panel) return;

    const stLabel = STATUS_LABELS[s.status]
      ? STATUS_LABELS[s.status][currentLang] || STATUS_LABELS[s.status].en
      : s.status;
    const stColor = s.status === 'delivered' ? '#5a9e00'
      : s.status === 'near_dropoff' ? '#f0b03a'
      : '#c5ff3d';

    const pos = getRoutePos(s.route, s.progress);
    const fromWh = WAREHOUSES.find(w => w.id === s.route.from) || { city: '?' };
    const toWh = WAREHOUSES.find(w => w.id === s.route.to) || { city: '?' };

    let eventsHtml = s.events.length === 0
      ? '<div class="lt-no-events">Chưa có sự kiện mới</div>'
      : s.events.map(e => {
          const eLabel = STATUS_LABELS[e.type]
            ? STATUS_LABELS[e.type][currentLang] || STATUS_LABELS[e.type].en
            : e.type;
          return `<div class="lt-event">
            <div class="lt-event-dot" style="background:${stColor}"></div>
            <div class="lt-event-content">
              <span class="lt-event-type" style="color:${stColor}">${eLabel}</span>
              <span class="lt-event-time">${e.time}</span>
              <span class="lt-event-note">${e.note}</span>
            </div>
          </div>`;
        }).join('');

    panel.innerHTML = `
      <div class="lt-detail-card">
        <div class="lt-detail-header">
          <div>
            <h3>${s.trackingId}</h3>
            <span class="lt-detail-customer">👤 ${s.customer}</span>
          </div>
          <span class="lt-status" style="color:${stColor};border-color:${stColor}">${stLabel}</span>
        </div>
        <div class="lt-detail-route">
          <span>📍 ${fromWh.city}</span>
          <div class="lt-detail-line"><div style="width:${Math.round(s.progress*100)}%;background:${stColor}"></div></div>
          <span>📍 ${toWh.city}</span>
        </div>
        <div class="lt-detail-meta">
          <div><small>📦 Hàng hóa</small><span>${s.cargo}</span></div>
          <div><small>🚚 Nhà vận chuyển</small><span>${s.carrier}</span></div>
          <div><small>🛣️ Tuyến đường</small><span>${s.route.road}</span></div>
          <div><small>⚡ Tốc độ</small><span>${s.speed} km/h</span></div>
          <div><small>⏱️ Dự kiến</small><span>${s.eta}</span></div>
          <div><small>📊 Tiến độ</small><span>${Math.round(s.progress*100)}%</span></div>
        </div>
        <div class="lt-detail-events">
          <h4>Dòng sự kiện</h4>
          ${eventsHtml}
        </div>
        <div class="lt-compliance">
          🔒 Enterprise Logistics Sandbox Simulation — data is fictional and PII-masked.
        </div>
      </div>
    `;
    panel.classList.add('active');
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    canvas = document.getElementById('livetrack-canvas');
    const container = canvas ? canvas.parentElement : null;
    if (!canvas || !container) return;

    ctx = canvas.getContext('2d');
    W = canvas.width = 800;
    H = canvas.height = 800;

    // Initial events
    SHIPMENTS.forEach(s => {
      addEvent(s, 'picked_up', 'Đã lấy hàng từ kho — ' + s.carrier);
      addEvent(s, 'in_transit', 'Xuất phát trên ' + s.route.road);
    });

    renderShipmentList();

    // Animate
    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      animationId = requestAnimationFrame(loop);
    }
    loop(performance.now());

    // Close detail panel
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('livetrack-detail');
      if (panel && panel.classList.contains('active') && !panel.contains(e.target) && !e.target.closest('.lt-shipment')) {
        panel.classList.remove('active');
      }
    });

    // Language change
    window.addEventListener('dtr:lang-change', (e) => {
      currentLang = e.detail.lang;
      renderShipmentList();
    });
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    SHIPMENTS,
    renderShipmentList,
    showShipmentDetail
  };
})();

window.DTR_LIVETRACK = DTR_LIVETRACK;
