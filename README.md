# MC Portfolio — Giao diện "Rundown"

Website một trang cho MC sự kiện, trình bày như **tờ kịch bản dẫn chương trình (rundown)** trên nền vàng chanh:

- Mở trang: **màn hình máy nhắc chữ**. Lời chào tự gõ từng chữ, rồi tiêu đề lớn "bật sáng". Hero chỉ có chữ.
- Bên trái luôn có **thanh mục lục mốc giờ** (18:30, 18:45…). Mép phải của thanh là **trục thời gian**, trên đó có
  vạch đỏ chạy theo tiến độ cuộn. Bấm một mốc giờ để nhảy tới phần đó.
- Mỗi phần là một **tiết mục** có mốc giờ và số cue. Tên tiết mục tự gõ khi cuộn tới.
- Các phần: Mở màn (hồ sơ MC) → Chương trình (dịch vụ) → Phát VTR (video) → Khoảnh khắc (ảnh dạng contact sheet phim)
  → Phản hồi (cảm nhận dạng biên bản) → Đồng hành (đối tác) → Hỏi nhanh (ghi chú đạo diễn) → Chốt lịch (cue card báo giá).
- Liên hệ nhanh: **đèn ON AIR** tròn đỏ ở góc phải dưới. Trên máy tính còn có nút "Đặt lịch" ở cuối thanh mục lục.

Màu: vàng chanh `#FFE14A`, mực `#141414`, đỏ cue `#C4122F`, giấy cue `#FFF6C2`.
Font: JetBrains Mono (tiêu đề, chữ máy) · Archivo (nội dung).

HTML + Tailwind CSS v4 + JavaScript thuần, không framework, không bundler.
Toàn bộ nội dung nằm trong **một file duy nhất: `site.config.js`**.

---

## Sửa nội dung (không cần biết code)

### Bước 1 — Mở đúng file
Mở **`site.config.js`** bằng Notepad, Notepad++ hoặc VS Code. Đây là file duy nhất cần sửa.
**Không** sửa `index.html`, `src/`, `dist/`.

### Bước 2 — Sửa chữ
- Chỉ sửa phần chữ **nằm giữa hai dấu ngoặc kép** `"..."`.
- Các chỗ ghi `[IN_HOA]` là thông tin chưa có, thay bằng thông tin thật. VD: `"[SO_DIEN_THOAI]"` → `"0901 234 567"`.
- Muốn xuống dòng trong tiêu đề: gõ `\n` (VD `"Khoảnh Khắc Đáng Nhớ\nBắt Đầu Từ Sân Khấu"`).
- Mỗi mục có comment đánh số (`// ─── 4. HERO ───`) cho biết mục đó hiện ở đâu trên trang.
- Tên tiết mục (chữ "MỞ MÀN", "PHÁT VTR"… ở thanh mục lục và đầu mỗi phần) là key `sectionLabel` của từng mục.

### Bước 3 — Thay ảnh
1. Đặt ảnh vào đúng thư mục trong `public/images/` (xem bảng "Ảnh cần chuẩn bị" bên dưới).
2. Tên file viết thường, không dấu, nối bằng gạch ngang, có số: `service-01.webp`, `gallery-09.webp`.
3. Muốn có **bản nhẹ riêng cho điện thoại**: đặt thêm file cùng tên có đuôi `-m` ngay bên cạnh,
   VD `service-01-m.webp`. Trang tự dùng bản này trên điện thoại, không cần khai báo thêm.
4. Ghi đường dẫn vào `site.config.js` dạng `"public/images/services/service-01.webp"` (**không** có dấu `/` ở đầu).
5. Ảnh chưa có → trang tự hiện khung kẻ sọc đúng tỉ lệ, không bị vỡ.

### Bước 4 — Thêm / bớt mục (dịch vụ, video, ảnh, đối tác, cảm nhận, câu hỏi)
- **Thêm**: copy nguyên một khối `{ ... },` rồi dán ngay sau nó, sửa chữ bên trong.
- **Bớt**: xóa cả khối `{ ... },` (kể cả dấu phẩy phía sau).
- Danh sách để trống `[]` → phần đó tự ẩn, **mốc giờ của các tiết mục sau tự dồn lên** (không bị nhảy cóc).

### Bước 5 — Đổi số mục hiện sẵn trên điện thoại
Trên điện thoại, danh sách dài được thu gọn sau nút **"[+] Xem thêm (N)"**. Số mục hiện sẵn đặt bằng key `mobileVisible`:

