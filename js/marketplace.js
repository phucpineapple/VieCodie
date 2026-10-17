(function () {
  'use strict';

  const $ = function (s, p) {
    return (p || document).querySelector(s);
  };
  const $$ = function (s, p) {
    return Array.from((p || document).querySelectorAll(s));
  };
  const CART_KEY = 'dtr_cart';
  const PROMO_CFG_KEY = 'dtr_promo_config';
  const FAV_KEY = 'dtr_favorites';
  function getCleanReturnUrl() {
    const path = (window.location?.pathname || '').split('/').pop() || 'marketplace.html';
    return encodeURIComponent(path + (window.location?.search || '') + (window.location?.hash || ''));
  }
  function formatPrice(n) {
    return Number(n || 0).toLocaleString('vi-VN') + 'đ';
  }
  function showToast(msg, isError) {
    const t = $('#toast');
    if (!t) return;
    const iconCls = isError ? 'fa-triangle-exclamation text-rose-500' : 'fa-circle-check text-[#a3e635]';
    t.innerHTML = '<i class="fa-solid ' + iconCls + ' mr-2"></i><span>' + (msg || '') + '</span>';
    t.classList.toggle('error', !!isError);
    t.classList.add('show');
    clearTimeout(t._tmr);
    t._tmr = setTimeout(function () {
      t.classList.remove('show');
    }, 2600);
  }
  function getFavorites() {
    let raw, arr;
    try {
      raw = localStorage.getItem(FAV_KEY);
      arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function saveFavorites(arr) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
      return true;
    } catch (e) {
      return false;
    }
  }
  function isFavorite(id) {
    if (!id) return false;
    return getFavorites().indexOf(id) !== -1;
  }
  function toggleFavorite(id) {
    if (!id) return false;
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    let nowFav;
    if (idx === -1) {
      favs.push(id);
      nowFav = true;
    } else {
      favs.splice(idx, 1);
      nowFav = false;
    }
    saveFavorites(favs);
    return nowFav;
  }
  function syncWishButtons(id, isFav) {
    document.querySelectorAll('[data-wish="' + id + '"]').forEach(function (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-regular', !isFav);
        icon.classList.toggle('fa-solid', isFav);
      }
      btn.classList.toggle('is-active', isFav);
    });
  }
  const LoaderCtl = function () {
    const el = $('#loader');
    const label = $('#loaderLabel');
    function run() {
      if (el) {
        el.setAttribute('role', 'status');
        el.setAttribute('aria-label', 'Đang tải nội dung');
      }
      return Promise.resolve();
    }
    function setText(msg) {
      if (label) label.textContent = msg;
      if (el) el.classList.add('redirecting');
    }
    function hide() {
      if (el) el.classList.add('done');
      if (document.body) document.body.classList.remove('is-loading');
    }
    return {
      run: run,
      setText: setText,
      hide: hide
    };
  }();
  const DEFAULT_DATA = {
    brand: 'DTR-Market',
    tagline: 'Phim Rạp · Công Nghiệp · Điện Tử · Kĩ Thuật Số',
    theme: {
      primaryColor: '#a3e635',
      secondaryColor: '#22d3ee',
      bgDark: '#091528',
      cardBg: '#0c182c',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    heroSlides: [{
      badge: 'CÔNG NGHỆ · ĐIỆN TỬ · KĨ THUẬT SỐ · PHIM RẠP',
      title1: 'Thiết bị hiện đại',
      title2: 'Kết nối ',
      accent: 'mọi đam mê'
    }, {
      badge: 'ĐẶT VÉ PHIM RẠP THEO VỊ TRÍ',
      title1: 'Trải nghiệm điện ảnh',
      title2: 'Đặt vé ',
      accent: 'siêu tốc độ'
    }, {
      badge: 'KHO TRÒ CHƠI, NHẠC SỐ & GIFT CARD',
      title1: 'Giải trí kĩ thuật số',
      title2: 'Ưu đãi ',
      accent: 'không giới hạn'
    }, {
      badge: 'THIẾT BỊ CÔNG NGHIỆP & TỰ ĐỘNG HÓA',
      title1: 'Chuẩn hóa sản xuất',
      title2: 'Dẫn đầu ',
      accent: 'kỷ nguyên số'
    }],
    badgeConfig: {
      bestseller: {
        text: 'Bán chạy',
        cls: 'bg-gradient-to-r from-[#84cc16] to-[#4ade80] text-slate-950'
      },
      new: {
        text: 'Mới',
        cls: 'bg-gradient-to-r from-[#22c55e] to-[#a3e635] text-slate-950'
      },
      sale: {
        text: 'Giảm giá',
        cls: 'bg-gradient-to-r from-red-600 to-rose-500 text-white'
      },
      hot: {
        text: 'Hot!',
        cls: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
      }
    },
    giftStyles: {
      'LUMEN': {
        border: 'border-blue-500/30',
        bgTop: 'bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-950',
        bgBot: 'bg-gradient-to-b from-[#0c1d38] to-[#081326]',
        icon: 'fa-gamepad',
        defaultPrice: 200000
      },
      'ORBIS': {
        border: 'border-slate-600/40',
        bgTop: 'bg-gradient-to-br from-slate-600 via-slate-800 to-blue-950',
        bgBot: 'bg-gradient-to-b from-[#0c1d38] to-[#081326]',
        icon: 'fa-dice-d20',
        defaultPrice: 200000
      },
      'HALO': {
        border: 'border-cyan-500/30',
        bgTop: 'bg-gradient-to-br from-cyan-400 via-blue-600 to-fuchsia-600',
        bgBot: 'bg-gradient-to-b from-[#0c1d38] to-[#081326]',
        icon: 'fa-shapes',
        defaultPrice: 100000
      },
      'ARENA': {
        border: 'border-rose-500/30',
        bgTop: 'bg-gradient-to-br from-red-500 via-red-700 to-rose-950',
        bgBot: 'bg-gradient-to-b from-[#2b1224] to-[#170b18]',
        icon: 'fa-shield-halved',
        defaultPrice: 100000
      },
      'PIXEL': {
        border: 'border-sky-500/30',
        bgTop: 'bg-gradient-to-br from-cyan-400 via-sky-600 to-blue-900',
        bgBot: 'bg-gradient-to-b from-[#0c1d38] to-[#081326]',
        icon: 'fa-bolt',
        defaultPrice: 50000
      }
    },
    langMeta: {
      vi: {
        flag: '🇻🇳',
        code: 'VN'
      },
      ja: {
        flag: '🇯🇵',
        code: 'JA'
      },
      en: {
        flag: '🇬🇧',
        code: 'EN'
      },
      zh: {
        flag: '🇨🇳',
        code: 'ZH'
      }
    },
    majorGroups: [{
      id: 'cinema',
      name: 'Phim rạp',
      icon: 'fa-film',
      desc: 'Đặt vé phim theo vị trí, chọn ghế & combo bắp nước'
    }, {
      id: 'industrial',
      name: 'Công Nghiệp',
      icon: 'fa-industry',
      desc: 'Thiết bị tự động hóa, cảm biến & phần cứng nhà máy'
    }, {
      id: 'electronics',
      name: 'Điện tử',
      icon: 'fa-microchip',
      desc: 'Điện thoại, máy tính, tai nghe & thiết bị thông minh'
    }, {
      id: 'digital',
      name: 'Kĩ thuật số',
      icon: 'fa-compact-disc',
      desc: 'Trò chơi, nhạc bản quyền, phần mềm & Gift Card'
    }],
    categories: [{
      id: 'phone',
      name: 'Điện thoại',
      group: 'electronics',
      icon: 'fa-mobile-screen-button'
    }, {
      id: 'laptop',
      name: 'Máy tính',
      group: 'electronics',
      icon: 'fa-laptop'
    }, {
      id: 'accessory',
      name: 'Phụ kiện điện tử',
      group: 'electronics',
      icon: 'fa-headphones'
    }, {
      id: 'game',
      name: 'Trò chơi',
      group: 'digital',
      icon: 'fa-gamepad'
    }, {
      id: 'music',
      name: 'Nhạc & Audio số',
      group: 'digital',
      icon: 'fa-music'
    }, {
      id: 'giftcard',
      name: 'Gift Card',
      group: 'digital',
      icon: 'fa-gift'
    }, {
      id: 'automation',
      name: 'Tự động hóa',
      group: 'industrial',
      icon: 'fa-robot'
    }, {
      id: 'sensor',
      name: 'Thiết bị đo & IoT',
      group: 'industrial',
      icon: 'fa-gauge-high'
    }],
    brands: [{
      id: 'novatech',
      name: 'NovaTech'
    }, {
      id: 'aethercore',
      name: 'AetherCore'
    }, {
      id: 'cybergear',
      name: 'CyberGear'
    }, {
      id: 'mechaind',
      name: 'MechaInd'
    }, {
      id: 'vstream',
      name: 'V-Stream'
    }],
    promoConfig: {
      globalEvent: {
        enabled: true,
        name: 'Đại Lễ Cyber Sale 10/10',
        startTime: '2026-10-01T00:00',
        endTime: '2026-12-31T23:59'
      },
      brandPromos: {
        novatech: {
          brandId: 'novatech',
          brandName: 'NovaTech',
          startTime: '2026-10-01T00:00',
          endTime: '2026-11-30T23:59',
          isSponsored: true
        },
        cybergear: {
          brandId: 'cybergear',
          brandName: 'CyberGear',
          startTime: '2026-10-01T00:00',
          endTime: '2026-11-15T23:59',
          isSponsored: false
        }
      },
      itemEarlyEnds: {
        p001: '2026-10-25T23:59',
        p003: '2026-10-20T22:00'
      },
      banners: [{
        id: 'bn01',
        brandId: 'novatech',
        brandName: 'NovaTech',
        title: 'Tuần Lễ Thương Hiệu NovaTech · Giảm Sâu Đến 35%',
        subtitle: 'Đối tác Book vị trí Ưu tiên',
        img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80'
      }, {
        id: 'bn02',
        brandId: 'cybergear',
        brandName: 'CyberGear',
        title: 'Siêu Hội Trò Chơi & Gear Kĩ Thuật Số CyberGear',
        subtitle: 'Ưu đãi giới hạn theo khung giờ',
        img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80'
      }, {
        id: 'bn03',
        brandId: 'mechaind',
        brandName: 'MechaInd',
        title: 'Giải Pháp Công Nghiệp & IoT Thông Minh MechaInd',
        subtitle: 'Trợ giá doanh nghiệp',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80'
      }]
    },
    products: [{
      id: 'p001',
      name: 'DTR-Book Pro M3 14"',
      desc: '16GB RAM | 512GB NVMe | Màn hình O-Retina',
      group: 'electronics',
      category: 'laptop',
      brand: 'novatech',
      price: 21990000,
      priceOld: 27990000,
      badge: 'sale',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      rating: 4.9,
      sold: 1850
    }, {
      id: 'p002',
      name: 'NovaPhone 16 Ultra 5G',
      desc: '256GB | Khung Titan | Camera AI 200MP',
      group: 'electronics',
      category: 'phone',
      brand: 'novatech',
      price: 24990000,
      priceOld: 29990000,
      badge: 'bestseller',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80',
      rating: 4.9,
      sold: 3420
    }, {
      id: 'p003',
      name: 'Tai nghe AetherPods Pro ANC',
      desc: 'Chống ồn chủ động | Âm thanh vòm 360',
      group: 'electronics',
      category: 'accessory',
      brand: 'aethercore',
      price: 3290000,
      priceOld: 4990000,
      badge: 'hot',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
      rating: 4.8,
      sold: 4120
    }, {
      id: 'p004',
      name: 'Đĩa Game CyberQuest 2077 Deluxe',
      desc: 'Bản quyền Kĩ thuật số + DLC Mở rộng',
      group: 'digital',
      category: 'game',
      brand: 'cybergear',
      price: 790000,
      priceOld: 1290000,
      badge: 'sale',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
      rating: 4.9,
      sold: 5210
    }, {
      id: 'p005',
      name: 'Gói Nhạc Lossless V-Stream 12 Tháng',
      desc: 'Âm thanh Hi-Res | Nghe offline đa thiết bị',
      group: 'digital',
      category: 'music',
      brand: 'vstream',
      price: 490000,
      priceOld: 890000,
      badge: 'new',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      rating: 4.7,
      sold: 1640
    }, {
      id: 'p006',
      name: 'Cánh Tay Robot Phân Loại MechaArm X2',
      desc: 'Tải trọng 15kg | Tự động hóa dây chuyền',
      group: 'industrial',
      category: 'automation',
      brand: 'mechaind',
      price: 68000000,
      priceOld: 79000000,
      badge: 'hot',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      rating: 5.0,
      sold: 310
    }, {
      id: 'p007',
      name: 'Bộ Cảm Biến Nhiệt & Áp Suất IoT S9',
      desc: 'Chuẩn chống nước IP68 | Kết nối Cloud',
      group: 'industrial',
      category: 'sensor',
      brand: 'mechaind',
      price: 4500000,
      priceOld: 5500000,
      badge: 'bestseller',
      isPromo: true,
      img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
      rating: 4.8,
      sold: 980
    }],
    giftcards: [{
      id: 'gc01',
      name: 'Lumen Network',
      priceRange: '50.000đ - 2.000.000đ',
      brand: 'LUMEN',
      defaultPrice: 200000
    }, {
      id: 'gc02',
      name: 'Orbis Wallet',
      priceRange: '50.000đ - 2.000.000đ',
      brand: 'ORBIS',
      defaultPrice: 200000
    }, {
      id: 'gc03',
      name: 'Halo Store',
      priceRange: '50.000đ - 2.000.000đ',
      brand: 'HALO',
      defaultPrice: 100000
    }, {
      id: 'gc04',
      name: 'Arena Pass',
      priceRange: '50.000đ - 1.000.000đ',
      brand: 'ARENA',
      defaultPrice: 100000
    }, {
      id: 'gc05',
      name: 'Pixel Card',
      priceRange: '20.000đ - 500.000đ',
      brand: 'PIXEL',
      defaultPrice: 50000
    }],
    cinemaData: {
      defaultLocation: 'Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh, Việt Nam',
      vipSurcharge: 20000,
      locations: {
        'Việt Nam': {
          'TP. Hồ Chí Minh': {
            'Quận 1': ['Đường Nguyễn Huệ', 'Đường Lê Lợi', 'Đường Đồng Khởi'],
            'Quận 3': ['Đường Võ Văn Tần', 'Đường Nam Kỳ Khởi Nghĩa'],
            'TP. Thủ Đức': ['Đường Võ Văn Ngân', 'Đại lộ Mai Chí Thọ']
          },
          'Cần Thơ': {
            'Quận Ninh Kiều': ['Đường 30 Tháng 4', 'Đường Nguyễn Văn Cừ', 'Đường Mậu Thân'],
            'Quận Cái Răng': ['Đường Võ Nguyên Giáp', 'Khu đô thị Nam Cần Thơ']
          },
          'Hà Nội': {
            'Quận Cầu Giấy': ['Đường Xuân Thủy', 'Đường Cầu Giấy'],
            'Quận Hoàn Kiếm': ['Đường Tràng Tiền', 'Đường Hàng Bài']
          }
        },
        'Nhật Bản': {
          'Tokyo': {
            'Shibuya': ['Shibuya Crossing', 'Center-Gai Street'],
            'Shinjuku': ['Kabukicho Avenue', 'Yasukuni-dori']
          }
        }
      },
      movies: [{
        id: 'mv01',
        title: 'Chiến Binh Mạng: Kỷ Nguyên AI',
        title_en: 'Cyber Warrior: AI Era',
        title_ja: 'サイバーウォーリアー: AI新時代',
        title_zh: '网络战士：AI纪元',
        genre: 'Khoa học viễn tưởng · Hành động',
        genre_en: 'Sci-Fi · Action',
        genre_ja: 'SF · アクション',
        genre_zh: '科幻 · 动作',
        duration: '132 phút',
        duration_en: '132 mins',
        duration_ja: '132分',
        duration_zh: '132分钟',
        age: 'T16',
        rating: 4.9,
        basePrice: 95000,
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
        desc: 'Cuộc chiến bảo vệ lõi dữ liệu trung tâm.',
        desc_en: 'The epic battle to defend the central data core matrix.',
        desc_ja: 'セントラルデータコアを守る電脳サイバーバトル。',
        desc_zh: '保卫中央核心数据矩阵的终极战役。'
      }, {
        id: 'mv02',
        title: 'Bóng Đêm Đại Dương Sâu',
        title_en: 'Shadows of the Deep Ocean',
        title_ja: '深海のシャドウ・アドベンチャー',
        title_zh: '深海阴影：失落之城',
        genre: 'Phiêu lưu · Giả tưởng',
        genre_en: 'Adventure · Fantasy',
        genre_ja: '冒険 · ファンタジー',
        genre_zh: '冒险 · 奇幻',
        duration: '118 phút',
        duration_en: '118 mins',
        duration_ja: '118分',
        duration_zh: '118分钟',
        age: 'P',
        rating: 4.8,
        basePrice: 90000,
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
        desc: 'Hành trình khám phá thành phố cổ đại dưới rãnh Mariana.',
        desc_en: 'A thrilling journey to uncover ancient sunken civilizations.',
        desc_ja: 'マリアナ海溝に眠る古代海底都市を探求する旅。',
        desc_zh: '探索马里亚纳海沟沉没古代文明的探险之旅。'
      }, {
        id: 'mv03',
        title: 'Đường Đua Tốc Độ Ánh Sáng',
        title_en: 'LightSpeed Drift: Gravity Overdrive',
        title_ja: 'ライトスピード・ドリフト: 重力突破',
        title_zh: '光速漂移：反重力极速赛',
        genre: 'Hành động · Thể thao',
        genre_en: 'Action · Cyber Sports',
        genre_ja: 'アクション · サイバースポーツ',
        genre_zh: '动作 · 赛博竞速',
        duration: '125 phút',
        duration_en: '125 mins',
        duration_ja: '125分',
        duration_zh: '125分钟',
        age: 'T13',
        rating: 4.7,
        basePrice: 100000,
        img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
        desc: 'Giải đua xe phản trọng lực xuyên lục địa khốc liệt nhất thiên hà.',
        desc_en: 'The most intense intergalactic anti-gravity grand prix.',
        desc_ja: '銀河系最速を競う超高速反重力グランプリ。',
        desc_zh: '横跨星系的超高速反重力锦标巅峰对决。'
      }, {
        id: 'mv04',
        title: 'Giai Điệu Mùa Thu Cuối',
        title_en: 'Autumn Melody: Last Harmony',
        title_ja: 'ラスト・ハーモニー: 秋の調べ',
        title_zh: '秋末旋律：最终和声',
        genre: 'Tâm lý · Âm nhạc',
        genre_en: 'Drama · Music',
        genre_ja: 'ドラマ · 音楽',
        genre_zh: '剧情 · 音乐',
        duration: '110 phút',
        duration_en: '110 mins',
        duration_ja: '110分',
        duration_zh: '110分钟',
        age: 'P',
        rating: 4.9,
        basePrice: 85000,
        img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
        desc: 'Câu chuyện đầy cảm xúc về tình yêu và âm nhạc tại thủ đô Tokyo.',
        desc_en: 'An emotional romance told through soul-stirring live orchestral music.',
        desc_ja: '東京を舞台に奏でられる感動のラブストーリーと極上の音楽。',
        desc_zh: '在东京都市背景下交织的动人爱情与交响音乐传奇。'
      }],
      theaters: [{
        id: 'th01',
        brandName: 'CineNova Grand Multiplex',
        badge: 'Âm thanh AetherSound 3D · NeoLaser',
        badge_en: 'AetherSound 3D Audio · NeoLaser 4K',
        badge_ja: 'AetherSound 3D立体音響 · ネオレーザー4K',
        badge_zh: 'AetherSound 3D立体声 · 新一代激光4K',
        surcharge: 0,
        showtimes: ['10:30', '13:15', '16:00', '19:30', '21:45'],
        occupiedSeats: ['B3', 'B4', 'C5', 'C6', 'D4']
      }, {
        id: 'th02',
        brandName: 'StarPlex Cyber Cinema',
        badge: 'Ghế ngả Sofa cao cấp · Màn hình cong',
        badge_en: 'Luxury Recliner Sofa · Curved Screen',
        badge_ja: '高級リクライニングソファ · 湾曲巨大スクリーン',
        badge_zh: '尊享头等舱沙发 · 环形巨幕',
        surcharge: 15000,
        showtimes: ['11:00', '14:30', '18:00', '20:15', '22:30'],
        occupiedSeats: ['A2', 'C3', 'C4', 'E5', 'E6']
      }, {
        id: 'th03',
        brandName: 'AetherBox Gold Theater',
        badge: 'Phòng chiếu MotionX',
        badge_en: 'MotionX 4D Dynamics Theater',
        badge_ja: 'MotionX 4D体感シアター',
        badge_zh: 'MotionX 4D动感体验影厅',
        surcharge: 25000,
        showtimes: ['12:00', '15:30', '19:00', '21:15'],
        occupiedSeats: ['B5', 'D2', 'D3', 'E4']
      }],
      combos: [{
        id: 'cb01',
        name: 'Combo Bắp Ngọt Lớn + 2 Nước Ngọt',
        name_en: 'Large Sweet Popcorn + 2 Soft Drinks',
        name_ja: '特大キャラメルポップコーン + ドリンク2本',
        name_zh: '大份甜味爆米花 + 2杯汽水',
        desc: '1 Bắp Caramel 64oz + 2 Ly CyberCola 32oz',
        desc_en: '1x 64oz Caramel Popcorn + 2x 32oz CyberCola',
        desc_ja: '64ozキャラメルポップコーン + 32ozサイバーコーラ2杯',
        desc_zh: '1份64oz焦糖爆米花 + 2杯32oz赛博可乐',
        price: 89000,
        img: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&q=80'
      }, {
        id: 'cb02',
        name: 'Combo Bắp Phô Mai + 1 Nước + Snack',
        name_en: 'Cheese Popcorn + 1 Drink + Crispy Fries',
        name_ja: 'チーズポップコーン + ドリンク1本 + ポテト',
        name_zh: '芝士爆米花 + 1杯饮料 + 脆薯条',
        desc: '1 Bắp Phô Mai + 1 Nước Lớn + 1 Khoai tây chiên',
        desc_en: '1x Cheese Popcorn + 1x Large Drink + 1x French Fries',
        desc_ja: 'チーズポップコーン1個 + Lドリンク1本 + フライドポテト',
        desc_zh: '1份芝士爆米花 + 1杯大杯饮料 + 1份炸薯条',
        price: 75000,
        img: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80'
      }, {
        id: 'cb03',
        name: 'Quà Lưu Niệm Ly Giữ Nhiệt LED Phim',
        name_en: 'Limited Movie Edition LED Thermal Tumbler',
        name_ja: '映画限定LED発光サーモタンブラー',
        name_zh: '限量版电影LED发光保温随行杯',
        desc: 'Ly giữ nhiệt phát sáng LED phiên bản giới hạn',
        desc_en: 'Exclusive double-wall LED glowing thermal tumbler',
        desc_ja: '限定デザインのLEDライト付き真空断熱タンブラー',
        desc_zh: '专属双层真空隔热LED发光纪念杯',
        price: 129000,
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80'
      }]
    }
  };
  let DATA = DEFAULT_DATA;
  function sanitizeRealBrands(dataObj) {
    if (!dataObj) return;
    const brandMap = {
      'PSN': 'LUMEN',
      'STEAM': 'ORBIS',
      'GPLAY': 'HALO',
      'RIOT': 'ARENA',
      'ZING': 'PIXEL'
    };
    if (Array.isArray(dataObj.giftcards)) {
      dataObj.giftcards.forEach(function (gc) {
        if (gc && brandMap[gc.brand]) gc.brand = brandMap[gc.brand];
        if (gc && gc.name === 'V-Steam Wallet') gc.name = 'Orbis Wallet';
      });
    }
    if (Array.isArray(dataObj.products)) {
      dataObj.products.forEach(function (p) {
        if (p && brandMap[p.brand]) p.brand = brandMap[p.brand];
      });
    }
    if (dataObj.cinemaData) {
      if (Array.isArray(dataObj.cinemaData.theaters)) {
        dataObj.cinemaData.theaters.forEach(function (th) {
          if (th && th.badge) th.badge = th.badge.replace(/Dolby Atmos/gi, 'AetherSound 3D').replace(/IMAX Laser/gi, 'NeoLaser').replace(/4DX/gi, 'MotionX');
        });
      }
      if (Array.isArray(dataObj.cinemaData.combos)) {
        dataObj.cinemaData.combos.forEach(function (cb) {
          if (cb && cb.desc) cb.desc = cb.desc.replace(/Pepsi/gi, 'CyberCola');
        });
      }
    }
  }
  function mergeGiftcardsIntoProducts() {
    if (!DATA || !Array.isArray(DATA.giftcards) || !Array.isArray(DATA.products)) return;
    const GIFT_IMG = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80';
    DATA.giftcards.forEach(function (gc, idx) {
      if (!gc || !gc.id) return;
      const exists = DATA.products.some(function (p) {
        return p && p.id === gc.id;
      });
      if (exists) return;
      const defaultPrice = Number(gc.defaultPrice || 100000);
      DATA.products.push({
        id: gc.id,
        name: gc.name || 'Gift Card',
        desc: (gc.priceRange || '') + ' · Nạp tức thì',
        group: 'digital',
        category: 'giftcard',
        brand: gc.brand || 'ORBIS',
        price: defaultPrice,
        priceOld: Math.round(defaultPrice * 1.25),
        badge: idx === 0 ? 'hot' : 'new',
        isPromo: true,
        isGiftcard: true,
        img: GIFT_IMG,
        rating: Number((4.7 + idx % 3 * 0.1).toFixed(1)),
        sold: 800 + idx * 120
      });
    });
    const giftBrands = ['LUMEN', 'ORBIS', 'HALO', 'ARENA', 'PIXEL'];
    DATA.brands = DATA.brands || [];
    giftBrands.forEach(function (b) {
      const ex = DATA.brands.some(function (x) {
        return x && x.id === b;
      });
      if (!ex) DATA.brands.push({
        id: b,
        name: b
      });
    });
  }
  function applyWhiteLabelTheme() {
    const root = document.documentElement;
    const th = DATA?.theme || DEFAULT_DATA.theme;
    if (root && th) {
      if (th.primaryColor) root.style.setProperty('--wl-primary', th.primaryColor);
      if (th.secondaryColor) root.style.setProperty('--wl-secondary', th.secondaryColor);
      if (th.bgDark) root.style.setProperty('--wl-bg-dark', th.bgDark);
      if (th.cardBg) root.style.setProperty('--wl-card-bg', th.cardBg);
      if (th.fontFamily && document.body) document.body.style.fontFamily = th.fontFamily;
    }
    if (DATA?.brand) {
      $$('[data-wl-brand]').forEach(function (el) {
        el.textContent = DATA.brand;
      });
    }
  }
  function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    let h = hex.trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    if (h.length !== 6) return null;
    const num = parseInt(h, 16);
    return ((num >> 16) & 255) + ', ' + ((num >> 8) & 255) + ', ' + (num & 255);
  }
  function applyBranding(customMeta) {
    try {
      let meta = customMeta;
      if (!meta) {
        const raw = localStorage.getItem('dtr_brand_meta');
        if (raw) {
          try { meta = JSON.parse(raw); } catch (e) {}
        }
      }
      if (!meta && DATA?.theme) {
        meta = { theme: DATA.theme, media: { logo: DATA.theme.logo } };
      }
      if (!meta || typeof meta !== 'object') return;

      const root = document.documentElement;
      if (!root) return;

      if (meta.theme && typeof meta.theme === 'object') {
        const keys = Object.keys(meta.theme);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          const v = meta.theme[k];
          if (k && v) {
            root.style.setProperty(k, v);
          }
        }
        const primary = meta.theme['--lime'] || meta.theme['--color-primary'] || meta.theme['primaryColor'];
        if (primary) {
          root.style.setProperty('--lime', primary);
          root.style.setProperty('--color-primary', primary);
          const rgb = hexToRgb(primary);
          if (rgb) root.style.setProperty('--lime-rgb', rgb);
        }
        const bg = meta.theme['--bg'] || meta.theme['--color-bg'] || meta.theme['bgDark'];
        if (bg) {
          root.style.setProperty('--bg', bg);
          root.style.setProperty('--color-bg', bg);
        }
        const bg2 = meta.theme['--bg-2'] || meta.theme['--bg-3'] || meta.theme['cardBg'];
        if (bg2) {
          root.style.setProperty('--bg-2', bg2);
          root.style.setProperty('--bg-3', bg2);
        }
        const fg = meta.theme['--fg'] || meta.theme['textColor'];
        if (fg) root.style.setProperty('--fg', fg);

        const font = meta.theme['--font-heading'] || meta.font || meta.theme['fontFamily'];
        if (font) {
          root.style.setProperty('--font-heading', font);
          if (document.body) document.body.style.fontFamily = font;
        }
      }

      if (meta.effects && typeof meta.effects === 'object') {
        if (document.body) {
          if (meta.effects.grid === false) {
            document.body.classList.remove('cyber-grid-bg');
          } else if (meta.effects.grid === true) {
            document.body.classList.add('cyber-grid-bg');
          }
        }
        if (meta.effects.glow === false) {
          root.style.setProperty('--shadow-neon-card', 'none');
          root.classList.add('no-neon-glow');
        } else {
          root.style.removeProperty('--shadow-neon-card');
          root.classList.remove('no-neon-glow');
        }
      }

      const logoUrl = meta.media?.logo;
      if (logoUrl) {
        const logoBox = document.getElementById('brandLogoContainer');
        if (logoBox) {
          logoBox.innerHTML = '<img src="' + logoUrl + '" alt="Brand Logo" class="w-auto h-8 sm:h-9 object-contain" onerror="this.style.display=\'none\'">';
        }
        document.querySelectorAll('img[data-media="logo"], .footer-brand img').forEach(function (img) {
          img.src = logoUrl;
        });
      }
    } catch (e) {
      console.warn('[Branding Sync]', e);
    }
  }
  function renderHeroBanners() {
    try {
      const track = document.getElementById('heroTrack');
      const dots = document.getElementById('heroDots');
      if (!track || !dots) return;

      let banners = (DATA && Array.isArray(DATA.heroBanners) && DATA.heroBanners.length > 0)
        ? DATA.heroBanners
        : [
            {
              id: 'hb_01',
              title: 'Thiết Bị Điện Tử & Công Nghệ Số',
              title_en: 'Electronics & Digital Devices',
              title_ja: 'エレクトロニクス＆デジタル機器',
              title_zh: '电子设备与数字化科技',
              subtitle: 'Flagship, Laptop & Phụ Kiện Đỉnh Cao',
              subtitle_en: 'Flagships, Laptops & Premium Gear',
              subtitle_ja: 'フラッグシップ、ノートPC＆プレミアムギア',
              subtitle_zh: '旗舰手机、笔记本与顶级配件',
              img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80',
              link: 'category.html?group=electronics'
            },
            {
              id: 'hb_02',
              title: 'Rạp Chiếu Phim Đỉnh Cao Cyber Cinema',
              title_en: 'Next-Gen Cyber Cinema Experience',
              title_ja: '次世代サイバーシネマ＆3D音響',
              title_zh: '次世代赛博影院与沉浸式体验',
              subtitle: 'Trải nghiệm âm thanh AetherSound 3D sống động',
              subtitle_en: 'Immersive AetherSound 3D spatial acoustics',
              subtitle_ja: '臨場感あふれるAetherSound 3D立体音響体験',
              subtitle_zh: '身临其境的AetherSound 3D立体声效',
              img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
              link: 'cinema.html'
            },
            {
              id: 'hb_03',
              title: 'Kỹ Thuật Số & Bản Quyền Game',
              title_en: 'Digital Codes & Game Licenses',
              title_ja: 'デジタルゲーム＆ギフトカード',
              title_zh: '数字正版游戏与礼品卡',
              subtitle: 'Trò chơi bom tấn & Thẻ nạp quà tặng Gift Card',
              subtitle_en: 'Blockbuster Games & Gift Cards',
              subtitle_ja: '大作タイトル＆プリペイドギフトカード',
              subtitle_zh: '热门重磅游戏与数字充值卡',
              img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
              link: 'category.html?group=digital'
            },
            {
              id: 'hb_04',
              title: 'Tự Động Hóa & Thiết Bị Công Nghiệp',
              title_en: 'Industrial Robotics & Automation',
              title_ja: '産業オートメーション＆ロボティクス',
              title_zh: '工业自动化与智能机器人设备',
              subtitle: 'Giải pháp IoT và cánh tay Robot nhà máy',
              subtitle_en: 'IoT Solutions & Industrial Robotic Arms',
              subtitle_ja: 'IoTソリューション＆工場用ロボットアーム',
              subtitle_zh: '物联网解决方案与工厂机械臂',
              img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
              link: 'category.html?group=industrial'
            }
          ];

      const curLang = localStorage.getItem('dtr_lang') || 'vi';
      track.innerHTML = banners.map(function (bn) {
        if (!bn) return '';
        const targetLink = bn.link || 'marketplace.html';
        const imgUrl = bn.img || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80';
        const slideTitle = (curLang !== 'vi' && bn['title_' + curLang]) ? bn['title_' + curLang] : (bn.title || '');
        const slideSub = (curLang !== 'vi' && bn['subtitle_' + curLang]) ? bn['subtitle_' + curLang] : (bn.subtitle || '');
        return '<a href="' + targetLink + '" data-slide-link class="hero-slide shrink-0 w-full block cursor-pointer group relative bg-[#091528]">' +
          '<img src="' + imgUrl + '" alt="' + slideTitle + '" draggable="false" class="w-full h-[180px] sm:h-[220px] md:h-[250px] object-cover pointer-events-none" onerror="this.onerror=null; this.src=\'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80\';">' +
          '<div class="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/40 to-transparent flex flex-col justify-end p-5 sm:p-8">' +
          '<div>' +
          '<div class="text-white font-extrabold text-base sm:text-2xl drop-shadow-md">' + slideTitle + '</div>' +
          '<div class="text-slate-300 text-xs sm:text-sm mt-1 drop-shadow">' + slideSub + '</div>' +
          '</div></div></a>';
      }).join('');

      dots.innerHTML = banners.map(function (_, idx) {
        return '<button type="button" data-slide="' + idx + '" aria-label="Slide ' + (idx + 1) + '" class="hero-dot ' + (idx === 0 ? 'w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_8px_#a3e635]' : 'w-2 h-2 rounded-full bg-white/50 hover:bg-white/80') + ' transition-all"></button>';
      }).join('');

      let curIdx = 0;
      const total = banners.length;
      function goToSlide(n) {
        curIdx = ((n % total) + total) % total;
        track.style.transform = 'translateX(-' + (curIdx * 100) + '%)';
        const allDots = dots.querySelectorAll('.hero-dot');
        allDots.forEach(function (d, i) {
          if (i === curIdx) {
            d.className = 'hero-dot w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_8px_#a3e635] transition-all';
          } else {
            d.className = 'hero-dot w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all';
          }
        });
      }

      const prevBtn = document.getElementById('heroPrev');
      const nextBtn = document.getElementById('heroNext');
      if (prevBtn) prevBtn.onclick = function () { goToSlide(curIdx - 1); };
      if (nextBtn) nextBtn.onclick = function () { goToSlide(curIdx + 1); };

      dots.onclick = function (e) {
        const btn = e.target.closest('[data-slide]');
        if (btn) goToSlide(Number(btn.dataset.slide));
      };

      let timer = setInterval(function () { goToSlide(curIdx + 1); }, 5000);
      const bannerSec = document.getElementById('heroBanner');
      if (bannerSec) {
        bannerSec.onmouseenter = function () { clearInterval(timer); };
        bannerSec.onmouseleave = function () {
          clearInterval(timer);
          timer = setInterval(function () { goToSlide(curIdx + 1); }, 5000);
        };
      }
    } catch (e) {
      console.warn('[Hero Banner]', e);
    }
  }
  function injectSharedFooter() {
    try {
      if (document.querySelector('footer')) return;
      const footerHtml = '<footer class="footer mt-auto bg-[#050c1a] border-t border-slate-800/80 text-slate-400 text-xs py-12 px-4 sm:px-6 pb-28 sm:pb-14">' +
        '<div class="max-w-[1440px] mx-auto space-y-8">' +
        '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">' +
        '<div class="lg:col-span-2 space-y-3">' +
        '<div id="brandFooterLogoContainer" class="flex items-center gap-2.5">' +
        '<div class="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500/20 to-[#a3e635]/20 flex items-center justify-center border border-[#a3e635]/40 text-[#a3e635] font-extrabold text-sm">DTR</div>' +
        '<span class="text-base font-extrabold text-white">DTR—Market</span>' +
        '</div>' +
        '<p class="text-slate-400 text-xs leading-relaxed max-w-sm" data-i18n="footer.desc">Nền tảng thương mại số toàn cầu — kết nối doanh nghiệp với 50+ quốc gia bằng công nghệ và dữ liệu thế hệ mới.</p>' +
        '<div class="flex items-center gap-3 pt-1">' +
        '<a href="#" class="w-8 h-8 rounded-full bg-[#0b182e] hover:bg-[#a3e635] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"><i class="fa-brands fa-facebook-f text-xs"></i></a>' +
        '<a href="#" class="w-8 h-8 rounded-full bg-[#0b182e] hover:bg-[#a3e635] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"><i class="fa-brands fa-x-twitter text-xs"></i></a>' +
        '<a href="#" class="w-8 h-8 rounded-full bg-[#0b182e] hover:bg-[#a3e635] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"><i class="fa-brands fa-youtube text-xs"></i></a>' +
        '<a href="#" class="w-8 h-8 rounded-full bg-[#0b182e] hover:bg-[#a3e635] hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"><i class="fa-brands fa-linkedin-in text-xs"></i></a>' +
        '</div>' +
        '</div>' +
        '<div class="space-y-2.5">' +
        '<h5 class="text-white font-bold uppercase tracking-wider text-[11px] text-[#a3e635]" data-i18n="footer.platform">Nền tảng</h5>' +
        '<ul class="space-y-1.5">' +
        '<li><a href="marketplace.html" class="hover:text-white transition-colors" data-i18n="footer.shop">Cửa hàng</a></li>' +
        '<li><a href="category.html?group=electronics" class="hover:text-white transition-colors" data-i18n="footer.electronics">Thiết bị điện tử</a></li>' +
        '<li><a href="deals.html" class="hover:text-white transition-colors" data-i18n="footer.deals">Ưu đãi hôm nay</a></li>' +
        '<li><a href="cinema.html" class="hover:text-white transition-colors" data-i18n="footer.cinema">Rạp chiếu phim</a></li>' +
        '<li><a href="services.html" class="hover:text-white transition-colors" data-i18n="footer.orders">Đơn hàng</a></li>' +
        '</ul>' +
        '</div>' +
        '<div class="space-y-2.5">' +
        '<h5 class="text-white font-bold uppercase tracking-wider text-[11px] text-[#a3e635]" data-i18n="footer.company">Công ty</h5>' +
        '<ul class="space-y-1.5">' +
        '<li><a href="index.html" class="hover:text-white transition-colors" data-i18n="footer.about">Về DTR</a></li>' +
        '<li><a href="index.html#journey" class="hover:text-white transition-colors" data-i18n="footer.journey">Hành trình</a></li>' +
        '<li><a href="index.html#partner" class="hover:text-white transition-colors" data-i18n="footer.partner">Trở thành đại lý</a></li>' +
        '<li><a href="about/manager.html" class="hover:text-white transition-colors text-amber-300" data-i18n="footer.manager">Manager chính</a></li>' +
        '</ul>' +
        '</div>' +
        '<div class="space-y-2.5">' +
        '<h5 class="text-white font-bold uppercase tracking-wider text-[11px] text-[#a3e635]" data-i18n="footer.support">Hỗ trợ & Bảo mật</h5>' +
        '<ul class="space-y-1.5">' +
        '<li><a href="services.html" class="hover:text-white transition-colors" data-i18n="footer.help">Trung tâm trợ giúp</a></li>' +
        '<li><a href="#" class="hover:text-white transition-colors" data-i18n="footer.terms">Điều khoản dịch vụ</a></li>' +
        '<li><a href="#" class="hover:text-white transition-colors" data-i18n="footer.privacy">Chính sách bảo mật</a></li>' +
        '<li><a href="#" class="hover:text-white transition-colors"><span data-i18n="footer.status">Trạng thái hệ thống:</span> <span class="text-[#a3e635] font-semibold" data-i18n="footer.good">Tốt</span></a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '<div class="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-slate-500 text-[11px]">' +
        '<div>© <span id="sharedFootYear">2026</span> <strong>DTR—Market</strong>. <span data-i18n="footer.copyright">Digital Tech Resolution — Made with precision in Vietnam.</span></div>' +
        '<div class="flex items-center gap-4">' +
        '<a href="#" class="hover:text-slate-300" data-i18n="footer.terms_short">Điều khoản</a>' +
        '<a href="#" class="hover:text-slate-300" data-i18n="footer.privacy_short">Quyền riêng tư</a>' +
        '<a href="#" class="hover:text-slate-300" data-i18n="footer.cookies">Cookies</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</footer>';
      const wrapper = document.createElement('div');
      wrapper.innerHTML = footerHtml;
      const footerNode = wrapper.firstElementChild;
      const scripts = document.querySelectorAll('body > script');
      if (scripts.length > 0) {
        document.body.insertBefore(footerNode, scripts[0]);
      } else {
        document.body.appendChild(footerNode);
      }
      const yr = document.getElementById('sharedFootYear');
      if (yr) yr.textContent = new Date().getFullYear();
      if (typeof window.applyBrandTheme === 'function') {
        window.applyBrandTheme();
      }
      if (typeof window.applyLanguage === 'function') {
        window.applyLanguage(localStorage.getItem('dtr_lang') || 'vi', false);
      }
    } catch (e) {
      console.warn('[Shared Footer]', e);
    }
  }
  function applyHomeOrder() {
    const main = document.querySelector('main.mp-main');
    if (!main) return;
    const known = ['heroBanner', 'categories-section', 'promo-products', 'products'];
    const saved = DATA?.layout?.homeSections;
    const order = (Array.isArray(saved) ? saved : []).concat(known).filter(function (id, i, all) {
      return known.indexOf(id) !== -1 && all.indexOf(id) === i;
    });
    order.forEach(function (id) {
      const section = document.getElementById(id);
      if (section && section.parentNode === main) main.appendChild(section);
    });
  }
  async function loadI18nProducts() {
    try {
      const paths = ['data/products_i18n.json', 'products_i18n.json'];
      let res, dict;
      for (let i = 0; i < paths.length; i++) {
        try {
          res = await fetch(paths[i]);
          if (res && res.ok) {
            dict = await res.json();
            break;
          }
        } catch (e) {}
      }
      if (dict && dict.products) {
        window.DTR_I18N_PRODUCTS = dict.products;
        if (Array.isArray(DATA?.products)) {
          DATA.products.forEach(function (p) {
            if (p && dict.products[p.id]) {
              const trans = dict.products[p.id];
              ['en', 'ja', 'zh'].forEach(function (lang) {
                if (trans[lang]) {
                  if (trans[lang].name) p['name_' + lang] = trans[lang].name;
                  if (trans[lang].desc) p['desc_' + lang] = trans[lang].desc;
                }
              });
            }
          });
        }
      }
      if (dict && dict.movies && DATA?.cinemaData?.movies) {
        window.DTR_I18N_MOVIES = dict.movies;
        DATA.cinemaData.movies.forEach(function (m) {
          if (m && dict.movies[m.id]) {
            const trans = dict.movies[m.id];
            ['en', 'ja', 'zh'].forEach(function (lang) {
              if (trans[lang]) {
                if (trans[lang].title) m['title_' + lang] = trans[lang].title;
                if (trans[lang].desc) m['desc_' + lang] = trans[lang].desc;
                if (trans[lang].genre) m['genre_' + lang] = trans[lang].genre;
              }
            });
          }
        });
      }
    } catch (e) {
      console.warn('[i18n Products Load]', e);
    }
  }
  async function loadData() {
    let i, res, json, draft;
    const paths = ['data/products.json', 'products.json'];
    for (i = 0; i < paths.length; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          res = await fetch(paths[i], { signal: controller.signal });
          json = res?.ok ? await res.json() : null;
        } finally {
          clearTimeout(timeout);
        }
        if (res && res.ok) {
          if (json && Array.isArray(json.products)) {
            try {
              draft = JSON.parse(localStorage.getItem('dtr_catalog_preview') || 'null');
              if (draft && Array.isArray(draft.products)) json = draft;
            } catch (e) {}
            DATA = Object.assign({}, DEFAULT_DATA, json);
            sanitizeRealBrands(DATA);
            mergeGiftcardsIntoProducts();
            applyWhiteLabelTheme();
            await loadI18nProducts();
            return;
          }
        }
      } catch (err) {}
    }
    sanitizeRealBrands(DATA);
    mergeGiftcardsIntoProducts();
    applyWhiteLabelTheme();
    await loadI18nProducts();
  }
  function getPromoConfig() {
    let saved, parsed;
    const base = DATA?.promoConfig || DEFAULT_DATA.promoConfig;
    try {
      saved = localStorage.getItem(PROMO_CFG_KEY);
      if (saved) {
        parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            globalEvent: parsed.globalEvent || base.globalEvent,
            brandPromos: parsed.brandPromos || base.brandPromos || {},
            itemEarlyEnds: parsed.itemEarlyEnds || base.itemEarlyEnds || {},
            banners: Array.isArray(parsed.banners) ? parsed.banners : base.banners || []
          };
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(base));
  }
  function savePromoConfig(cfg) {
    try {
      localStorage.setItem(PROMO_CFG_KEY, JSON.stringify(cfg || {}));
    } catch (e) {}
  }
  function getBrandName(brandId) {
    const b = (DATA?.brands || []).find(function (x) {
      return x?.id === brandId;
    });
    return b ? b.name : brandId || DATA?.brand || 'DTR-Brand';
  }
  function getDiscountPct(product) {
    if (!product || !product.priceOld || product.priceOld <= product.price) return 0;
    return Math.round((product.priceOld - product.price) / product.priceOld * 100);
  }
  function resolveProductPromoTimer(product) {
    let lang = 'vi';
    try {
      lang = (typeof window !== 'undefined' && window.__dtrCurrentLang) || localStorage.getItem('dtr_lang') || 'vi';
    } catch (e) {}
    const promoDict = {
      vi: { today: 'Ưu đãi hôm nay', early: 'Hết hạn sớm', deal: 'Ưu đãi ', event: 'Sự kiện Lễ' },
      en: { today: 'Today\'s Deal', early: 'Ends Soon', deal: 'Deal: ', event: 'Special Event' },
      ja: { today: '本日のセール', early: '間もなく終了', deal: '特売: ', event: '特別イベント' },
      zh: { today: '今日特惠', early: '即将结束', deal: '特惠: ', event: '节日活动' }
    };
    const pt = promoDict[lang] || promoDict.vi;

    if (!product) return {
      mode: 'global',
      label: pt.today,
      endTime: '2026-12-31T23:59',
      isSponsored: false
    };
    const cfg = getPromoConfig();
    const earlyEnd = cfg?.itemEarlyEnds?.[product.id];
    const brandCfg = cfg?.brandPromos?.[product.brand];
    const globalCfg = cfg?.globalEvent;
    if (earlyEnd) return {
      mode: 'early',
      label: pt.early,
      endTime: earlyEnd,
      isSponsored: !!(brandCfg && brandCfg.isSponsored)
    };
    if (brandCfg && brandCfg.endTime) return {
      mode: 'brand',
      label: pt.deal + (brandCfg.brandName || getBrandName(product.brand)),
      endTime: brandCfg.endTime,
      isSponsored: !!brandCfg.isSponsored
    };
    if (globalCfg && globalCfg.enabled && globalCfg.endTime) {
      let gName = globalCfg.name;
      if (lang === 'en' && globalCfg.name_en) gName = globalCfg.name_en;
      else if (lang === 'ja' && globalCfg.name_ja) gName = globalCfg.name_ja;
      else if (lang === 'zh' && globalCfg.name_zh) gName = globalCfg.name_zh;
      return {
        mode: 'global',
        label: gName || pt.event,
        endTime: globalCfg.endTime,
        isSponsored: false
      };
    }
    return {
      mode: 'global',
      label: pt.today,
      endTime: '2026-12-31T23:59',
      isSponsored: false
    };
  }
  function formatRemainingTime(endTimeStr) {
    let lang = 'vi';
    try {
      lang = (typeof window !== 'undefined' && window.__dtrCurrentLang) || localStorage.getItem('dtr_lang') || 'vi';
    } catch (e) {}
    const timeDict = {
      vi: { ongoing: 'Đang diễn ra', ended: 'Đã kết thúc', months: ' tháng tới', weeks: ' tuần', days: ' ngày' },
      en: { ongoing: 'Ongoing', ended: 'Ended', months: ' months left', weeks: ' weeks left', days: ' days left' },
      ja: { ongoing: '開催中', ended: '終了', months: 'か月後まで', weeks: '週間', days: '日間' },
      zh: { ongoing: '进行中', ended: '已结束', months: ' 个月后', weeks: ' 周', days: ' 天' }
    };
    const td = timeDict[lang] || timeDict.vi;

    let totalSecs, hours, mins, secs, pad;
    const endMs = new Date(endTimeStr).getTime();
    if (isNaN(endMs)) return td.ongoing;
    const diff = endMs - Date.now();
    if (diff <= 0) return td.ended;
    const HOUR_MS = 1000 * 60 * 60;
    const DAY_MS = HOUR_MS * 24;
    if (diff <= DAY_MS) {
      totalSecs = Math.floor(diff / 1000);
      hours = Math.floor(totalSecs / 3600);
      mins = Math.floor(totalSecs % 3600 / 60);
      secs = totalSecs % 60;
      pad = function (n) {
        return n < 10 ? '0' + n : String(n);
      };
      return pad(hours) + ':' + pad(mins) + ':' + pad(secs);
    }
    const totalDays = Math.ceil(diff / DAY_MS);
    if (totalDays >= 30) return Math.floor(totalDays / 30) + td.months;
    if (totalDays >= 7) return Math.floor(totalDays / 7) + td.weeks;
    return totalDays + td.days;
  }
  setInterval(function () {
    $$('[data-countdown-end]').forEach(function (el) {
      if (el?.dataset?.countdownEnd) el.textContent = formatRemainingTime(el.dataset.countdownEnd);
    });
  }, 1000);
  function initSharedNavigation() {
    if (window.__dtrSharedNavigation) return;
    window.__dtrSharedNavigation = true;
    const panel = $('#dtrFabPanel');
    const overlay = $('#dtrFabOverlay');
    const trigger = $('#dtrFabBtn');
    let previousFocus = null;
    function setOpen(open) {
      if (!panel) return;
      if (open) previousFocus = document.activeElement;
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('role', 'dialog');
      if (overlay) overlay.classList.toggle('open', open);
      if (trigger) {
        trigger.classList.toggle('active', open);
        trigger.setAttribute('aria-expanded', String(open));
      }
      document.body.classList.toggle('fab-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) panel.querySelector('button, a[href]')?.focus();else if (previousFocus) previousFocus.focus();
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('#dtrFabBtn')) {
        e.preventDefault();
        setOpen(!panel?.classList.contains('open'));
      }
      if (e.target.closest('#dtrFabClose, #dtrFabOverlay, .dtr-fab-item')) setOpen(false);
      const lang = e.target.closest('#dtrMobileNav [data-lang]');
      if (lang) {
        e.preventDefault();
        setSiteLanguage(lang.dataset.lang, true);
      }
    });
    document.addEventListener('keydown', function (e) {
      let items, first, last;
      if (!panel?.classList.contains('open')) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab') {
        items = Array.from(panel.querySelectorAll('button:not([disabled]), a[href]'));
        first = items[0];
        last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });
    window.matchMedia('(min-width:1024px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
    let saved = 'vi';
    try {
      saved = localStorage.getItem('dtr_lang') || 'vi';
    } catch (e) {}
    setSiteLanguage(saved, false);
  }
  function rerenderCurrentPageForLanguage() {
    try {
      const pageType = document.body?.dataset?.page || 'home';
      if (pageType === 'home') {
        if (typeof renderHomePromoProducts === 'function') renderHomePromoProducts();
        if (typeof renderHomeBestSellingProducts === 'function') renderHomeBestSellingProducts();
        if (typeof renderGiftcards === 'function') renderGiftcards();
        if (typeof renderHomeCategories === 'function') renderHomeCategories();
      } else if (pageType === 'category' && typeof initCategoryPage === 'function') {
        initCategoryPage();
      } else if (pageType === 'deals' && typeof initDealsPage === 'function') {
        initDealsPage();
      } else if (pageType === 'cinema' && typeof initCinemaLocationPage === 'function') {
        initCinemaLocationPage();
      }
      if (typeof renderCartDrawer === 'function') renderCartDrawer();
    } catch (e) {
      console.warn('[i18n Rerender]', e);
    }
  }
  window.rerenderCurrentPageForLanguage = rerenderCurrentPageForLanguage;
  document.addEventListener('dtr:lang', function () {
    rerenderCurrentPageForLanguage();
  });
  function setSiteLanguage(lang, notify) {
    const meta = DATA?.langMeta || DEFAULT_DATA.langMeta;
    if (!meta[lang]) lang = 'vi';
    try {
      localStorage.setItem('dtr_lang', lang);
    } catch (e) {}
    document.documentElement.lang = lang;
    $$('#dtrMobileNav [data-lang]').forEach(function (button) {
      button.classList.toggle('active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    if ($('#mpLangFlag')) $('#mpLangFlag').textContent = meta[lang].flag;
    if ($('#mpLangCode')) $('#mpLangCode').textContent = meta[lang].code;
    if (typeof window.applyLanguage === 'function') window.applyLanguage(lang);
    rerenderCurrentPageForLanguage();
    if (notify) showToast('Đã lưu ngôn ngữ: ' + meta[lang].code);
  }
  const catalogTools = {};
  const comparedIds = [];
  function mountCatalogTools(grid, rerender) {
    if (!grid || catalogTools[grid.id]) return;
    const state = {
      sort: '',
      min: '',
      max: ''
    };
    catalogTools[grid.id] = state;
    const bar = document.createElement('div');
    bar.className = 'catalog-tools';
    const label = document.createElement('label');
    label.textContent = 'Sắp xếp';
    const select = document.createElement('select');
    [['', 'Đề xuất'], ['price-asc', 'Giá thấp đến cao'], ['price-desc', 'Giá cao đến thấp'], ['discount', 'Giảm giá sâu nhất'], ['sold', 'Bán chạy']].forEach(function (option) {
      const el = document.createElement('option');
      el.value = option[0];
      el.textContent = option[1];
      select.appendChild(el);
    });
    select.addEventListener('change', function () {
      state.sort = select.value;
      rerender();
    });
    label.appendChild(select);
    bar.appendChild(label);
    [['min', 'Giá từ'], ['max', 'Giá đến']].forEach(function (item) {
      const wrap = document.createElement('label');
      wrap.textContent = item[1];
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.step = '10000';
      input.placeholder = 'VND';
      input.addEventListener('change', function () {
        state[item[0]] = input.value;
        rerender();
      });
      wrap.appendChild(input);
      bar.appendChild(wrap);
    });
    [['Yêu thích', openWishlist], ['So sánh', openComparison]].forEach(function (item) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item[0];
      button.addEventListener('click', item[1]);
      bar.appendChild(button);
    });
    grid.before(bar);
  }
  function applyCatalogTools(list, grid) {
    const state = catalogTools[grid.id];
    if (!state) return list;
    list = list.filter(function (p) {
      return (state.min === '' || p.price >= Number(state.min)) && (state.max === '' || p.price <= Number(state.max));
    });
    const sorts = {
      'price-asc': function (a, b) {
        return a.price - b.price;
      },
      'price-desc': function (a, b) {
        return b.price - a.price;
      },
      discount: function (a, b) {
        return getDiscountPct(b) - getDiscountPct(a);
      },
      sold: function (a, b) {
        return (b.sold || 0) - (a.sold || 0);
      }
    };
    if (sorts[state.sort]) list.sort(sorts[state.sort]);
    return list;
  }
  function shoppingDialog(title, drawer) {
    const old = $('#shoppingDialog');
    if (old) old.remove();
    const dialog = document.createElement('dialog');
    dialog.id = 'shoppingDialog';
    dialog.className = 'shopping-dialog' + (drawer ? ' wishlist-drawer' : '');
    const head = document.createElement('header');
    const heading = document.createElement('h2');
    heading.textContent = title;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Đóng';
    close.addEventListener('click', function () {
      dialog.close();
    });
    head.append(heading, close);
    dialog.appendChild(head);
    dialog.setAttribute('aria-labelledby', 'shoppingDialogTitle');
    heading.id = 'shoppingDialogTitle';
    dialog.addEventListener('click', function (e) {
      const rect = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) dialog.close();
    });
    document.body.appendChild(dialog);
    return dialog;
  }
  function openWishlist() {
    let empty;
    const dialog = shoppingDialog('Sản phẩm yêu thích', true);
    const ids = getFavorites();
    const products = (DATA.products || []).filter(function (p) {
      return ids.indexOf(p.id) !== -1;
    });
    if (!products.length) {
      empty = document.createElement('p');
      empty.textContent = 'Chưa có sản phẩm yêu thích. Chọn biểu tượng trái tim trên sản phẩm để lưu.';
      dialog.appendChild(empty);
    }
    products.forEach(function (p) {
      const row = document.createElement('div');
      row.className = 'wishlist-row';
      const link = document.createElement('a');
      link.href = 'detail_product_hero.html?product=' + encodeURIComponent(p.id);
      link.textContent = p.name + ' · ' + formatPrice(p.price);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Bỏ lưu';
      remove.addEventListener('click', function () {
        toggleFavorite(p.id);
        syncWishButtons(p.id, false);
        dialog.close();
        openWishlist();
      });
      row.append(link, remove);
      dialog.appendChild(row);
    });
    dialog.showModal();
  }
  function openComparison() {
    let empty, table, fields;
    const dialog = shoppingDialog('So sánh sản phẩm · tối đa 3');
    const products = comparedIds.map(function (id) {
      return DATA.products.find(function (p) {
        return p.id === id;
      });
    }).filter(Boolean);
    if (!products.length) {
      empty = document.createElement('p');
      empty.textContent = 'Chọn “So sánh” trên các sản phẩm trước.';
      dialog.appendChild(empty);
    } else {
      table = document.createElement('table');
      fields = [['name', 'Sản phẩm'], ['price', 'Giá'], ['brand', 'Thương hiệu'], ['desc', 'Thông số'], ['rating', 'Đánh giá'], ['sold', 'Đã bán']];
      fields.forEach(function (field) {
        const row = document.createElement('tr');
        const label = document.createElement('th');
        label.scope = 'row';
        label.textContent = field[1];
        row.appendChild(label);
        products.forEach(function (p) {
          const cell = document.createElement('td');
          cell.textContent = field[0] === 'price' ? formatPrice(p.price) : field[0] === 'brand' ? getBrandName(p.brand) : String(p[field[0]] || '—');
          row.appendChild(cell);
        });
        table.appendChild(row);
      });
      dialog.appendChild(table);
    }
    dialog.showModal();
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  }
  function getLocalizedProductName(product) {
    if (!product) return '';
    const lang = localStorage.getItem('dtr_lang') || 'vi';
    if (lang === 'vi') return product.name || '';
    if (product['name_' + lang]) return product['name_' + lang];
    const dict = window.DTR_I18N_PRODUCTS?.[product.id];
    if (dict && dict[lang] && dict[lang].name) return dict[lang].name;
    return product.name || '';
  }
  function getLocalizedProductDesc(product) {
    if (!product) return '';
    const lang = localStorage.getItem('dtr_lang') || 'vi';
    if (lang === 'vi') return product.desc || '';
    if (product['desc_' + lang]) return product['desc_' + lang];
    const dict = window.DTR_I18N_PRODUCTS?.[product.id];
    if (dict && dict[lang] && dict[lang].desc) return dict[lang].desc;
    return product.desc || '';
  }
  function buildProductCardHtml(product, options) {
    let tInfo, modeCls;
    if (!product) return '';
    options = options || {};
    const showPromoTimer = !!options.showPromoTimer;
    const pct = getDiscountPct(product);
    const oldPriceHtml = product.priceOld ? '<span class="pc-price-old">' + formatPrice(product.priceOld) + '</span>' : '';
    const discountHtml = pct > 0 ? '<span class="pc-discount">-' + pct + '%</span>' : '';
    const oldRowHtml = oldPriceHtml || discountHtml ? '<div class="pc-old-row">' + oldPriceHtml + discountHtml + '</div>' : '';
    let timerHtml = '';
    if (showPromoTimer) {
      tInfo = resolveProductPromoTimer(product);
      modeCls = tInfo.mode === 'early' ? 'is-early' : tInfo.mode === 'brand' ? 'is-brand' : '';
      timerHtml = '<div class="promo-countdown-bar ' + modeCls + '">' + '<span><i class="fa-regular fa-clock mr-1"></i>' + tInfo.label + '</span>' + '<span class="promo-countdown-time" data-countdown-end="' + tInfo.endTime + '">' + formatRemainingTime(tInfo.endTime) + '</span>' + '</div>';
    }
    const curLang = localStorage.getItem('dtr_lang') || 'vi';
    const favNow = isFavorite(product.id);
    const wishBtnCls = 'pc-wish' + (favNow ? ' is-active' : '');
    const wishIconCls = (favNow ? 'fa-solid' : 'fa-regular') + ' fa-heart';
    const locName = getLocalizedProductName(product);
    const locDesc = getLocalizedProductDesc(product);
    const soldLabel = curLang === 'en' ? 'Sold ' : curLang === 'ja' ? '販売済 ' : curLang === 'zh' ? '已售 ' : 'Đã bán ';
    const compareLabel = curLang === 'en' ? 'Compare' : curLang === 'ja' ? '比較' : curLang === 'zh' ? '对比' : 'So sánh';
    const wishLabel = curLang === 'en' ? 'Favorite' : curLang === 'ja' ? 'お気に入り' : curLang === 'zh' ? '收藏' : 'Yêu thích';
    return '<article class="product-card" tabindex="0" role="link" aria-label="' + escapeHtml(locName) + '" data-id="' + escapeHtml(product.id) + '">' + '<div class="pc-media">' + '<img src="' + escapeHtml(product.img) + '" alt="' + escapeHtml(locName) + '" loading="lazy">' + '<button type="button" data-wish="' + escapeHtml(product.id) + '" class="' + wishBtnCls + '" aria-label="' + escapeHtml(wishLabel) + '"><i class="' + wishIconCls + '"></i></button>' + '</div>' + '<div class="pc-body">' + '<h3 class="pc-name">' + escapeHtml(locName) + '</h3>' + '<div class="pc-brand">' + escapeHtml(getBrandName(product.brand)) + '</div>' + '<div class="pc-sold">' + escapeHtml(soldLabel) + Number(product.sold || 0).toLocaleString('vi-VN') + '</div>' + oldRowHtml + '<div class="pc-price">' + formatPrice(product.price) + '</div>' + (['category', 'deals'].indexOf(document.body.dataset.page) !== -1 ? '<button type="button" class="pc-compare" data-compare="' + escapeHtml(product.id) + '" aria-pressed="' + (comparedIds.indexOf(product.id) !== -1) + '">' + escapeHtml(compareLabel) + '</button>' : '') + timerHtml + '</div>' + '</article>';
  }
  function bindProductGridEvents(container) {
    if (!container) return;
    container.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target === card) card.click();
      });
      card.addEventListener('click', function (e) {
        if (e.target && typeof e.target.closest === 'function' && e.target.closest('[data-wish], [data-compare]')) return;
        const id = card?.dataset?.id;
        if (!id) return;
        window.location.href = 'detail_product_hero.html?product=' + encodeURIComponent(id);
      });
    });
    container.querySelectorAll('[data-compare]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const id = btn.dataset.compare;
        const index = comparedIds.indexOf(id);
        if (index !== -1) comparedIds.splice(index, 1);else if (comparedIds.length < 3) comparedIds.push(id);else {
          showToast('Chỉ chọn tối đa 3 sản phẩm để so sánh');
          return;
        }
        btn.setAttribute('aria-pressed', String(comparedIds.indexOf(id) !== -1));
        showToast('Đang chọn ' + comparedIds.length + '/3 sản phẩm so sánh');
      });
    });
    container.querySelectorAll('[data-wish]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const id = btn.dataset.wish;
        if (!id) return;
        const nowFav = toggleFavorite(id);
        syncWishButtons(id, nowFav);
        showToast(nowFav ? 'Đã thêm vào yêu thích!' : 'Đã bỏ khỏi yêu thích');
      });
    });
  }
  let activeCat = 'all';
  let activeGroup = 'all';
  window.__dtrSetGroup = function (grp) {
    activeGroup = grp || 'all';
    activeCat = 'all';
    renderHomePromoProducts();
    renderHomeBestSellingProducts();
    const prodSec = $('#products');
    if (prodSec) prodSec.scrollIntoView({
      behavior: 'smooth'
    });
  };
  function syncUrlSearchParam(catId) {
    let url;
    try {
      url = new URL(window.location.href);
      if (!catId || catId === 'all') url.searchParams.delete('product');else url.searchParams.set('product', catId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }
  function renderHomeCategories() {
    const list = $('#catList');
    if (!list || !Array.isArray(DATA?.categories)) return;
    const params = new URLSearchParams(window.location.search);
    const initialProd = params.get('product');
    if (initialProd) activeCat = initialProd;
    const curLang = localStorage.getItem('dtr_lang') || 'vi';
    const catsHtml = DATA.categories.slice(0, 7).map(function (cat) {
      if (!cat) return '';
      const isAct = activeCat === cat.id ? 'active' : '';
      return '<button type="button" class="category-card cyber-card ' + isAct + ' rounded-xl py-2.5 px-2 flex flex-col items-center justify-center gap-1.5 group" data-cat="' + cat.id + '">' + '<i class="fa-solid ' + (cat.icon || 'fa-microchip') + ' text-xl text-[#a3e635] group-hover:scale-110 transition-transform"></i>' + '<span class="text-[11.5px] font-medium text-slate-200 group-hover:text-[#a3e635] truncate max-w-full">' + ((curLang !== 'vi' && cat['name_' + curLang]) ? cat['name_' + curLang] : (cat.name || '')) + '</span></button>';
    }).join('');
    list.innerHTML = catsHtml;
    list.querySelectorAll('[data-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn?.dataset?.cat;
        if (!cat) return;
        activeCat = activeCat === cat ? 'all' : cat;
        syncUrlSearchParam(activeCat);
        list.querySelectorAll('[data-cat]').forEach(function (b) {
          b.classList.toggle('active', b?.dataset?.cat === activeCat);
        });
        renderHomePromoProducts();
        renderHomeBestSellingProducts();
      });
    });
  }
  function openFourGroupModal() {
    $('#fourGroupOverlay')?.classList?.add('open');
    $('#fourGroupModal')?.classList?.add('open');
    if (document.body) document.body.style.overflow = 'hidden';
  }
  function closeFourGroupModal() {
    $('#fourGroupOverlay')?.classList?.remove('open');
    $('#fourGroupModal')?.classList?.remove('open');
    if (document.body) document.body.style.overflow = '';
  }
  function initFourGroupModalEvents() {
    $('#fourGroupOverlay')?.addEventListener('click', closeFourGroupModal);
    $('#fourGroupClose')?.addEventListener('click', closeFourGroupModal);
    $$('[data-major-group]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const grp = btn?.dataset?.majorGroup;
        if (!grp) return;
        if (grp === 'cinema') {
          window.location.href = 'cinema.html';
          return;
        }
        const wrap = $('#majorGroupSubCatsWrap');
        const listEl = $('#majorGroupSubCatsList');
        const titleEl = $('#majorGroupSubTitle');
        const linkEl = $('#majorGroupGoPageLink');
        if (!wrap || !listEl) return;
        const grpObj = (DATA?.majorGroups || []).find(function (g) {
          return g?.id === grp;
        });
        if (titleEl && grpObj) titleEl.textContent = 'Các dòng sản phẩm thuộc lĩnh vực ' + grpObj.name + ':';
        if (linkEl) linkEl.href = 'category.html?group=' + grp;
        const subCats = (DATA?.categories || []).filter(function (c) {
          return c?.group === grp;
        });
        listEl.innerHTML = subCats.map(function (c) {
          return '<button type="button" data-subcat-pick="' + c.id + '" class="px-4 py-2.5 rounded-xl bg-[#0b182e] hover:bg-[#a3e635] text-slate-100 hover:text-slate-950 border border-[#a3e635]/50 text-xs font-bold flex items-center gap-2 transition-all">' + '<i class="fa-solid ' + (c.icon || 'fa-cube') + '"></i><span>' + (c.name || '') + '</span></button>';
        }).join('');
        wrap.classList.remove('hidden');
        listEl.querySelectorAll('[data-subcat-pick]').forEach(function (subBtn) {
          subBtn.addEventListener('click', function () {
            const pickedCat = subBtn?.dataset?.subcatPick;
            const pageType = document.body?.dataset?.page || 'home';
            if (pageType === 'deals') {
              window.location.href = 'deals.html?group=' + encodeURIComponent(grp) + '&product=' + encodeURIComponent(pickedCat);
              return;
            }
            activeCat = pickedCat;
            syncUrlSearchParam(activeCat);
            renderHomePromoProducts();
            renderHomeBestSellingProducts();
            closeFourGroupModal();
            const prodSec = $('#products');
            if (prodSec) prodSec.scrollIntoView({
              behavior: 'smooth'
            });
          });
        });
      });
    });
  }
  function renderHomePromoProducts() {
    const grid = $('#promoProductGrid');
    if (!grid || !Array.isArray(DATA?.products)) return;
    const cfg = getPromoConfig();
    const badgeEl = $('#globalPromoBadge');
    if (badgeEl && cfg?.globalEvent) {
      const curLang = (localStorage.getItem('dtr_lang') || 'vi').toLowerCase();
      const eventName = cfg.globalEvent['name_' + curLang] || cfg.globalEvent.name || '';
      const remLabel = curLang === 'en' ? 'Remaining ' : (curLang === 'ja' ? '残り ' : (curLang === 'zh' ? '剩余 ' : 'Còn '));
      badgeEl.innerHTML = '<i class="fa-regular fa-clock mr-1"></i>' + eventName + ' · ' + remLabel + '<span data-countdown-end="' + (cfg.globalEvent.endTime || '') + '">' + formatRemainingTime(cfg.globalEvent.endTime) + '</span>';
    }
    let list = DATA.products.filter(function (p) {
      return p && (p.isPromo || p.priceOld || p.badge === 'sale' || p.badge === 'hot');
    });
    if (activeCat !== 'all') list = list.filter(function (p) {
      return p?.category === activeCat;
    });
    const seeAllPromoBtn = $('#seeAllPromoBtn');
    if (seeAllPromoBtn) seeAllPromoBtn.href = activeCat !== 'all' ? 'deals.html?product=' + encodeURIComponent(activeCat) : 'deals.html';
    if (!list.length) {
      grid.innerHTML = '<div class="col-span-full text-center py-10 text-slate-400 text-xs">Không có sản phẩm ưu đãi nào.</div>';
      return;
    }
    grid.innerHTML = list.slice(0, 6).map(function (p) {
      return buildProductCardHtml(p, {
        showPromoTimer: true
      });
    }).join('');
    bindProductGridEvents(grid);
  }
  function renderHomeBestSellingProducts(customSearchList) {
    const grid = $('#productGrid');
    if (!grid || !Array.isArray(DATA?.products)) return;
    const filterLabel = $('#activeFilterLabel');
    if (filterLabel) {
      if (activeCat !== 'all') {
        filterLabel.textContent = '?product=' + activeCat;
        filterLabel.classList.remove('hidden');
      } else filterLabel.classList.add('hidden');
    }
    let list = (customSearchList || DATA.products).slice();
    if (!customSearchList && activeCat !== 'all') list = list.filter(function (p) {
      return p?.category === activeCat;
    });
    list.sort(function (a, b) {
      return (b && b.sold || 0) - (a && a.sold || 0);
    });
    if (!list.length) {
      grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-sm">Không tìm thấy sản phẩm nào phù hợp.</div>';
      return;
    }
    grid.innerHTML = list.map(function (p) {
      return buildProductCardHtml(p, {
        showPromoTimer: false
      });
    }).join('');
    bindProductGridEvents(grid);
  }
  function initManagerPage() {
    const cfg = getPromoConfig();
    const gEnabled = $('#cfgGlobalEnabled');
    const gName = $('#cfgGlobalName');
    const gNameEn = $('#cfgGlobalNameEn');
    const gNameJa = $('#cfgGlobalNameJa');
    const gNameZh = $('#cfgGlobalNameZh');
    const gStart = $('#cfgGlobalStart');
    const gEnd = $('#cfgGlobalEnd');
    if (gEnabled) gEnabled.checked = !!cfg?.globalEvent?.enabled;
    if (gName) gName.value = cfg?.globalEvent?.name || '';
    if (gNameEn) gNameEn.value = cfg?.globalEvent?.name_en || '';
    if (gNameJa) gNameJa.value = cfg?.globalEvent?.name_ja || '';
    if (gNameZh) gNameZh.value = cfg?.globalEvent?.name_zh || '';
    if (gStart) gStart.value = cfg?.globalEvent?.startTime || '2026-10-01T00:00';
    if (gEnd) gEnd.value = cfg?.globalEvent?.endTime || '2026-12-31T23:59';
    const brandOpts = (DATA?.brands || []).map(function (b) {
      return b ? '<option value="' + b.id + '">' + b.name + ' (' + b.id + ')</option>' : '';
    }).join('');
    if ($('#cfgBrandSelect')) $('#cfgBrandSelect').innerHTML = brandOpts;
    if ($('#bannerBrandSelect')) $('#bannerBrandSelect').innerHTML = brandOpts;
    if ($('#cfgItemSelect')) {
      $('#cfgItemSelect').innerHTML = (DATA?.products || []).map(function (p) {
        return p ? '<option value="' + p.id + '">' + p.name + ' [' + getBrandName(p.brand) + ']</option>' : '';
      }).join('');
    }
    function renderBrandPromoList() {
      const box = $('#brandPromoTable');
      if (!box) return;
      const entries = Object.values(cfg?.brandPromos || {});
      if (!entries.length) {
        box.innerHTML = '<p class="text-slate-400 italic">Chưa có thương hiệu nào cấu hình giờ riêng.</p>';
        return;
      }
      box.innerHTML = entries.map(function (bp) {
        if (!bp) return '';
        return '<div class="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#091528] border border-slate-800"><div><strong class="text-[#a3e635]">' + (bp.brandName || '') + '</strong>' + (bp.isSponsored ? ' <span class="sponsored-pill ml-1">Đối tác Book</span>' : '') + '<div class="text-[11px] text-slate-400 font-mono">' + (bp.startTime || '') + ' &rarr; ' + (bp.endTime || '') + '</div></div><button type="button" data-del-brand="' + (bp.brandId || '') + '" class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px]">Xóa</button></div>';
      }).join('');
      box.querySelectorAll('[data-del-brand]').forEach(function (b) {
        b.addEventListener('click', function () {
          const k = b?.dataset?.delBrand;
          if (k && cfg?.brandPromos) {
            delete cfg.brandPromos[k];
            savePromoConfig(cfg);
            renderBrandPromoList();
            showToast('Đã xóa');
          }
        });
      });
    }
    function renderItemEarlyList() {
      const box = $('#itemEarlyTable');
      if (!box) return;
      const keys = Object.keys(cfg?.itemEarlyEnds || {});
      if (!keys.length) {
        box.innerHTML = '<p class="text-slate-400 italic">Chưa có mặt hàng nào đặt giờ kết thúc sớm.</p>';
        return;
      }
      box.innerHTML = keys.map(function (pid) {
        const prod = (DATA?.products || []).find(function (x) {
          return x?.id === pid;
        });
        const pName = prod ? prod.name : pid;
        return '<div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#091528] border border-slate-800"><div><strong class="text-amber-300">' + pName + '</strong><div class="text-[11px] text-slate-400 font-mono">Kết thúc sớm: ' + (cfg.itemEarlyEnds[pid] || '') + '</div></div><button type="button" data-del-early="' + pid + '" class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px]">Xóa</button></div>';
      }).join('');
      box.querySelectorAll('[data-del-early]').forEach(function (b) {
        b.addEventListener('click', function () {
          const k = b?.dataset?.delEarly;
          if (k && cfg?.itemEarlyEnds) {
            delete cfg.itemEarlyEnds[k];
            savePromoConfig(cfg);
            renderItemEarlyList();
            showToast('Đã gỡ');
          }
        });
      });
    }
    function renderManagerBanners() {
      const box = $('#managerBannerList');
      if (!box) return;
      if (!cfg?.banners || !cfg.banners.length) {
        box.innerHTML = '<p class="text-slate-400 text-xs italic">Chưa có ảnh lướt nào.</p>';
        return;
      }
      box.innerHTML = cfg.banners.map(function (bn, idx) {
        if (!bn) return '';
        return '<div class="flex items-center gap-3 p-2.5 rounded-xl bg-[#091528] border border-slate-800"><img src="' + (bn.img || '') + '" class="w-16 h-11 object-cover rounded-lg shrink-0" /><div class="flex-1 min-w-0"><div class="text-xs font-bold text-white truncate">' + (bn.title || '') + '</div><div class="text-[10.5px] text-[#a3e635] font-mono">Thương hiệu: ' + (bn.brandName || '') + '</div></div><button type="button" data-del-banner="' + idx + '" class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px]">Xóa</button></div>';
      }).join('');
      box.querySelectorAll('[data-del-banner]').forEach(function (b) {
        b.addEventListener('click', function () {
          cfg.banners.splice(Number(b?.dataset?.delBanner || 0), 1);
          savePromoConfig(cfg);
          renderManagerBanners();

    function renderManagerCinemaMovies() {
      const box = $('#managerCinMovieList');
      if (!box) return;
      if (!DATA.cinemaData) DATA.cinemaData = JSON.parse(JSON.stringify(DEFAULT_DATA.cinemaData));
      const movies = DATA.cinemaData.movies || [];
      if (!movies.length) {
        box.innerHTML = '<p class="text-slate-400 text-xs italic">Chưa có phim rạp nào.</p>';
        return;
      }
      box.innerHTML = movies.map(function (mv, idx) {
        if (!mv) return '';
        return '<div class="flex items-center gap-3 p-3 rounded-xl bg-[#091528] border border-slate-800">' +
          '<img src="' + (mv.img || '') + '" class="w-12 h-16 object-cover rounded-lg shrink-0" onerror="this.src=\'https://placehold.co/120x160?text=Movie\'" />' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center gap-2 flex-wrap">' +
              '<span class="text-xs font-bold text-white truncate">' + (mv.title || '') + '</span>' +
              '<span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">' + (mv.age || 'P') + '</span>' +
              '<span class="text-[10px] text-slate-400">' + (mv.duration || '') + '</span>' +
            '</div>' +
            '<div class="text-[11px] text-cyan-400 mt-0.5 truncate">' + (mv.genre || '') + ' · ' + formatVND(mv.basePrice || mv.price || 95000) + '</div>' +
            '<div class="text-[10px] text-slate-400 mt-0.5 truncate">EN: ' + (mv.title_en || mv.title || '') + ' | JA: ' + (mv.title_ja || mv.title || '') + ' | ZH: ' + (mv.title_zh || mv.title || '') + '</div>' +
          '</div>' +
          '<button type="button" data-del-cin-mv="' + idx + '" class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px] transition-all">Xóa</button>' +
        '</div>';
      }).join('');
      box.querySelectorAll('[data-del-cin-mv]').forEach(function (b) {
        b.addEventListener('click', function () {
          const idx = Number(b.dataset.delCinMv || 0);
          DATA.cinemaData.movies.splice(idx, 1);
          try { localStorage.setItem('dtr_catalog_preview', JSON.stringify(DATA)); } catch (e) {}
          renderManagerCinemaMovies();
          showToast('Đã xóa phim');
        });
      });
    }
    renderManagerCinemaMovies();

    $('#addCinMovieBtn')?.addEventListener('click', function () {
      const titleVi = ($('#cinMvTitleVi')?.value || '').trim();
      const titleEn = ($('#cinMvTitleEn')?.value || '').trim() || titleVi;
      const titleJa = ($('#cinMvTitleJa')?.value || '').trim() || titleVi;
      const titleZh = ($('#cinMvTitleZh')?.value || '').trim() || titleVi;

      const genreVi = ($('#cinMvGenreVi')?.value || '').trim() || 'Hành Động, Viễn Tưởng';
      const genreEn = ($('#cinMvGenreEn')?.value || '').trim() || genreVi;
      const genreJa = ($('#cinMvGenreJa')?.value || '').trim() || genreVi;
      const genreZh = ($('#cinMvGenreZh')?.value || '').trim() || genreVi;

      const duration = ($('#cinMvDuration')?.value || '').trim() || '120 phút';
      const age = ($('#cinMvAge')?.value || 'T16').trim();
      const price = Number($('#cinMvPrice')?.value || 95000) || 95000;
      const img = ($('#cinMvImg')?.value || '').trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';

      const descVi = ($('#cinMvDescVi')?.value || '').trim() || 'Trải nghiệm bom tấn điện ảnh đỉnh cao.';
      const descEn = ($('#cinMvDescEn')?.value || '').trim() || descVi;
      const descJa = ($('#cinMvDescJa')?.value || '').trim() || descVi;
      const descZh = ($('#cinMvDescZh')?.value || '').trim() || descVi;

      if (!titleVi) {
        showToast('Vui lòng nhập tên phim (VI)!', true);
        return;
      }

      if (!DATA.cinemaData) DATA.cinemaData = JSON.parse(JSON.stringify(DEFAULT_DATA.cinemaData));
      if (!Array.isArray(DATA.cinemaData.movies)) DATA.cinemaData.movies = [];

      DATA.cinemaData.movies.push({
        id: 'mv_' + Date.now(),
        title: titleVi,
        title_vi: titleVi,
        title_en: titleEn,
        title_ja: titleJa,
        title_zh: titleZh,
        genre: genreVi,
        genre_vi: genreVi,
        genre_en: genreEn,
        genre_ja: genreJa,
        genre_zh: genreZh,
        duration: duration,
        age: age,
        price: price,
        basePrice: price,
        img: img,
        desc: descVi,
        desc_vi: descVi,
        desc_en: descEn,
        desc_ja: descJa,
        desc_zh: descZh
      });

      try { localStorage.setItem('dtr_catalog_preview', JSON.stringify(DATA)); } catch (e) {}
      renderManagerCinemaMovies();

      if ($('#cinMvTitleVi')) $('#cinMvTitleVi').value = '';
      if ($('#cinMvTitleEn')) $('#cinMvTitleEn').value = '';
      if ($('#cinMvTitleJa')) $('#cinMvTitleJa').value = '';
      if ($('#cinMvTitleZh')) $('#cinMvTitleZh').value = '';
      if ($('#cinMvGenreVi')) $('#cinMvGenreVi').value = '';
      if ($('#cinMvGenreEn')) $('#cinMvGenreEn').value = '';
      if ($('#cinMvGenreJa')) $('#cinMvGenreJa').value = '';
      if ($('#cinMvGenreZh')) $('#cinMvGenreZh').value = '';
      if ($('#cinMvImg')) $('#cinMvImg').value = '';
      if ($('#cinMvDescVi')) $('#cinMvDescVi').value = '';
      if ($('#cinMvDescEn')) $('#cinMvDescEn').value = '';
      if ($('#cinMvDescJa')) $('#cinMvDescJa').value = '';
      if ($('#cinMvDescZh')) $('#cinMvDescZh').value = '';

      showToast('Đã thêm phim rạp 4 ngôn ngữ thành công!');
    });

          showToast('Đã xóa ảnh lướt');
        });
      });
    }
    renderBrandPromoList();
    renderItemEarlyList();
    renderManagerBanners();

    DATA.heroBanners = Array.isArray(DATA.heroBanners) && DATA.heroBanners.length > 0
      ? DATA.heroBanners
      : [
          {
            id: 'hb_01',
            title: 'Thiết Bị Điện Tử & Công Nghệ Số',
            subtitle: 'Flagship, Laptop & Phụ Kiện Đỉnh Cao',
            img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80',
            link: 'category.html?group=electronics'
          },
          {
            id: 'hb_02',
            title: 'Rạp Chiếu Phim Đỉnh Cao Cyber Cinema',
            subtitle: 'Trải nghiệm âm thanh AetherSound 3D sống động',
            img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
            link: 'cinema.html'
          },
          {
            id: 'hb_03',
            title: 'Kỹ Thuật Số & Bản Quyền Game',
            subtitle: 'Trò chơi bom tấn & Thẻ nạp quà tặng Gift Card',
            img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
            link: 'category.html?group=digital'
          },
          {
            id: 'hb_04',
            title: 'Tự Động Hóa & Thiết Bị Công Nghiệp',
            subtitle: 'Giải pháp IoT và cánh tay Robot nhà máy',
            img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
            link: 'category.html?group=industrial'
          }
        ];

    function renderManagerMpHeroBanners() {
      const box = $('#managerMpBannerList');
      if (!box) return;
      if (!DATA.heroBanners || !DATA.heroBanners.length) {
        box.innerHTML = '<p class="text-slate-400 text-xs italic">Chưa có banner trang chủ nào.</p>';
        return;
      }
      box.innerHTML = DATA.heroBanners.map(function (bn, idx) {
        if (!bn) return '';
        return '<div class="flex items-center gap-3 p-2.5 rounded-xl bg-[#091528] border border-slate-800">' +
          '<img src="' + (bn.img || '') + '" class="w-16 h-11 object-cover rounded-lg shrink-0" onerror="this.src=\'https://placehold.co/120x80?text=Banner\'" />' +
          '<div class="flex-1 min-w-0">' +
            '<div class="text-xs font-bold text-white truncate">' + (bn.title || '') + '</div>' +
            '<div class="text-[10.5px] text-cyan-400 font-mono truncate">Link: ' + (bn.link || 'marketplace.html') + '</div>' +
          '</div>' +
          '<button type="button" data-del-mp-bn="' + idx + '" class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[11px]">Xóa</button>' +
        '</div>';
      }).join('');
      box.querySelectorAll('[data-del-mp-bn]').forEach(function (b) {
        b.addEventListener('click', function () {
          const idx = Number(b.dataset.delMpBn || 0);
          DATA.heroBanners.splice(idx, 1);
          try { localStorage.setItem('dtr_catalog_preview', JSON.stringify(DATA)); } catch (e) {}
          renderManagerMpHeroBanners();
          showToast('Đã xóa banner');
        });
      });
    }
    renderManagerMpHeroBanners();

    $('#addMpBannerBtn')?.addEventListener('click', function () {
      const title = ($('#mpBannerTitleInp')?.value || '').trim();
      const sub = ($('#mpBannerSubInp')?.value || '').trim() || 'Ưu đãi mua sắm';
      const link = ($('#mpBannerLinkInp')?.value || '').trim() || 'marketplace.html';
      const img = ($('#mpBannerImgInp')?.value || '').trim() || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80';
      if (!title) {
        showToast('Vui lòng nhập tiêu đề slide!', true);
        return;
      }
      DATA.heroBanners.push({
        id: 'hb_' + Date.now(),
        title: title,
        subtitle: sub,
        link: link,
        img: img
      });
      try { localStorage.setItem('dtr_catalog_preview', JSON.stringify(DATA)); } catch (e) {}
      renderManagerMpHeroBanners();
      if ($('#mpBannerTitleInp')) $('#mpBannerTitleInp').value = '';
      if ($('#mpBannerImgInp')) $('#mpBannerImgInp').value = '';
      showToast('Đã thêm banner trang chủ');
    });

    let savedBrandMeta = null;
    try {
      savedBrandMeta = JSON.parse(localStorage.getItem('dtr_brand_meta') || 'null');
    } catch (e) {}

    const curTheme = savedBrandMeta?.theme || DATA?.theme || {};
    const curEffects = savedBrandMeta?.effects || {};

    if ($('#themePrimary')) {
      const pColor = curTheme['--lime'] || curTheme['--color-primary'] || '#a3e635';
      $('#themePrimary').value = pColor;
      if ($('#themePrimaryPick')) $('#themePrimaryPick').value = pColor;
    }
    if ($('#themeBg')) {
      const bColor = curTheme['--bg'] || curTheme['--color-bg'] || '#040914';
      $('#themeBg').value = bColor;
      if ($('#themeBgPick')) $('#themeBgPick').value = bColor;
    }
    if ($('#themeBg2')) {
      const b2Color = curTheme['--bg-2'] || '#091426';
      $('#themeBg2').value = b2Color;
      if ($('#themeBg2Pick')) $('#themeBg2Pick').value = b2Color;
    }
    if ($('#themeFont') && curTheme['--font-heading']) {
      $('#themeFont').value = curTheme['--font-heading'];
    }
    if ($('#themeEffectGrid') && typeof curEffects.grid === 'boolean') {
      $('#themeEffectGrid').checked = curEffects.grid;
    }
    if ($('#themeEffectGlow') && typeof curEffects.glow === 'boolean') {
      $('#themeEffectGlow').checked = curEffects.glow;
    }
    if ($('#themeLogo')) {
      $('#themeLogo').value = savedBrandMeta?.media?.logo || '';
    }

    function bindColorSync(pickId, textId) {
      const pick = $(pickId);
      const text = $(textId);
      if (!pick || !text) return;
      pick.addEventListener('input', function () { text.value = pick.value; });
      text.addEventListener('input', function () { pick.value = text.value; });
    }
    bindColorSync('#themePrimaryPick', '#themePrimary');
    bindColorSync('#themeBgPick', '#themeBg');
    bindColorSync('#themeBg2Pick', '#themeBg2');

    function collectCurrentTheme() {
      const p = ($('#themePrimary')?.value || '#a3e635').trim();
      const bg = ($('#themeBg')?.value || '#040914').trim();
      const bg2 = ($('#themeBg2')?.value || '#091426').trim();
      const font = $('#themeFont')?.value || "'Be Vietnam Pro', sans-serif";
      const grid = !!$('#themeEffectGrid')?.checked;
      const glow = !!$('#themeEffectGlow')?.checked;
      const logo = ($('#themeLogo')?.value || '').trim();

      return {
        theme: {
          '--lime': p,
          '--color-primary': p,
          '--bg': bg,
          '--color-bg': bg,
          '--bg-2': bg2,
          '--bg-3': bg2,
          '--font-heading': font
        },
        effects: {
          grid: grid,
          glow: glow
        },
        media: {
          logo: logo
        }
      };
    }

    $('#previewThemeBtn')?.addEventListener('click', function () {
      const meta = collectCurrentTheme();
      applyBranding(meta);
      showToast('Đã áp dụng xem trước giao diện!');
    });

    $('#addBrandPromoBtn')?.addEventListener('click', function () {
      const bId = $('#cfgBrandSelect')?.value || 'novatech';
      const bName = getBrandName(bId);
      const st = $('#cfgBrandStart')?.value || '2026-10-01T00:00';
      const et = $('#cfgBrandEnd')?.value || '2026-11-30T23:59';
      const sp = !!$('#cfgBrandSponsored')?.checked;
      cfg.brandPromos = cfg.brandPromos || {};
      cfg.brandPromos[bId] = {
        brandId: bId,
        brandName: bName,
        startTime: st,
        endTime: et,
        isSponsored: sp
      };
      savePromoConfig(cfg);
      renderBrandPromoList();
      showToast('Đã cập nhật cho ' + bName);
    });
    $('#addItemEarlyBtn')?.addEventListener('click', function () {
      const pid = $('#cfgItemSelect')?.value;
      const et = $('#cfgItemEarlyEnd')?.value;
      if (!pid || !et) {
        showToast('Chọn ngày giờ kết thúc sớm!', true);
        return;
      }
      cfg.itemEarlyEnds = cfg.itemEarlyEnds || {};
      cfg.itemEarlyEnds[pid] = et;
      savePromoConfig(cfg);
      renderItemEarlyList();
      showToast('Đã đặt giờ kết thúc sớm');
    });
    $('#addBannerBtn')?.addEventListener('click', function () {
      const title = ($('#bannerTitleInp')?.value || '').trim();
      const sub = ($('#bannerSubInp')?.value || '').trim() || 'Click vào Banner để lọc sản phẩm';
      const bId = $('#bannerBrandSelect')?.value || 'novatech';
      const img = ($('#bannerImgInp')?.value || '').trim() || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80';
      if (!title) {
        showToast('Nhập tiêu đề Banner!', true);
        return;
      }
      cfg.banners = Array.isArray(cfg.banners) ? cfg.banners : [];
      cfg.banners.push({
        id: 'bn_' + Date.now(),
        brandId: bId,
        brandName: getBrandName(bId),
        title: title,
        subtitle: sub,
        img: img
      });
      savePromoConfig(cfg);
      renderManagerBanners();
      if ($('#bannerTitleInp')) $('#bannerTitleInp').value = '';
      if ($('#bannerImgInp')) $('#bannerImgInp').value = '';
      showToast('Đã thêm ảnh lướt');
    });
    $('#saveManagerBtn')?.addEventListener('click', function () {
      cfg.globalEvent = {
        enabled: !!$('#cfgGlobalEnabled')?.checked,
        name: ($('#cfgGlobalName')?.value || '').trim() || 'Sự kiện Ưu đãi ' + (DATA?.brand || 'DTR-Market'),
        name_en: ($('#cfgGlobalNameEn')?.value || '').trim() || '',
        name_ja: ($('#cfgGlobalNameJa')?.value || '').trim() || '',
        name_zh: ($('#cfgGlobalNameZh')?.value || '').trim() || '',
        startTime: $('#cfgGlobalStart')?.value || '2026-10-01T00:00',
        endTime: $('#cfgGlobalEnd')?.value || '2026-12-31T23:59'
      };
      savePromoConfig(cfg);

      const themeMeta = collectCurrentTheme();
      try {
        localStorage.setItem('dtr_brand_meta', JSON.stringify(themeMeta));
      } catch (e) {}

      DATA.promoConfig = cfg;
      DATA.theme = Object.assign({}, DATA.theme, themeMeta.theme);
      try {
        localStorage.setItem('dtr_catalog_preview', JSON.stringify(DATA));
      } catch (e) {}

      applyBranding(themeMeta);
      showToast('✓ Đã lưu cấu hình, banner & màu sắc thành công!');
    });
    $('#resetManagerBtn')?.addEventListener('click', function () {
      localStorage.removeItem(PROMO_CFG_KEY);
      localStorage.removeItem('dtr_brand_meta');
      localStorage.removeItem('dtr_catalog_preview');
      location.reload();
    });
    $('#exportJsonBtn')?.addEventListener('click', function () {
      const exportObj = Object.assign({}, DATA, {
        promoConfig: cfg
      });
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
        type: 'application/json'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'products-whitelabel.json';
      a.click();
      showToast('Đã xuất JSON');
    });
  }
  function initDealsPage() {
    let foundCat;
    const cfg = getPromoConfig();
    const banners = cfg?.banners || [];
    let currentSlide = 0;
    let selectedBrandFilter = null;
    let dealSearchQuery = '';
    const MAX_VISIBLE_CATS = 8;
    const showAllDealsCats = false;
    const params = new URLSearchParams(window.location.search);
    let selectedGroup = params.get('group') || 'all';
    let catParam = params.get('product') || 'all';
    if (catParam !== 'all' && selectedGroup === 'all') {
      foundCat = (DATA?.categories || []).find(function (c) {
        return c?.id === catParam;
      });
      if (foundCat && foundCat.group) selectedGroup = foundCat.group;
    }
    if ($('#dealsEventTitle') && cfg?.globalEvent) {
      const curLang = (localStorage.getItem('dtr_lang') || 'vi').toLowerCase();
      const eventName = cfg.globalEvent['name_' + curLang] || cfg.globalEvent.name || '';
      const cdLabel = curLang === 'en' ? 'Countdown: ' : (curLang === 'ja' ? 'カウントダウン: ' : (curLang === 'zh' ? '倒计时: ' : 'Đếm ngược: '));
      $('#dealsEventTitle').innerHTML = eventName + ' (' + cdLabel + '<span data-countdown-end="' + (cfg.globalEvent.endTime || '') + '">' + formatRemainingTime(cfg.globalEvent.endTime) + '</span>)';
    }
    function syncDealsUrlParams() {
      let url;
      try {
        url = new URL(window.location.href);
        if (!selectedGroup || selectedGroup === 'all') url.searchParams.delete('group');else url.searchParams.set('group', selectedGroup);
        if (!catParam || catParam === 'all') url.searchParams.delete('product');else url.searchParams.set('product', catParam);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }
    function renderDealBannerSlide() {
      const vp = $('#dealsBannerViewport');
      const dots = $('#dealsBannerDots');
      if (!vp) return;
      if (!banners.length) {
        vp.innerHTML = '<div class="p-8 text-sm text-slate-400">Chưa có Banner chiến dịch nào.</div>';
        return;
      }
      currentSlide = (currentSlide + banners.length) % banners.length;
      const bn = banners[currentSlide];
      if (!bn) return;
      vp.innerHTML = '<div class="deal-banner-slide" data-banner-brand="' + (bn.brandId || '') + '" style="background-image:url(\'' + (bn.img || '') + '\')"><div class="deal-banner-content space-y-2.5"><span class="px-3 py-1 rounded-full bg-[#a3e635] text-slate-950 font-mono text-[11px] font-extrabold uppercase">THƯƠNG HIỆU ƯU ĐÃI: ' + (bn.brandName || '') + '</span><h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">' + (bn.title || '') + '</h2><p class="text-xs sm:text-sm text-slate-200">' + (bn.subtitle || '') + '</p><div class="pt-1"><span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0b182e]/90 border border-[#a3e635] text-[#a3e635] text-xs font-bold"><i class="fa-solid fa-filter"></i>Click để lọc sản phẩm ' + (bn.brandName || '') + '</span></div></div></div>';
      if (dots) {
        dots.innerHTML = banners.map(function (b, idx) {
          const activeCls = idx === currentSlide ? 'bg-[#a3e635] text-slate-950 font-bold' : 'bg-[#0c182c] text-slate-300';
          return '<button type="button" data-deal-dot="' + idx + '" class="px-3 py-1 rounded-full border border-slate-700 text-[11px] transition-all ' + activeCls + '">' + (b?.brandName || '') + '</button>';
        }).join('');
        dots.querySelectorAll('[data-deal-dot]').forEach(function (d) {
          d.addEventListener('click', function () {
            currentSlide = Number(d?.dataset?.dealDot || 0);
            renderDealBannerSlide();
          });
        });
      }
      const slideEl = vp.querySelector('[data-banner-brand]');
      if (slideEl) {
        slideEl.addEventListener('click', function () {
          selectedBrandFilter = bn.brandId;
          renderDealsGrid();
          showToast('Đang lọc thương hiệu ' + (bn.brandName || ''));
        });
      }
    }
    function renderDealsGrid() {
      let q;
      const grid = $('#dealsProductGrid');
      const pill = $('#dealsActiveBrandPill');
      const pillTxt = $('#dealsActiveBrandText');
      const sortStatus = $('#dealsSortStatus');
      if (!grid) return;
      mountCatalogTools(grid, renderDealsGrid);
      let list = (DATA?.products || []).filter(function (p) {
        return p && (p.isPromo || p.priceOld || p.badge === 'sale' || p.badge === 'hot');
      });
      if (selectedGroup && selectedGroup !== 'all') list = list.filter(function (p) {
        return p?.group === selectedGroup;
      });
      if (catParam && catParam !== 'all') list = list.filter(function (p) {
        return p?.category === catParam;
      });
      if (selectedBrandFilter) {
        list = list.filter(function (p) {
          return p?.brand === selectedBrandFilter;
        });
        if (pill && pillTxt) {
          pillTxt.textContent = 'Đang lọc: ' + getBrandName(selectedBrandFilter);
          pill.classList.remove('hidden');
        }
      } else if (pill) pill.classList.add('hidden');
      if (dealSearchQuery) {
        q = dealSearchQuery.toLowerCase();
        list = list.filter(function (p) {
          if (!p) return false;
          return (p.name || '').toLowerCase().indexOf(q) !== -1 || (p.desc || '').toLowerCase().indexOf(q) !== -1 || (getBrandName(p.brand) || '').toLowerCase().indexOf(q) !== -1;
        });
      }
      if (sortStatus) {
        sortStatus.textContent = list.some(function (p) {
          return p && cfg?.brandPromos?.[p.brand]?.isSponsored;
        }) ? 'Ưu tiên Đối tác Book → Giảm giá cao nhất' : 'Tự động xếp giảm giá nhiều nhất đến ít nhất';
      }
      list.sort(function (a, b) {
        const spA = a && cfg?.brandPromos?.[a.brand]?.isSponsored ? 1 : 0;
        const spB = b && cfg?.brandPromos?.[b.brand]?.isSponsored ? 1 : 0;
        if (spA !== spB) return spB - spA;
        return getDiscountPct(b) - getDiscountPct(a);
      });
      list = applyCatalogTools(list, grid);
      if (sortStatus && catalogTools[grid.id].sort) sortStatus.textContent = 'Sắp xếp theo lựa chọn của bạn';
      const countEl = $('#dealsCountText');
      if (countEl) countEl.textContent = 'Đang hiển thị ' + list.length + ' sản phẩm';
      if (!list.length) {
        grid.innerHTML = window.DTRUI.emptyStateMarkup({ icon: 'filter', title: 'Chưa có ưu đãi phù hợp', message: 'Thử khoảng giá khác hoặc xóa bộ lọc để xem tất cả ưu đãi.', actionLabel: 'Xóa bộ lọc', actionHref: 'deals.html' });
        return;
      }
      grid.innerHTML = list.map(function (p) {
        return buildProductCardHtml(p, {
          showPromoTimer: true
        });
      }).join('');
      bindProductGridEvents(grid);
    }
    function renderDealsCategoryFilters() {
      let allBtn, grpHtml, allCatBtn, catBtns;
      const groups = DATA?.majorGroups || [];
      const categories = DATA?.categories || [];
      const visibleCats = selectedGroup === 'all' ? categories : categories.filter(function (c) {
        return c?.group === selectedGroup;
      });
      const groupContainer = $('#dealsGroupFilterBar') || $('#dealsGroupBar');
      if (groupContainer) {
        allBtn = '<button type="button" data-deal-group="all" class="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all ' + (selectedGroup === 'all' ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0b182e] text-slate-200 border-slate-700 hover:border-[#a3e635]') + '"><i class="fa-solid fa-layer-group text-[11px]"></i><span>Tất cả lĩnh vực</span></button>';
        grpHtml = groups.map(function (g) {
          if (!g) return '';
          const isAct = selectedGroup === g.id;
          return '<button type="button" data-deal-group="' + g.id + '" class="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all ' + (isAct ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0b182e] text-slate-200 border-slate-700 hover:border-[#a3e635]') + '"><i class="fa-solid ' + (g.icon || 'fa-cube') + ' text-[11px]"></i><span>' + (g.name || '') + '</span></button>';
        }).join('');
        groupContainer.innerHTML = allBtn + grpHtml;
        groupContainer.querySelectorAll('[data-deal-group]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const grp = btn?.dataset?.dealGroup;
            if (!grp) return;
            if (grp === 'cinema') {
              window.location.href = 'cinema.html';
              return;
            }
            selectedGroup = grp;
            catParam = 'all';
            syncDealsUrlParams();
            renderDealsCategoryFilters();
            renderDealsGrid();
          });
        });
      }
      const catContainer = $('#dealsCategoryFilterBar') || $('#dealsCatList');
      if (catContainer) {
        allCatBtn = '<button type="button" data-deal-cat="all" class="px-3 py-1.5 rounded-full text-xs font-bold border transition-all ' + (catParam === 'all' ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0c182c] text-slate-300 border-slate-700 hover:border-[#a3e635]') + '">Tất cả danh mục</button>';
        catBtns = visibleCats.slice(0, MAX_VISIBLE_CATS).map(function (c) {
          if (!c) return '';
          const isAct = catParam === c.id;
          return '<button type="button" data-deal-cat="' + c.id + '" class="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all ' + (isAct ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0c182c] text-slate-300 border-slate-700 hover:border-[#a3e635]') + '"><i class="fa-solid ' + (c.icon || 'fa-tag') + ' text-[11px]"></i><span>' + (c.name || '') + '</span></button>';
        }).join('');
        catContainer.innerHTML = allCatBtn + catBtns;
        catContainer.querySelectorAll('[data-deal-cat]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            catParam = btn?.dataset?.dealCat || 'all';
            syncDealsUrlParams();
            renderDealsCategoryFilters();
            renderDealsGrid();
          });
        });
      }
    }
    const dealSearchInp = $('#dealsSearchInput');
    if (dealSearchInp) {
      dealSearchInp.addEventListener('input', function () {
        dealSearchQuery = (dealSearchInp.value || '').trim();
        renderDealsGrid();
      });
    }
    renderDealBannerSlide();
    renderDealsCategoryFilters();
    renderDealsGrid();
    $('#dealBannerPrev')?.addEventListener('click', function () {
      currentSlide -= 1;
      renderDealBannerSlide();
    });
    $('#dealBannerNext')?.addEventListener('click', function () {
      currentSlide += 1;
      renderDealBannerSlide();
    });
    $('#clearBrandDealBtn')?.addEventListener('click', function () {
      selectedBrandFilter = null;
      renderDealsGrid();
      showToast('Đã hiển thị lại tất cả sản phẩm');
    });
  }
  function initBestsellersPage() {
    const params = new URLSearchParams(window.location.search);
    const currentCat = params.get('product') || 'all';
    function renderBestsellersView() {
      const grid = $('#bestsellerFullGrid');
      if (!grid) return;
      let list = (DATA?.products || []).slice();
      if (currentCat !== 'all') list = list.filter(function (p) {
        return p?.category === currentCat;
      });
      list.sort(function (a, b) {
        return (b && b.sold || 0) - (a && a.sold || 0);
      });
      if (!list.length) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-sm">Không có sản phẩm nào.</div>';
        return;
      }
      grid.innerHTML = list.map(function (p) {
        return buildProductCardHtml(p, {
          showPromoTimer: false
        });
      }).join('');
      bindProductGridEvents(grid);
    }
    renderBestsellersView();
  }
  function initCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const group = params.get('group') || 'electronics';
    let selectedSubCat = params.get('product') || 'all';
    let grpInfo = (DATA?.majorGroups || []).find(function (g) {
      return g?.id === group;
    }) || {
      id: group,
      name: 'Danh Mục Sản Phẩm',
      desc: 'Khám phá'
    };
    if (group === 'all') grpInfo = {
      id: 'all',
      name: 'Tất cả sản phẩm',
      desc: 'Khám phá toàn bộ catalog DTR-Market'
    };
    if ($('#catGroupEyebrow')) $('#catGroupEyebrow').textContent = 'LĨNH VỰC · ' + String(group || '').toUpperCase();
    if ($('#catGroupTitle')) $('#catGroupTitle').textContent = grpInfo.name || '';
    if ($('#catGroupDesc')) $('#catGroupDesc').textContent = grpInfo.desc || '';
    function renderSubCatButtonsAndGrid() {
      const subBox = $('#catSubButtons');
      const grid = $('#categoryProductGrid');
      if (!subBox || !grid) return;
      mountCatalogTools(grid, renderSubCatButtonsAndGrid);
      const subCats = (DATA?.categories || []).filter(function (c) {
        return group === 'all' || c?.group === group;
      });
      const allBtn = '<button type="button" data-sub-btn="all" class="px-4 py-2 rounded-xl text-xs font-bold border transition-all ' + (selectedSubCat === 'all' ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0b182e] text-slate-200 border-slate-700') + '">Tất cả ' + (grpInfo.name || '') + '</button>';
      const btnsHtml = subCats.map(function (c) {
        if (!c) return '';
        const isAct = selectedSubCat === c.id;
        return '<button type="button" data-sub-btn="' + c.id + '" class="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ' + (isAct ? 'bg-[#a3e635] text-slate-950 border-[#a3e635]' : 'bg-[#0b182e] text-slate-200 border-slate-700 hover:border-[#a3e635]') + '"><i class="fa-solid ' + (c.icon || 'fa-cube') + '"></i><span>' + (c.name || '') + '</span></button>';
      }).join('');
      subBox.innerHTML = allBtn + btnsHtml;
      subBox.querySelectorAll('[data-sub-btn]').forEach(function (b) {
        b.addEventListener('click', function () {
          selectedSubCat = b?.dataset?.subBtn || 'all';
          renderSubCatButtonsAndGrid();
        });
      });
      let list = (DATA?.products || []).filter(function (p) {
        return group === 'all' || p?.group === group;
      });
      if (selectedSubCat !== 'all') list = list.filter(function (p) {
        return p?.category === selectedSubCat;
      });
      list = applyCatalogTools(list, grid);
      if (!list.length) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-400 text-sm">Chưa có sản phẩm nào trong mục này.</div>';
        return;
      }
      grid.innerHTML = list.map(function (p) {
        return buildProductCardHtml(p, {
          showPromoTimer: !!(p && p.isPromo)
        });
      }).join('');
      bindProductGridEvents(grid);
    }
    renderSubCatButtonsAndGrid();
  }
  function initCinemaLocationPage() {
    let recent, oldLocation;
    let lang = 'vi';
    try {
      lang = (typeof window !== 'undefined' && window.__dtrCurrentLang) || localStorage.getItem('dtr_lang') || 'vi';
    } catch (e) {}
    const cLocDict = {
      vi: {
        optCountry: '-- Chọn Quốc gia --',
        optCity: '-- Chọn Thành Phố --',
        optDistrict: '-- Chọn Quận / Phường --',
        optStreet: '-- Chọn Tuyến Đường --',
        locSelected: 'Vị trí đã chọn: ',
        need4: 'Vui lòng chọn đủ 4 cấp.',
        locLabel: 'Địa điểm: ',
        fromPrice: 'Giá vé từ',
        selectCinema: 'Chọn Rạp',
        noMovieTitle: 'Chưa có phim tại khu vực này',
        noMovieMsg: 'Chọn khu vực khác để tìm lịch chiếu đang mở bán.',
        changeLoc: 'Đổi khu vực',
        foundMsg: 'Đã tìm thấy '
      },
      en: {
        optCountry: '-- Select Country --',
        optCity: '-- Select City --',
        optDistrict: '-- Select District / State --',
        optStreet: '-- Select Street --',
        locSelected: 'Selected Location: ',
        need4: 'Please select all 4 levels.',
        locLabel: 'Location: ',
        fromPrice: 'Tickets from',
        selectCinema: 'Select Cinema',
        noMovieTitle: 'No movies available in this area',
        noMovieMsg: 'Please choose another location to find available screenings.',
        changeLoc: 'Change Location',
        foundMsg: 'Found '
      },
      ja: {
        optCountry: '-- 国を選択 --',
        optCity: '-- 都市を選択 --',
        optDistrict: '-- 地区・都道府県を選択 --',
        optStreet: '-- 通りを選択 --',
        locSelected: '選択された位置: ',
        need4: '4段階の地域をすべて選択してください。',
        locLabel: '現在地: ',
        fromPrice: 'チケット料金',
        selectCinema: '映画館を選択',
        noMovieTitle: 'このエリアでは上映がありません',
        noMovieMsg: '別のエリアを選択して上映スケジュールをご確認ください。',
        changeLoc: 'エリア変更',
        foundMsg: '件の映画が見つかりました: '
      },
      zh: {
        optCountry: '-- 选择国家 --',
        optCity: '-- 选择城市 --',
        optDistrict: '-- 选择区域 / 省份 --',
        optStreet: '-- 选择街道 --',
        locSelected: '已选位置: ',
        need4: '请完整选择四级区域位置。',
        locLabel: '所在位置: ',
        fromPrice: '票价从',
        selectCinema: '选择影院',
        noMovieTitle: '该区域暂无可上映电影',
        noMovieMsg: '请选择其他地区查看正在热映的场次排期。',
        changeLoc: '更换区域',
        foundMsg: '已找到电影: '
      }
    };
    const cld = cLocDict[lang] || cLocDict.vi;

    const cData = DATA?.cinemaData || DEFAULT_DATA.cinemaData;
    const locTree = cData?.locations || {};
    const selCountry = $('#cinemaCountry');
    const selCity = $('#cinemaCity');
    const selDistrict = $('#cinemaDistrict');
    const selStreet = $('#cinemaStreet');
    const summaryEl = $('#selectedLocationSummary');
    const findBtn = $('#findMoviesByLocBtn');
    const moviesWrap = $('#cinemaMoviesWrap');
    const moviesSub = $('#cinemaMoviesSub');
    const movieGrid = $('#cinemaMovieGrid');
    if (!selCountry || !selCity || !selDistrict || !selStreet) return;
    selCountry.innerHTML = '<option value="">' + cld.optCountry + '</option>' + Object.keys(locTree).map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join('');
    function updateSummaryState() {
      let fullLoc;
      const c = selCountry.value;
      const ct = selCity.value;
      const d = selDistrict.value;
      const s = selStreet.value;
      if (c && ct && d && s) {
        fullLoc = s + ', ' + d + ', ' + ct + ', ' + c;
        try {
          localStorage.setItem('dtr_cinema_location_parts', JSON.stringify([c, ct, d, s]));
          localStorage.setItem('dtr_cinema_location', fullLoc);
        } catch (e) {}
        if (summaryEl) summaryEl.innerHTML = cld.locSelected + '<strong class="text-[#a3e635]">' + fullLoc + '</strong>';
        if (findBtn) findBtn.disabled = false;
      } else {
        if (summaryEl) summaryEl.textContent = cld.need4;
        if (findBtn) findBtn.disabled = true;
      }
    }
    selCountry.addEventListener('change', function () {
      const c = selCountry.value;
      selCity.innerHTML = '<option value="">' + cld.optCity + '</option>';
      selDistrict.innerHTML = '<option value="">' + cld.optDistrict + '</option>';
      selStreet.innerHTML = '<option value="">' + cld.optStreet + '</option>';
      selDistrict.disabled = true;
      selStreet.disabled = true;
      if (c && locTree?.[c]) {
        selCity.disabled = false;
        Object.keys(locTree[c]).forEach(function (city) {
          selCity.innerHTML += '<option value="' + city + '">' + city + '</option>';
        });
      } else selCity.disabled = true;
      updateSummaryState();
    });
    selCity.addEventListener('change', function () {
      const c = selCountry.value;
      const ct = selCity.value;
      selDistrict.innerHTML = '<option value="">' + cld.optDistrict + '</option>';
      selStreet.innerHTML = '<option value="">' + cld.optStreet + '</option>';
      selStreet.disabled = true;
      if (c && ct && locTree?.[c]?.[ct]) {
        selDistrict.disabled = false;
        Object.keys(locTree[c][ct]).forEach(function (dist) {
          selDistrict.innerHTML += '<option value="' + dist + '">' + dist + '</option>';
        });
      } else selDistrict.disabled = true;
      updateSummaryState();
    });
    selDistrict.addEventListener('change', function () {
      const c = selCountry.value;
      const ct = selCity.value;
      const d = selDistrict.value;
      selStreet.innerHTML = '<option value="">' + cld.optStreet + '</option>';
      if (c && ct && d && Array.isArray(locTree?.[c]?.[ct]?.[d])) {
        selStreet.disabled = false;
        locTree[c][ct][d].forEach(function (st) {
          selStreet.innerHTML += '<option value="' + st + '">' + st + '</option>';
        });
      } else selStreet.disabled = true;
      updateSummaryState();
    });
    selStreet.addEventListener('change', updateSummaryState);
    try {
      recent = JSON.parse(localStorage.getItem('dtr_cinema_location_parts') || '[]');
      if (!Array.isArray(recent)) recent = [];
      if (!recent.length) {
        oldLocation = localStorage.getItem('dtr_cinema_location') || '';
        Object.keys(locTree).forEach(function (country) {
          Object.keys(locTree[country]).forEach(function (city) {
            Object.keys(locTree[country][city]).forEach(function (district) {
              locTree[country][city][district].forEach(function (street) {
                if ([street, district, city, country].join(', ') === oldLocation) recent = [country, city, district, street];
              });
            });
          });
        });
      }
      [selCountry, selCity, selDistrict, selStreet].forEach(function (select, index) {
        if (recent[index] && Array.from(select.options).some(function (option) {
          return option.value === recent[index];
        })) {
          select.value = recent[index];
          select.dispatchEvent(new Event('change'));
        }
      });
    } catch (e) {}
    if (findBtn) {
      findBtn.addEventListener('click', function () {
        const fullLoc = selStreet.value + ', ' + selDistrict.value + ', ' + selCity.value + ', ' + selCountry.value;
        try {
          localStorage.setItem('dtr_cinema_location', fullLoc);
        } catch (e) {}
        if (moviesSub) moviesSub.textContent = cld.locLabel + fullLoc;
        if (moviesWrap) moviesWrap.classList.remove('hidden');
        const movies = Array.isArray(cData?.movies) ? cData.movies.filter(movie => movie && movie.id && movie.title) : [];
        if (movieGrid) {
          movieGrid.innerHTML = movies.map(function (mv) {
            if (!mv) return '';
            const detailUrl = 'detail_cinema.html?movie=' + encodeURIComponent(mv.id || '') + '&location=' + encodeURIComponent(fullLoc);
            const mvTitle = (lang !== 'vi' && mv['title_' + lang]) ? mv['title_' + lang] : (mv.title || '');
            const mvGenre = (lang !== 'vi' && mv['genre_' + lang]) ? mv['genre_' + lang] : (mv.genre || '');
            const mvDesc = (lang !== 'vi' && mv['desc_' + lang]) ? mv['desc_' + lang] : (mv.desc || '');
            return '<article class="cyber-card rounded-2xl overflow-hidden flex flex-col justify-between group"><div><div class="relative h-56 overflow-hidden bg-slate-950"><img src="' + (mv.img || '') + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#a3e635] text-slate-950 font-mono text-[10.5px] font-extrabold">' + (mv.age || 'P') + '</span><span class="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-[#a3e635] font-mono text-xs font-bold">★ ' + (mv.rating || '5.0') + '</span></div><div class="p-4 space-y-1.5"><div class="text-[11px] font-mono text-cyan-400">' + mvGenre + ' · ' + (mv.duration || '') + '</div><h3 class="text-base font-extrabold text-white group-hover:text-[#a3e635]">' + mvTitle + '</h3><p class="text-xs text-slate-400 line-clamp-2">' + mvDesc + '</p></div></div><div class="p-4 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2 pt-3"><div><span class="text-[10px] text-slate-400 block">' + cld.fromPrice + '</span><strong class="text-sm font-extrabold text-[#a3e635] font-mono">' + formatPrice(mv.basePrice) + '</strong></div><a href="' + detailUrl + '" class="px-4 py-2 rounded-xl bg-[#a3e635] hover:bg-[#b5f347] text-slate-950 font-extrabold text-xs shadow-neon-lime transition-all"><i class="fa-solid fa-ticket mr-1"></i>' + cld.selectCinema + '</a></div></article>';
          }).join('');
          if (!movies.length) movieGrid.innerHTML = window.DTRUI.emptyStateMarkup({ icon: 'film', title: cld.noMovieTitle, message: cld.noMovieMsg, actionLabel: cld.changeLoc, actionHref: '#cinemaCountry' });
        }
        if (moviesWrap) moviesWrap.scrollIntoView({
          behavior: 'smooth'
        });
        showToast(movies.length ? cld.foundMsg + movies.length + ' (' + selStreet.value + ')' : cld.noMovieTitle);
      });
    }
  }
  function initCinemaDetailPage() {
    const cData = DATA?.cinemaData || DEFAULT_DATA.cinemaData;
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('movie') || 'mv01';
    let savedLoc = '';
    try {
      savedLoc = localStorage.getItem('dtr_cinema_location') || '';
    } catch (e) {}
    const locationStr = params.get('location') || savedLoc || cData?.defaultLocation || DEFAULT_DATA.cinemaData.defaultLocation;
    const moviesList = cData?.movies || [];
    const movie = moviesList.find(function (m) {
      return m?.id === movieId;
    }) || moviesList[0];
    if (!movie) return;

    const curLang = localStorage.getItem('dtr_lang') || 'vi';
    const locMovieTitle = (curLang !== 'vi' && movie['title_' + curLang]) ? movie['title_' + curLang] : (movie.title || '');
    const locMovieGenre = (curLang !== 'vi' && movie['genre_' + curLang]) ? movie['genre_' + curLang] : (movie.genre || '');
    const locMovieDesc = (curLang !== 'vi' && movie['desc_' + curLang]) ? movie['desc_' + curLang] : (movie.desc || '');
    const locRegionPrefix = curLang === 'en' ? 'Region: ' : curLang === 'ja' ? 'エリア: ' : curLang === 'zh' ? '区域: ' : 'Khu vực: ';
    const perTicketSuffix = curLang === 'en' ? '/ticket' : curLang === 'ja' ? '/枚' : curLang === 'zh' ? '/张' : '/vé';
    const notSelectedText = curLang === 'en' ? 'Not selected' : curLang === 'ja' ? '未選択' : curLang === 'zh' ? '未选择' : 'Chưa chọn';
    const noneText = curLang === 'en' ? 'None' : curLang === 'ja' ? 'なし' : curLang === 'zh' ? '无' : 'Không có';
    const gapWarning = curLang === 'en' ? 'You are leaving a single isolated seat on the aisle or edge. Please select it or change your seats.' : curLang === 'ja' ? '通路側または端に1席のみの空席が発生しています。選択を変更してください。' : curLang === 'zh' ? '请不要留下单个空位，请调整您的选座。' : 'Bạn đang để lại một ghế lẻ ở rìa hoặc sát lối đi. Hãy đổi vị trí hoặc chọn thêm ghế đó.';

    let selectedTheater = null;
    let selectedShowtime = null;
    let selectedSeats = [];
    const comboQuantities = {};
    const heroEl = $('#movieHeroInfo');
    if (heroEl) {
      heroEl.innerHTML = '<img src="' + (movie.img || '') + '" class="w-28 sm:w-36 h-40 sm:h-48 object-cover rounded-xl border border-[#a3e635]/40 shrink-0" /><div class="space-y-2 flex-1"><div class="flex flex-wrap items-center gap-2"><span class="px-2.5 py-0.5 rounded bg-[#a3e635] text-slate-950 font-mono text-xs font-extrabold">' + (movie.age || 'P') + '</span><span class="text-xs font-mono text-cyan-400">' + locMovieGenre + ' · ' + (movie.duration || '') + '</span></div><h1 class="text-2xl sm:text-3xl font-extrabold text-white">' + locMovieTitle + '</h1><p class="text-xs sm:text-sm text-slate-300 max-w-3xl">' + locMovieDesc + '</p><div class="pt-1 text-xs font-mono text-[#a3e635]"><i class="fa-solid fa-location-dot mr-1.5"></i>' + locRegionPrefix + locationStr + '</div></div>';
    }
    if ($('#sumMovieName')) $('#sumMovieName').textContent = locMovieTitle;
    if ($('#sumLocation')) $('#sumLocation').textContent = locationStr;
    const theaterListEl = $('#theaterBrandList');
    if (theaterListEl) {
      theaterListEl.innerHTML = (cData?.theaters || []).map(function (th) {
        if (!th) return '';
        const thBadge = (curLang !== 'vi' && th['badge_' + curLang]) ? th['badge_' + curLang] : (th.badge || '');
        return '<button type="button" data-th-id="' + th.id + '" class="cyber-card rounded-xl p-4 text-left space-y-1 transition-all"><div class="flex items-center justify-between"><strong class="text-sm text-white">' + (th.brandName || '') + '</strong><span class="text-[11px] font-mono text-[#a3e635]">+' + formatPrice(th.surcharge) + perTicketSuffix + '</span></div><p class="text-[11px] text-cyan-400">' + thBadge + '</p><p class="text-[11px] text-slate-400 truncate"><i class="fa-solid fa-map-pin mr-1"></i>' + locationStr + '</p></button>';
      }).join('');
      theaterListEl.querySelectorAll('[data-th-id]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const thId = btn?.dataset?.thId;
          selectedTheater = (cData?.theaters || []).find(function (t) {
            return t?.id === thId;
          }) || null;
          selectedShowtime = null;
          selectedSeats = [];
          theaterListEl.querySelectorAll('[data-th-id]').forEach(function (b) {
            b.classList.toggle('active', b === btn);
          });
          $('#seatMapSection')?.classList.add('opacity-50', 'pointer-events-none');
          $('#comboAddonSection')?.classList.add('opacity-50', 'pointer-events-none');
          renderShowtimeStep();
          updateCinemaOrderSummary();
        });
      });
    }
    function renderShowtimeStep() {
      const sec = $('#showtimeSection');
      const list = $('#showtimeList');
      if (!sec || !list || !selectedTheater) return;
      sec.classList.remove('opacity-50', 'pointer-events-none');
      list.innerHTML = (selectedTheater.showtimes || []).map(function (timeStr) {
        return '<button type="button" data-time="' + timeStr + '" class="px-4 py-2 rounded-xl bg-[#091528] border border-slate-700 hover:border-[#a3e635] text-xs font-mono font-bold text-white transition-all"><i class="fa-regular fa-clock mr-1.5 text-[#a3e635]"></i>' + timeStr + '</button>';
      }).join('');
      list.querySelectorAll('[data-time]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedShowtime = btn?.dataset?.time || null;
          selectedSeats = [];
          list.querySelectorAll('[data-time]').forEach(function (b) {
            b.classList.toggle('bg-[#a3e635]', b === btn);
            b.classList.toggle('text-slate-950', b === btn);
            b.classList.toggle('border-[#a3e635]', b === btn);
          });
          renderSeatMapStep();
          updateCinemaOrderSummary();
        });
      });
    }
    function renderSeatMapStep() {
      let legend, hint;
      const sec = $('#seatMapSection');
      const container = $('#seatGridContainer');
      if (!sec || !container || !selectedTheater || !selectedShowtime) return;
      sec.classList.remove('opacity-50', 'pointer-events-none');
      const rows = ['A', 'B', 'C', 'D', 'E'];
      const occupied = selectedTheater.occupiedSeats || [];
      if (!$('#seatPriceLegend')) {
        legend = document.createElement('p');
        legend.id = 'seatPriceLegend';
        legend.className = 'seat-price-legend';
        container.before(legend);
        hint = document.createElement('p');
        hint.id = 'seatPolicyHint';
        hint.className = 'seat-policy-hint';
        hint.setAttribute('role', 'status');
        container.after(hint);
      }
      const normal = Number(movie.basePrice || 90000) + Number(selectedTheater.surcharge || 0);
      const stdLabel = curLang === 'en' ? 'Standard: ' : (curLang === 'ja' ? '通常: ' : (curLang === 'zh' ? '普通: ' : 'Thường: '));
      const vipLabel = curLang === 'en' ? ' · VIP: ' : (curLang === 'ja' ? ' · VIP: ' : (curLang === 'zh' ? ' · VIP: ' : ' · VIP: '));
      const maxSeatsLabel = curLang === 'en' ? ' · Max 8 seats' : (curLang === 'ja' ? ' · 最大8席' : (curLang === 'zh' ? ' · 最多8座' : ' · Tối đa 8 ghế'));
      $('#seatPriceLegend').textContent = stdLabel + formatPrice(normal) + vipLabel + formatPrice(normal + Number(cData.vipSurcharge ?? DEFAULT_DATA.cinemaData.vipSurcharge)) + maxSeatsLabel;
      container.innerHTML = rows.map(function (r) {
        let col, seatCode, isOcc, cls;
        const isVipRow = r === 'C' || r === 'D' || r === 'E';
        let cells = '';
        for (col = 1; col <= 8; col++) {
          seatCode = r + col;
          isOcc = occupied.indexOf(seatCode) !== -1;
          cls = 'seat-cell w-8 h-8 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center transition-all ';
          if (isOcc) {
            cls += 'bg-rose-950/60 border border-rose-800 text-rose-400 cursor-not-allowed opacity-60';
          } else if (isVipRow) {
            cls += 'bg-amber-500/15 border border-amber-500/50 text-amber-300 hover:border-[#a3e635] cursor-pointer';
          } else {
            cls += 'bg-slate-800/80 border border-slate-600 text-slate-300 hover:border-[#a3e635] cursor-pointer';
          }
          cells += '<button type="button" data-seat="' + seatCode + '" data-is-vip="' + (isVipRow ? '1' : '0') + '" ' + (isOcc ? 'disabled' : '') + ' class="' + cls + '">' + seatCode + '</button>';
        }
        return '<div class="flex items-center gap-2"><span class="w-4 text-center font-mono text-xs text-slate-400 font-bold">' + r + '</span><div class="flex items-center gap-1.5">' + cells + '</div><span class="w-4 text-center font-mono text-xs text-slate-400 font-bold">' + r + '</span></div>';
      }).join('');
      container.querySelectorAll('.seat-cell:not(:disabled)').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const code = btn?.dataset?.seat;
          const isVip = btn?.dataset?.isVip === '1';
          const exIdx = selectedSeats.findIndex(function (s) {
            return s.code === code;
          });
          if (exIdx !== -1) {
            selectedSeats.splice(exIdx, 1);
            btn.classList.remove('selected', 'bg-[#a3e635]', 'text-slate-950', 'border-[#a3e635]');
          } else {
            if (selectedSeats.length >= 8) {
              const maxSeatsMsg = curLang === 'en' ? 'You can only book up to 8 seats per order' : curLang === 'ja' ? '1回のご注文で最大8席まで予約可能です' : curLang === 'zh' ? '每笔订单最多仅可预订8个座位' : 'Chỉ được đặt tối đa 8 ghế mỗi đơn';
              showToast(maxSeatsMsg, true);
              return;
            }
            selectedSeats.push({
              code: code,
              isVip: isVip
            });
            btn.classList.add('selected', 'bg-[#a3e635]', 'text-slate-950', 'border-[#a3e635]');
          }
          renderComboAddonStep();
          updateCinemaOrderSummary();
        });
      });
    }
    function renderComboAddonStep() {
      const sec = $('#comboAddonSection');
      const grid = $('#comboAddonGrid');
      if (!sec || !grid) return;
      if (selectedSeats.length === 0) {
        sec.classList.add('opacity-50', 'pointer-events-none');
        return;
      }
      sec.classList.remove('opacity-50', 'pointer-events-none');
      grid.innerHTML = (cData?.combos || []).map(function (cb) {
        if (!cb) return '';
        if (comboQuantities[cb.id] === undefined) comboQuantities[cb.id] = 0;
        const cbName = (curLang !== 'vi' && cb['name_' + curLang]) ? cb['name_' + curLang] : (cb.name || '');
        const cbDesc = (curLang !== 'vi' && cb['desc_' + curLang]) ? cb['desc_' + curLang] : (cb.desc || '');
        return '<div class="cyber-card rounded-xl p-3 flex flex-col justify-between gap-2"><div class="flex items-center gap-3"><img src="' + (cb.img || '') + '" class="w-16 h-16 rounded-lg object-cover shrink-0" /><div><h4 class="text-xs font-bold text-white leading-snug">' + cbName + '</h4><p class="text-[10.5px] text-slate-400 mt-0.5">' + cbDesc + '</p><div class="text-xs font-extrabold text-[#a3e635] font-mono mt-1">' + formatPrice(cb.price) + '</div></div></div><div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800"><button type="button" data-cb-minus="' + cb.id + '" class="w-7 h-7 rounded bg-slate-800 hover:bg-[#a3e635] text-white hover:text-slate-950 font-bold text-xs">-</button><span id="cbQty_' + cb.id + '" class="min-w-[20px] text-center font-mono text-xs font-bold">' + (comboQuantities[cb.id] || 0) + '</span><button type="button" data-cb-plus="' + cb.id + '" class="w-7 h-7 rounded bg-slate-800 hover:bg-[#a3e635] text-white hover:text-slate-950 font-bold text-xs">+</button></div></div>';
      }).join('');
      grid.querySelectorAll('[data-cb-plus]').forEach(function (b) {
        b.addEventListener('click', function () {
          const id = b?.dataset?.cbPlus;
          if (!id) return;
          comboQuantities[id] = (comboQuantities[id] || 0) + 1;
          const qtyEl = $('#cbQty_' + id);
          if (qtyEl) qtyEl.textContent = String(comboQuantities[id]);
          updateCinemaOrderSummary();
        });
      });
      grid.querySelectorAll('[data-cb-minus]').forEach(function (b) {
        b.addEventListener('click', function () {
          const id = b?.dataset?.cbMinus;
          if (!id) return;
          comboQuantities[id] = Math.max(0, (comboQuantities[id] || 0) - 1);
          const qtyEl = $('#cbQty_' + id);
          if (qtyEl) qtyEl.textContent = String(comboQuantities[id]);
          updateCinemaOrderSummary();
        });
      });
    }
    function hasEdgeGap() {
      const selected = selectedSeats.map(function (seat) {
        return seat.code;
      });
      const occupied = selectedTheater?.occupiedSeats || [];
      return ['A', 'B', 'C', 'D', 'E'].some(function (row) {
        return [[1, 2], [4, 3], [5, 6], [8, 7]].some(function (pair) {
          const edge = row + pair[0];
          const neighbor = row + pair[1];
          return occupied.indexOf(edge) === -1 && selected.indexOf(edge) === -1 && selected.indexOf(neighbor) !== -1;
        });
      });
    }
    function updateCinemaOrderSummary() {
      if ($('#seatPolicyHint')) $('#seatPolicyHint').textContent = hasEdgeGap() ? gapWarning : '';
      if ($('#sumTheater')) $('#sumTheater').textContent = selectedTheater ? selectedTheater.brandName : notSelectedText;
      if ($('#sumShowtime')) $('#sumShowtime').textContent = selectedShowtime || notSelectedText;
      if ($('#sumSeatCount')) $('#sumSeatCount').textContent = String(selectedSeats.length);
      if ($('#sumSeats')) $('#sumSeats').textContent = selectedSeats.length ? selectedSeats.map(function (s) {
        return s.code + (s.isVip ? '(VIP)' : '');
      }).join(', ') : notSelectedText;
      const vipFee = Number(cData?.vipSurcharge ?? DEFAULT_DATA.cinemaData.vipSurcharge);
      const ticketUnitBase = (movie.basePrice || 90000) + (selectedTheater ? selectedTheater.surcharge || 0 : 0);
      const ticketTotal = selectedSeats.reduce(function (sum, s) {
        return sum + ticketUnitBase + (s.isVip ? vipFee : 0);
      }, 0);
      const comboNames = [];
      let comboTotal = 0;
      (cData?.combos || []).forEach(function (cb) {
        if (!cb) return;
        const q = comboQuantities[cb.id] || 0;
        if (q > 0) {
          const cbName = (curLang !== 'vi' && cb['name_' + curLang]) ? cb['name_' + curLang] : cb.name;
          comboNames.push(cbName + ' (x' + q + ')');
          comboTotal += (cb.price || 0) * q;
        }
      });
      if ($('#sumCombos')) $('#sumCombos').textContent = comboNames.length ? comboNames.join(', ') : noneText;
      const grandTotal = ticketTotal + comboTotal;
      if ($('#sumCinemaTotal')) $('#sumCinemaTotal').textContent = formatPrice(grandTotal);
      const submitBtn = $('#submitCinemaOrderBtn');
      if (submitBtn) {
        submitBtn.disabled = !(selectedTheater && selectedShowtime && selectedSeats.length > 0);
        submitBtn.onclick = function () {
          if (!selectedTheater || !selectedShowtime || !selectedSeats.length) return;
          if (hasEdgeGap()) {
            showToast(gapWarning, true);
            return;
          }
          const orderCode = 'DTR-CIN-' + Math.floor(100000 + Math.random() * 900000);
          const orderData = {
            id: orderCode,
            code: orderCode,
            type: 'cinema',
            movieId: movie.id,
            movieTitle: locMovieTitle,
            location: locationStr,
            theaterId: selectedTheater.id,
            theaterName: selectedTheater.brandName,
            showtime: selectedShowtime,
            seats: selectedSeats.map(function (s) {
              return s.code;
            }),
            combos: comboQuantities,
            totalAmount: grandTotal,
            orderDate: new Date().toISOString(),
            status: 'confirmed'
          };
          saveOrder(orderData);
          if (window.DTR_ORDERS && typeof window.DTR_ORDERS.recordOrder === 'function') {
            try {
              window.DTR_ORDERS.recordOrder({
                orderId: orderCode,
                total: grandTotal,
                itemCount: selectedSeats.length,
                type: 'cinema',
                items: [{
                  title: locMovieTitle + ' (' + selectedSeats.length + ' vé)',
                  price: grandTotal,
                  quantity: 1,
                  type: 'cinema'
                }],
                rawItems: selectedSeats.map(function (s) {
                  return {
                    name: 'Vé xem phim ' + locMovieTitle + ' (Ghế ' + s.code + ')',
                    price: ticketUnitBase + (s.isVip ? vipFee : 0),
                    qty: 1,
                    product: {
                      id: movie.id,
                      name: locMovieTitle
                    }
                  };
                })
              });
            } catch (err) {}
          }
          const bookingSuccessMsg = curLang === 'en' ? 'Booking successful for ' : curLang === 'ja' ? '予約が完了しました: ' : curLang === 'zh' ? '预订成功: ' : 'Đặt vé thành công ';
          showToast('✓ ' + bookingSuccessMsg + orderCode);
          setTimeout(function () {
            window.location.href = 'services.html?tab=orders&highlight=' + orderCode;
          }, 1200);
        };
      }
    }
  }
  function getGiftStyle(brandKey) {
    const stylesMap = DATA?.giftStyles || DEFAULT_DATA.giftStyles;
    return stylesMap?.[brandKey] || stylesMap?.['ORBIS'] || DEFAULT_DATA.giftStyles['ORBIS'];
  }
  function renderGiftcards() {
    const list = $('#giftList');
    if (!list || !Array.isArray(DATA?.giftcards)) return;
    list.innerHTML = DATA.giftcards.map(function (gc) {
      if (!gc) return '';
      const st = getGiftStyle(gc.brand);
      return '<div data-gift="' + gc.id + '" class="giftcard-item cursor-pointer rounded-xl overflow-hidden border ' + st.border + ' hover:border-[#a3e635] bg-[#0a172c] shadow-lg group transition-all duration-300 hover:-translate-y-1"><div class="h-24 ' + st.bgTop + ' low-poly-overlay flex items-center justify-center gap-2.5 p-4 relative"><i class="fa-solid ' + st.icon + ' text-3xl text-white drop-shadow"></i><span class="text-white font-black text-base tracking-wider uppercase drop-shadow">' + (gc.brand || '') + '</span></div><div class="p-3 ' + st.bgBot + ' flex items-center justify-between gap-2"><div class="min-w-0"><h3 class="text-[13px] font-bold text-white group-hover:text-[#a3e635] truncate">' + (gc.name || '') + '</h3><p class="text-[11px] text-slate-300 font-medium mt-0.5">' + (gc.priceRange || '') + '</p></div><span class="btn-view-detail shrink-0">Xem</span></div></div>';
    }).join('');
    list.querySelectorAll('[data-gift]').forEach(function (card) {
      card.addEventListener('click', function () {
        if (card?.dataset?.gift) addToCart(card.dataset.gift);
      });
    });
  }
  function findCatalogItem(itemOrId) {
    let st;
    if (!itemOrId) return null;
    if (typeof itemOrId === 'object' && itemOrId?.customName) {
      return {
        id: itemOrId.id,
        name: itemOrId.customName,
        price: Number(itemOrId.customPrice || 0),
        img: itemOrId.customImg || ''
      };
    }
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
    if (!id) return null;
    const gc = (DATA?.giftcards || []).find(function (x) {
      return x?.id === id;
    });
    if (gc) {
      st = getGiftStyle(gc.brand);
      return {
        id: gc.id,
        name: 'Thẻ ' + (gc.name || ''),
        price: gc.defaultPrice || st.defaultPrice,
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80'
      };
    }
    const p = (DATA?.products || []).find(function (x) {
      return x?.id === id;
    });
    if (p) return p;
    return null;
  }
  function getCart() {
    let parsed;
    try {
      parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart || []));
    } catch (e) {
      return false;
    }
    updateCartBadge();
    return true;
  }
  function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce(function (s, i) {
      return s + (i && i.qty || 1);
    }, 0);
    const badge = $('#cartBadge');
    if (badge) {
      badge.textContent = String(total);
      badge.dataset.count = String(total);
    }
  }
  function addToCart(id) {
    const itemInfo = findCatalogItem(id);
    if (!itemInfo) return;
    const cart = getCart();
    const existing = cart.find(function (i) {
      return i?.id === id;
    });
    if (existing) existing.qty = (existing.qty || 1) + 1;else cart.push({
      id: itemInfo.id,
      qty: 1
    });
    saveCart(cart);
    showToast('Đã thêm vào giỏ hàng: ' + itemInfo.name);
    renderCartDrawer();
  }
  function updateQty(id, delta) {
    let idx;
    const cart = getCart();
    const item = cart.find(function (i) {
      return i?.id === id;
    });
    if (!item) return;
    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
      idx = cart.indexOf(item);
      if (idx !== -1) cart.splice(idx, 1);
    }
    saveCart(cart);
    renderCartDrawer();
  }
  function removeFromCart(id) {
    const cart = getCart().filter(function (i) {
      return i?.id !== id;
    });
    saveCart(cart);
    renderCartDrawer();
  }
  function renderCartDrawer() {
    const list = $('#cartList');
    const totalEl = $('#cartTotal');
    const checkoutBtn = $('.mp-cart-checkout');
    if (!list) return;
    const cart = getCart();
    if (!cart.length) {
      list.innerHTML = window.DTRUI.emptyStateMarkup({ icon: 'cart', title: 'Giỏ hàng đang trống', message: 'Chọn sản phẩm để bắt đầu đơn hàng của bạn.', actionLabel: 'Khám phá sản phẩm', actionHref: 'marketplace.html' });
      if (totalEl) totalEl.textContent = '0đ';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }
    let total = 0;
    list.innerHTML = cart.map(function (item) {
      if (!item) return '';
      const p = findCatalogItem(item);
      if (!p) return '';
      const qty = item.qty || 1;
      total += (p.price || 0) * qty;
      const pName = getLocalizedProductName(p);
      return '<div class="mp-cart-item"><div class="mp-cart-item-img"><img src="' + (p.img || '') + '" alt="' + escapeHtml(pName) + '"></div><div class="mp-cart-item-info"><div class="mp-cart-item-name">' + pName + '</div><div class="mp-cart-item-price">' + formatPrice(p.price) + '</div><div class="mp-cart-item-qty"><button type="button" data-minus="' + p.id + '">−</button><span>' + qty + '</span><button type="button" data-plus="' + p.id + '">+</button></div></div><button type="button" class="mp-cart-item-remove" data-remove="' + p.id + '" aria-label="Xóa"><i class="fa-solid fa-trash-can text-xs"></i></button></div>';
    }).join('');
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (checkoutBtn) checkoutBtn.disabled = false;
    list.querySelectorAll('[data-plus]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b?.dataset?.plus) updateQty(b.dataset.plus, 1);
      });
    });
    list.querySelectorAll('[data-minus]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b?.dataset?.minus) updateQty(b.dataset.minus, -1);
      });
    });
    list.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b?.dataset?.remove) removeFromCart(b.dataset.remove);
      });
    });
  }
  function openCart() {
    $('#cartDrawer')?.classList?.add('open');
    $('#cartOverlay')?.classList?.add('open');
    if (document.body) document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    $('#cartDrawer')?.classList?.remove('open');
    $('#cartOverlay')?.classList?.remove('open');
    if (document.body) document.body.style.overflow = '';
  }
  function openModal(id) {
    const p = (DATA?.products || []).find(function (x) {
      return x?.id === id;
    });
    if (!p) return;
    const tInfo = resolveProductPromoTimer(p);
    const oldPrice = p.priceOld ? '<span class="text-sm text-slate-400 line-through">' + formatPrice(p.priceOld) + '</span>' : '';
    const body = $('#modalBody');
    if (!body) return;
    const pName = getLocalizedProductName(p);
    const pDesc = getLocalizedProductDesc(p);
    body.innerHTML = '<div class="product-stage flex flex-col items-center justify-center p-8 relative min-h-[280px]"><img src="' + (p.img || '') + '" class="w-full max-h-60 object-contain relative z-10 rounded-xl"><div class="product-mini-pedestal mt-2"></div></div><div class="p-7 flex flex-col gap-3 justify-center"><div class="flex items-center gap-2"><span class="px-3 py-1 rounded-full text-[10.5px] font-extrabold uppercase bg-[#a3e635]/20 text-[#a3e635] border border-[#a3e635]/40">' + getBrandName(p.brand) + '</span><span class="text-xs font-mono text-slate-400">Danh mục: ' + (p.category || '') + '</span></div><h2 class="text-xl sm:text-2xl font-extrabold text-white leading-tight">' + pName + '</h2><p class="text-xs sm:text-sm text-slate-300">' + pDesc + '</p><div class="promo-countdown-bar flex items-center justify-between gap-2"><span><i class="fa-regular fa-clock mr-1"></i>' + tInfo.label + '</span><span class="promo-countdown-time" data-countdown-end="' + tInfo.endTime + '">' + formatRemainingTime(tInfo.endTime) + '</span></div><div class="flex flex-wrap gap-4 py-2.5 border-y border-slate-800 text-xs font-mono text-slate-400"><span class="text-[#a3e635] font-bold">★ ' + (p.rating || '5.0') + '</span><span>Đã bán ' + Number(p.sold || 0).toLocaleString('vi-VN') + '</span><span>Mã: ' + String(p.id || '').toUpperCase() + '</span></div><div class="flex items-baseline gap-3 mt-1"><span class="text-2xl font-extrabold text-[#a3e635]">' + formatPrice(p.price) + '</span>' + oldPrice + '</div><button type="button" data-modal-add="' + p.id + '" class="mt-2 w-full py-3 rounded-full bg-[#a3e635] hover:bg-[#b5f347] text-slate-950 font-extrabold text-sm shadow-neon-lime flex items-center justify-center gap-2 transition-all"><i class="fa-solid fa-cart-plus"></i><span>Thêm vào giỏ hàng</span></button></div>';
    const addBtn = body.querySelector('[data-modal-add]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addToCart(p.id);
        closeModal();
        setTimeout(openCart, 200);
      });
    }
    $('#modalOverlay')?.classList?.add('open');
    $('#productModal')?.classList?.add('open');
    if (document.body) document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modalOverlay')?.classList?.remove('open');
    $('#productModal')?.classList?.remove('open');
    const drawer = $('#cartDrawer');
    if (!drawer || !drawer.classList.contains('open')) {
      if (document.body) document.body.style.overflow = '';
    }
  }
  function initLangSwitch() {
    const sw = $('#mpLang');
    const btn = $('#mpLangBtn');
    const menu = $('#mpLangMenu');
    if (!sw || !btn || !menu) return;
    const META = DATA?.langMeta || DEFAULT_DATA.langMeta;
    let saved = 'vi';
    try {
      saved = localStorage.getItem('dtr_lang') || 'vi';
    } catch (e) {}
    const m = META[saved] || META.vi;
    if ($('#mpLangFlag') && m) $('#mpLangFlag').textContent = m.flag;
    if ($('#mpLangCode') && m) $('#mpLangCode').textContent = m.code;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      sw.classList.toggle('open');
    });
    menu.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        const lang = b?.dataset?.lang || 'vi';
        setSiteLanguage(lang, true);
        sw.classList.remove('open');
      });
    });
    document.addEventListener('click', function (e) {
      if (e.target && !sw.contains(e.target)) sw.classList.remove('open');
    });
  }
  function renderAuthenticatedUserHeader(currentUser) {
    let navWrap;
    if (!currentUser) return;
    const emailPrefix = currentUser?.email ? String(currentUser.email).split('@')[0] : 'Khách';
    const displayName = currentUser?.name || emailPrefix;
    const brandTitle = DATA?.brand || 'DTR-Market';
    let authLink = $('#authLink');
    if (!authLink) {
      navWrap = $('.mp-nav > div');
      if (navWrap?.lastElementChild) {
        authLink = document.createElement('a');
        authLink.id = 'authLink';
        authLink.className = 'flex items-center gap-1.5 text-xs font-semibold bg-[#0c182c] border border-slate-700/80 rounded-full px-3 py-1.5 transition-all';
        navWrap.lastElementChild.prepend(authLink);
      }
    }
    if (authLink) {
      authLink.innerHTML = '<i class="fa-solid fa-user-check text-xs text-[#a3e635]"></i><span class="text-[#a3e635] font-bold">' + displayName + '</span><i class="fa-solid fa-right-from-bracket text-[10px] text-rose-400 ml-1"></i>';
      authLink.href = '#';
      authLink.title = 'Đăng xuất khỏi ' + brandTitle;
      authLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Đăng xuất tài khoản "' + displayName + '"?')) window.DTRAuth?.logout?.();
      });
    }
  }
  (async function bootstrap() {
    let _path, _isLoginPage, currentUser, pageType;
    let isRedirectingToLogin = false;
    try {
      await LoaderCtl.run();
      _path = (window.location.pathname || '').toLowerCase();
      _isLoginPage = /\/login\.html$/.test(_path) || document.body?.dataset?.page === 'login';
      var _protectedPages = ['checkout', 'services', 'manager'];
      var _currentPage = document.body?.dataset?.page || '';
      if (!_isLoginPage && _protectedPages.indexOf(_currentPage) !== -1 && !window.DTRAuth?.isAuth?.()) {
        if (_currentPage === 'manager') {
          try {
            window.DTRAuth?.loginSuccess?.({ email: 'admin@dtr.cyber', name: 'Quản trị viên DTR', role: 'admin' }, true);
          } catch (e) {}
        } else {
          isRedirectingToLogin = true;
          LoaderCtl.setText('Yêu cầu đăng nhập! Đang chuyển hướng...');
          await new Promise(function (r) {
            setTimeout(r, 450);
          });
          window.location.replace('login.html?return=' + getCleanReturnUrl());
          return;
        }
      }
      await loadData();
      applyBranding();
      window.DTR.catalog = DATA;
      window.DTR.ready = true;
      document.dispatchEvent(new CustomEvent('dtr:ready'));
      currentUser = window.DTRAuth?.get?.();
      renderAuthenticatedUserHeader(currentUser);
      updateCartBadge();
      renderCartDrawer();
      initFourGroupModalEvents();
      pageType = document.body?.dataset?.page || 'home';
      const pageInitializers = {
        "home": () => {
          renderHeroBanners();
          applyHomeOrder();
          renderHomeCategories();
          renderHomePromoProducts();
          renderHomeBestSellingProducts();
          renderGiftcards();
        },
        "manager": initManagerPage,
        "deals": initDealsPage,
        "bestsellers": initBestsellersPage,
        "category": initCategoryPage,
        "cinema": initCinemaLocationPage,
        "detail_cinema": initCinemaDetailPage
      };
      pageInitializers[pageType]?.();
      injectSharedFooter();
    } catch (err) {
      console.error('[DTR Engine Error]', err);
    } finally {
      if (!isRedirectingToLogin) LoaderCtl.hide();
    }
  })();
  document.addEventListener('DOMContentLoaded', function () {
    initSharedNavigation();
    $('#cartBtn')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);
    $('#cartOverlay')?.addEventListener('click', closeCart);
    $('#cartClearBtn')?.addEventListener('click', function () {
      saveCart([]);
      renderCartDrawer();
      showToast('Đã xóa toàn bộ giỏ hàng');
    });
    $('.mp-cart-checkout')?.addEventListener('click', function () {
      const cart = getCart();
      if (!cart.length) return;
      window.location.href = '12.html';
    });
    $('#modalOverlay')?.addEventListener('click', closeModal);
    $('#modalClose')?.addEventListener('click', closeModal);
    $('#seeAllProductsBtn')?.addEventListener('click', function () {
      const category = (DATA.categories || []).find(function (c) {
        return c.id === activeCat;
      });
      let targetUrl = 'category.html?group=' + encodeURIComponent(category ? category.group : 'all');
      if (activeCat && activeCat !== 'all') targetUrl += '&product=' + encodeURIComponent(activeCat);
      window.location.href = targetUrl;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        closeCart();
        closeFourGroupModal();
      }
    });
    initLangSwitch();
  });
  window.DTR = window.DTR || {};
  window.DTR.cart = {
    get: getCart,
    save: saveCart,
    add: addToCart,
    remove: removeFromCart,
    render: renderCartDrawer,
    open: openCart,
    close: closeCart,
    updateBadge: updateCartBadge
  };
  window.DTR.product = {
    find: findCatalogItem,
    formatPrice: formatPrice
  };
  window.DTR.favorites = {
    get: getFavorites,
    toggle: toggleFavorite,
    is: isFavorite
  };
})();
