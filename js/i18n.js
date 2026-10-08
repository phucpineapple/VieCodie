/* ============================================================
   i18n.js — PROFESSIONAL 5-LANGUAGE ENGINE (VI | EN | JA | ZH | KO)
   ============================================================
   Manual dictionary (no runtime APIs).
   Language Detection Cascade:
     1. URL param ?lang=<code> or hash route #/vi/ etc.
     2. localStorage 'dtr_lang'
     3. navigator.language auto-detection
     4. Fallback to 'en'
   DOM binding: data-i18n, data-i18n-html, data-i18n-placeholder
   ============================================================ */

const DTR_I18N = (function () {
  'use strict';

  const SUPPORTED = ['vi', 'en', 'ja', 'zh', 'ko'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'dtr_lang';

  /* ============================================================
     MANUAL DICTIONARY — B2B Commercial Terminology
     ============================================================ */
  const DICT = {
    /* ---- NAV ---- */
    'nav.brand': { vi: 'DTR—Mart', en: 'DTR—Mart', ja: 'DTR—Mart', zh: 'DTR—Mart', ko: 'DTR—Mart' },
    'nav.platform': { vi: 'Nền tảng', en: 'Platform', ja: 'プラットフォーム', zh: '平台', ko: '플랫폼' },
    'nav.network': { vi: 'Mạng lưới', en: 'Network', ja: 'ネットワーク', zh: '网络', ko: '네트워크' },
    'nav.journey': { vi: 'Hành trình', en: 'Journey', ja: '歩み', zh: '历程', ko: '여정' },
    'nav.mission': { vi: 'Sứ mệnh', en: 'Mission', ja: 'ミッション', zh: '使命', ko: '미션' },
    'nav.support': { vi: 'Hỗ trợ', en: 'Support', ja: 'サポート', zh: '支持', ko: '지원' },
    'nav.cta': { vi: 'Bắt đầu', en: 'Get Started', ja: '始める', zh: '开始', ko: '시작하기' },
    'nav.cart': { vi: 'Giỏ hàng', en: 'Cart', ja: 'カート', zh: '购物车', ko: '장바구니' },
    'nav.products': { vi: 'Sản phẩm', en: 'Products', ja: '製品', zh: '产品', ko: '제품' },
    'nav.partners': { vi: 'Đối tác', en: 'Partners', ja: 'パートナー', zh: '合作伙伴', ko: '파트너' },

    /* ---- HERO ---- */
    'hero.meta.live': { vi: 'LIVE', en: 'LIVE', ja: 'ライブ', zh: '实时', ko: '실시간' },
    'hero.meta.countries': { vi: '50+ Quốc gia', en: '50+ Countries', ja: '50カ国以上', zh: '50+ 国家', ko: '50개국 이상' },
    'hero.meta.partners': { vi: '12K+ Đối tác', en: '12K+ Partners', ja: '12K以上のパートナー', zh: '12K+ 合作伙伴', ko: '12K+ 파트너' },
    'hero.title.l1': { vi: 'Thương mại', en: 'Commerce', ja: '商取引', zh: '商业', ko: '상거래' },
    'hero.title.l2': { vi: 'không biên giới,', en: 'without borders,', ja: '国境なき', zh: '无国界，', ko: '국경 없는' },
    'hero.title.l3': { vi: 'vận hành', en: 'powered', ja: 'データで', zh: '数据', ko: '데이터로' },
    'hero.title.l4': { vi: 'bằng dữ liệu.', en: 'by data.', ja: '駆動する。', zh: '驱动。', ko: '구동.' },
    'hero.desc': {
      vi: 'Nền tảng thương mại số kết nối <strong>50+ quốc gia</strong> với hơn <strong>38.000 sản phẩm kỹ thuật số</strong> trong một hệ sinh thái liền mạch. Minh bạch. Nhanh. Đáng tin cậy.',
      en: 'A digital commerce platform connecting <strong>50+ countries</strong> with over <strong>38,000 digital products</strong> in one seamless ecosystem. Transparent. Fast. Reliable.',
      ja: '<strong>50カ国以上</strong>と<strong>38,000以上のデジタル製品</strong>を一つのシームレスなエコシステムでつなぐデジタルコマースプラットフォーム。透明性、迅速性、信頼性。',
      zh: '数字商务平台连接<strong>50+国家</strong>和超过<strong>38,000种数字产品</strong>，在一个无缝生态系统中。透明。快速。可靠。',
      ko: '<strong>50개국 이상</strong>과 <strong>38,000개 이상의 디지털 제품</strong>을 하나의 매끄러운 생태계로 연결하는 디지털 상거래 플랫폼. 투명. 신속. 신뢰.'
    },
    'hero.btn1': { vi: 'Khám phá nền tảng', en: 'Explore Platform', ja: 'プラットフォームを見る', zh: '探索平台', ko: '플랫폼 살펴보기' },
    'hero.btn2': { vi: 'Xem hành trình', en: 'View Journey', ja: '歩みを見る', zh: '查看历程', ko: '여정 보기' },

    /* ---- MARQUEE ---- */
    'marquee.countries': { vi: 'Quốc gia', en: 'Countries', ja: 'カ国', zh: '国家', ko: '개국' },
    'marquee.products': { vi: 'Sản phẩm số', en: 'Digital Products', ja: 'デジタル製品', zh: '数字产品', ko: '디지털 제품' },
    'marquee.partners': { vi: 'Đối tác', en: 'Partners', ja: 'パートナー', zh: '合作伙伴', ko: '파트너' },
    'marquee.uptime': { vi: 'Uptime', en: 'Uptime', ja: '稼働率', zh: '正常运行', ko: '가동률' },
    'marquee.support': { vi: 'Hỗ trợ', en: 'Support', ja: 'サポート', zh: '支持', ko: '지원' },
    'marquee.offices': { vi: 'Văn phòng toàn cầu', en: 'Global Offices', ja: 'グローバルオフィス', zh: '全球办事处', ko: '글로벌 오피스' },

    /* ---- INTRO ---- */
    'intro.label': { vi: 'MANIFESTO', en: 'MANIFESTO', ja: 'マニフェスト', zh: '宣言', ko: '선언' },
    'intro.title': {
      vi: "Chúng tôi xây dựng <span class='it'>hạ tầng</span> cho thương mại toàn cầu.",
      en: "We build the <span class='it'>infrastructure</span> for global commerce.",
      ja: "グローバル商取引の<span class='it'>インフラ</span>を構築する。",
      zh: "我们为全球商业构建<span class='it'>基础设施</span>。",
      ko: "글로벌 상거래를 위한 <span class='it'>인프라</span>를 구축합니다."
    },
    'intro.text': {
      vi: "Mỗi giao dịch là một điểm dữ liệu. Mỗi đối tác là một <em>nút kết nối</em>. DTR—Mart không bán sản phẩm — chúng tôi xây dựng <em>hạ tầng</em> để dòng chảy thương mại toàn cầu vận hành liền mạch. Minh bạch. Nhanh. Không biên giới.",
      en: "Every transaction is a data point. Every partner is a <em>node</em>. DTR—Mart doesn't sell products — we build <em>infrastructure</em> for global commerce to flow seamlessly. Transparent. Fast. Borderless.",
      ja: "すべての取引はデータポイント。すべてのパートナーは<em>ノード</em>。DTR—Martは製品を売るのではなく、グローバル商取引がシームレスに流れるための<em>インフラ</em>を構築します。透明、迅速、国境なし。",
      zh: "每笔交易都是一个数据点。每个合作伙伴都是一个<em>节点</em>。DTR—Mart不卖产品——我们构建<em>基础设施</em>，让全球商业无缝流动。透明。快速。无国界。",
      ko: "모든 거래는 데이터 포인트입니다. 모든 파트너는 <em>노드</em>입니다. DTR—Mart는 제품을 팔지 않습니다 — 글로벌 상거래가 매끄럽게 흐르도록 <em>인프라</em>를 구축합니다. 투명. 신속. 국경 없음."
    },

    /* ---- GLOBE ---- */
    'globe.label': { vi: 'GLOBAL NETWORK', en: 'GLOBAL NETWORK', ja: 'グローバルネットワーク', zh: '全球网络', ko: '글로벌 네트워크' },
    'globe.title': {
      vi: "Kết nối <span class='it'>thương mại toàn cầu</span>.",
      en: "Connecting <span class='it'>global trade</span>.",
      ja: "<span class='it'>グローバル貿易</span>をつなぐ。",
      zh: "连接<span class='it'>全球贸易</span>。",
      ko: "<span class='it'>글로벌 무역</span>을 연결합니다."
    },
    'globe.stat1.label': { vi: 'Quốc gia hoạt động', en: 'Active Countries', ja: '稼働国', zh: '活跃国家', ko: '운영 국가' },
    'globe.stat2.label': { vi: 'Sản phẩm số', en: 'Digital Products', ja: 'デジタル製品', zh: '数字产品', ko: '디지털 제품' },
    'globe.stat3.label': { vi: 'Đối tác toàn cầu', en: 'Global Partners', ja: 'グローバルパートナー', zh: '全球合作伙伴', ko: '글로벌 파트너' },
    'globe.stat4.label': { vi: 'Uptime hệ thống', en: 'System Uptime', ja: 'システム稼働率', zh: '系统正常运行', ko: '시스템 가동률' },

    /* GLOBE LIVE TRAFFIC */
    'globe.live.users': { vi: 'người dùng online', en: 'users online', ja: 'オンラインユーザー', zh: '在线用户', ko: '온라인 사용자' },
    'globe.live.txn': { vi: 'giao dịch/giây', en: 'txn/sec', ja: '取引/秒', zh: '交易/秒', ko: '거래/초' },
    'globe.live.countries': { vi: 'quốc gia hoạt động', en: 'countries active', ja: '稼働国', zh: '活跃国家', ko: '운영 국가' },
    'scroll.hint': { vi: 'Cuộn để khám phá', en: 'Scroll to explore', ja: 'スクロールして探索', zh: '滚动探索', ko: '스크롤하여 탐색' },

    /* SKYWATCH (privacy-first order lookup) */
    'skywatch.title': {
      vi: "Tra cứu <span class='it'>đơn hàng của bạn</span>.",
      en: "Track <span class='it'>your order</span>.",
      ja: "<span class='it'>注文を追跡</span>。",
      zh: "追踪<span class='it'>您的订单</span>。",
      ko: "<span class='it'>주문 추적</span>."
    },
    'skywatch.subtitle': {
      vi: 'Nhập mã tracking để xem trạng thái real-time. Dữ liệu đơn hàng được bảo vệ — chỉ bạn mới xem được chi tiết.',
      en: 'Enter your tracking ID to see real-time status. Your shipment data is protected — only you can see the details.',
      ja: '追跡IDを入力してリアルタイムステータスを確認。配送データは保護されています。',
      zh: '输入您的追踪ID查看实时状态。您的货物数据受保护。',
      ko: '추적 ID를 입력하여 실시간 상태를 확인하세요. 배송 데이터는 보호됩니다.'
    },
    'skywatch.track.placeholder': { vi: 'Nhập mã tracking (VD: DTR-TRK-9821-VN)', en: 'Enter your tracking ID (e.g., DTR-TRK-9821-VN)', ja: '追跡IDを入力', zh: '输入追踪ID', ko: '추적 ID 입력' },
    'skywatch.track.btn': { vi: 'Tra cứu đơn hàng', en: 'Track My Order', ja: '注文を追跡', zh: '追踪订单', ko: '주문 추적' },
    'skywatch.demo.note': {
      vi: 'Xem mô phỏng tracking đầy đủ (chuyến bay + xe trên địa cầu 3D)? <a href="demo.html">Xem demo cho ban giám khảo →</a>',
      en: 'Want to see the full live tracking simulation (flights + vehicles on 3D globe)? <a href="demo.html">View the demo for judges →</a>',
      ja: 'フル追跡シミュレーションを見る？<a href="demo.html">審査員用デモを見る →</a>',
      zh: '查看完整追踪模拟？<a href="demo.html">查看评委演示 →</a>',
      ko: '전체 추적 시뮬레이션을 보시겠습니까? <a href="demo.html">심사위원용 데모 보기 →</a>'
    },
    'skywatch.track.quick': {
      vi: 'Tra cứu đơn hàng nhanh',
      en: 'Quick order tracking',
      ja: 'クイック注文追跡',
      zh: '快速订单追踪',
      ko: '빠른 주문 추적'
    },
    'skywatch.privacy.note': {
      vi: 'Thông tin đơn hàng thuộc về khách hàng giữ mã. Chúng tôi không hiển thị đơn của người khác tại đây. Cần xem mô phỏng đầy đủ? <a href="demo.html">Xem demo cho ban giám khảo →</a>',
      en: 'Order details belong to the customer who holds the ID. We never display other shipments here. Need a full simulation? <a href="demo.html">View the demo for judges →</a>',
      ja: '注文情報は追跡番号を持つ顧客だけのものです。他人の注文はここに表示されません。完全なシミュレーションが必要ですか？<a href="demo.html">審査員用デモを見る →</a>',
      zh: '订单详情仅属于持有追踪号码的客户。我们绝不会在此显示他人的订单。需要完整模拟吗？<a href="demo.html">查看评委演示 →</a>',
      ko: '주문 세부 정보는 추적 번호를 가진 고객에게만 있습니다. 다른 사람의 주문은 여기에 표시되지 않습니다. 전체 시뮬레이션이 필요하신가요? <a href="demo.html">심사위원용 데모 보기 →</a>'
    },

    /* COUNTRY NAMES (for markers/tooltip) */
    'country.US': { vi: 'Hoa Kỳ', en: 'United States', ja: 'アメリカ', zh: '美国', ko: '미국' },
    'country.CN': { vi: 'Trung Quốc', en: 'China', ja: '中国', zh: '中国', ko: '중국' },
    'country.GB': { vi: 'Anh Quốc', en: 'United Kingdom', ja: 'イギリス', zh: '英国', ko: '영국' },
    'country.DE': { vi: 'Đức', en: 'Germany', ja: 'ドイツ', zh: '德国', ko: '독일' },
    'country.JP': { vi: 'Nhật Bản', en: 'Japan', ja: '日本', zh: '日本', ko: '일본' },
    'country.KR': { vi: 'Hàn Quốc', en: 'South Korea', ja: '韓国', zh: '韩国', ko: '대한민국' },
    'country.IN': { vi: 'Ấn Độ', en: 'India', ja: 'インド', zh: '印度', ko: '인도' },
    'country.AU': { vi: 'Úc', en: 'Australia', ja: 'オーストラリア', zh: '澳大利亚', ko: '호주' },
    'country.SG': { vi: 'Singapore', en: 'Singapore', ja: 'シンガポール', zh: '新加坡', ko: '싱가포르' },
    'country.VN': { vi: 'Việt Nam', en: 'Vietnam', ja: 'ベトナム', zh: '越南', ko: '베트남' },
    'country.BR': { vi: 'Brazil', en: 'Brazil', ja: 'ブラジル', zh: '巴西', ko: '브라질' },
    'country.ZA': { vi: 'Nam Phi', en: 'South Africa', ja: '南アフリカ', zh: '南非', ko: '남아프리카' },
    'country.RU': { vi: 'Nga', en: 'Russia', ja: 'ロシア', zh: '俄罗斯', ko: '러시아' },
    'country.AR': { vi: 'Argentina', en: 'Argentina', ja: 'アルゼンチン', zh: '阿根廷', ko: '아르헨티나' },

    /* ---- JOURNEY ---- */
    'journey.label': { vi: 'JOURNEY', en: 'JOURNEY', ja: '歩み', zh: '历程', ko: '여정' },
    'journey.subtitle': { vi: 'Digital Tech Resolution · Từ 2019 đến nay', en: 'Digital Tech Resolution · Since 2019', ja: 'Digital Tech Resolution · 2019年から現在', zh: 'Digital Tech Resolution · 自2019年至今', ko: 'Digital Tech Resolution · 2019년부터 현재' },
    'journey.title': {
      vi: "Từ <span class='it'>2019</span> đến nay.",
      en: "From <span class='it'>2019</span> to now.",
      ja: "<span class='it'>2019年</span>から現在まで。",
      zh: "从<span class='it'>2019年</span>至今。",
      ko: "<span class='it'>2019년</span>부터 지금까지."
    },
    'journey.2019.title': { vi: 'Khởi nguồn tại Việt Nam', en: 'Origin in Vietnam', ja: 'ベトナムでの創業', zh: '越南起源', ko: '베트남에서의 창업' },
    'journey.2019.desc': {
      vi: 'DTR Group được thành lập với tầm nhìn cầu nối thương mại số giữa Việt Nam và thị trường công nghệ toàn cầu. Văn phòng đầu tiên tại TP.HCM.',
      en: 'DTR Group was founded to bridge digital commerce between Vietnam and the global tech market. First office in Ho Chi Minh City.',
      ja: 'DTR Groupは、ベトナムとグローバルテクノロジー市場をつなぐデジタル商取引の架け橋として設立。最初のオフィスはホーチミン市。',
      zh: 'DTR Group成立，旨在搭建越南与全球科技市场之间的数字商务桥梁。首个办公室在胡志明市。',
      ko: 'DTR Group은 베트남과 글로벌 기술 시장을 연결하는 디지털 상거래의 다리로 설립. 첫 사무실은 호치민시.'
    },
    'journey.2021.title': { vi: 'Ra mắt nền tảng DTR—Mart', en: 'DTR—Mart Platform Launch', ja: 'DTR—Martプラットフォーム開始', zh: 'DTR—Mart平台上线', ko: 'DTR—Mart 플랫폼 출시' },
    'journey.2021.desc': {
      vi: 'Nền tảng chính thức vận hành, cung cấp game, phim và sản phẩm số từ hơn 20 quốc gia. Cán mốc 1.000 nhà cung cấp đầu tiên.',
      en: 'Platform officially launched, offering games, movies and digital products from 20+ countries. Reached 1,000 suppliers.',
      ja: 'プラットフォームが正式稼働、20カ国以上のゲーム、映画、デジタル製品を提供。1,000社のサプライヤーを突破。',
      zh: '平台正式运营，提供来自20+国家的游戏、电影和数字产品。突破1,000家供应商。',
      ko: '플랫폼이 정식 가동, 20개국 이상의 게임, 영화, 디지털 제품을 제공. 1,000개 공급업체 돌파.'
    },
    'journey.2023.title': { vi: 'Mở rộng ra Đông Nam Á', en: 'Southeast Asia Expansion', ja: '東南アジアへの拡張', zh: '东南亚扩展', ko: '동남아시아 확장' },
    'journey.2023.desc': {
      vi: 'Phục vụ khách hàng tại 30+ quốc gia. Ra mắt dịch vụ B2B điện tử & công nghiệp. Văn phòng Singapore và Tokyo đi vào hoạt động.',
      en: 'Serving customers in 30+ countries. Launched B2B electronics & industrial services. Singapore and Tokyo offices opened.',
      ja: '30カ国以上の顧客にサービスを提供。B2B電子・産業サービスを開始。シンガポール・東京オフィスが稼働。',
      zh: '服务30+国家的客户。推出B2B电子与工业服务。新加坡和东京办公室启用。',
      ko: '30개국 이상의 고객에게 서비스 제공. B2B 전자·산업 서비스 시작. 싱가포르·도쿄 사무실 가동.'
    },
    'journey.2025.title': { vi: 'Bứt phá toàn cầu', en: 'Global Breakthrough', ja: 'グローバル飛躍', zh: '全球突破', ko: '글로벌 도약' },
    'journey.2025.desc': {
      vi: 'Mạng lưới đạt 50+ quốc gia với 38.000 sản phẩm số và 12.000 đối tác. Hệ thống logistics thông minh kết nối real-time.',
      en: 'Network reached 50+ countries with 38,000 digital products and 12,000 partners. Smart logistics connected in real-time.',
      ja: 'ネットワークが50カ国以上、38,000のデジタル製品と12,000のパートナーに到達。スマート物流がリアルタイムで接続。',
      zh: '网络覆盖50+国家，拥有38,000种数字产品和12,000个合作伙伴。智能物流实时连接。',
      ko: '네트워크가 50개국 이상, 38,000개 디지털 제품과 12,000개 파트너에 도달. 스마트 물류가 실시간으로 연결.'
    },
    'journey.2026.title': { vi: 'Kỷ nguyên AI', en: 'The AI Era', ja: 'AI時代', zh: 'AI时代', ko: 'AI 시대' },
    'journey.2026.desc': {
      vi: 'Tích hợp AI vào toàn bộ chuỗi cung ứng. Cá nhân hoá trải nghiệm mua sắm và tối ưu vận hành cho đối tác toàn cầu.',
      en: 'AI integrated into the entire supply chain. Personalized shopping experience and optimized operations for global partners.',
      ja: 'AIをサプライチェーン全体に統合。パーソナライズされたショッピング体験とグローバルパートナーの運営最適化。',
      zh: 'AI融入整个供应链。个性化购物体验，为全球合作伙伴优化运营。',
      ko: 'AI를 공급망 전체에 통합. 맞춤형 쇼핑 경험과 글로벌 파트너의 운영 최적화.'
    },

    /* ---- MISSION ---- */
    'mission.label': { vi: 'MISSION & VISION', en: 'MISSION & VISION', ja: 'ミッション＆ビジョン', zh: '使命与愿景', ko: '미션 & 비전' },
    'mission.title': {
      vi: "Giá trị <span class='it'>chúng tôi theo đuổi</span>.",
      en: "The values <span class='it'>we pursue</span>.",
      ja: "<span class='it'>私たちが追求する</span>価値。",
      zh: "我们<span class='it'>追求的</span>价值。",
      ko: "<span class='it'>우리가 추구하는</span> 가치."
    },
    'mission.big1.label': { vi: 'Live metrics', en: 'Live metrics', ja: 'ライブメトリクス', zh: '实时指标', ko: '실시간 지표' },
    'mission.big1.h': {
      vi: "Mạng lưới đang <span class='it'>vận hành</span> theo thời gian thực.",
      en: "Network <span class='it'>operating</span> in real-time.",
      ja: "ネットワークが<span class='it'>リアルタイム</span>で稼働中。",
      zh: "网络<span class='it'>实时</span>运行中。",
      ko: "네트워크가 <span class='it'>실시간</span>으로 가동 중."
    },
    'mission.big1.p': {
      vi: 'Hệ thống theo dõi 12.847 giao dịch mỗi giây trên toàn cầu. Mỗi giao dịch là một điểm dữ liệu được xử lý trong <200ms.',
      en: 'System tracks 12,847 transactions per second globally. Each transaction is a data point processed in <200ms.',
      ja: 'システムは全球で12,847件/秒の取引を追跡。各取引は200ms以内に処理されるデータポイント。',
      zh: '系统全球追踪12,847笔交易/秒。每笔交易在200ms内处理完成。',
      ko: '시스템은 전 세계에서 12,847건/초의 거래를 추적. 각 거래는 200ms 이내에 처리되는 데이터 포인트.'
    },
    'mission.countries.label': { vi: 'Active hubs', en: 'Active hubs', ja: 'アクティブハブ', zh: '活跃枢纽', ko: '운영 허브' },
    'mission.countries.h': {
      vi: "5 trung tâm <span class='it'>phân phối</span>",
      en: "5 distribution <span class='it'>centers</span>",
      ja: "5つの<span class='it'>流通拠点</span>",
      zh: "5个<span class='it'>配送中心</span>",
      ko: "5개 <span class='it'>유통 거점</span>"
    },
    'mission.latency.label': { vi: 'Global latency', en: 'Global latency', ja: 'グローバルレイテンシ', zh: '全球延迟', ko: '글로벌 지연' },
    'mission.latency.h': { vi: 'Phản hồi trung bình', en: 'Average response', ja: '平均応答', zh: '平均响应', ko: '평균 응답' },
    'mission.latency.p': {
      vi: 'Chặng Bắc Mỹ · Châu Âu · Châu Á',
      en: 'North America · Europe · Asia',
      ja: '北米・欧州・アジア',
      zh: '北美·欧洲·亚洲',
      ko: '북미 · 유럽 · 아시아'
    },
    'mission.uptime.label': { vi: 'Uptime 90 ngày', en: 'Uptime 90 days', ja: '稼働率 90日', zh: '正常运行 90天', ko: '가동률 90일' },
    'mission.txn.label': { vi: 'Giao dịch / tháng', en: 'Transactions / month', ja: '月間取引', zh: '月交易量', ko: '월간 거래' },
    'mission.tags.label': { vi: 'Danh mục', en: 'Categories', ja: 'カテゴリー', zh: '类别', ko: '카테고리' },

    /* ---- SUPPORT ---- */
    'support.label': { vi: 'SUPPORT', en: 'SUPPORT', ja: 'サポート', zh: '支持', ko: '지원' },
    'support.title': {
      vi: "Hỗ trợ <span class='it'>mọi lúc, mọi nơi</span>.",
      en: "Support <span class='it'>anytime, anywhere</span>.",
      ja: "<span class='it'>いつでもどこでも</span>サポート。",
      zh: "<span class='it'>随时随地</span>支持。",
      ko: "<span class='it'>언제 어디서나</span> 지원."
    },
    'support.help.h': { vi: 'Trung tâm hỗ trợ', en: 'Help Center', ja: 'ヘルプセンター', zh: '帮助中心', ko: '도움말 센터' },
    'support.help.p': {
      vi: 'Tài liệu, video hướng dẫn và cẩm nang sử dụng dịch vụ.',
      en: 'Documentation, video tutorials and service guides.',
      ja: 'ドキュメント、ビデオチュートリアル、サービスガイド。',
      zh: '文档、视频教程和服务指南。',
      ko: '문서, 비디오 튜토리얼 및 서비스 가이드.'
    },
    'support.chat.h': { vi: 'Live Chat 24/7', en: 'Live Chat 24/7', ja: 'ライブチャット 24/7', zh: '24/7在线客服', ko: '실시간 채팅 24/7' },
    'support.chat.p': {
      vi: 'Trò chuyện trực tuyến với nhân viên hỗ trợ bất cứ lúc nào.',
      en: 'Chat online with support staff anytime.',
      ja: 'いつでもサポート担当者とオンラインチャット。',
      zh: '随时与支持人员在线聊天。',
      ko: '언제든지 지원 담당자와 온라인 채팅.'
    },
    'support.phone.h': { vi: 'Hotline', en: 'Hotline', ja: 'ホットライン', zh: '热线', ko: '핫라인' },
    'support.phone.p': {
      vi: 'Gọi 1900 xxxx — đội ngũ phản hồi trong vòng 30 phút.',
      en: 'Call 1900 xxxx — response team replies within 30 minutes.',
      ja: '1900 xxxxに電話 — 30分以内に対応チームが返信。',
      zh: '致电1900 xxxx — 团队30分钟内回复。',
      ko: '1900 xxxx로 전화 — 30분 이내에 응답팀이 회신.'
    },
    'support.track.h': { vi: 'Tra cứu đơn hàng', en: 'Order Tracking', ja: '注文追跡', zh: '订单追踪', ko: '주문 추적' },
    'support.track.p': {
      vi: 'Theo dõi trạng thái đơn hàng theo mã vận đơn.',
      en: 'Track order status by tracking number.',
      ja: '追跡番号で注文状況を確認。',
      zh: '通过运单号追踪订单状态。',
      ko: '추적 번호로 주문 상태를 확인.'
    },
    'support.warranty.h': { vi: 'Bảo hành 1-1', en: '1-for-1 Warranty', ja: '1対1保証', zh: '一对一保修', ko: '1:1 보증' },
    'support.warranty.p': {
      vi: 'Chính sách bảo hành đổi mới trong 30 ngày cho sản phẩm lỗi.',
      en: '1-for-1 replacement warranty within 30 days for defective products.',
      ja: '不良品は30日以内の1対1交換保証。',
      zh: '缺陷产品30天内一对一换新保修。',
      ko: '불량 제품은 30일 이내 1:1 교환 보증.'
    },
    'support.faq.h': { vi: 'Câu hỏi thường gặp', en: 'FAQ', ja: 'よくある質問', zh: '常见问题', ko: '자주 묻는 질문' },
    'support.faq.p': {
      vi: 'Giải đáp thắc mắc về thanh toán, đơn hàng, bảo hành.',
      en: 'Answers about payments, orders and warranty.',
      ja: '支払い、注文、保証に関する回答。',
      zh: '关于付款、订单和保修的解答。',
      ko: '결제, 주문, 보증에 대한 답변.'
    },

    /* ---- CTA ---- */
    'cta.eyebrow': {
      vi: 'Sẵn sàng tham gia?',
      en: 'Ready to join?',
      ja: '参加する準備はできましたか？',
      zh: '准备好加入了吗？',
      ko: '참여할 준비가 되셨나요?'
    },
    'cta.title': {
      vi: "Bắt đầu <span class='it'>hành trình</span> của bạn.",
      en: "Start your <span class='it'>journey</span>.",
      ja: "<span class='it'>旅</span>を始めましょう。",
      zh: "开启您的<span class='it'>旅程</span>。",
      ko: "<span class='it'>여정</span>을 시작하세요."
    },
    'cta.btn': { vi: 'Đăng ký ngay', en: 'Sign Up Now', ja: '今すぐ登録', zh: '立即注册', ko: '지금 가입하기' },

    /* ---- FOOTER ---- */
    'footer.brand': { vi: 'DTR—<span class="accent">Mart</span>', en: 'DTR—<span class="accent">Mart</span>', ja: 'DTR—<span class="accent">Mart</span>', zh: 'DTR—<span class="accent">Mart</span>', ko: 'DTR—<span class="accent">Mart</span>' },
    'footer.tagline': {
      vi: 'Digital Tech Resolution. Thương mại không biên giới — từ Việt Nam ra thế giới.',
      en: 'Digital Tech Resolution. Commerce without borders — from Vietnam to the world.',
      ja: 'Digital Tech Resolution。国境なき商取引 — ベトナムから世界へ。',
      zh: 'Digital Tech Resolution。无国界商业 — 从越南到世界。',
      ko: 'Digital Tech Resolution. 국경 없는 상거래 — 베트남에서 세계로.'
    },
    'footer.col1.title': { vi: 'Sản phẩm', en: 'Products', ja: '製品', zh: '产品', ko: '제품' },
    'footer.col2.title': { vi: 'Công ty', en: 'Company', ja: '会社', zh: '公司', ko: '회사' },
    'footer.col3.title': { vi: 'Hỗ trợ', en: 'Support', ja: 'サポート', zh: '支持', ko: '지원' },
    'footer.col1.l1': { vi: 'Trò chơi', en: 'Games', ja: 'ゲーム', zh: '游戏', ko: '게임' },
    'footer.col1.l2': { vi: 'Phim ảnh', en: 'Movies', ja: '映画', zh: '电影', ko: '영화' },
    'footer.col1.l3': { vi: 'Sản phẩm số', en: 'Digital Products', ja: 'デジタル製品', zh: '数字产品', ko: '디지털 제품' },
    'footer.col1.l4': { vi: 'Điện tử & CN', en: 'Electronics & Industrial', ja: '電子・産業', zh: '电子与工业', ko: '전자 & 산업' },
    'footer.col2.l1': { vi: 'Về chúng tôi', en: 'About Us', ja: '会社概要', zh: '关于我们', ko: '회사 소개' },
    'footer.col2.l2': { vi: 'Đối tác', en: 'Partners', ja: 'パートナー', zh: '合作伙伴', ko: '파트너' },
    'footer.col2.l3': { vi: 'Tuyển dụng', en: 'Careers', ja: '採用情報', zh: '招聘', ko: '채용' },
    'footer.col2.l4': { vi: 'Báo chí', en: 'Press', ja: 'プレス', zh: '新闻', ko: '보도자료' },
    'footer.col3.l1': { vi: 'Trung tâm hỗ trợ', en: 'Help Center', ja: 'ヘルプセンター', zh: '帮助中心', ko: '도움말 센터' },
    'footer.col3.l2': { vi: 'FAQ', en: 'FAQ', ja: 'よくある質問', zh: '常见问题', ko: '자주 묻는 질문' },
    'footer.col3.l3': { vi: 'Liên hệ', en: 'Contact', ja: 'お問い合わせ', zh: '联系', ko: '문의' },
    'footer.col3.l4': { vi: 'Bảo mật', en: 'Privacy', ja: 'プライバシー', zh: '隐私', ko: '개인정보' },
    'footer.bottom.left': {
      vi: '© 2026 DTR—Mart · All rights reserved',
      en: '© 2026 DTR—Mart · All rights reserved',
      ja: '© 2026 DTR—Mart · All rights reserved',
      zh: '© 2026 DTR—Mart · 版权所有',
      ko: '© 2026 DTR—Mart · All rights reserved'
    },
    'footer.bottom.right': {
      vi: 'Made in Vietnam · Since 2019',
      en: 'Made in Vietnam · Since 2019',
      ja: 'Made in Vietnam · Since 2019',
      zh: '越南制造 · 自2019年',
      ko: 'Made in Vietnam · Since 2019'
    },

    /* ---- COMPLIANCE ---- */
    'compliance.disclaimer': {
      vi: 'Mô phỏng sandbox logistics doanh nghiệp: Thiết kế theo tiêu chuẩn thương mại quốc tế và bảo mật dữ liệu.',
      en: 'Enterprise Logistics Sandbox Simulation: Engineered in accordance with international trade and data privacy standards.',
      ja: 'エンタープライズ物流サンドボックスシミュレーション：国際貿易およびデータプライバシー基準に準拠。',
      zh: '企业物流沙盒模拟：符合国际贸易和数据隐私标准。',
      ko: '엔터프라이즈 물류 샌드박스 시뮬레이션: 국제 무역 및 데이터 프라이버시 기준에 부합.'
    },

    /* ---- THEME ---- */
    'theme.toggle': { vi: 'Chuyển giao diện', en: 'Toggle theme', ja: 'テーマ切替', zh: '切换主题', ko: '테마 전환' },

    /* ---- LANGUAGE LABELS ---- */
    'lang.vi': { vi: 'Tiếng Việt', en: 'Vietnamese', ja: 'ベトナム語', zh: '越南语', ko: '베트남어' },
    'lang.en': { vi: 'English', en: 'English', ja: '英語', zh: '英语', ko: '영어' },
    'lang.ja': { vi: '日本語', en: 'Japanese', ja: '日本語', zh: '日语', ko: '일본어' },
    'lang.zh': { vi: '简体中文', en: 'Simplified Chinese', ja: '簡体字中国語', zh: '简体中文', ko: '간체 중국어' },
    'lang.ko': { vi: 'Tiếng Hàn', en: 'Korean', ja: '韓国語', zh: '韩语', ko: '한국어' }
  };

  /* ============================================================
     LANGUAGE DETECTION CASCADE
     ============================================================ */
  function detectLanguage() {
    // Priority 1: URL param ?lang=<code>
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED.includes(urlLang.toLowerCase())) {
      return urlLang.toLowerCase();
    }

    // Priority 1b: Hash route #/vi/ etc.
    const hash = window.location.hash;
    const hashMatch = hash.match(/^#\/(vi|en|ja|zh|ko)\//i);
    if (hashMatch) return hashMatch[1].toLowerCase();

    // Priority 2: localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored.toLowerCase())) {
        return stored.toLowerCase();
      }
    } catch (e) { /* ignore */ }

    // Priority 3: System auto-detection
    const sysLang = (navigator.language || '').toLowerCase();
    if (sysLang.startsWith('vi')) return 'vi';
    if (sysLang.startsWith('ja')) return 'ja';
    if (sysLang.startsWith('zh')) return 'zh';
    if (sysLang.startsWith('ko')) return 'ko';

    // Priority 4: Fallback
    return DEFAULT_LANG;
  }

  /* ============================================================
     GET TRANSLATION
     ============================================================ */
  function t(key, lang) {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] || entry[DEFAULT_LANG] || entry.en || key;
  }

  /* ============================================================
     APPLY LANGUAGE TO DOM
     ============================================================ */
  function applyLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

    // Update <html lang>
    document.documentElement.lang = lang;

    // Text nodes — preserve child elements (svg, icons)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      // Only set textContent if the element has no important children (svg, etc.)
      if (el.children.length === 0) {
        el.textContent = t(key, lang);
      } else {
        // Update aria-label if it has data-i18n-aria
        if (el.dataset.i18nAria) {
          el.setAttribute('aria-label', t(el.dataset.i18nAria, lang));
        }
      }
    });

    // HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      el.innerHTML = t(key, lang);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key, lang);
    });

    // Update active state in language menu
    document.querySelectorAll('.lang-menu a').forEach(a => {
      a.classList.toggle('active', a.dataset.lang === lang);
    });

    // Update flag button
    const flagEl = document.querySelector('.lang-btn .flag');
    const flags = { vi: '🇻🇳', en: '🇺🇸', ja: '🇯🇵', zh: '🇨🇳', ko: '🇰🇷' };
    if (flagEl) flagEl.textContent = flags[lang] || '🌐';

    // Update lang code text (e.g. EN, VI, JA, ZH, KO)
    const codeEl = document.querySelector('.lang-btn .lang-code');
    if (codeEl) codeEl.textContent = lang.toUpperCase();

    // Save preference
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }

    // Dispatch event for other components (globe tooltip etc.)
    window.dispatchEvent(new CustomEvent('dtr:lang-change', { detail: { lang } }));

    return lang;
  }

  /* ============================================================
     INIT — auto-detect and apply on load
     ============================================================ */
  function init() {
    const lang = detectLanguage();
    applyLanguage(lang);

    // Language menu click handlers
    document.querySelectorAll('.lang-menu a').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const selectedLang = a.dataset.lang;
        applyLanguage(selectedLang);
        // Close dropdown
        document.querySelector('.lang-switch')?.classList.remove('open');
      });
    });

    // Toggle dropdown
    const langBtn = document.querySelector('.lang-btn');
    const langSwitch = document.querySelector('.lang-switch');
    if (langBtn) {
      langBtn.addEventListener('click', e => {
        e.stopPropagation();
        langSwitch?.classList.toggle('open');
      });
    }

    // Close on outside click
    document.addEventListener('click', e => {
      if (langSwitch && !langSwitch.contains(e.target)) {
        langSwitch.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') langSwitch?.classList.remove('open');
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
    t,
    applyLanguage,
    detectLanguage,
    getSupported: () => [...SUPPORTED],
    getDefault: () => DEFAULT_LANG,
    DICT
  };
})();

// Expose globally
window.DTR_I18N = DTR_I18N;