| Khu vực | Key | Mặc định |
|---|---|---|
| Dịch vụ | `services.mobileVisible` | 3 |
| Video nhỏ | `videos.mobileVisible` | 3 |
| Ảnh | `gallery.mobileVisible` | 4 |
| Cảm nhận | `testimonials.mobileVisible` | 2 |
| Hỏi đáp | `faq.mobileVisible` | 3 |

Từ 1024px trở lên (máy tính) luôn hiện đủ. Phần câu chuyện dài ở mục Giới thiệu (`about.story`) cũng
nằm sau nút `about.storyToggleLabel` trên điện thoại.

### Bước 6 — Đổi mốc giờ của kịch bản
Trong mục `rundown` ở đầu `site.config.js`:
- `startTime: "18:30"`: giờ của tiết mục đầu tiên (màn hình nhắc chữ).
- `stepMinutes: 15`: mỗi tiết mục sau cộng thêm bấy nhiêu phút.
- `endLabel`: dòng "Hết chương trình" ở chân trang.

### Bước 7 — Build
Mở terminal trong thư mục này, chạy:

```bash
npm install        # chỉ cần lần đầu
npm run build
```

Terminal báo:
- **Vàng (cảnh báo)**: file ảnh được dùng nhưng chưa có, placeholder `[IN_HOA]` chưa thay.
- **Đỏ (lỗi)**: thiếu key / sai cú pháp → build trả mã lỗi 1. Lỗi hay gặp: **thiếu dấu phẩy** cuối dòng,
  **thiếu dấu ngoặc kép**, **xóa nhầm dấu `}` hoặc `]`**. Cần dấu ngoặc kép trong chữ thì dùng `“ ”` hoặc `\"`.

### Bước 8 — Xem thử trên điện thoại
```bash
npm run dev
```
Terminal in ra hai địa chỉ: `http://localhost:5173/` (máy tính) và `http://192.168.x.x:5173/` (**Mạng LAN**).
Điện thoại bắt **cùng Wi-Fi** với máy tính, mở địa chỉ Mạng LAN. Sửa `site.config.js` và lưu là trang tự build lại.

### Bước 9 — Đưa lên GitHub Pages
1. Tạo repo trên GitHub (VD `mc-portfolio`), đẩy toàn bộ thư mục này lên nhánh `main`.
2. Trên GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` tự build và đưa lên (xem tiến trình ở tab **Actions**).
4. Điền `seo.url` trong `site.config.js` bằng link trang (VD `https://ten-ban.github.io/mc-portfolio/`)
   để ảnh chia sẻ Zalo/Facebook hiện đúng.

---

## Key mới của giao diện này (ghi "(MỚI)" trong `site.config.js`)

Xóa các key này đi trang vẫn chạy (dùng chữ mặc định). File config của Temp khác copy sang vẫn build được.

| Key | Tác dụng |
|---|---|
| `rundown.title` | Tên thanh mục lục (hiện trên máy tính, trình đọc màn hình đọc) |
| `rundown.startTime`, `rundown.stepMinutes` | Mốc giờ tiết mục đầu tiên và khoảng cách giữa các tiết mục |
| `rundown.endLabel` | Dòng "Hết chương trình" ở chân trang |
| `hero.prompter` | Các dòng tự gõ trên máy nhắc chữ (mảng rỗng `[]` → bỏ hiệu ứng gõ) |
| `hero.availability` | Dòng có đèn đỏ nhấp nháy trên màn hình nhắc chữ (để `""` thì ẩn) |
| `ui.*` | Chữ trên nút "Xem thêm", "Thu gọn", "Đóng", "Ảnh trước/sau", lời báo video chưa có |
| `about.summary`, `about.storyToggleLabel` | Tóm tắt luôn hiện, chữ nút mở câu chuyện đầy đủ |
| `*.mobileVisible` | Số mục hiện sẵn trên điện thoại |
| `faq.*` | Câu hỏi thường gặp (mảng `items` rỗng → ẩn) |

Dùng chung với giao diện khác nhưng **không hiện ở đây** (hero chỉ có chữ): `hero.image`, `hero.imagePosition`,
`hero.backgroundDesktop`, `hero.backgroundMobile`. `brand.logo` chỉ làm favicon (thanh mục lục hiện chữ lồng tự tạo từ tên).
`hero.scrollIndicator: true` hiện dòng "Cuộn để vào chương trình" dưới màn hình nhắc chữ.

## Placeholder cần thay

