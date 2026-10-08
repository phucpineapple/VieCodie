/* ============================================================
   logistics.js — SKYWATCH LOGISTICS TRACKER (COMPLIANT)
   ============================================================
   LEGAL COMPLIANCE:
   - Zero military references: all events are commercial
     (weather routing, customs compliance, eco-corridors)
   - Fictional enterprise branding: DTR SkyFreight, AeroNova
   - PII masking: customer names masked (Tr** D** M***)
   - Tracking IDs: DTR-TRK-XXXX-XX format
   - Compliance disclaimer displayed
   ============================================================ */

const DTR_LOGISTICS = (function () {
  'use strict';

  /* ============================================================
     FICTIONAL FLEET — commercial cargo lines only
     ============================================================ */
  const FLEET = [
    { id: 'DTR-SF-001', name: 'DTR SkyFreight', flag: '🇻🇳', route: 'Hanoi → Singapore' },
    { id: 'AN-GL-004', name: 'AeroNova Global Logistics', flag: '🇸🇬', route: 'Singapore → Tokyo' },
    { id: 'DTR-SF-007', name: 'DTR SkyFreight', flag: '🇯🇵', route: 'Tokyo → Los Angeles' },
    { id: 'OR-PAC-012', name: 'Orient Pacific Cargo', flag: '🇰🇷', route: 'Seoul → Shanghai' },
    { id: 'GM-EUR-021', name: 'GlobalMeridian Express', flag: '🇩🇪', route: 'Frankfurt → London' },
    { id: 'AN-GL-035', name: 'AeroNova Global Logistics', flag: '🇺🇸', route: 'New York → São Paulo' },
    { id: 'DTR-SF-048', name: 'DTR SkyFreight', flag: '🇦🇺', route: 'Sydney → Singapore' },
    { id: 'SA-IND-052', name: 'SouthAsia TradeLink', flag: '🇮🇳', route: 'Mumbai → Dubai' }
  ];

  /* ============================================================
     COMMERCIAL SUPPLY-CHAIN EVENTS (zero military)
     ============================================================ */
  const EVENT_TYPES = [
    { key: 'departed', icon: '🛫', color: '#5a9e00' },
    { key: 'in_transit', icon: '✈️', color: '#3b5998' },
    { key: 'customs', icon: '📋', color: '#d4af37' },
    { key: 'weather_reroute', icon: '🌦️', color: '#5a6a85' },
    { key: 'eco_corridor', icon: '🌱', color: '#5a9e00' },
    { key: 'arrived', icon: '🛬', color: '#c5ff3d' },
    { key: 'delivered', icon: '📦', color: '#77b300' }
  ];

  /* ============================================================
     MASKED CUSTOMER DATA — PII compliant
     ============================================================ */
  const SHIPMENTS = [
    {
      trackingId: 'DTR-TRK-9821-VN',
      customer: 'Tr** D** M***',
      fleet: FLEET[0],
      status: 'in_transit',
      progress: 45,
      eta: '2026-10-10 14:30 UTC',
      origin: 'Hanoi, VN', destination: 'Singapore, SG',
      cargo: 'Electronics — 2.4t',
      events: [
        { type: 'departed', time: '2026-10-08 08:15', location: 'Hanoi (HAN)', note: 'Cargo loaded, flight departed on schedule' },
        { type: 'weather_reroute', time: '2026-10-08 11:20', location: 'South China Sea', note: 'Rerouted via eco-corridor to avoid storm system' },
        { type: 'in_transit', time: '2026-10-08 13:00', location: 'En route', note: 'Cruising at FL380, telemetry nominal' }
      ]
    },
    {
      trackingId: 'DTR-TRK-4417-JP',
      customer: 'Ya** T*******',
      fleet: FLEET[1],
      status: 'customs',
      progress: 72,
      eta: '2026-10-09 09:00 UTC',
      origin: 'Singapore, SG', destination: 'Tokyo, JP',
      cargo: 'Pharmaceuticals — 850kg',
      events: [
        { type: 'departed', time: '2026-10-07 22:00', location: 'Singapore (SIN)', note: 'Temperature-controlled cargo verified' },
        { type: 'eco_corridor', time: '2026-10-08 03:30', location: 'Pacific Eco-Corridor', note: 'Routing via low-emission corridor (−40% CO₂)' },
        { type: 'customs', time: '2026-10-08 08:45', location: 'Tokyo Narita (NRT)', note: 'Customs clearance in progress — documentation verified' }
      ]
    },
    {
      trackingId: 'DTR-TRK-2056-US',
      customer: 'Ja** W*****',
      fleet: FLEET[2],
      status: 'arrived',
      progress: 95,
      eta: '2026-10-08 18:00 UTC',
      origin: 'Tokyo, JP', destination: 'Los Angeles, US',
      cargo: 'Auto parts — 12.8t',
      events: [
        { type: 'departed', time: '2026-10-07 15:00', location: 'Tokyo (HND)', note: 'Departed on schedule' },
        { type: 'in_transit', time: '2026-10-08 02:00', location: 'Pacific Ocean', note: 'Mid-pacific crossing, all systems nominal' },
        { type: 'arrived', time: '2026-10-08 17:30', location: 'Los Angeles (LAX)', note: 'Arrived at LAX cargo terminal' }
      ]
    },
    {
      trackingId: 'DTR-TRK-7733-KR',
      customer: 'Ki* P***',
      fleet: FLEET[3],
      status: 'delivered',
      progress: 100,
      eta: 'Delivered',
      origin: 'Seoul, KR', destination: 'Shanghai, CN',
      cargo: 'Semiconductors — 1.2t',
      events: [
        { type: 'departed', time: '2026-10-06 09:00', location: 'Seoul (ICN)', note: 'High-value cargo escorted' },
        { type: 'customs', time: '2026-10-06 14:20', location: 'Shanghai (PVG)', note: 'Express customs lane — cleared in 45 min' },
        { type: 'delivered', time: '2026-10-06 16:00', location: 'Shanghai Free Trade Zone', note: 'Signed for by recipient — delivery confirmed' }
      ]
    },
    {
      trackingId: 'DTR-TRK-5599-DE',
      customer: 'Ha** F******',
      fleet: FLEET[4],
      status: 'in_transit',
      progress: 30,
      eta: '2026-10-09 12:00 UTC',
      origin: 'Frankfurt, DE', destination: 'London, GB',
      cargo: 'Industrial machinery — 18.5t',
      events: [
        { type: 'departed', time: '2026-10-08 06:00', location: 'Frankfurt (FRA)', note: 'Oversized cargo loaded' },
        { type: 'weather_reroute', time: '2026-10-08 09:15', location: 'English Channel', note: 'Adjusted flight path for weather optimization' },
        { type: 'in_transit', time: '2026-10-08 10:00', location: 'En route', note: 'Approaching UK airspace' }
      ]
    }
  ];

  /* ============================================================
     I18N EVENT LABELS
     ============================================================ */
  const EVENT_LABELS = {
    departed: { vi: 'Khởi hành', en: 'Departed', ja: '出発', zh: '出发', ko: '출발' },
    in_transit: { vi: 'Đang vận chuyển', en: 'In Transit', ja: '輸送中', zh: '运输中', ko: '운송 중' },
    customs: { vi: 'Hải quan', en: 'Customs', ja: '税関', zh: '海关', ko: '세관' },
    weather_reroute: { vi: 'Tuyến đường thời tiết', en: 'Weather Reroute', ja: '気候回廊', zh: '天气改道', ko: '기후 회항' },
    eco_corridor: { vi: 'Hành lang sinh thái', en: 'Eco-Corridor', ja: 'エコ回廊', zh: '生态走廊', ko: '에코 회랑' },
    arrived: { vi: 'Đã đến', en: 'Arrived', ja: '到着', zh: '到达', ko: '도착' },
    delivered: { vi: 'Đã giao', en: 'Delivered', ja: '配達完了', zh: '已送达', ko: '배송 완료' }
  };

  let currentLang = 'en';

  /* ============================================================
     RENDER — single shipment card (only when the customer
     actively queries THEIR OWN tracking ID)
     ============================================================ */
  function renderShipment(shipment, container) {
    if (!container || !shipment) return;

    const s = shipment;
    const fleetName = s.fleet.name;
    const statusInfo = EVENT_TYPES.find(e => e.key === s.status) || EVENT_TYPES[1];
    const statusLabel = EVENT_LABELS[s.status]
      ? EVENT_LABELS[s.status][currentLang] || EVENT_LABELS[s.status].en
      : s.status;

    container.innerHTML = `<div class="shipment-card" data-tracking="${s.trackingId}">
      <div class="shipment-header">
        <div class="shipment-id">
          <span class="shipment-tracking">${s.trackingId}</span>
          <span class="shipment-customer">👤 ${s.customer}</span>
        </div>
        <div class="shipment-status" style="color:${statusInfo.color}">
          <span class="status-icon">${statusInfo.icon}</span>
          <span class="status-label">${statusLabel}</span>
        </div>
      </div>

      <div class="shipment-route">
        <span class="route-origin">${s.origin}</span>
        <div class="route-line">
          <div class="route-progress" style="width:${s.progress}%;background:${statusInfo.color}"></div>
        </div>
        <span class="route-dest">${s.destination}</span>
      </div>

      <div class="shipment-meta">
        <div class="meta-item">
          <span class="meta-label">✈️</span>
          <span class="meta-value">${fleetName}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">📦</span>
          <span class="meta-value">${s.cargo}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">⏱️</span>
          <span class="meta-value">${s.eta}</span>
        </div>
      </div>

      <div class="shipment-timeline">
        ${s.events.map(ev => {
          const evInfo = EVENT_TYPES.find(e => e.key === ev.type) || EVENT_TYPES[1];
          const evLabel = EVENT_LABELS[ev.type]
            ? EVENT_LABELS[ev.type][currentLang] || EVENT_LABELS[ev.type].en
            : ev.type;
          return `<div class="timeline-event">
            <div class="timeline-dot" style="background:${evInfo.color}">${evInfo.icon}</div>
            <div class="timeline-content">
              <span class="timeline-type" style="color:${evInfo.color}">${evLabel}</span>
              <span class="timeline-time">${ev.time}</span>
              <span class="timeline-location">📍 ${ev.location}</span>
              <span class="timeline-note">${ev.note}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function renderEmpty(container, message) {
    if (!container) return;
    container.innerHTML = `<div class="track-empty">
      <span class="track-empty-icon">◈</span>
      <p>${message || 'Nhập mã tracking của bạn để xem trạng thái đơn hàng.'}</p>
    </div>`;
  }

  // Backward-compat: render all (no-op now — kept to avoid breaking external callers)
  function renderShipments(container) {
    if (!container) return;
    renderEmpty(container);
  }

  /* ============================================================
     TRACKING SEARCH — strict lookup by exact tracking ID
     ============================================================ */
  function initSearch() {
    const searchInput = document.getElementById('trackInput');
    const searchBtn = document.getElementById('trackBtn');
    const resultsContainer = document.getElementById('skywatch-container') ||
                              document.getElementById('logistics-container') ||
                              document.getElementById('trackResults');

    if (!searchInput || !searchBtn || !resultsContainer) return;

    const emptyMsg = {
      vi: 'Nhập mã tracking của bạn để xem trạng thái đơn hàng.',
      en: 'Enter your tracking ID to see order status.',
      ja: '追跡番号を入力して注文状況を確認してください。',
      zh: '请输入您的追踪号码以查看订单状态。',
      ko: '주문 상태를 보려면 추적 번호를 입력하세요.'
    };

    // Render initial empty state
    renderEmpty(resultsContainer, emptyMsg[currentLang] || emptyMsg.en);

    function doSearch() {
      const query = searchInput.value.trim().toUpperCase();
      if (!query) {
        renderEmpty(resultsContainer, emptyMsg[currentLang] || emptyMsg.en);
        return;
      }

      // Strict match by exact tracking ID (customer privacy)
      const match = SHIPMENTS.find(s => s.trackingId.toUpperCase() === query);

      if (!match) {
        resultsContainer.innerHTML = `
          <div class="track-no-results">
            <span>🔍</span>
            <p>${({vi:'Không tìm thấy đơn hàng cho mã', en:'No shipment found for', ja:'追跡番号の注文が見つかりません', zh:'未找到此追踪号码的订单', ko:'이 추적 번호에 대한 주문을 찾을 수 없습니다'})[currentLang] || 'No shipment found for'} "${query}"</p>
            <p class="hint">${({vi:'Vui lòng kiểm tra lại mã. Định dạng: DTR-TRK-XXXX-XX', en:'Please double-check your ID. Format: DTR-TRK-XXXX-XX', ja:'追跡番号を確認してください。形式: DTR-TRK-XXXX-XX', zh:'请检查您的追踪号码。格式：DTR-TRK-XXXX-XX', ko:'추적 번호를 확인해 주세요. 형식: DTR-TRK-XXXX-XX'})[currentLang] || 'Format: DTR-TRK-XXXX-XX'}</p>
          </div>`;
        return;
      }

      renderShipment(match, resultsContainer);
    }

    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  /* ============================================================
     INIT — no auto-render of all shipments (privacy)
     ============================================================ */
  function init() {
    // DO NOT auto-render all shipments on load.
    // Shipment details belong to the customer who holds the ID.
    initSearch();

    // Listen for language changes — only refresh empty state text
    window.addEventListener('dtr:lang-change', (e) => {
      currentLang = e.detail.lang;
      const container = document.getElementById('skywatch-container') ||
                        document.getElementById('logistics-container') ||
                        document.getElementById('trackResults');
      if (!container) return;
      const hasCard = container.querySelector('.shipment-card');
      const hasNoRes = container.querySelector('.track-no-results');
      if (!hasCard && !hasNoRes) {
        const emptyMsg = {
          vi: 'Nhập mã tracking của bạn để xem trạng thái đơn hàng.',
          en: 'Enter your tracking ID to see order status.',
          ja: '追跡番号を入力して注文状況を確認してください。',
          zh: '请输入您的追踪号码以查看订单状态。',
          ko: '주문 상태를 보려면 추적 번호를 입력하세요.'
        };
        renderEmpty(container, emptyMsg[currentLang] || emptyMsg.en);
      }
    });
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    renderShipments,
    SHIPMENTS,
    FLEET
  };
})();

window.DTR_LOGISTICS = DTR_LOGISTICS;
