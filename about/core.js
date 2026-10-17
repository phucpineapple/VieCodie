(function () {
  'use strict';
  const DEFAULT_DICTS = {"vi":{"loader.text":"Đang tải","nav.store":"Cửa hàng","nav.manager":"Quản lý","fab.storeDesc":"Mua sắm và đặt vé","nav.categories":"Danh mục sản phẩm","nav.orders":"Đơn hàng","nav.platform":"Nền tảng","nav.journey":"Hành trình","nav.features":"Dịch vụ","nav.network":"Mạng lưới","nav.support":"Hỗ trợ","mnav.home":"Home","mnav.services":"Dịch vụ","mnav.network":"Mạng","mnav.track":"Đơn hàng","mnav.cart":"Giỏ","fab.tag":"Truy cập nhanh","fab.title":"Chọn chức năng","fab.lang":"Ngôn ngữ","fab.nav.platform":"Trang chủ DTR—Mart","fab.nav.journey":"Câu chuyện doanh nghiệp","fab.nav.features":"Hệ sinh thái giải pháp","fab.nav.network":"Mạng lưới toàn cầu","fab.nav.support":"Tra cứu đơn hàng","fab.nav.partner":"Đại lý","fab.nav.partner.desc":"Trở thành đại lý","hero.live":"TRỰC TIẾP","hero.countries":"50+ QUỐC GIA","hero.partners":"12K+ ĐỐI TÁC","hero.title.1":"Thương mại","hero.title.2":"không biên giới,","hero.title.3":"vận hành","hero.title.4":"bằng dữ liệu.","hero.desc":"Nền tảng thương mại số kết nối <strong>50+ quốc gia</strong> với hơn <strong>38.000 sản phẩm kỹ thuật số</strong> trong một hệ sinh thái liền mạch. Minh bạch. Nhanh. Đáng tin cậy.","hero.cta":"Nền tảng mua sắm","marquee.1":"Digital Tech Resolution","marquee.2":"50+ <em>quốc gia</em> hoạt động","marquee.3":"38K+ <em>sản phẩm số</em>","marquee.4":"12K+ <em>đối tác</em> toàn cầu","marquee.5":"Uptime <em>99%</em>","marquee.6":"AI định tuyến thông minh","brand.01.word":"<em>Digital</em> — Số hoá toàn diện","brand.01.desc":"Chuyển đổi hạ tầng thương mại truyền thống sang nền tảng số vận hành theo thời gian thực.","brand.02.word":"<em>Tech</em> — Công nghệ dẫn dắt","brand.02.desc":"API mở, AI định tuyến, hạ tầng cloud đa vùng phủ khắp 5 châu lục.","brand.03.word":"<em>Resolution</em> — Giải pháp trọn vẹn","brand.03.desc":"Từ thanh toán, logistics đến phân tích — một đầu mối, một hệ sinh thái.","journey.tag":"Hành trình doanh nghiệp","journey.title":"Từ một ý tưởng <span class=\"it\">đến hạ tầng toàn cầu</span>.","journey.sub":"Mỗi cột mốc là một bước tiến — từ ngày đầu thành lập tại Việt Nam đến hệ sinh thái thương mại số phủ khắp 50+ quốc gia.","tl.2018.tag":"Khởi đầu","tl.2018.title":"DTR ra đời tại <em>Hà Nội</em>","tl.2018.desc":"Đội ngũ 6 kỹ sư khởi tạo nền tảng thương mại số đầu tiên — tầm nhìn \"Digital Tech Resolution\" bắt đầu từ một căn phòng nhỏ.","tl.2020.tag":"Vươn xa","tl.2020.title":"Phủ <em>Đông Nam Á</em>","tl.2020.desc":"Mở rộng sang Singapore, Thái Lan, Malaysia. Ra mắt hệ thống logistics DTR SkyFreight với 120 tuyến vận chuyển.","tl.2022.tag":"Bùng nổ","tl.2022.title":"Cột mốc <em>10.000 đối tác</em>","tl.2022.desc":"Nền tảng API mở đạt 10.000 doanh nghiệp tích hợp. Tổng giá trị giao dịch vượt 1 tỷ USD mỗi năm.","tl.2024.tag":"Đổi mới","tl.2024.title":"AI định tuyến <em>thông minh</em>","tl.2024.desc":"Ra mắt động cơ AI DTR-Resolve: tối ưu tuyến vận chuyển, giảm 42% phát thải CO₂, dự đoán nhu cầu theo thời gian thực.","tl.2026.tag":"Hiện tại","tl.2026.title":"Hạ tầng <em>50+ quốc gia</em>","tl.2026.desc":"12.000 đối tác toàn cầu, 38.000 sản phẩm số, uptime 99%. DTR trở thành hạ tầng thương mại số cho thế hệ doanh nghiệp mới.","features.tag":"Dịch vụ nổi bật","features.title":"Một hệ sinh thái — <span class=\"it\">vạn giải pháp</span>.","features.sub":"Mọi thành phần của thương mại số được tích hợp trong một nền tảng duy nhất — từ vận chuyển, thanh toán, phân tích đến bảo mật.","features.f1.title":"Logistics thông minh","features.f1.desc":"DTR SkyFreight vận hành 120+ tuyến quốc tế, AI tối ưu hành trình và giảm phát thải tới 42%.","features.f2.title":"Thanh toán đa tiền tệ","features.f2.desc":"Hỗ trợ 30+ loại tiền, cổng thanh toán tích hợp một API duy nhất, tỷ giá minh bạch theo thời gian thực.","features.f3.title":"Phân tích dữ liệu","features.f3.desc":"Dashboard real-time, dự đoán nhu cầu bằng AI, báo cáo chuyên sâu đa chiều theo khu vực và ngành.","features.f4.title":"API mở & SDK","features.f4.desc":"RESTful API, webhook, SDK cho 8 ngôn ngữ. Tích hợp chỉ trong 5 phút với tài liệu đầy đủ.","features.f5.title":"Bảo mật chuẩn quốc tế","features.f5.desc":"Chứng nhận ISO 27001, PCI-DSS Level 1, mã hoá end-to-end, tuân thủ GDPR và các quy định khu vực.","features.f6.title":"Hỗ trợ 24/7","features.f6.desc":"Đội ngũ chuyên gia đa ngôn ngữ, SLA cam kết phản hồi dưới 15 phút, hỗ trợ qua chat, email, hotline.","cta.title":"Sẵn sàng mở rộng <em>biên giới thương mại</em> của bạn?","cta.sub":"Tư vấn miễn phí 1-1 với chuyên gia DTR. Triển khai chỉ trong 7 ngày, không phí ẩn.","cta.btn1":"Đặt lịch tư vấn","cta.btn2":"Xem tài liệu","partner.eyebrow":"Cơ hội hợp tác","partner.title":"Khởi Sức Kinh Doanh Số —<br><span class=\"cream\">Trở Thành</span> <em>Chuyên Gia Công Nghệ</em> Dẫn Đầu Thị Trường","partner.desc":"Trở thành đại lý chính thức của DTR—Mart. Nhận hệ thống vận hành, đào tạo chuyên sâu, hỗ trợ marketing và nguồn hàng số hoá toàn cầu — tất cả trong một gói duy nhất.","partner.btn":"Trở thành đại lý","partner.btn2":"Tìm hiểu thêm","partner.note":"Đang tuyển đại lý toàn quốc — 2026","partner.float.1":"doanh thu năm đầu","partner.float.2":"kích hoạt tài khoản","partner.float.2.time":"5 phút","globe.title":"Kết nối <span class=\"it\">thương mại toàn cầu</span>.","globe.stat.countries":"Quốc gia hoạt động","globe.stat.products":"Sản phẩm số","globe.stat.partners":"Đối tác toàn cầu","globe.stat.uptime":"Uptime hệ thống","live.users":"người dùng trực tuyến","live.txn":"giao dịch/giây","live.countries":"quốc gia hoạt động","skywatch.title":"Tra cứu <span class=\"it\">đơn hàng của bạn</span>.","skywatch.subtitle":"Theo dõi hành trình đơn hàng của bạn trên bản đồ thời gian thực — chọn chuyến bay hoặc tạo đơn hàng mới để xem cách hệ thống tự xử lý sự cố.","footer.desc":"Nền tảng thương mại số toàn cầu — kết nối doanh nghiệp với 50+ quốc gia bằng công nghệ và dữ liệu.","footer.col.platform":"Nền tảng","footer.col.company":"Công ty","footer.col.support":"Hỗ trợ","footer.col.newsletter":"Bản tin","footer.link.features":"Dịch vụ","footer.link.network":"Mạng lưới","footer.link.track":"Tra cứu đơn","footer.link.api":"API & SDK","footer.link.pricing":"Bảng giá","footer.link.about":"Về DTR","footer.link.journey":"Hành trình","footer.link.partner":"Trở thành đại lý","footer.link.careers":"Tuyển dụng","footer.link.contact":"Liên hệ","footer.link.help":"Trung tâm trợ giúp","footer.link.docs":"Tài liệu","footer.link.status":"Trạng thái hệ thống","footer.link.security":"Bảo mật","footer.link.privacy":"Quyền riêng tư","footer.news.desc":"Nhận tin tức về thương mại số, cập nhật nền tảng và ưu đãi độc quyền.","footer.news.placeholder":"email@dtr-mart.com","footer.news.btn":"Đăng ký","footer.copy":"Digital Tech Resolution — Made with precision in Vietnam.","footer.legal.terms":"Điều khoản","footer.legal.privacy":"Quyền riêng tư","footer.legal.cookies":"Cookies","footer.legal.sitemap":"Sitemap","footer.status.badge":"All systems operational","country.US":"Hoa Kỳ","country.CN":"Trung Quốc","country.GB":"Anh Quốc","country.DE":"Đức","country.JP":"Nhật Bản","country.KR":"Hàn Quốc","country.IN":"Ấn Độ","country.AU":"Úc","country.SG":"Singapore","country.VN":"Việt Nam","country.BR":"Brazil","country.ZA":"Nam Phi","country.RU":"Nga","country.AR":"Argentina","brand.name":"DTR—Mart","brand.tag":"Digital Tech Resolution","seo.title":"DTR—Mart | Digital Tech Resolution — Nền tảng thương mại số toàn cầu","seo.description":"DTR—Mart — Digital Tech Resolution. Nền tảng thương mại số kết nối 50+ quốc gia, vận hành bằng dữ liệu. Hành trình, dịch vụ và hệ sinh thái toàn cầu.","skywatch.placeholder":"Nhập mã tracking (VD: DTR-TRL-9821-VN)","skywatch.btn":"Tra cứu đơn hàng","skywatch.empty":"Nhập mã tracking của bạn để xem trạng thái đơn hàng.","skywatch.noresult":"Không tìm thấy đơn hàng cho mã","skywatch.hint":"Vui lòng kiểm tra lại mã. Định dạng: DTR-TRK-XXXX-XX","ship.departed":"Khởi hành","ship.in_transit":"Đang vận chuyển","ship.customs":"Hải quan","ship.eco_corridor":"Hành lang sinh thái","ship.arrived":"Đã đến","ship.delivered":"Đã giao","track.liveBtn":"Xem demo theo dõi trực tiếp","track.liveDesc":"Bản xem trước theo thời gian thực","ship.fleet.skyfreight":"DTR SkyFreight","ship.cargo.electronics":"Thiết bị điện tử","ship.cargo.pharma":"Dược phẩm","ship.airport.HAN":"Sân bay Nội Bài (HAN)","ship.airport.SIN":"Singapore (SIN)","ship.airport.NRT":"Tokyo Narita (NRT)","ship.region.SCS":"Biển Đông","ship.region.SEA_ECO":"Hành lang sinh thái Đông Nam Á","ship.region.GOT":"Vịnh Thái Lan","ship.region.PAC_ECO":"Hành lang sinh thái Thái Bình Dương","ship.note.loaded_ontime":"Đã bốc hàng, khởi hành đúng lịch trình.","ship.note.fl380_normal":"Hành trình ở FL380, telemetry bình thường.","ship.note.eco_route_42":"Định tuyến qua hành lang ít phát thải (−42% CO₂).","ship.note.approach_sin":"Đang tiến vào không phận Singapore.","ship.note.temp_verified":"Hàng kiểm soát nhiệt độ đã xác minh.","ship.note.eco_route_pac":"Định tuyến qua hành lang ít phát thải.","ship.note.docs_verified":"Đang thông quan — chứng từ đã xác minh.","faq.title":"Câu hỏi <span class=\"it\">thường gặp</span>.","faq.sub":"Mọi điều bạn cần biết trước khi bắt đầu.","faq.q1":"Giá cả thế nào?","faq.a1":"Tư vấn miễn phí. Triển khai chỉ trong 7 ngày, không phí ẩn.","faq.q2":"Mất bao lâu để triển khai?","faq.a2":"Triển khai chuẩn trong 7 ngày, kích hoạt tài khoản chỉ trong 5 phút.","faq.q3":"Bảo mật ra sao?","faq.a3":"Chứng nhận ISO 27001, PCI-DSS Level 1, mã hoá end-to-end, tuân thủ GDPR.","faq.q4":"Có API mở không?","faq.a4":"RESTful API, webhook, SDK cho 8 ngôn ngữ. Tích hợp chỉ trong 5 phút.","faq.q5":"Hỗ trợ thế nào?","faq.a5":"Đội ngũ đa ngôn ngữ 24/7, SLA phản hồi dưới 15 phút qua chat, email, hotline.","faq.q6":"Huỷ dịch vụ có dễ không?","faq.a6":"Huỷ bất cứ lúc nào, không phí phạt. Dữ liệu của bạn được xuất đầy đủ trước khi đóng.","faq.q7":"Tích hợp với hệ thống sẵn có?","faq.a7":"API mở và webhook kết nối mọi ERP/CRM phổ biến. Đội ngũ hỗ trợ tích hợp 1-1.","faq.q8":"Ai sở hữu dữ liệu?","faq.a8":"Bạn sở hữu 100% dữ liệu. Chúng tôi chỉ xử lý theo thoả thuận, không bán, không chia sẻ."},"en":{"loader.text":"Loading","nav.store":"Store","nav.manager":"Manager","fab.storeDesc":"Shop & Book Tickets","nav.categories":"Categories","nav.orders":"Orders","nav.platform":"Platform","nav.journey":"Journey","nav.features":"Services","nav.network":"Network","nav.support":"Support","mnav.home":"Home","mnav.services":"Services","mnav.network":"Network","mnav.track":"Track","mnav.cart":"Cart","fab.tag":"Quick access","fab.title":"Choose a function","fab.lang":"Language","fab.nav.platform":"DTR—Mart homepage","fab.nav.journey":"Company story","fab.nav.features":"Solution ecosystem","fab.nav.network":"Global network","fab.nav.support":"Track your order","fab.nav.partner":"Partner","fab.nav.partner.desc":"Become an agent","hero.live":"LIVE","hero.countries":"50+ COUNTRIES","hero.partners":"12K+ PARTNERS","hero.title.1":"Commerce","hero.title.2":"without borders,","hero.title.3":"operating","hero.title.4":"on data.","hero.desc":"A digital commerce platform connecting <strong>50+ countries</strong> with over <strong>38,000 digital products</strong> in one seamless ecosystem. Transparent. Fast. Reliable.","hero.cta":"Shopping Platform","marquee.1":"Digital Tech Resolution","marquee.2":"50+ <em>countries</em> active","marquee.3":"38K+ <em>digital products</em>","marquee.4":"12K+ <em>global partners</em>","marquee.5":"Uptime <em>99%</em>","marquee.6":"Smart AI routing","brand.01.word":"<em>Digital</em> — Full digitalization","brand.01.desc":"Transforming traditional commerce infrastructure into real-time digital platforms.","brand.02.word":"<em>Tech</em> — Technology-driven","brand.02.desc":"Open API, AI routing, multi-region cloud infrastructure spanning 5 continents.","brand.03.word":"<em>Resolution</em> — Complete solutions","brand.03.desc":"From payments and logistics to analytics — one hub, one ecosystem.","journey.tag":"Company Journey","journey.title":"From one idea <span class=\"it\">to global infrastructure</span>.","journey.sub":"Every milestone is a leap — from our first day in Vietnam to a digital commerce ecosystem across 50+ countries.","tl.2018.tag":"Beginning","tl.2018.title":"DTR was born in <em>Hanoi</em>","tl.2018.desc":"A team of 6 engineers created the first digital commerce platform — the \"Digital Tech Resolution\" vision started in a small room.","tl.2020.tag":"Expansion","tl.2020.title":"Covering <em>Southeast Asia</em>","tl.2020.desc":"Expanded to Singapore, Thailand, Malaysia. Launched DTR SkyFreight logistics with 120 shipping routes.","tl.2022.tag":"Breakthrough","tl.2022.title":"<em>10,000 partner</em> milestone","tl.2022.desc":"Open API platform reached 10,000 integrated businesses. Total transaction value exceeded $1B annually.","tl.2024.tag":"Innovation","tl.2024.title":"<em>Smart</em> AI routing","tl.2024.desc":"Launched DTR-Resolve AI engine: route optimization, 42% CO₂ reduction, real-time demand forecasting.","tl.2026.tag":"Present","tl.2026.title":"Infrastructure in <em>50+ countries</em>","tl.2026.desc":"12,000 global partners, 38,000 digital products, 99% uptime. DTR becomes digital commerce infrastructure for the new generation of businesses.","features.tag":"Featured Services","features.title":"One ecosystem — <span class=\"it\">endless solutions</span>.","features.sub":"Every layer of digital commerce integrated into a single platform — from shipping and payments to analytics and security.","features.f1.title":"Smart Logistics","features.f1.desc":"DTR SkyFreight operates 120+ international routes, AI-optimized and cutting emissions by up to 42%.","features.f2.title":"Multi-currency Payments","features.f2.desc":"Support for 30+ currencies, payment gateway via one API, transparent real-time exchange rates.","features.f3.title":"Data Analytics","features.f3.desc":"Real-time dashboards, AI demand forecasting, deep multi-dimensional reports by region and industry.","features.f4.title":"Open API & SDK","features.f4.desc":"RESTful API, webhooks, SDKs for 8 languages. Integrate in 5 minutes with full documentation.","features.f5.title":"International Security","features.f5.desc":"ISO 27001, PCI-DSS Level 1 certified, end-to-end encryption, GDPR and regional compliance.","features.f6.title":"24/7 Support","features.f6.desc":"Multilingual experts, SLA under 15 min response, support via chat, email, and hotline.","cta.title":"Ready to expand <em>your commerce borders</em>?","cta.sub":"Free 1-on-1 consultation with DTR experts. Deploy in 7 days, no hidden fees.","cta.btn1":"Book a consultation","cta.btn2":"View docs","partner.eyebrow":"Partnership opportunity","partner.title":"Digital Business Kickstart —<br><span class=\"cream\">Become</span> a <em>Leading Tech Expert</em> in the Market","partner.desc":"Become an official DTR—Mart agent. Get the operating system, deep training, marketing support, and access to globally digitized inventory — all in one package.","partner.btn":"Become an agent","partner.btn2":"Learn more","partner.note":"Now recruiting nationwide agents — 2026","partner.float.1":"first-year revenue","partner.float.2":"account activation","partner.float.2.time":"5 minutes","globe.title":"Connecting <span class=\"it\">global commerce</span>.","globe.stat.countries":"Active countries","globe.stat.products":"Digital products","globe.stat.partners":"Global partners","globe.stat.uptime":"System uptime","live.users":"users online","live.txn":"transactions/sec","live.countries":"active countries","skywatch.title":"Track <span class=\"it\">your order</span>.","skywatch.subtitle":"Track your order's journey on a real-time map — select a flight or create a new order to see how the system handles incidents automatically.","footer.desc":"A global digital commerce platform — connecting businesses with 50+ countries through tech and data.","footer.col.platform":"Platform","footer.col.company":"Company","footer.col.support":"Support","footer.col.newsletter":"Newsletter","footer.link.features":"Services","footer.link.network":"Network","footer.link.track":"Track order","footer.link.api":"API & SDK","footer.link.pricing":"Pricing","footer.link.about":"About DTR","footer.link.journey":"Journey","footer.link.partner":"Become an agent","footer.link.careers":"Careers","footer.link.contact":"Contact","footer.link.help":"Help Center","footer.link.docs":"Documentation","footer.link.status":"System status","footer.link.security":"Security","footer.link.privacy":"Privacy","footer.news.desc":"Get news on digital commerce, platform updates and exclusive offers.","footer.news.placeholder":"email@dtr-mart.com","footer.news.btn":"Subscribe","footer.copy":"Digital Tech Resolution — Made with precision in Vietnam.","footer.legal.terms":"Terms","footer.legal.privacy":"Privacy","footer.legal.cookies":"Cookies","footer.legal.sitemap":"Sitemap","footer.status.badge":"All systems operational","country.US":"United States","country.CN":"China","country.GB":"United Kingdom","country.DE":"Germany","country.JP":"Japan","country.KR":"South Korea","country.IN":"India","country.AU":"Australia","country.SG":"Singapore","country.VN":"Vietnam","country.BR":"Brazil","country.ZA":"South Africa","country.RU":"Russia","country.AR":"Argentina","brand.name":"DTR—Mart","brand.tag":"Digital Tech Resolution","seo.title":"DTR—Mart | Digital Tech Resolution — Global digital commerce platform","seo.description":"DTR—Mart — Digital Tech Resolution. A digital commerce platform connecting 50+ countries, run on data. Explore the journey, services and global ecosystem.","skywatch.placeholder":"Enter tracking code (e.g. DTR-TRL-9821-VN)","skywatch.btn":"Track order","skywatch.empty":"Enter your tracking code to view order status.","skywatch.noresult":"No order found for code","skywatch.hint":"Please check the code. Format: DTR-TRK-XXXX-XX","ship.departed":"Departed","ship.in_transit":"In transit","ship.customs":"Customs","ship.eco_corridor":"Eco corridor","ship.arrived":"Arrived","ship.delivered":"Delivered","track.liveBtn":"Watch live tracking demo","track.liveDesc":"Real-time preview","ship.fleet.skyfreight":"DTR SkyFreight","ship.cargo.electronics":"Electronics","ship.cargo.pharma":"Pharmaceuticals","ship.airport.HAN":"Noi Bai Airport (HAN)","ship.airport.SIN":"Singapore (SIN)","ship.airport.NRT":"Tokyo Narita (NRT)","ship.region.SCS":"South China Sea","ship.region.SEA_ECO":"Southeast Asia Eco Corridor","ship.region.GOT":"Gulf of Thailand","ship.region.PAC_ECO":"Pacific Eco Corridor","ship.note.loaded_ontime":"Loaded and departed on schedule.","ship.note.fl380_normal":"Cruising at FL380, telemetry nominal.","ship.note.eco_route_42":"Routed via a low-emission corridor (−42% CO₂).","ship.note.approach_sin":"Entering Singapore airspace.","ship.note.temp_verified":"Temperature-controlled cargo verified.","ship.note.eco_route_pac":"Routing via a low-emission corridor.","ship.note.docs_verified":"In customs — documents verified.","faq.title":"Frequently asked <span class=\"it\">questions</span>.","faq.sub":"Everything you need to know before getting started.","faq.q1":"How is pricing?","faq.a1":"Consultation is free. Deploy in 7 days, no hidden fees.","faq.q2":"How long does deployment take?","faq.a2":"Standard deployment in 7 days, account activation in just 5 minutes.","faq.q3":"How is security handled?","faq.a3":"ISO 27001 and PCI-DSS Level 1 certified, end-to-end encryption, GDPR compliant.","faq.q4":"Is there an open API?","faq.a4":"RESTful API, webhooks, SDKs for 8 languages. Integrate in 5 minutes.","faq.q5":"How do I get support?","faq.a5":"Multilingual team 24/7, SLA response under 15 minutes via chat, email and hotline.","faq.q6":"Is cancellation easy?","faq.a6":"Cancel anytime, no penalties. Your data is fully exported before closing.","faq.q7":"Does it integrate with existing systems?","faq.a7":"Open API and webhooks connect all popular ERPs/CRMs. 1-on-1 integration support.","faq.q8":"Who owns the data?","faq.a8":"You own 100% of your data. We only process it under agreement — never sold, never shared."},"ja":{"loader.text":"読み込み中","nav.store":"ストア","nav.manager":"管理","fab.storeDesc":"ショッピング＆予約","nav.categories":"商品カテゴリ","nav.orders":"注文履歴","nav.platform":"プラットフォーム","nav.journey":"沿革","nav.features":"サービス","nav.network":"ネットワーク","nav.support":"サポート","mnav.home":"ホーム","mnav.services":"サービス","mnav.network":"ネット","mnav.track":"注文","mnav.cart":"カート","fab.tag":"クイックアクセス","fab.title":"機能を選択","fab.lang":"言語","fab.nav.platform":"DTR—Mart ホーム","fab.nav.journey":"企業ストーリー","fab.nav.features":"ソリューション","fab.nav.network":"グローバルネットワーク","fab.nav.support":"注文を追跡","fab.nav.partner":"エージェント","fab.nav.partner.desc":"エージェントになる","hero.live":"ライブ","hero.countries":"50+ カ国","hero.partners":"12K+ パートナー","hero.title.1":"国境のない","hero.title.2":"商取引、","hero.title.3":"データで","hero.title.4":"運営する。","hero.desc":"デジタル商取引プラットフォームは <strong>50カ国以上</strong> と <strong>38,000以上のデジタル製品</strong> をシームレスなエコシステムで結びます。透明。迅速。信頼。","hero.cta":"ショッピングプラットフォーム","marquee.1":"Digital Tech Resolution","marquee.2":"50+ <em>カ国</em> で運営","marquee.3":"38K+ <em>デジタル製品</em>","marquee.4":"12K+ <em>グローバルパートナー</em>","marquee.5":"稼働率 <em>99%</em>","marquee.6":"スマート AI ルーティング","brand.01.word":"<em>Digital</em> — 完全デジタル化","brand.01.desc":"従来の商取引インフラをリアルタイム運営のデジタルプラットフォームへ転換。","brand.02.word":"<em>Tech</em> — テクノロジー主導","brand.02.desc":"オープン API、AI ルーティング、5大陸に広がるマルチリージョンクラウド基盤。","brand.03.word":"<em>Resolution</em> — 完全なソリューション","brand.03.desc":"決済、物流から分析まで — ワンハブ、ワンエコシステム。","journey.tag":"企業の歩み","journey.title":"ひとつのアイデアから <span class=\"it\">グローバル基盤へ</span>。","journey.sub":"各マイルストーンは飛躍です — ベトナムでの創業から 50カ国以上に広がるデジタル商取引エコシステムまで。","tl.2018.tag":"始まり","tl.2018.title":"DTR は <em>ハノイ</em> で誕生","tl.2018.desc":"6人のエンジニアチームが最初のデジタル商取引プラットフォームを創設 — 「Digital Tech Resolution」のビジョンは小さな部屋から始まりました。","tl.2020.tag":"拡大","tl.2020.title":"<em>東南アジア</em> をカバー","tl.2020.desc":"シンガポール、タイ、マレーシアに拡大。120路線の DTR SkyFreight 物流システムを開始。","tl.2022.tag":"ブレークスルー","tl.2022.title":"<em>10,000 パートナー</em> のマイルストーン","tl.2022.desc":"オープン API プラットフォームが 10,000 社に到達。年間総取引額が 10 億ドルを突破。","tl.2024.tag":"イノベーション","tl.2024.title":"<em>スマート</em> AI ルーティング","tl.2024.desc":"DTR-Resolve AI エンジンを発表：ルート最適化、CO₂ 排出量 42% 削減、リアルタイム需要予測。","tl.2026.tag":"現在","tl.2026.title":"<em>50+ カ国</em> のインフラ","tl.2026.desc":"12,000 のグローバルパートナー、38,000 のデジタル製品、99% 稼働率。DTR は新世代企業のデジタル商取引インフラに。","features.tag":"主要サービス","features.title":"ひとつのエコシステム — <span class=\"it\">無限のソリューション</span>。","features.sub":"デジタル商取引のあらゆる層を一つのプラットフォームに統合 — 物流、決済、分析、セキュリティまで。","features.f1.title":"スマート物流","features.f1.desc":"DTR SkyFreight は 120以上の国際路線を運航、AI がルートを最適化し最大42%の排出削減。","features.f2.title":"多通貨決済","features.f2.desc":"30以上の通貨対応、単一 API で決済ゲートウェイ統合、リアルタイム為替レート。","features.f3.title":"データ分析","features.f3.desc":"リアルタイムダッシュボード、AI 需要予測、地域・業界別の多次元レポート。","features.f4.title":"オープン API & SDK","features.f4.desc":"RESTful API、webhook、8言語の SDK。5分で統合、完全なドキュメント。","features.f5.title":"国際セキュリティ基準","features.f5.desc":"ISO 27001、PCI-DSS Level 1 認証、エンドツーエンド暗号化、GDPR と地域規制に準拠。","features.f6.title":"24時間サポート","features.f6.desc":"多言語の専門家、SLA 15分以内の応答、チャット・メール・ホットラインで対応。","cta.title":"<em>あなたの商取引の境界</em> を広げませんか？","cta.sub":"DTR 専門家による無料1対1相談。7日で導入、隠れた費用なし。","cta.btn1":"相談を予約","cta.btn2":"ドキュメントを見る","partner.eyebrow":"パートナーシップ","partner.title":"デジタルビジネス・キックスタート —<br><span class=\"cream\">市場をリードする</span> <em>テックの専門家に</em>","partner.desc":"DTR—Mart 公認エージェントになりませんか。運営システム、深い研修、マーケティング支援、世界中のデジタル商材 — すべてをワンパッケージで。","partner.btn":"エージェントになる","partner.btn2":"詳細を見る","partner.note":"全国でエージェント募集中 — 2026","partner.float.1":"1年目の売上","partner.float.2":"アカウントの有効化","partner.float.2.time":"5分","globe.title":"<span class=\"it\">グローバル商取引</span> をつなぐ。","globe.stat.countries":"運営国","globe.stat.products":"デジタル製品","globe.stat.partners":"グローバルパートナー","globe.stat.uptime":"システム稼働率","live.users":"オンラインユーザー","live.txn":"取引/秒","live.countries":"アクティブ国","skywatch.title":"<span class=\"it\">ご注文</span> を追跡。","skywatch.subtitle":"リアルタイムの地図でご注文の輸送状況を追跡。フライトを選ぶか新しい注文を作成して、システムが障害を自動で処理する様子をご覧ください。","footer.desc":"グローバルなデジタル商取引プラットフォーム — テクノロジーとデータで企業と50カ国以上を結びます。","footer.col.platform":"プラットフォーム","footer.col.company":"会社","footer.col.support":"サポート","footer.col.newsletter":"ニュースレター","footer.link.features":"サービス","footer.link.network":"ネットワーク","footer.link.track":"注文追跡","footer.link.api":"API & SDK","footer.link.pricing":"料金","footer.link.about":"DTR について","footer.link.journey":"沿革","footer.link.partner":"エージェントになる","footer.link.careers":"採用","footer.link.contact":"お問い合わせ","footer.link.help":"ヘルプセンター","footer.link.docs":"ドキュメント","footer.link.status":"システム状態","footer.link.security":"セキュリティ","footer.link.privacy":"プライバシー","footer.news.desc":"デジタル商取引のニュース、プラットフォーム更新、限定オファーをお届けします。","footer.news.placeholder":"email@dtr-mart.com","footer.news.btn":"登録","footer.copy":"Digital Tech Resolution — ベトナムで丁寧に作られました。","footer.legal.terms":"規約","footer.legal.privacy":"プライバシー","footer.legal.cookies":"Cookies","footer.legal.sitemap":"サイトマップ","footer.status.badge":"全システム稼働中","country.US":"アメリカ","country.CN":"中国","country.GB":"イギリス","country.DE":"ドイツ","country.JP":"日本","country.KR":"韓国","country.IN":"インド","country.AU":"オーストラリア","country.SG":"シンガポール","country.VN":"ベトナム","country.BR":"ブラジル","country.ZA":"南アフリカ","country.RU":"ロシア","country.AR":"アルゼンチン","brand.name":"DTR—Mart","brand.tag":"Digital Tech Resolution","seo.title":"DTR—Mart | Digital Tech Resolution — グローバル・デジタル商取引プラットフォーム","seo.description":"DTR—Mart — Digital Tech Resolution。50カ国以上を結び、データで運営するデジタル商取引プラットフォーム。歩み、サービス、グローバルなエコシステムをご覧ください。","skywatch.placeholder":"追跡コードを入力（例：DTR-TRL-9821-VN）","skywatch.btn":"注文を追跡","skywatch.empty":"追跡コードを入力して注文状況を表示します。","skywatch.noresult":"注文が見つかりません。コード：","skywatch.hint":"コードを確認してください。形式：DTR-TRK-XXXX-XX","ship.departed":"出発","ship.in_transit":"輸送中","ship.customs":"通関中","ship.eco_corridor":"エコ回廊","ship.arrived":"到着","ship.delivered":"配送完了","track.liveBtn":"ライブ追跡デモを見る","track.liveDesc":"リアルタイムプレビュー","ship.fleet.skyfreight":"DTR SkyFreight","ship.cargo.electronics":"電子機器","ship.cargo.pharma":"医薬品","ship.airport.HAN":"ノイバイ空港（HAN）","ship.airport.SIN":"シンガポール（SIN）","ship.airport.NRT":"東京・成田（NRT）","ship.region.SCS":"南シナ海","ship.region.SEA_ECO":"東南アジア・エコ回廊","ship.region.GOT":"タイ湾","ship.region.PAC_ECO":"太平洋・エコ回廊","ship.note.loaded_ontime":"積み込み完了、定刻に出発しました。","ship.note.fl380_normal":"FL380を飛行中、テレメトリは正常です。","ship.note.eco_route_42":"低排出回廊でルート設定（CO₂ −42%）。","ship.note.approach_sin":"シンガポール空域に接近中です。","ship.note.temp_verified":"温度管理貨物を確認済みです。","ship.note.eco_route_pac":"低排出回廊でルート設定しています。","ship.note.docs_verified":"通関中 — 書類を確認済みです。","faq.title":"よくある<span class=\"it\">ご質問</span>。","faq.sub":"始める前に知っておきたいこと。","faq.q1":"料金はどうなっていますか？","faq.a1":"相談は無料です。7日で導入、隠れた費用はありません。","faq.q2":"導入にどれくらいかかりますか？","faq.a2":"標準導入は7日、アカウント有効化はわずか5分です。","faq.q3":"セキュリティは大丈夫ですか？","faq.a3":"ISO 27001、PCI-DSS Level 1 認証、エンドツーエンド暗号化、GDPR 準拠。","faq.q4":"オープン API はありますか？","faq.a4":"RESTful API、webhook、8言語の SDK。5分で統合できます。","faq.q5":"サポート体制は？","faq.a5":"多言語チームが24時間対応、SLA 15分以内の応答（チャット・メール・ホットライン）。","faq.q6":"解約は簡単ですか？","faq.a6":"いつでも解約可能、違約金なし。解約前にデータを完全にエクスポートできます。","faq.q7":"既存システムと連携できますか？","faq.a7":"オープン API と webhook で主要な ERP/CRM と連携。1対1の導入支援付き。","faq.q8":"データの所有者は誰ですか？","faq.a8":"データの100%はお客様のものです。契約範囲内でのみ処理し、販売・共有はしません。"},"zh":{"loader.text":"加载中","nav.store":"商店","nav.manager":"管理后台","fab.storeDesc":"购物与订票","nav.categories":"产品分类","nav.orders":"订单","nav.platform":"平台","nav.journey":"历程","nav.features":"服务","nav.network":"网络","nav.support":"支持","mnav.home":"首页","mnav.services":"服务","mnav.network":"网络","mnav.track":"订单","mnav.cart":"购物车","fab.tag":"快速访问","fab.title":"选择功能","fab.lang":"语言","fab.nav.platform":"DTR—Mart 首页","fab.nav.journey":"企业故事","fab.nav.features":"解决方案生态","fab.nav.network":"全球网络","fab.nav.support":"查询订单","fab.nav.partner":"代理","fab.nav.partner.desc":"成为代理","hero.live":"实时","hero.countries":"50+ 国家","hero.partners":"12K+ 合作伙伴","hero.title.1":"无界商业","hero.title.2":"跨越国境，","hero.title.3":"数据驱动","hero.title.4":"全球运营。","hero.desc":"数字商业平台连接 <strong>50+ 个国家</strong> 与超过 <strong>38,000 个数字产品</strong>，构建无缝生态系统。透明。快速。可靠。","hero.cta":"购物平台","marquee.1":"Digital Tech Resolution","marquee.2":"50+ <em>国家</em> 运营中","marquee.3":"38K+ <em>数字产品</em>","marquee.4":"12K+ <em>全球合作伙伴</em>","marquee.5":"正常运行时间 <em>99%</em>","marquee.6":"智能 AI 路由","brand.01.word":"<em>Digital</em> — 全面数字化","brand.01.desc":"将传统商业基础设施转型为实时运营的数字平台。","brand.02.word":"<em>Tech</em> — 技术驱动","brand.02.desc":"开放 API、AI 路由、覆盖五大洲的多区域云基础设施。","brand.03.word":"<em>Resolution</em> — 完整解决方案","brand.03.desc":"从支付、物流到分析 — 一个中心，一个生态系统。","journey.tag":"企业历程","journey.title":"从一个想法 <span class=\"it\">到全球基础设施</span>。","journey.sub":"每一个里程碑都是一次飞跃——从越南创立到覆盖 50+ 国家的数字商业生态系统。","tl.2018.tag":"起点","tl.2018.title":"DTR 在 <em>河内</em> 诞生","tl.2018.desc":"6 名工程师团队打造首个数字商业平台——\"Digital Tech Resolution\" 的愿景从一个小房间开始。","tl.2020.tag":"扩展","tl.2020.title":"覆盖 <em>东南亚</em>","tl.2020.desc":"拓展至新加坡、泰国、马来西亚。推出 DTR SkyFreight 物流系统，拥有 120 条航运路线。","tl.2022.tag":"突破","tl.2022.title":"<em>10,000 家合作伙伴</em> 里程碑","tl.2022.desc":"开放 API 平台达到 10,000 家集成企业。年交易总额超过 10 亿美元。","tl.2024.tag":"创新","tl.2024.title":"<em>智能</em> AI 路线规划","tl.2024.desc":"推出 DTR-Resolve AI 引擎：路线优化、CO₂ 减排 42%、实时需求预测。","tl.2026.tag":"现在","tl.2026.title":"<em>50+ 国家</em> 基础设施","tl.2026.desc":"12,000 家全球合作伙伴，38,000 种数字产品，99% 正常运行时间。DTR 成为新一代企业的数字商业基础设施。","features.tag":"核心服务","features.title":"一个生态 — <span class=\"it\">万种方案</span>。","features.sub":"数字商务的每一层都集成于一个平台——从物流、支付、分析到安全。","features.f1.title":"智能物流","features.f1.desc":"DTR SkyFreight 运营 120+ 条国际航线，AI 优化路线，减排高达 42%。","features.f2.title":"多币种支付","features.f2.desc":"支持 30+ 种货币，单一 API 集成支付网关，汇率实时透明。","features.f3.title":"数据分析","features.f3.desc":"实时仪表板、AI 需求预测、按地区和行业的深度多维度报告。","features.f4.title":"开放 API 与 SDK","features.f4.desc":"RESTful API、webhook、8 种语言 SDK。5 分钟集成，文档完善。","features.f5.title":"国际安全标准","features.f5.desc":"ISO 27001、PCI-DSS Level 1 认证，端到端加密，符合 GDPR 及地区法规。","features.f6.title":"24/7 支持","features.f6.desc":"多语言专家团队，SLA 15 分钟内响应，支持聊天、邮件、热线。","cta.title":"准备好扩展 <em>您的商业边界</em> 了吗？","cta.sub":"与 DTR 专家免费 1 对 1 咨询。7 天内上线，无隐藏费用。","cta.btn1":"预约咨询","cta.btn2":"查看文档","partner.eyebrow":"合作机会","partner.title":"数字商业启航 —<br><span class=\"cream\">成为</span> <em>市场领先科技专家</em>","partner.desc":"成为 DTR—Mart 官方代理。获取运营系统、深度培训、营销支持以及全球数字货源 — 一站式套餐。","partner.btn":"成为代理","partner.btn2":"了解更多","partner.note":"全国招募代理中 — 2026","partner.float.1":"首年营收","partner.float.2":"激活账户","partner.float.2.time":"5分钟","globe.title":"连接 <span class=\"it\">全球商业</span>。","globe.stat.countries":"运营国家","globe.stat.products":"数字产品","globe.stat.partners":"全球合作伙伴","globe.stat.uptime":"系统正常运行时间","live.users":"用户在线","live.txn":"交易/秒","live.countries":"活跃国家","skywatch.title":"查询 <span class=\"it\">您的订单</span>。","skywatch.subtitle":"在实时地图上追踪您订单的运输旅程——选择航班或创建新订单，查看系统如何自动处理突发状况。","footer.desc":"全球数字商务平台——通过技术与数据连接企业与 50+ 国家。","footer.col.platform":"平台","footer.col.company":"公司","footer.col.support":"支持","footer.col.newsletter":"新闻订阅","footer.link.features":"服务","footer.link.network":"网络","footer.link.track":"查询订单","footer.link.api":"API 与 SDK","footer.link.pricing":"定价","footer.link.about":"关于 DTR","footer.link.journey":"历程","footer.link.partner":"成为代理","footer.link.careers":"招聘","footer.link.contact":"联系我们","footer.link.help":"帮助中心","footer.link.docs":"文档","footer.link.status":"系统状态","footer.link.security":"安全","footer.link.privacy":"隐私","footer.news.desc":"获取数字商务新闻、平台更新与独家优惠。","footer.news.placeholder":"email@dtr-mart.com","footer.news.btn":"订阅","footer.copy":"Digital Tech Resolution — 越南精心打造。","footer.legal.terms":"条款","footer.legal.privacy":"隐私","footer.legal.cookies":"Cookies","footer.legal.sitemap":"网站地图","footer.status.badge":"所有系统运行正常","country.US":"美国","country.CN":"中国","country.GB":"英国","country.DE":"德国","country.JP":"日本","country.KR":"韩国","country.IN":"印度","country.AU":"澳大利亚","country.SG":"新加坡","country.VN":"越南","country.BR":"巴西","country.ZA":"南非","country.RU":"俄罗斯","country.AR":"阿根廷","brand.name":"DTR—Mart","brand.tag":"Digital Tech Resolution","seo.title":"DTR—Mart | Digital Tech Resolution — 全球数字商业平台","seo.description":"DTR—Mart — Digital Tech Resolution。连接 50 多个国家、以数据驱动运营的数字商业平台。了解发展历程、服务与全球生态系统。","skywatch.placeholder":"输入追踪码（例：DTR-TRL-9821-VN）","skywatch.btn":"查询订单","skywatch.empty":"输入您的追踪码以查看订单状态。","skywatch.noresult":"未找到订单，追踪码：","skywatch.hint":"请检查追踪码。格式：DTR-TRK-XXXX-XX","ship.departed":"出发","ship.in_transit":"运输中","ship.customs":"海关","ship.eco_corridor":"生态走廊","ship.arrived":"到达","ship.delivered":"已送达","track.liveBtn":"查看实时追踪演示","track.liveDesc":"实时预览","ship.fleet.skyfreight":"DTR SkyFreight","ship.cargo.electronics":"电子设备","ship.cargo.pharma":"药品","ship.airport.HAN":"内排机场 (HAN)","ship.airport.SIN":"新加坡 (SIN)","ship.airport.NRT":"东京成田 (NRT)","ship.region.SCS":"南海","ship.region.SEA_ECO":"东南亚生态走廊","ship.region.GOT":"泰国湾","ship.region.PAC_ECO":"太平洋生态走廊","ship.note.loaded_ontime":"已装货，准时出发。","ship.note.fl380_normal":"正在FL380飞行，遥测正常。","ship.note.eco_route_42":"经低排放走廊绕行（−42% CO₂）。","ship.note.approach_sin":"正在进入新加坡空域。","ship.note.temp_verified":"温控货物已验证。","ship.note.eco_route_pac":"正在经低排放走廊绕行。","ship.note.docs_verified":"正在清关——单证已验证。","faq.title":"<span class=\"it\">常见</span>问题。","faq.sub":"开始之前您需要了解的一切。","faq.q1":"价格如何？","faq.a1":"咨询免费。7天部署，无隐藏费用。","faq.q2":"部署需要多长时间？","faq.a2":"标准部署7天，账户激活仅需5分钟。","faq.q3":"安全性如何？","faq.a3":"ISO 27001、PCI-DSS Level 1 认证，端到端加密，符合 GDPR。","faq.q4":"有开放 API 吗？","faq.a4":"RESTful API、webhook、8种语言 SDK。5分钟即可集成。","faq.q5":"支持服务如何？","faq.a5":"多语言团队24小时支持，SLA 15分钟内响应（聊天·邮件·热线）。","faq.q6":"取消服务容易吗？","faq.a6":"随时取消，无违约金。关闭前可完整导出您的数据。","faq.q7":"能与现有系统集成吗？","faq.a7":"开放 API 和 webhook 连接主流 ERP/CRM。提供一对一集成支持。","faq.q8":"数据属于谁？","faq.a8":"您拥有100%的数据。我们仅按协议处理，不出售、不共享。"}};
  window.ABOUT_I18N_DICTS = DEFAULT_DICTS;


  const LANGS = ['vi', 'ja', 'en', 'zh'];
  const DEFAULT_LANG = 'vi';
  const LANG_CODE = {
    vi: 'VI',
    ja: 'JA',
    en: 'EN',
    zh: 'ZH'
  };
  const CORE_BASE = new URL('.', document.currentScript.src).href;
  const qs = new URLSearchParams(location.search);
  function pickLang(l) {
    return LANGS.indexOf(l) >= 0 ? l : DEFAULT_LANG;
  }
  let initialSavedLang = 'vi';
  try { initialSavedLang = localStorage.getItem('dtr_lang') || 'vi'; } catch (e) {}
  window.__currentLang = pickLang(qs.get('lang') || initialSavedLang);
  window.I18N = Object.assign({}, DEFAULT_DICTS);
  window.DTR = {
    brand: null,
    meta: null,
    ready: false
  };
  const cache = {};
  function fetchJSON(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    return fetch(path, {
      signal: controller.signal,
      cache: 'no-cache'
    }).then(function (r) {
      if (!r.ok) throw new Error(path + ' -> HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      cache[path] = j;
      return j;
    }).finally(() => clearTimeout(timeout));
  }
  function loadDict(base, lang) {
    const defVi = DEFAULT_DICTS.vi || {};
    const defTarget = DEFAULT_DICTS[lang] || defVi;
    const fallbackDict = Object.assign({}, defVi, defTarget);
    if (!base) {
      return Promise.resolve({ vi: defVi, dict: fallbackDict });
    }
    return fetchJSON(base + '/vi.json').catch(function () {
      return defVi;
    }).then(function (vi) {
      const baseVi = vi || defVi;
      if (lang === 'vi') return {
        vi: baseVi,
        dict: baseVi
      };
      return fetchJSON(base + '/' + lang + '.json').catch(function () {
        return defTarget;
      }).then(function (d) {
        const dict = Object.assign({}, baseVi, d || defTarget);
        return {
          vi: baseVi,
          dict: dict
        };
      });
    });
  }
  function applyMeta(meta) {
    let key, hid, h, card;
    const root = document.documentElement;
    let k;
    let i;
    const theme = meta.theme || {};
    for (k in theme) if (k.indexOf('--') === 0) root.style.setProperty(k, theme[k]);

    // Synchronize core theme variables if provided
    const limeColor = theme['--lime'] || theme['--brand-lime'] || theme['--accent'];
    if (limeColor) {
      root.style.setProperty('--lime', limeColor);
      root.style.setProperty('--brand-lime', limeColor);
      const hex = limeColor.replace('#', '').trim();
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          root.style.setProperty('--lime-rgb', r + ',' + g + ',' + b);
        }
      }
    }
    if (theme['--display']) root.style.setProperty('--display', theme['--display']);
    if (theme['--sans']) root.style.setProperty('--sans', theme['--sans']);

    // Effects
    if (meta.effects) {
      if (meta.effects.grid === false) document.body.classList.remove('cyber-grid-bg');
      else if (meta.effects.grid === true) document.body.classList.add('cyber-grid-bg');
      if (meta.effects.glow === false) root.classList.add('no-neon-glow');
      else root.classList.remove('no-neon-glow');
    }

    const sec = meta.sections || {};
    const order = Array.isArray(meta.sectionOrder) ? meta.sectionOrder : [];
    const blocks = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
    const known = blocks.map(function (el) {
      return el.getAttribute('data-section');
    });
    const sectionParent = blocks[0] && blocks[0].parentNode;
    const sectionEnd = blocks.length && blocks[blocks.length - 1].nextSibling;
    order.concat(known).filter(function (key, index, all) {
      return known.indexOf(key) !== -1 && all.indexOf(key) === index;
    }).forEach(function (key) {
      const block = blocks[known.indexOf(key)];
      if (sectionParent && block.parentNode === sectionParent) sectionParent.insertBefore(block, sectionEnd);
    });
    if (window.ScrollTrigger && window.ScrollTrigger.refresh) {
      requestAnimationFrame(function () {
        window.ScrollTrigger.refresh();
      });
    }
    const sections = document.querySelectorAll('[data-section]');
    for (i = 0; i < sections.length; i++) {
      (function (el) {
        let links, j, li;
        const on = sec[el.getAttribute('data-section')] !== false;
        el.hidden = !on;
        el.style.display = on ? '' : 'none';
        if (el.id) {
          links = document.querySelectorAll('a[href="#' + el.id + '"]');
          for (j = 0; j < links.length; j++) {
            li = links[j].closest('li, .fab-item') || links[j];
            li.style.display = on ? '' : 'none';
          }
        }
      })(sections[i]);
    }
    const m = meta.media || {};
    const imgs = document.querySelectorAll('[data-media]');
    for (i = 0; i < imgs.length; i++) {
      key = imgs[i].getAttribute('data-media');
      if (m[key]) {
        if (imgs[i].tagName === 'LINK') imgs[i].href = m[key];else imgs[i].src = m[key];
      }
    }
    const fav = document.querySelector('link[rel="icon"]');
    if (fav && m.favicon) fav.href = m.favicon;

    const logoUrl = m.logo;
    if (logoUrl) {
      document.querySelectorAll('img[data-media="logo"], .brand-logo img, .loader-logo').forEach(function (img) {
        img.src = logoUrl;
      });
    }

    const hidden = meta.hiddenMedia || [];
    for (i = 0; i < hidden.length; i++) {
      hid = document.querySelectorAll('[data-media="' + hidden[i] + '"]');
      for (h = 0; h < hid.length; h++) {
        hid[h].style.display = 'none';
        card = hid[h].closest('.tech-icon');
        if (card) card.style.display = 'none';
      }
    }
    const links = meta.links || {};
    const partnerBtn = document.querySelector('#partner .btn-ghost');
    if (partnerBtn && links.partnerLearnMore) {
      partnerBtn.onclick = function () {
        window.open(links.partnerLearnMore, '_blank', 'noopener');
      };
    }
    const globeLink = document.querySelector('.globe-learn-more');
    if (globeLink && links.globeLearnMore) globeLink.href = links.globeLearnMore;
  }
  function setMeta(sel, attr, val, createProp) {
    let el = document.querySelector(sel);
    if (!el && createProp) {
      el = document.createElement('meta');
      el.setAttribute('property', createProp);
      document.head.appendChild(el);
    }
    if (el && val) el.setAttribute(attr, val);
  }
  function applyDict(dict, lang) {
    document.documentElement.lang = lang;
    let i;
    let els;
    let v;
    els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) {
      v = dict[els[i].getAttribute('data-i18n')];
      if (v !== undefined) els[i].textContent = v;
    }
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) {
      v = dict[els[i].getAttribute('data-i18n-html')];
      if (v !== undefined) els[i].innerHTML = v;
    }
    els = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < els.length; i++) {
      v = dict[els[i].getAttribute('data-i18n-placeholder')];
      if (v !== undefined) els[i].placeholder = v;
    }
    els = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < els.length; i++) {
      v = dict[els[i].getAttribute('data-i18n-aria')];
      if (v !== undefined) els[i].setAttribute('aria-label', v);
    }
    if (dict['seo.title']) document.title = dict['seo.title'];
    let md = document.querySelector('meta[name="description"]');
    if (!md) {
      md = document.createElement('meta');
      md.setAttribute('name', 'description');
      document.head.appendChild(md);
    }
    if (dict['seo.description']) md.setAttribute('content', dict['seo.description']);
    setMeta('meta[property="og:title"]', 'content', dict['seo.title'], 'og:title');
    setMeta('meta[property="og:description"]', 'content', dict['seo.description'], 'og:description');
    setMeta('meta[property="og:locale"]', 'content', lang, 'og:locale');
    const logo = window.DTR.meta && window.DTR.meta.media && window.DTR.meta.media.logo;
    if (logo) setMeta('meta[property="og:image"]', 'content', logo, 'og:image');
    const btns = document.querySelectorAll('[data-lang]');
    for (i = 0; i < btns.length; i++) btns[i].classList.toggle('active', btns[i].getAttribute('data-lang') === lang);
    const lc = document.getElementById('langCode');
    if (lc) lc.textContent = LANG_CODE[lang] || lang.toUpperCase();
  }
  window.applyLanguage = function (lang) {
    lang = pickLang(lang);
    try { localStorage.setItem('dtr_lang', lang); } catch (e) {}
    window.__currentLang = lang;
    const defVi = DEFAULT_DICTS.vi || {};
    const defTarget = DEFAULT_DICTS[lang] || defVi;
    const fallbackDict = Object.assign({}, defVi, defTarget);

    const base = window.DTR.brand ? window.DTR.brand.path : null;
    const dictPromise = base ? loadDict(base, lang).catch(() => ({ vi: defVi, dict: fallbackDict })) : Promise.resolve({ vi: defVi, dict: fallbackDict });

    return dictPromise.then(function (res) {
      const resDict = res.dict || fallbackDict;
      window.I18N = {
        vi: res.vi || defVi
      };
      window.I18N[lang] = resDict;
      applyDict(resDict, lang);
      try {
        const u = new URL(location.href);
        if (u.searchParams.get('lang') !== lang) {
          u.searchParams.set('lang', lang);
          history.replaceState(null, '', u.toString());
        }
      } catch (e) {}
      document.dispatchEvent(new CustomEvent('dtr:lang', {
        detail: {
          lang: lang
        }
      }));
    });
  };
  function showError(err) {
    console.error('[core]', err);
  }
  function boot() {
    const fallbackBrand = {
      id: 'brand-1',
      label: 'DTR—Mart',
      path: 'about/data/brand-1'
    };
    const fallbackMeta = {
      name: 'DTR—Mart',
      tagline: 'Digital Tech Resolution',
      theme: {
        '--lime': '#c5ff3d',
        '--color-primary': '#c5ff3d',
        '--wl-primary': '#c5ff3d'
      }
    };

    return fetchJSON(new URL('data/brands.json', CORE_BASE).href).catch(function () {
      return { default: 'brand-1', brands: [fallbackBrand] };
    }).then(function (idx) {
      let savedBrand = null;
      try { savedBrand = localStorage.getItem('dtr_current_brand'); } catch (e) {}
      const id = qs.get('brand') || savedBrand || idx.default;
      const brands = idx.brands || [fallbackBrand];
      let brand = brands.find(b => b.id === id) || brands.find(b => b.id === idx.default) || brands[0] || fallbackBrand;
      brand.path = new URL(brand.path, CORE_BASE).href.replace(/\/$/, '');
      window.DTR.brand = brand;
      return fetchJSON(brand.path + '/meta.json').catch(function () {
        return fallbackMeta;
      });
    }).then(function (meta) {
      try {
        const customMetaStr = localStorage.getItem('dtr_brand_meta');
        if (customMetaStr) {
          const customMeta = JSON.parse(customMetaStr);
          if (customMeta && typeof customMeta === 'object') {
            meta = Object.assign({}, meta, customMeta);
            if (customMeta.theme) meta.theme = Object.assign({}, meta.theme, customMeta.theme);
            if (customMeta.media) meta.media = Object.assign({}, meta.media, customMeta.media);
            if (customMeta.effects) meta.effects = Object.assign({}, meta.effects, customMeta.effects);
          }
        }
      } catch (e) {}
      window.DTR.meta = meta;
      applyMeta(meta);
      let initialLang = 'vi';
      try { initialLang = localStorage.getItem('dtr_lang') || 'vi'; } catch (e) {}
      const targetLang = pickLang(qs.get('lang') || initialLang || window.__currentLang);
      return window.applyLanguage(targetLang);
    }).then(function () {
      window.DTR.ready = true;
    }, showError);
  }
  document.addEventListener('click', function (e) {
    const b = e.target.closest ? e.target.closest('[data-lang]') : null;
    if (b) {
      e.preventDefault();
      window.applyLanguage(b.getAttribute('data-lang'));
    }
  });
  window.addEventListener('storage', function (e) {
    if (e.key === 'dtr_lang' && e.newValue && e.newValue !== window.__currentLang) {
      window.applyLanguage(e.newValue);
    }
  });
  const start = () => { window.DTR.readyPromise = boot(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);else start();
})();