| Placeholder | Ý nghĩa / ví dụ |
|---|---|
| `[TEN_MC]` | Tên MC / thương hiệu (cũng nên thay trong `hero.prompter`) |
| `[SO_NAM_KINH_NGHIEM]`, `[SO_SU_KIEN]` | Số liệu, VD `8`, `500` |
| `[SO_DIEN_THOAI]` | `0901 234 567` (tự tạo link `tel:`) |
| `[ZALO_LINK]` | `https://zalo.me/0901234567` |
| `[EMAIL]` | Email nhận yêu cầu báo giá từ form |
| `[FACEBOOK_LINK]`, `[YOUTUBE_LINK]` | Link trang cá nhân |
| `[YOUTUBE_SHOWREEL_URL]`, `[YOUTUBE_VIDEO_01..04]` | Link YouTube hoặc `public/videos/xxx.mp4` |
| `[WEBSITE_URL]` | URL website sau khi deploy |
| `[DIA_CHI]` | Khu vực hoạt động (còn placeholder thì dòng này tự ẩn) |

Link còn placeholder tự trỏ về mục Chốt lịch (`#contact`), không bao giờ thành link hỏng.

## Ảnh cần chuẩn bị

Ưu tiên `.webp`. Kích thước: **điện thoại** trước, **máy tính** sau.

| File | Điện thoại | Máy tính |
|---|---|---|
| `about/portrait-mobile.webp`, `about/portrait.webp` | 400×500 (4:5) | 600×800 (3:4) |
| `services/service-01..06.webp` (+ `-m`) | 640×640 vuông, dùng chung | 640×640 |
| `videos/showreel-thumb.webp` (+ `-m`) | 1280×720, dùng chung | 1280×720 |
| `videos/video-01..04.webp` (+ `-m`) | 640×360, dùng chung | 640×360 |
| `gallery/gallery-01..08.webp` (+ `-m`) | 1200×900 (4:3), dùng chung — ảnh dọc tự cắt vừa ô | 1200×900 |
| `partners/partner-01..06.webp` | 200×80 nền trong suốt, dùng chung | 200×80 |
| `testimonials/avatar-01..04.webp` | 100×100 vuông, dùng chung | 100×100 |
| `og/og-cover.jpg` | 1200×630 JPG (ảnh khi chia sẻ link) | — |

Tất cả nằm trong `public/images/`. Logo đối tác và avatar chưa có → trang hiện tên công ty / chữ cái đầu.
Icon (`public/icons/`): `favicon.svg` (tờ kịch bản có nút cue đỏ), `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`.

---

## Các lệnh

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Build (không minify), mở server tại http://localhost:5173 + địa chỉ LAN, tự build lại khi sửa `index.html`, `site.config.js`, `src/`, `public/` |
| `npm run build` | Build bản chính thức (CSS minify) vào `dist/` |
| `npm run preview` | Chỉ phục vụ `dist/` đang có, không build |
| `node scripts/build.mjs --html-only` | Chỉ ghép HTML, bỏ qua CSS (nhanh) |

- Đổi cổng: PowerShell `$env:PORT=3000; npm run dev`.
- Giả lập GitHub Pages dạng project: `npm run dev -- --base=/mc-portfolio/` rồi mở http://localhost:5173/mc-portfolio/.
- Trên Windows, nếu PowerShell chặn `npm`, dùng `npm.cmd run build`.

## Cấu trúc thư mục

```
├── site.config.js        # NỘI DUNG website (sửa ở đây)
├── index.html            # Khung HTML (template)
├── src/
│   ├── templates.js      # Bộ render: config → HTML (thanh mục lục, máy nhắc chữ, các tiết mục)
│   ├── input.css         # CSS nguồn Tailwind v4 (màu, font trong @theme)
│   └── js/main.js        # JS: gõ chữ, mục lục theo cuộn, xem thêm, lọc ảnh, xem ảnh, video, ON AIR, form
├── public/               # icons/, images/<khu-vuc>/, videos/
├── scripts/
│   ├── build.mjs         # Build → dist/
│   └── dev.mjs           # Server phát triển (cổng 5173, có địa chỉ LAN)
└── .github/workflows/deploy.yml
```

Không có JavaScript: mọi chữ hiện sẵn (không hiệu ứng gõ), mọi nội dung (kể cả phần thu gọn) vẫn hiện đầy đủ.
Máy bật "giảm chuyển động": tắt hiệu ứng gõ chữ, hiện dần, vạch kẻ tự kéo và đèn nhấp nháy.
