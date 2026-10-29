/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SITE.CONFIG.JS — CẤU HÌNH NỘI DUNG WEBSITE                  ║
 * ║  Giao diện "Rundown" — cả trang là tờ kịch bản dẫn chương    ║
 * ║  trình: mỗi phần là một tiết mục có mốc giờ, mở đầu bằng     ║
 * ║  màn hình máy nhắc chữ.                                      ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Toàn bộ chữ, ảnh, video, link của website nằm trong file    ║
 * ║  này. Sửa xong chỉ cần chạy `npm run build` (hoặc để         ║
 * ║  `npm run dev` tự build lại). KHÔNG cần mở HTML/CSS/JS.      ║
 * ║                                                              ║
 * ║  CÁCH SỬA:                                                   ║
 * ║  - Chỉ sửa phần chữ nằm GIỮA hai dấu ngoặc kép "..."         ║
 * ║  - Thay các giá trị [IN_HOA] bằng thông tin thật             ║
 * ║    VD: "[SO_DIEN_THOAI]"  →  "0901 234 567"                  ║
 * ║  - Ảnh đặt trong thư mục public/images/<khu-vuc>/, ghi       ║
 * ║    đường dẫn dạng "public/images/..." (KHÔNG có / ở đầu)     ║
 * ║  - Ảnh ưu tiên .webp, tên kebab-case có số: service-01.webp; ║
 * ║    bản riêng cho điện thoại thêm đuôi -m: service-01-m.webp  ║
 * ║    (có file -m nằm cạnh là điện thoại tự dùng, không cần     ║
 * ║    khai báo thêm)                                            ║
 * ║  - Kích thước ảnh ghi ở comment từng mục: ĐIỆN THOẠI trước,  ║
 * ║    MÁY TÍNH sau                                              ║
 * ║  - Ảnh chưa có → trang tự hiện khung kẻ sọc đúng tỉ lệ       ║
 * ║  - Link còn [IN_HOA] → nút tự trỏ về mục Chốt lịch (#contact)║
 * ║  - Danh sách (dịch vụ, video, ảnh...): muốn thêm thì copy    ║
 * ║    nguyên một khối { ... }, rồi dán ngay sau nó; muốn bớt    ║
 * ║    thì xóa cả khối { ... }, kể cả dấu phẩy phía sau          ║
 * ║  - Số mục hiện sẵn trên điện thoại: key `mobileVisible` ở    ║
 * ║    từng khu vực (phần còn lại nằm sau nút "Xem thêm (N)");   ║
 * ║    từ 1024px trở lên luôn hiện đủ                            ║
 * ║  - Các key ghi (MỚI) được thêm cho giao diện này. Xóa đi     ║
 * ║    trang vẫn chạy (dùng chữ mặc định)                        ║
 * ║                                                              ║
 * ║  LỖI HAY GẶP (build báo lỗi đỏ):                             ║
 * ║  - Thiếu dấu phẩy , ở cuối dòng / cuối khối { ... }          ║
 * ║  - Thiếu một dấu ngoặc kép "  (mở " thì phải có đóng ")      ║
 * ║  - Xóa nhầm dấu } hoặc ] — số dấu mở và đóng phải bằng nhau  ║
 * ║  - Trong chữ cần dấu ngoặc kép → dùng “ ” hoặc \"            ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const SITE_CONFIG = {

  // ─── 0. CHỮ GIAO DIỆN DÙNG CHUNG (MỚI) ─────────────────────
  // Chữ trên các nút thu gọn/mở rộng, nút đóng, nhãn trợ năng
  ui: {
    showMore: "Xem thêm",                            // nút sẽ hiện "Xem thêm (N)"
    showLess: "Thu gọn",
    skipLink: "Bỏ qua đến nội dung chính",
    closeLabel: "Đóng",
    prevLabel: "Ảnh trước",
    nextLabel: "Ảnh sau",
    videoMissing: "Video đang được cập nhật — liên hệ để xem trọn bộ showreel.",
  },

  // ─── 0b. KỊCH BẢN / MỐC GIỜ (MỚI) ──────────────────────────
  // Mỗi phần của trang là một "tiết mục" có mốc giờ, hiện ở thanh mục lục bên trái
  // và ở đầu mỗi phần. Mốc giờ tự tính: tiết mục đầu = startTime, mỗi tiết mục sau
  // cộng thêm stepMinutes phút. Phần nào trống (mảng rỗng) thì tự bỏ qua.
  rundown: {
    title: "Kịch bản chương trình",                  // tên thanh mục lục (đọc bởi trình đọc màn hình, hiện trên máy tính)
    startTime: "18:30",                              // giờ:phút, dạng "HH:MM"
    stepMinutes: 15,                                 // khoảng cách giữa hai tiết mục (phút)
    endLabel: "Hết chương trình",                    // dòng kết ở chân trang
  },

  // ─── 1. SEO & META ─────────────────────────────────────────
  // Hiện khi chia sẻ link lên Zalo/Facebook và trên Google
  seo: {
    title: "MC [TEN_MC] — MC Sự Kiện Chuyên Nghiệp",
    description: "MC dẫn chương trình sự kiện chuyên nghiệp tại TP.HCM và toàn quốc. Hơn [SO_NAM_KINH_NGHIEM] năm kinh nghiệm, [SO_SU_KIEN]+ sự kiện thành công.",
    keywords: "MC sự kiện, MC đám cưới, MC doanh nghiệp, dẫn chương trình, [TEN_MC]",
    ogImage: "public/images/og/og-cover.jpg",        // Điện thoại & Máy tính: 1200×630px, JPG (Facebook/Zalo chưa đọc tốt WebP)
    ogImageAlt: "MC [TEN_MC] — Dẫn chương trình sự kiện",
    url: "[WEBSITE_URL]",                            // VD: https://ten-ban.github.io/mc-portfolio/
    locale: "vi_VN",
    themeColor: "#FFE14A",                           // màu thanh trình duyệt trên điện thoại — trùng nền vàng chanh
  },

  // ─── 2. THÔNG TIN CÁ NHÂN / THƯƠNG HIỆU ──────────────────
  // Tên hiện trên màn hình nhắc chữ, ô chữ lồng đầu thanh mục lục và chân trang
  brand: {
    name: "[TEN_MC]",
    tagline: "MC Sự Kiện Chuyên Nghiệp",
    logo: "public/icons/favicon.svg",                // SVG logo (giao diện này hiện chữ lồng tự tạo từ tên, logo dùng làm favicon)
    logoAlt: "Logo [TEN_MC]",
  },

  // ─── 3. HEADER ─────────────────────────────────────────────
  // Giao diện này KHÔNG có thanh menu trên cùng: thanh mục lục mốc giờ dính mép trái
  // tự lấy tên từng phần (sectionLabel). menuItems hiện thành mục lục ở chân trang.
  // ctaButton là nút đặt lịch cuối thanh mục lục (máy tính).
  header: {
    menuItems: [
      { label: "Trang chủ", href: "#hero" },
      { label: "Giới thiệu", href: "#about" },
      { label: "Dịch vụ", href: "#services" },
      { label: "Video", href: "#videos" },
      { label: "Gallery", href: "#gallery" },
      { label: "Cảm nhận", href: "#testimonials" },
      { label: "Liên hệ", href: "#contact" },
    ],
    ctaButton: {
      label: "Đặt Lịch Ngay",
      href: "[ZALO_LINK]",                           // Link Zalo hoặc #contact
    },
  },

  // ─── 4. HERO (MÀN HÌNH MÁY NHẮC CHỮ) ───────────────────────
  // Màn hình đen kiểu máy nhắc chữ: các dòng `prompter` tự gõ từng chữ, rồi tới tiêu đề lớn,
  // lời dẫn và hai nút. Hero giao diện này CHỈ CÓ CHỮ — các ảnh bên dưới được giữ để
  // dùng chung với giao diện khác (không hiện ở đây).
  hero: {
    heading: "Khoảnh Khắc Đáng Nhớ\nBắt Đầu Từ Sân Khấu",
    subheading: "MC dẫn chương trình chuyên nghiệp cho đám cưới, sự kiện doanh nghiệp và các chương trình nghệ thuật trên toàn quốc.",
    backgroundDesktop: "public/images/hero/hero.jpg",   // không hiện ở giao diện này — Máy tính 900×1200px
    backgroundMobile: "public/images/hero/hero_minh.jpg", // không hiện ở giao diện này — Điện thoại 600×750px
    backgroundAlt: "MC [TEN_MC] cầm micro dẫn tiệc cưới",
    ctaPrimary: {
      label: "Đặt Lịch Qua Zalo",
      href: "[ZALO_LINK]",
    },
    ctaSecondary: {
      label: "Xem Showreel",
      href: "#videos",
    },
    scrollIndicator: true,                           // true = hiện dòng "Cuộn để vào chương trình" dưới màn hình

    // (MỚI) Các dòng nhắc chữ tự gõ phía trên tiêu đề. Mỗi dòng nên ngắn (≤ 30 ký tự).
    // Để mảng rỗng [] thì bỏ hiệu ứng gõ, chỉ hiện tiêu đề.
    prompter: [
      "Kính thưa quý vị,",
      "Xin chào, tôi là [TEN_MC].",
    ],
    // (MỚI) Dòng trạng thái có chấm đỏ nhấp nháy góc trên màn hình. Để "" thì ẩn.
    availability: "Đang nhận lịch mùa cưới & YEP 2026",
    // (MỚI, dùng chung với giao diện khác) Ảnh MC đã tối ưu — không hiện ở giao diện này.
    image: {
      mobile: "public/images/hero/hero-01-m.webp",   // 600×750px (dọc 4:5)
      desktop: "public/images/hero/hero-01.webp",    // 900×1200px (dọc 3:4)
    },
    imagePosition: {
      mobile: "50% 22%",
      desktop: "50% 25%",
    },
  },

  // ─── 5. GIỚI THIỆU (TIẾT MỤC "MỞ MÀN") ────────────────────
  // Như tờ hồ sơ diễn viên (call sheet): ảnh chân dung có dấu cắt góc, tóm tắt, bảng 4 chỉ số.
  // Điện thoại: hiện `summary`, phần `story` nằm sau nút `storyToggleLabel`.
  // Ảnh chân dung: Điện thoại 400×500px (4:5) — Máy tính 600×800px (3:4)
  about: {
    sectionLabel: "Mở màn",
    heading: "Đồng Hành Cùng\nKhoảnh Khắc Của Bạn",
    portrait: "public/images/about/portrait.webp",        // Máy tính 600×800px
    portraitMobile: "public/images/about/portrait-mobile.webp", // Điện thoại 400×500px
    portraitAlt: "MC [TEN_MC] cầm micro bên bục phát biểu",
    story: "Với hơn [SO_NAM_KINH_NGHIEM] năm kinh nghiệm trong lĩnh vực dẫn chương trình, tôi đã có vinh dự đồng hành cùng hàng trăm sự kiện — từ những đám cưới ấm cúng đến những gala doanh nghiệp quy mô lớn.\n\nTriết lý của tôi: mỗi sự kiện là duy nhất, và người MC phải là cầu nối cảm xúc giữa chương trình và khán giả. Tôi luôn chuẩn bị kỹ lưỡng, lắng nghe mong muốn của khách hàng, và mang đến năng lượng tích cực cho từng khoảnh khắc trên sân khấu.",
    // (MỚI) Tóm tắt 1–2 câu, luôn hiển thị
    summary: "Hơn [SO_NAM_KINH_NGHIEM] năm cầm mic, [SO_SU_KIEN]+ sân khấu — từ tiệc cưới ấm cúng đến gala nghìn khách. Kịch bản riêng cho từng chương trình, nhịp cảm xúc giữ trọn từ lời chào đến phút khép lại.",
    // (MỚI) Chữ trên nút mở phần câu chuyện đầy đủ (story)
    storyToggleLabel: "Đọc trọn câu chuyện",
    stats: [
      { number: "[SO_NAM_KINH_NGHIEM]+", label: "Năm Kinh Nghiệm" },
      { number: "[SO_SU_KIEN]+", label: "Sự Kiện Thành Công" },
      { number: "50+", label: "Đối Tác Doanh Nghiệp" },
      { number: "100%", label: "Khách Hàng Hài Lòng" },
    ],
  },

  // ─── 6. DỊCH VỤ (TIẾT MỤC "CÁC CHƯƠNG TRÌNH") ─────────────
  // Bảng kịch bản: mỗi dịch vụ là một dòng đánh số #01, #02… có ảnh vuông nhỏ, tên và mô tả.
  // Ảnh dịch vụ: Điện thoại & Máy tính dùng chung 640×640px (vuông)
  // icon có sẵn: wedding, corporate, event, ceremony, award, bilingual (hiện khi chưa có ảnh)
  services: {
    sectionLabel: "Chương trình",
    heading: "Dịch Vụ Của Tôi",
    subheading: "Mỗi loại hình sự kiện đều được chuẩn bị kịch bản riêng, phù hợp với phong cách và mong muốn của bạn.",
    mobileVisible: 3,                                // (MỚI) số dòng hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        icon: "wedding",
        title: "MC Đám Cưới",
        description: "Dẫn dắt tiệc cưới ấm cúng, lãng mạn với kịch bản cá nhân hóa cho từng cặp đôi.",
        image: "public/images/services/service-01.webp",  // 640×640px
      },
      {
        icon: "corporate",
        title: "MC Doanh Nghiệp",
        description: "Gala dinner, hội nghị khách hàng, lễ kỷ niệm — chuyên nghiệp và đẳng cấp.",
        image: "public/images/services/service-02.webp",
      },
      {
        icon: "event",
        title: "MC Sự Kiện",
        description: "Festival, concert, gameshow — tạo không khí sôi động và kết nối khán giả.",
        image: "public/images/services/service-03.webp",
      },
      {
        icon: "ceremony",
        title: "MC Lễ Khai Trương",
        description: "Lễ khai trương, động thổ, khánh thành — trang trọng và chuyên nghiệp.",
        image: "public/images/services/service-04.webp",
      },
      {
        icon: "award",
        title: "MC Lễ Trao Giải",
        description: "Vinh danh, trao giải thưởng — tạo cảm xúc và khoảnh khắc đáng nhớ.",
        image: "public/images/services/service-05.webp",
      },
      {
        icon: "bilingual",
        title: "MC Song Ngữ",
        description: "Dẫn chương trình Việt — Anh cho sự kiện quốc tế và đa văn hóa.",
        image: "public/images/services/service-06.webp",
      },
    ],
  },

  // ─── 7. VIDEO (TIẾT MỤC "PHÁT VTR") ───────────────────────
  // Showreel trong khung màn hình kiểm tra có chấm REC + các video nhỏ dạng danh sách VTR-01, VTR-02…
  // Poster: showreel Điện thoại & Máy tính 1280×720px, video nhỏ 640×360px (16:9)
  // videoUrl: link YouTube (https://youtu.be/... hoặc https://www.youtube.com/watch?v=...)
  //           hoặc file tự host "public/videos/ten-video.mp4". Video chỉ tải khi người xem bấm.
  videos: {
    sectionLabel: "Phát VTR",
    heading: "Khoảnh Khắc Trên Sân Khấu",
    subheading: "Xem những highlight từ các sự kiện tôi đã dẫn chương trình.",
    mobileVisible: 3,                                // (MỚI) số video nhỏ hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    featured: {
      title: "Showreel 2025",
      thumbnail: "public/images/videos/showreel-thumb.webp",  // 1280×720px
      videoUrl: "[YOUTUBE_SHOWREEL_URL]",
      duration: "3:45",
    },
    items: [
      {
        title: "Highlight Đám Cưới",
        thumbnail: "public/images/videos/video-01.webp",       // 640×360px
        videoUrl: "[YOUTUBE_VIDEO_01]",
        duration: "2:30",
      },
      {
        title: "Gala Doanh Nghiệp ABC",
        thumbnail: "public/images/videos/video-02.webp",
        videoUrl: "[YOUTUBE_VIDEO_02]",
        duration: "4:15",
      },
      {
        title: "Festival Âm Nhạc 2025",
        thumbnail: "public/images/videos/video-03.webp",
        videoUrl: "[YOUTUBE_VIDEO_03]",
        duration: "3:00",
      },
      {
        title: "Lễ Kỷ Niệm 20 Năm Cty XYZ",
        thumbnail: "public/images/videos/video-04.webp",
        videoUrl: "[YOUTUBE_VIDEO_04]",
        duration: "5:20",
      },
    ],
  },

  // ─── 8. GALLERY (TIẾT MỤC "KHOẢNH KHẮC") ──────────────────
  // Tờ "contact sheet" phim: ảnh xếp ô đánh số khung 01A, 02A… trên nền đen, 2 cột (điện thoại) / 4 cột (máy tính).
  // Bấm ảnh để phóng to, vuốt để chuyển ảnh.
  // Ảnh: Điện thoại & Máy tính dùng chung 1200×900px (4:3) — ảnh dọc vẫn dùng được (tự cắt vừa ô)
  // "category" phải trùng 1 mục trong categories. Nút lọc chỉ hiện những loại có ảnh.
  gallery: {
    sectionLabel: "Khoảnh khắc",
    heading: "Khoảnh Khắc Đáng Nhớ",
    subheading: "Những khoảnh khắc thực tế từ các sự kiện tôi đã đồng hành.",
    mobileVisible: 4,                                // (MỚI) số ảnh hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    categories: ["Tất cả", "Đám cưới", "Doanh nghiệp", "Sự kiện", "Hậu trường"],
    items: [
      {
        src: "public/images/gallery/gallery-01.webp",    // 1200×900px
        alt: "MC dẫn chương trình trên sân khấu trang trí hoa trắng",
        category: "Đám cưới",
      },
      {
        src: "public/images/gallery/gallery-02.webp",
        alt: "Ba MC cùng dẫn tiệc Year End Party của doanh nghiệp",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-03.webp",
        alt: "MC khuấy động không khí, khách mời giơ tay hưởng ứng",
        category: "Sự kiện",
      },
      {
        src: "public/images/gallery/gallery-04.webp",
        alt: "MC cúi chào khán giả trên sân khấu tiệc",
        category: "Đám cưới",
      },
      {
        src: "public/images/gallery/gallery-05.webp",
        alt: "MC cùng đại diện doanh nghiệp trên sân khấu Year End 2025",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-06.webp",
        alt: "MC dẫn talkshow, khán giả ngồi phía trước sân khấu",
        category: "Sự kiện",
      },
      {
        src: "public/images/gallery/gallery-07.webp",
        alt: "Toàn cảnh tiệc Chúc Mừng Năm Mới 2026 với MC trên sân khấu",
        category: "Doanh nghiệp",
      },
      {
        src: "public/images/gallery/gallery-08.webp",
        alt: "MC giao lưu cùng hai khách mời tại Year End Party",
        category: "Sự kiện",
      },
    ],
  },

  // ─── 9. KHÁCH HÀNG / ĐỐI TÁC (TIẾT MỤC "ĐỒNG HÀNH") ───────
  // Như danh sách đơn vị trên tờ kịch bản: mỗi đối tác một dòng, nối bằng dấu chấm, tĩnh (không chạy ngang).
  // Logo: Điện thoại & Máy tính dùng chung 200×80px, nền trong suốt (SVG/WebP/PNG)
  // Chưa có logo → hiện tên công ty bằng chữ
  partners: {
    sectionLabel: "Đồng hành",
    heading: "Tin Tưởng Bởi",
    items: [
      { name: "Công ty A", logo: "public/images/partners/partner-01.webp" },
      { name: "Công ty B", logo: "public/images/partners/partner-02.webp" },
      { name: "Công ty C", logo: "public/images/partners/partner-03.webp" },
      { name: "Công ty D", logo: "public/images/partners/partner-04.webp" },
      { name: "Công ty E", logo: "public/images/partners/partner-05.webp" },
      { name: "Công ty F", logo: "public/images/partners/partner-06.webp" },
    ],
  },

  // ─── 10. CẢM NHẬN KHÁCH HÀNG (TIẾT MỤC "PHẢN HỒI") ────────
  // Như biên bản ghi lời: tên người nói in hoa, lời nhận xét, số sao. Danh sách tĩnh, không trượt.
  // Avatar: Điện thoại & Máy tính dùng chung 100×100px vuông — chưa có ảnh → hiện chữ cái đầu
  testimonials: {
    sectionLabel: "Phản hồi",
    heading: "Khách Hàng Nói Gì",
    subheading: "Niềm tin của khách hàng là động lực lớn nhất để tôi không ngừng hoàn thiện.",
    mobileVisible: 2,                                // (MỚI) số lời nhận xét hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        name: "Anh Trần Văn Hùng",
        role: "Giám đốc, Công ty ABC",
        avatar: "public/images/testimonials/avatar-01.webp",  // 100×100px
        content: "Anh [TEN_MC] dẫn gala cuối năm cho công ty tôi rất chuyên nghiệp. Chương trình được dẫn dắt mạch lạc, không khí sôi động. Chắc chắn sẽ tiếp tục hợp tác!",
        rating: 5,
      },
      {
        name: "Chị Nguyễn Thị Mai",
        role: "Cô dâu",
        avatar: "public/images/testimonials/avatar-02.webp",
        content: "Cảm ơn anh [TEN_MC] đã làm đám cưới của vợ chồng em thêm trọn vẹn. Anh rất tâm lý, chuẩn bị kỹ lưỡng và tạo được nhiều khoảnh khắc xúc động.",
        rating: 5,
      },
      {
        name: "Anh Lê Minh Đức",
        role: "Trưởng phòng Marketing, Tập đoàn XYZ",
        avatar: "public/images/testimonials/avatar-03.webp",
        content: "Đã làm việc với nhiều MC nhưng anh [TEN_MC] luôn là lựa chọn hàng đầu cho các sự kiện quan trọng. Phong cách chuyên nghiệp, linh hoạt và rất có duyên.",
        rating: 5,
      },
      {
        name: "Chị Phạm Hồng Nhung",
        role: "Wedding Planner",
        avatar: "public/images/testimonials/avatar-04.webp",
        content: "Tôi thường xuyên giới thiệu anh [TEN_MC] cho các cặp đôi. Anh luôn mang đến sự chuyên nghiệp và cảm xúc đúng mực cho mỗi lễ cưới.",
        rating: 5,
      },
    ],
  },

  // ─── 10b. CÂU HỎI THƯỜNG GẶP (MỚI — TIẾT MỤC "HỎI NHANH") ─
  // Như ghi chú của đạo diễn: H. (hỏi) và Đ. (đáp) hiện sẵn, không cần bấm mở.
  // `subheading` là dòng kết, kèm nút nhắn Zalo. Mảng items rỗng → ẩn cả tiết mục.
  faq: {
    sectionLabel: "Hỏi nhanh",
    heading: "Câu Hỏi Thường Gặp",
    subheading: "Chưa thấy câu trả lời? Nhắn Zalo, tôi phản hồi trong ngày.",
    mobileVisible: 3,                                // số câu hỏi hiện sẵn trên điện thoại; ≥ 1024px hiện đủ
    items: [
      {
        question: "Nên đặt lịch trước bao lâu?",
        answer: "Mùa cưới và cuối năm (tháng 9 – tháng 1) nên đặt trước 1–3 tháng. Các tháng còn lại thường chỉ cần 2–4 tuần. Lịch được giữ khi hai bên xác nhận và đặt cọc.",
      },
      {
        question: "Chi phí dẫn chương trình được tính thế nào?",
        answer: "Chi phí phụ thuộc loại sự kiện, thời lượng, địa điểm và yêu cầu song ngữ. Gửi thông tin qua form hoặc Zalo để nhận báo giá chi tiết trong 24 giờ.",
      },
      {
        question: "Có nhận dẫn sự kiện ngoài TP.HCM không?",
        answer: "Có. Tôi nhận sự kiện trên toàn quốc; chi phí di chuyển và lưu trú (nếu có) được báo rõ trong báo giá.",
      },
      {
        question: "Kịch bản do ai chuẩn bị?",
        answer: "Tôi soạn kịch bản dẫn riêng dựa trên buổi trao đổi với bạn hoặc agency, gửi duyệt trước sự kiện và chỉnh sửa đến khi bạn hài lòng.",
      },
      {
        question: "Có tham gia tổng duyệt không?",
        answer: "Có. Tôi có mặt tổng duyệt (nếu chương trình có) và đến sớm trước giờ diễn để phối hợp cùng ekip âm thanh, ánh sáng.",
      },
    ],
  },

  // ─── 11. LIÊN HỆ (TIẾT MỤC "CHỐT LỊCH") ───────────────────
  // Tiết mục cuối: nút Gọi / Zalo, các kênh khác, và phiếu báo giá kiểu cue card.
  contact: {
    sectionLabel: "Chốt lịch",
    heading: "Hãy Kết Nối Với Tôi",
    subheading: "Bạn đang lên kế hoạch cho sự kiện? Liên hệ ngay để được tư vấn miễn phí!",
    phone: "[SO_DIEN_THOAI]",                        // VD: "0901 234 567" — tự tạo link tel:
    zalo: "[ZALO_LINK]",                             // https://zalo.me/<số điện thoại>
    email: "[EMAIL]",
    facebook: "[FACEBOOK_LINK]",
    youtube: "[YOUTUBE_LINK]",
    address: "[DIA_CHI]",                            // còn [DIA_CHI] thì dòng Khu vực tự ẩn
    workingHours: "Thứ 2 — Chủ nhật: 8:00 — 21:00",
    // Form báo giá: bấm gửi sẽ mở ứng dụng email với nội dung đã điền (không cần máy chủ)
    // eventTypes hiện thành các ô [ ] để đánh dấu (chọn 1 loại)
    form: {
      heading: "Gửi Yêu Cầu Báo Giá",
      note: "Để lại thông tin, tôi sẽ liên hệ lại trong vòng 24 giờ.",
      submitLabel: "Gửi Yêu Cầu",
      eventTypes: ["Đám cưới", "Sự kiện doanh nghiệp", "Khai trương / Khánh thành", "Lễ trao giải", "Sự kiện song ngữ", "Khác"],
    },
  },

  // ─── 12. FLOATING BUTTON ──────────────────────────────────
  // Nút tròn đỏ kiểu đèn "ON AIR" góc phải dưới, hiện khi đã cuộn qua màn hình nhắc chữ
  // và tự ẩn khi đang xem mục Chốt lịch. type: "zalo" hoặc "phone"
  floatingButton: {
    enabled: true,
    type: "zalo",
    label: "Chat Zalo",
    href: "[ZALO_LINK]",                             // VD: https://zalo.me/0901234567
  },

  // ─── 13. FOOTER ────────────────────────────────────────────
  // Dòng "Hết chương trình", tên, mục lục (lấy từ header.menuItems), mạng xã hội, bản quyền
  footer: {
    copyright: "© 2026 [TEN_MC]. All rights reserved.",
    madeWith: "MC sự kiện tại TP.HCM & toàn quốc",
    backToTop: true,                                 // true = hiện nút "Về đầu chương trình"
  },
};
