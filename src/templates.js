/**
 * ═══════════════════════════════════════════════════════════
 *  TEMPLATES.JS — Bộ render: config → HTML
 *  Giao diện "Rundown": cả trang là tờ kịch bản dẫn chương trình.
 *  Mỗi section là một tiết mục (.cue) có mốc giờ, nối vào trục thời gian
 *  chính là mép phải của thanh mục lục (.rail) dính bên trái màn hình.
 *  Hero là màn hình máy nhắc chữ — chỉ có chữ.
 * ═══════════════════════════════════════════════════════════
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Thư mục gốc của dự án (để kiểm tra file ảnh có thật hay không)
const ROOT = fileURLToPath(new URL("..", import.meta.url));

// ─── ICONS (SVG inline) ─────────────────────────────────
const ICONS = {
  wedding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M10.5 4.5 12 3l1.5 1.5L12 6z"/></svg>`,
  corporate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M3 7h18v13H3zM8.5 7V3.5h7V7M3 12.5h18"/></svg>`,
  event: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  ceremony: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6M3 21h18"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>`,
  bilingual: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M2.5 4.5h19v15h-19z"/><path d="m3 6 9 7 9-7"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  zalo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor"><path d="M12.5 6C9.46 6 7 8.46 7 11.5v25C7 39.54 9.46 42 12.5 42h23c3.04 0 5.5-2.46 5.5-5.5v-25C41 8.46 38.54 6 35.5 6h-23zm2.14 11h18.72c.87 0 1.34 1.01.78 1.67L22.97 31.5h8.87c.74 0 1.16.83.71 1.39-.15.18-.37.29-.61.29H13.36c-.87 0-1.34-1.01-.78-1.67L23.75 18.7h-9.1a.82.82 0 0 1-.72-.43.81.81 0 0 1 .71-1.27z"/></svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M15 18 9 12l6-6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="m18 15-6-6-6 6"/></svg>`,
  arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><path d="M3 12h16M13 6l6 6-6 6"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"><path d="M3 4h18v16H3z"/><circle cx="9" cy="10" r="1.8"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>`,
};

// ─── TIỆN ÍCH ──────────────────────────────────────────

/** Escape HTML để chống XSS */
export function esc(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Kiểm tra giá trị có phải placeholder [IN_HOA] không */
export function isPlaceholder(val) {
  if (typeof val !== "string") return false;
  return /\[[A-Z0-9_]+\]/.test(val);
}

/** Trả SVG icon inline (trang trí → aria-hidden) */
export function icon(name, cls = "") {
  const svg = ICONS[name];
  if (!svg) return `<!-- icon "${name}" không tìm thấy -->`;
  const clsAttr = cls ? ` class="${esc(cls)}"` : "";
  return svg.replace("<svg ", `<svg${clsAttr} aria-hidden="true" focusable="false" `);
}

/**
 * Tạo thẻ ảnh: <picture> khi có ảnh mobile riêng, lazy-load, width/height, alt.
 * Ảnh lỗi sẽ tự ẩn (onerror) để lộ khung thay thế .ph ngay sau nó.
 */
export function media({ src, alt = "", cls = "", width, height, lazy = true, priority = false, mobileSrc, mobileWidth, mobileHeight }) {
  const loadAttr = priority ? ` fetchpriority="high"` : lazy ? ` loading="lazy"` : "";
  const imgCls = cls ? ` class="${esc(cls)}"` : "";
  const size = (w, h) => `${w ? ` width="${w}"` : ""}${h ? ` height="${h}"` : ""}`;
  // Ảnh lỗi → ẩn ảnh và bật khung thay thế .ph nằm ngay sau (<img> hoặc <picture>)
  const onError = `this.hidden=true;var n=(this.parentNode.tagName==='PICTURE'?this.parentNode:this).nextElementSibling;if(n)n.classList.add('ph--on')`;
  const img = `<img src="${esc(src)}" alt="${esc(alt)}"${imgCls}${size(width, height)}${loadAttr} decoding="async" onerror="${onError}">`;

  if (!mobileSrc) return img;
  return `<picture class="contents">
  <source media="(max-width: 767px)" srcset="${esc(mobileSrc)}"${size(mobileWidth, mobileHeight)}>
  ${img}
</picture>`;
}

/** File (đường dẫn dạng public/...) có thật trong dự án không. Link http(s) coi như có. */
function fileExists(src) {
  if (!src || typeof src !== "string") return false;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return true;
  try {
    return existsSync(join(ROOT, src));
  } catch {
    return false;
  }
}

/** Bản ảnh cho điện thoại cùng tên, thêm đuôi -m: service-01.webp → service-01-m.webp */
function mobileVariant(src) {
  return typeof src === "string" ? src.replace(/(\.[a-z0-9]+)$/i, "-m$1") : "";
}

/**
 * Khung thay thế khi chưa có ảnh: sọc chéo kiểu băng dán sàn sân khấu + nhãn chữ máy.
 * `missing` = đường dẫn ảnh chưa có → khung hiện luôn, và build vẫn liệt kê được file thiếu.
 */
function placeholder(label, cls = "", missing = "", iconName = "image") {
  const on = missing ? " ph--on" : "";
  const data = missing ? ` data-missing="${esc(missing)}"` : "";
  return `<span class="ph ${cls}${on}"${data} aria-hidden="true">${icon(iconName, "ph__icon")}${label ? `<span class="ph__label">${esc(label)}</span>` : ""}</span>`;
}

/**
 * Ảnh + khung thay thế: chỉ chèn <img> khi file thật sự tồn tại (tránh lỗi 404).
 * Không khai báo mobileSrc mà có sẵn file "-m" bên cạnh → điện thoại tự dùng bản nhẹ đó.
 */
function pic(opts, label = "", phCls = "", iconName = "image") {
  if (opts.mobileSrc === undefined && fileExists(mobileVariant(opts.src))) {
    opts = { ...opts, mobileSrc: mobileVariant(opts.src) };
  }
  const hasMain = fileExists(opts.src);
  const hasMobile = fileExists(opts.mobileSrc);
  if (!hasMain && !hasMobile) {
    return placeholder(label, phCls, [opts.src, opts.mobileSrc].filter(Boolean).join(" "), iconName);
  }
  const src = hasMain ? opts.src : opts.mobileSrc;
  const mobileSrc = hasMain && hasMobile && opts.mobileSrc !== opts.src ? opts.mobileSrc : "";
  return media({ ...opts, src, mobileSrc }) + placeholder(label, phCls, "", iconName);
}

/** Thuộc tính href (+ target/rel nếu là link ngoài) */
function linkAttrs(href) {
  const external = /^https?:\/\//.test(href);
  return `href="${esc(href)}"${external ? ` target="_blank" rel="noopener noreferrer"` : ""}`;
}

/** Xuống dòng \n trong config → <br> */
function lines(text) {
  return esc(text || "").replace(/\n/g, "<br>");
}

/** Số mục hiện sẵn trên điện thoại (mobileVisible), mặc định `fallback` */
function visibleCount(n, fallback) {
  const v = Number(n);
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : fallback;
}

/** 7 → "07" */
function pad(n) {
  return String(n).padStart(2, "0");
}

/** Mốc giờ: "18:30" + 45 phút → "19:15" (sai định dạng → bắt đầu từ 18:30) */
function clock(start, minutes) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(start || "").trim());
  const base = m ? Number(m[1]) * 60 + Number(m[2]) : 18 * 60 + 30;
  const t = (((base + minutes) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
}

/** Chữ lồng ở đầu thanh mục lục: "Nguyễn Minh Tuấn" → "NT"; còn placeholder → "MC" */
function monogram(name) {
  if (!name || isPlaceholder(name)) return "MC";
  const words = name.trim().split(/\s+/);
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

// ─── HELPERS ────────────────────────────────────────────

/** Tạo các link tel/zalo/mailto/mạng xã hội — nếu còn placeholder thì trỏ về #contact */
export function createHelpers(config) {
  const c = config.contact || {};

  function safeLink(value, prefix = "") {
    if (!value || isPlaceholder(value)) return "#contact";
    if (prefix === "tel:") return `tel:${value.replace(/[^\d+]/g, "")}`;
    if (prefix === "mailto:") return `mailto:${value}`;
    if (prefix === "zalo:") return /^https?:\/\//.test(value) ? value : `https://zalo.me/${value.replace(/[^\d]/g, "")}`;
    return value;
  }

  const hasPhone = c.phone && !isPlaceholder(c.phone);
  const hasEmail = c.email && !isPlaceholder(c.email);

  return {
    phoneLink: safeLink(c.phone, "tel:"),
    phoneDisplay: hasPhone ? c.phone : "Đang cập nhật",
    hasPhone,
    zaloLink: safeLink(c.zalo, "zalo:"),
    emailLink: safeLink(c.email, "mailto:"),
    emailDisplay: hasEmail ? c.email : "Đang cập nhật",
    emailRaw: hasEmail ? c.email : "",
    facebookLink: safeLink(c.facebook),
    youtubeLink: safeLink(c.youtube),
    ctaLink: safeLink(config.header?.ctaButton?.href || c.zalo, "zalo:"),
    heroCtaLink: safeLink(config.hero?.ctaPrimary?.href || c.zalo, "zalo:"),
    floatingLink: safeLink(config.floatingButton?.href || c.zalo, "zalo:"),
  };
}

// ─── RENDERERS ──────────────────────────────────────────

export function createRenderers(config) {
  const h = createHelpers(config);
  const ui = {
    showMore: "Xem thêm",
    showLess: "Thu gọn",
    skipLink: "Bỏ qua đến nội dung chính",
    closeLabel: "Đóng",
    prevLabel: "Ảnh trước",
    nextLabel: "Ảnh sau",
    videoMissing: "Video đang được cập nhật — liên hệ để xem trọn bộ showreel.",
    ...(config.ui || {}),
  };
  const brandName = config.brand?.name || "";
  const rd = config.rundown || {};
  const step = Number.isFinite(Number(rd.stepMinutes)) && Number(rd.stepMinutes) > 0 ? Number(rd.stepMinutes) : 15;

  // ── Kịch bản: danh sách tiết mục THỰC SỰ hiện trên trang (phần trống bị bỏ qua),
  //    mỗi tiết mục được đánh số và gán mốc giờ theo thứ tự.
  const vid = config.videos || {};
  const hasFeatured = Boolean(vid.featured && (vid.featured.title || vid.featured.thumbnail || vid.featured.videoUrl));
  const defs = [
    ["hero", "Lên sóng", true],
    ["about", "Mở màn", true],
    ["services", "Chương trình", (config.services?.items || []).length > 0],
    ["videos", "Phát VTR", hasFeatured || (vid.items || []).length > 0],
    ["gallery", "Khoảnh khắc", (config.gallery?.items || []).length > 0],
    ["testimonials", "Phản hồi", (config.testimonials?.items || []).length > 0],
    ["partners", "Đồng hành", (config.partners?.items || []).length > 0],
    ["faq", "Hỏi nhanh", (config.faq?.items || []).length > 0],
    ["contact", "Chốt lịch", true],
  ];
  const cues = defs
    .filter(([, , show]) => show)
    .map(([id, fallback], i) => ({
      id,
      no: pad(i),
      time: clock(rd.startTime, i * step),
      label: (id !== "hero" && config[id]?.sectionLabel) || fallback,
    }));
  const cueOf = (id) => cues.find((c) => c.id === id) || { id, no: "00", time: clock(rd.startTime, 0), label: "" };

  /** Đầu mỗi tiết mục: dòng mốc giờ · tên tiết mục · số cue, tiêu đề chữ máy, lời dẫn */
  function cueHead(sec, id, fallbackHeading = "") {
    const cue = cueOf(id);
    return `<header class="cue-head">
        <p class="cue-head__meta">
          <time class="cue-head__time">${cue.time}</time>
          <span class="cue-head__label">${esc(cue.label)}</span>
          <span class="cue-head__no" aria-hidden="true">CUE ${cue.no}</span>
        </p>
        <h2 id="${id}-title" class="cue-head__title">${lines(sec.heading || fallbackHeading)}</h2>
        ${sec.subheading ? `<p class="cue-head__lede">${esc(sec.subheading)}</p>` : ""}
      </header>`;
  }

  /** Nút "Xem thêm (N)" cho danh sách thu gọn trên điện thoại (ẩn khi không có JS và từ 1024px) */
  function moreButton(listId, extra) {
    if (extra <= 0) return "";
    const more = `${ui.showMore} (${extra})`;
    return `<button type="button" class="more" data-more aria-controls="${listId}" aria-expanded="false" data-label-more="${esc(more)}" data-label-less="${esc(ui.showLess)}">
          <span class="more__bracket" aria-hidden="true">[+]</span><span data-more-text>${esc(more)}</span>
        </button>`;
  }

  /** Thuộc tính mở video: chưa có link → hộp thoại báo "đang cập nhật" thay vì phát rỗng */
  function videoAttrs(url, title) {
    const data = url && !isPlaceholder(url) ? `data-video="${esc(url)}"` : `data-video-missing`;
    return `${data} data-title="${esc(title || "")}" aria-haspopup="dialog" aria-controls="player"`;
  }

  return {
    // ─── SEO HEAD ─────────────────────────────────────
    seoHead() {
      const seo = config.seo || {};
      const siteUrl = seo.url && !isPlaceholder(seo.url) ? seo.url.replace(/\/?$/, "/") : "";
      // og:image cần URL tuyệt đối — chỉ ghép được khi đã có seo.url
      const ogImage = siteUrl ? siteUrl + (seo.ogImage || "") : seo.ogImage || "";
      return `<title>${esc(seo.title || "MC Portfolio")}</title>
    <meta name="description" content="${esc(seo.description || "")}">
    <meta name="keywords" content="${esc(seo.keywords || "")}">
    ${siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}">\n    <meta property="og:url" content="${esc(siteUrl)}">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${esc(seo.locale || "vi_VN")}">
    <meta property="og:site_name" content="${esc(brandName)}">
    <meta property="og:title" content="${esc(seo.title || "")}">
    <meta property="og:description" content="${esc(seo.description || "")}">
    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(seo.ogImageAlt || "")}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(seo.title || "")}">
    <meta name="twitter:description" content="${esc(seo.description || "")}">
    <meta name="twitter:image" content="${esc(ogImage)}">
    <meta name="theme-color" content="${esc(seo.themeColor || "#FFE14A")}">
    <link rel="icon" type="image/svg+xml" href="public/icons/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="public/icons/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="public/icons/apple-touch-icon.png">`;
    },

    // ─── CHỮ NHÃN TRỢ NĂNG ────────────────────────────
    skipLink() {
      return esc(ui.skipLink);
    },

    // ─── THANH MỤC LỤC MỐC GIỜ (dính mép trái = trục thời gian) ──
    rail() {
      const cta = config.header?.ctaButton || {};
      const items = cues
        .map(
          (c) => `<li>
          <a href="#${c.id}" class="rail__link" data-cue-link="${c.id}">
            <span class="rail__no" aria-hidden="true">${c.no}</span>
            <time class="rail__time">${c.time}</time>
            <span class="rail__label">${esc(c.label)}</span>
          </a>
        </li>`
        )
        .join("\n        ");

      return `<nav class="rail" aria-label="${esc(rd.title || "Kịch bản chương trình")}">
    <a href="#hero" class="rail__brand" aria-label="${esc(brandName)} — về đầu trang">
      <span class="rail__mono" aria-hidden="true">${esc(monogram(brandName))}</span>
      <span class="rail__brand-text"><span class="rail__brand-name">${esc(brandName)}</span><span class="rail__brand-title">${esc(rd.title || "Kịch bản chương trình")}</span></span>
    </a>
    <ol class="rail__list">
        ${items}
    </ol>
    <a ${linkAttrs(h.ctaLink)} class="rail__cta">${icon("zalo", "rail__cta-icon")}<span class="rail__cta-text">${esc(cta.label || "Đặt lịch")}</span></a>
    <span class="rail__track" aria-hidden="true"><span class="rail__fill"></span></span>
  </nav>`;
    },

    // ─── HERO: MÀN HÌNH MÁY NHẮC CHỮ (chỉ có chữ) ───
    heroSection() {
      const hero = config.hero || {};
      const cue = cueOf("hero");
      const prompts = (Array.isArray(hero.prompter) ? hero.prompter : [])
        .filter((p) => typeof p === "string" && p.trim())
        .map((p) => `<p class="prompter__line" data-type>${esc(p.trim())}</p>`)
        .join("\n          ");

      return `<section id="hero" class="cue cue--hero" aria-labelledby="hero-title">
      <p class="slate">
        <span class="slate__time">${cue.time}</span>
        <span class="slate__name">${esc(brandName)}</span>
        <span class="slate__role">${esc(config.brand?.tagline || "")}</span>
      </p>

      <div class="prompter">
        <div class="prompter__bar">
          <span class="prompter__cam" aria-hidden="true">CAM 1 · NHẮC CHỮ</span>
          ${hero.availability ? `<span class="tally"><span class="tally__dot" aria-hidden="true"></span>${esc(hero.availability)}</span>` : ""}
        </div>
        <div class="prompter__screen">
          ${prompts}
          <h1 id="hero-title" class="prompter__title" data-cue-title>${lines(hero.heading)}</h1>
        </div>
        <p class="prompter__tc" aria-hidden="true"><span>TC</span> <span data-tc>00:00:00</span></p>
      </div>

      <div class="hero-foot">
        ${hero.subheading ? `<p class="hero-sub">${esc(hero.subheading)}</p>` : ""}
        <div class="hero-cta">
          <a ${linkAttrs(h.heroCtaLink)} class="btn btn--ink">
            ${icon("zalo", "btn__icon")}<span>${esc(hero.ctaPrimary?.label || "Đặt lịch")}</span>
          </a>
          <a href="${esc(hero.ctaSecondary?.href || "#videos")}" class="btn btn--line">
            ${icon("play", "btn__icon")}<span>${esc(hero.ctaSecondary?.label || "Xem video")}</span>
          </a>
        </div>
        ${hero.scrollIndicator ? `<p class="hero-hint" aria-hidden="true">${icon("arrowDown", "hero-hint__icon")} Cuộn để vào chương trình</p>` : ""}
      </div>
    </section>`;
    },

    // ─── MỞ MÀN: HỒ SƠ MC (call sheet) ───────────────
    aboutSection() {
      const about = config.about || {};
      const paragraphs = (about.story || "")
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((p) => `<p>${lines(p.trim())}</p>`)
        .join("\n            ");
      // Có tóm tắt → câu chuyện đầy đủ thu gọn trên điện thoại; không có → hiện luôn
      const collapsible = Boolean(about.summary && paragraphs);

      const stats = (about.stats || [])
        .map(
          (s, i) => `<div class="meter__item">
            <dt class="meter__label"><span class="meter__idx" aria-hidden="true">${pad(i + 1)}</span>${esc(s.label)}</dt>
            <dd class="meter__num${isPlaceholder(s.number) ? " meter__num--ph" : ""}">${esc(s.number)}</dd>
          </div>`
        )
        .join("\n          ");

      return `<section id="about" class="cue" aria-labelledby="about-title">
      ${cueHead(about, "about")}
      <div class="talent reveal">
        <figure class="talent__photo">
          ${pic(
            {
              src: about.portrait || "",
              mobileSrc: about.portraitMobile || undefined,
              alt: about.portraitAlt || "Ảnh chân dung",
              cls: "talent__img",
              width: 600,
              height: 800,
              mobileWidth: 400,
              mobileHeight: 500,
            },
            "Chân dung",
            "talent__ph"
          )}
          <span class="crop" aria-hidden="true"></span>
          <figcaption class="talent__tag">TALENT · ${esc(brandName)}</figcaption>
        </figure>
        <div class="talent__body">
          <dl class="sheet">
            <div class="sheet__row"><dt>Họ tên</dt><dd>${esc(brandName)}</dd></div>
            <div class="sheet__row"><dt>Vai trò</dt><dd>${esc(config.brand?.tagline || "MC")}</dd></div>
          </dl>
          ${about.summary ? `<p class="talent__summary">${esc(about.summary)}</p>` : ""}
          ${paragraphs ? `<div id="about-story" class="talent__story${collapsible ? " is-collapsible" : ""}">
            ${paragraphs}
          </div>` : ""}
          ${collapsible ? `<button type="button" class="more more--text" data-more aria-controls="about-story" aria-expanded="false" data-label-more="${esc(about.storyToggleLabel || "Đọc tiếp")}" data-label-less="${esc(ui.showLess)}">
            <span class="more__bracket" aria-hidden="true">[+]</span><span data-more-text>${esc(about.storyToggleLabel || "Đọc tiếp")}</span>
          </button>` : ""}
        </div>
      </div>
      ${stats ? `<dl class="meter reveal">
          ${stats}
      </dl>` : ""}
    </section>`;
    },

    // ─── CHƯƠNG TRÌNH: BẢNG KỊCH BẢN DỊCH VỤ ─────────
    servicesSection() {
      const svc = config.services || {};
      const items = svc.items || [];
      if (!items.length) return "";
      const shown = visibleCount(svc.mobileVisible, 3);

      const rows = items
        .map(
          (item, i) => `<li class="seg reveal${i >= shown ? " is-extra" : ""}">
          <span class="seg__no" aria-hidden="true">#${pad(i + 1)}</span>
          <figure class="seg__img">
            ${pic({ src: item.image || "", alt: item.imageAlt || item.title || "", cls: "seg__photo", width: 640, height: 640 }, "", "seg__ph", item.icon || "event")}
          </figure>
          <div class="seg__text">
            <h3 class="seg__title">${esc(item.title)}</h3>
            <p class="seg__desc">${esc(item.description)}</p>
          </div>
        </li>`
        )
        .join("\n        ");

      return `<section id="services" class="cue" aria-labelledby="services-title">
      ${cueHead(svc, "services")}
      <ol id="services-list" class="segs" data-collapsible>
        ${rows}
      </ol>
      ${moreButton("services-list", items.length - shown)}
      <p class="cue-foot reveal"><a href="#contact" class="link">Hỏi lịch &amp; nhận báo giá ${icon("arrowRight", "link__icon")}</a></p>
    </section>`;
    },

    // ─── PHÁT VTR: MÀN HÌNH KIỂM TRA + DANH SÁCH VTR ─
    videosSection() {
      const featured = vid.featured || {};
      const items = vid.items || [];
      if (!hasFeatured && !items.length) return "";
      const shown = visibleCount(vid.mobileVisible, 3);

      const list = items
        .map(
          (v, i) => `<li class="vtr reveal${i >= shown ? " is-extra" : ""}">
          <button type="button" class="vtr__btn" ${videoAttrs(v.videoUrl, v.title)}>
            <span class="vtr__thumb">
              ${pic({ src: v.thumbnail || "", alt: "", cls: "vtr__img", width: 640, height: 360 }, "", "vtr__ph", "play")}
              <span class="vtr__play">${icon("play", "vtr__play-icon")}</span>
            </span>
            <span class="vtr__text">
              <span class="vtr__code" aria-hidden="true">VTR-${pad(i + 1)}</span>
              <span class="vtr__title">${esc(v.title)}</span>
              ${v.duration ? `<span class="vtr__time"><span class="sr-only">Thời lượng </span>${esc(v.duration)}</span>` : ""}
            </span>
          </button>
        </li>`
        )
        .join("\n        ");

      return `<section id="videos" class="cue" aria-labelledby="videos-title">
      ${cueHead(vid, "videos", "Video")}
      ${hasFeatured ? `<div class="monitor reveal">
        <button type="button" class="monitor__btn" ${videoAttrs(featured.videoUrl, featured.title)}>
          <span class="monitor__screen">
            ${pic({ src: featured.thumbnail || "", alt: "", cls: "monitor__img", width: 1280, height: 720 }, "Showreel", "monitor__ph", "play")}
            <span class="monitor__safe" aria-hidden="true"></span>
            <span class="monitor__rec" aria-hidden="true"><span class="monitor__dot"></span>REC</span>
            <span class="monitor__code" aria-hidden="true">VTR-00</span>
            <span class="monitor__play">${icon("play", "monitor__play-icon")}</span>
          </span>
          <span class="monitor__cap">
            <span class="monitor__title">${esc(featured.title || "Showreel")}</span>
            ${featured.duration ? `<span class="monitor__time"><span class="sr-only">Thời lượng </span>TC ${esc(featured.duration)}</span>` : ""}
          </span>
        </button>
      </div>` : ""}
      ${list ? `<ol id="videos-list" class="vtrs" data-collapsible>
        ${list}
      </ol>
      ${moreButton("videos-list", items.length - shown)}` : ""}
    </section>`;
    },

    // ─── KHOẢNH KHẮC: TỜ CONTACT SHEET ───────────────
    gallerySection() {
      const gal = config.gallery || {};
      const items = gal.items || [];
      if (!items.length) return "";
      const shown = visibleCount(gal.mobileVisible, 4);

      // Nút lọc chỉ hiện các loại có ảnh
      const used = new Set(items.map((g) => g.category).filter(Boolean));
      const cats = (gal.categories || []).filter((c, i) => i === 0 || used.has(c));
      const filters =
        cats.length > 2
          ? `<div class="tags reveal" role="group" aria-label="Lọc ảnh theo loại sự kiện">
        ${cats
          .map(
            (cat, i) =>
              `<button type="button" class="tags__btn" data-filter="${i === 0 ? "*" : esc(cat)}" aria-pressed="${i === 0}" aria-controls="gallery-list">${esc(cat)}</button>`
          )
          .join("\n        ")}
      </div>`
          : "";

      const frames = items
        .map((g, i) => {
          const mSrc = fileExists(mobileVariant(g.src)) ? mobileVariant(g.src) : "";
          return `<li class="frame${i >= shown ? " is-extra" : ""}" data-category="${esc(g.category || "")}">
          <button type="button" class="frame__btn" data-lightbox="${esc(g.src || "")}"${mSrc ? ` data-lightbox-m="${esc(mSrc)}"` : ""} data-alt="${esc(g.alt || "")}" aria-haspopup="dialog" aria-controls="lightbox" aria-label="Phóng to ảnh: ${esc(g.alt || g.category || "ảnh sự kiện")}">
            <span class="frame__pic">
              ${pic({ src: g.src || "", alt: g.alt || "", cls: "frame__img", width: 1200, height: 900 }, g.category || "Ảnh", "frame__ph")}
            </span>
            <span class="frame__no" aria-hidden="true">${pad(i + 1)}A</span>
            <svg class="frame__mark" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true"><path d="M50 6C22 5 5 20 6 40s20 34 46 34 42-14 42-34S74 4 44 8"/></svg>
          </button>
        </li>`;
        })
        .join("\n        ");

      return `<section id="gallery" class="cue" aria-labelledby="gallery-title">
      ${cueHead(gal, "gallery", "Hình ảnh")}
      ${filters}
      <div class="film reveal">
        <span class="film__edge" aria-hidden="true">▶ ${esc(cueOf("gallery").time)} · CONTACT SHEET · ${items.length} KHUNG</span>
        <ul id="gallery-list" class="frames" data-collapsible>
        ${frames}
        </ul>
      </div>
      ${moreButton("gallery-list", items.length - shown)}
    </section>`;
    },

    // ─── PHẢN HỒI: BIÊN BẢN LỜI KHÁCH HÀNG ───────────
    testimonialsSection() {
      const test = config.testimonials || {};
      const items = test.items || [];
      if (!items.length) return "";
      const shown = visibleCount(test.mobileVisible, 2);
      const base = cueOf("testimonials").time;

      const entries = items
        .map((t, i) => {
          const rating = Math.max(0, Math.min(5, Number(t.rating) || 5));
          const stars = Array.from({ length: rating }, () => icon("star", "quote__star")).join("");
          const initial = (t.name || "?").trim().split(/\s+/).pop().charAt(0);
          return `<figure class="quote reveal${i >= shown ? " is-extra" : ""}">
          <figcaption class="quote__by">
            <span class="quote__avatar">
              ${fileExists(t.avatar) ? media({ src: t.avatar, alt: "", cls: "quote__avatar-img", width: 100, height: 100 }) : `<span class="quote__initial" data-missing="${esc(t.avatar || "")}" aria-hidden="true">${esc(initial)}</span>`}
            </span>
            <span class="quote__who">
              <span class="quote__name">${esc(t.name || "")}</span>
              <span class="quote__role">${esc(t.role || "")}</span>
            </span>
            <time class="quote__stamp" aria-hidden="true">[${clock(base, (i + 1) * 2)}]</time>
          </figcaption>
          <blockquote class="quote__text"><p>${esc(t.content || "")}</p></blockquote>
          <span class="quote__rating" role="img" aria-label="${rating} trên 5 sao">${stars}</span>
        </figure>`;
        })
        .join("\n        ");

      return `<section id="testimonials" class="cue" aria-labelledby="testimonials-title">
      ${cueHead(test, "testimonials")}
      <div id="testimonials-list" class="transcript" data-collapsible>
        ${entries}
      </div>
      ${moreButton("testimonials-list", items.length - shown)}
    </section>`;
    },

    // ─── ĐỒNG HÀNH: DANH SÁCH ĐƠN VỊ (dòng chấm nối) ─
    partnersSection() {
      const par = config.partners || {};
      const items = par.items || [];
      if (!items.length) return "";

      const rows = items
        .map(
          (p, i) => `<li class="credits__row">
          <span class="credits__role" aria-hidden="true">Đơn vị ${pad(i + 1)}</span>
          <span class="credits__dots" aria-hidden="true"></span>
          ${fileExists(p.logo)
            ? `<span class="credits__logo">${media({ src: p.logo, alt: p.name || "Đối tác", cls: "credits__img", width: 200, height: 80 })}</span>`
            : `<span class="credits__name" data-missing="${esc(p.logo || "")}">${esc(p.name)}</span>`}
        </li>`
        )
        .join("\n        ");

      return `<section id="partners" class="cue" aria-labelledby="partners-title">
      ${cueHead(par, "partners", "Tin Tưởng Bởi")}
      <ul class="credits reveal">
        ${rows}
      </ul>
    </section>`;
    },

    // ─── HỎI NHANH: GHI CHÚ ĐẠO DIỄN ─────────────────
    faqSection() {
      const faq = config.faq || {};
      const items = faq.items || [];
      if (!items.length) return "";
      const shown = visibleCount(faq.mobileVisible, 3);

      const notes = items
        .map(
          (q, i) => `<div class="note reveal${i >= shown ? " is-extra" : ""}">
          <dt class="note__q"><span class="note__tag" aria-hidden="true">H${i + 1}.</span>${esc(q.question)}</dt>
          <dd class="note__a"><span class="note__tag" aria-hidden="true">Đ.</span>${esc(q.answer)}</dd>
        </div>`
        )
        .join("\n        ");

      return `<section id="faq" class="cue" aria-labelledby="faq-title">
      ${cueHead({ ...faq, subheading: "" }, "faq", "Câu Hỏi Thường Gặp")}
      <dl id="faq-list" class="notes" data-collapsible>
        ${notes}
      </dl>
      ${moreButton("faq-list", items.length - shown)}
      ${faq.subheading ? `<p class="cue-foot reveal">${esc(faq.subheading)} <a ${linkAttrs(h.zaloLink)} class="link">Nhắn Zalo ${icon("arrowRight", "link__icon")}</a></p>` : ""}
    </section>`;
    },

    // ─── CHỐT LỊCH: KÊNH LIÊN HỆ + CUE CARD BÁO GIÁ ──
    contactSection() {
      const c = config.contact || {};
      const form = c.form || {};

      const row = (href, iconName, label, value) => {
        const inner = `${icon(iconName, "channel__icon")}<span class="channel__label">${esc(label)}</span><span class="channel__dots" aria-hidden="true"></span><span class="channel__value">${esc(value)}</span>`;
        return href
          ? `<li><a ${linkAttrs(href)} class="channel channel--link">${inner}</a></li>`
          : `<li><span class="channel channel--stack">${inner}</span></li>`;
      };

      const types = (form.eventTypes || [])
        .map(
          (t, i) => `<label class="pick">
              <input type="radio" name="eventType" value="${esc(t)}" class="pick__input"${i === 0 ? " checked" : ""}>
              <span class="pick__box" aria-hidden="true"></span>
              <span class="pick__label">${esc(t)}</span>
            </label>`
        )
        .join("\n            ");

      return `<section id="contact" class="cue cue--contact" aria-labelledby="contact-title">
      ${cueHead(c, "contact")}
      <div class="booking">
        <div class="booking__side">
          <div class="booking__quick reveal">
            <a ${linkAttrs(h.phoneLink)} class="btn btn--ink">${icon("phone", "btn__icon")}<span>Gọi ${h.hasPhone ? esc(h.phoneDisplay) : "ngay"}</span></a>
            <a ${linkAttrs(h.zaloLink)} class="btn btn--line">${icon("zalo", "btn__icon")}<span>Nhắn Zalo</span></a>
          </div>
          <ul class="channels reveal">
            ${row(h.emailLink, "email", "Email", h.emailDisplay)}
            ${row(h.facebookLink, "facebook", "Facebook", "Fanpage")}
            ${row(h.youtubeLink, "youtube", "YouTube", "Xem kênh")}
            ${c.address && !isPlaceholder(c.address) ? row(null, "location", "Khu vực", c.address) : ""}
            ${c.workingHours ? row(null, "clock", "Giờ làm việc", c.workingHours) : ""}
          </ul>
        </div>

        <!-- Phiếu yêu cầu báo giá (gửi qua ứng dụng email, không cần máy chủ) -->
        <form id="contact-form" class="cuecard reveal" data-email="${esc(h.emailRaw)}" novalidate>
          <p class="cuecard__strip" aria-hidden="true"><span>CUE CARD</span><span>${esc(cueOf("contact").time)}</span></p>
          <h3 class="cuecard__title">${esc(form.heading || "Gửi Yêu Cầu Báo Giá")}</h3>
          ${form.note ? `<p class="cuecard__note">${esc(form.note)}</p>` : ""}
          <div class="fields">
            <div class="field">
              <label for="cf-name" class="field__label">Họ và tên <span aria-hidden="true">*</span></label>
              <input id="cf-name" name="name" type="text" autocomplete="name" required class="field__input" placeholder="Nguyễn Văn A">
            </div>
            <div class="field">
              <label for="cf-phone" class="field__label">Số điện thoại <span aria-hidden="true">*</span></label>
              <input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ .]{9,15}" class="field__input" placeholder="0901 234 567">
            </div>
            ${types ? `<fieldset class="field field--wide picks">
              <legend class="field__label">Loại sự kiện</legend>
            ${types}
            </fieldset>` : ""}
            <div class="field">
              <label for="cf-date" class="field__label">Ngày dự kiến</label>
              <input id="cf-date" name="date" type="date" class="field__input">
            </div>
            <div class="field field--wide">
              <label for="cf-message" class="field__label">Lời nhắn</label>
              <textarea id="cf-message" name="message" rows="4" class="field__input field__input--area" placeholder="Địa điểm, số lượng khách, mong muốn của bạn..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn--cue">${esc(form.submitLabel || "Gửi Yêu Cầu")}${icon("send", "btn__icon")}</button>
          <p class="cuecard__status" data-form-status role="status"></p>
        </form>
      </div>
    </section>`;
    },

    // ─── CHÂN TRANG: HẾT CHƯƠNG TRÌNH ────────────────
    footerSection() {
      const f = config.footer || {};
      const end = clock(rd.startTime, cues.length * step);
      const menu = (config.header?.menuItems || [])
        .map((m) => `<li><a href="${esc(m.href)}" class="endcard__link">${esc(m.label)}</a></li>`)
        .join("\n          ");
      const social = [
        [h.phoneLink, "phone", "Gọi điện"],
        [h.zaloLink, "zalo", "Zalo"],
        [h.facebookLink, "facebook", "Facebook"],
        [h.youtubeLink, "youtube", "YouTube"],
      ]
        .map(([href, ic, label]) => `<li><a ${linkAttrs(href)} class="endcard__social" aria-label="${esc(label)}">${icon(ic, "endcard__social-icon")}</a></li>`)
        .join("\n          ");

      return `<footer class="endcard">
    <p class="endcard__end"><time>${end}</time><span>${esc(rd.endLabel || "Hết chương trình")}</span></p>
    <p class="endcard__name">${esc(brandName)}</p>
    <p class="endcard__tag">${esc(config.brand?.tagline || "")}</p>
    ${menu ? `<nav class="endcard__nav" aria-label="Mục lục chân trang">
      <ul class="endcard__menu">
          ${menu}
      </ul>
    </nav>` : ""}
    <ul class="endcard__socials">
          ${social}
    </ul>
    <p class="endcard__meta">${esc(f.copyright || "")}<br>${esc(f.madeWith || "")}</p>
    ${f.backToTop ? `<a href="#hero" class="endcard__top">${icon("arrowUp", "endcard__top-icon")} Về đầu chương trình</a>` : ""}
    <p class="mt-6 text-center text-xs text-dim">© 2026 ProfileStudio.me. Nền tảng xây dựng hồ sơ cá nhân chuyên nghiệp.</p>
  </footer>`;
    },

    // ─── ĐÈN ON AIR NỔI (liên hệ nhanh) ──────────────
    floatingButton() {
      const fb = config.floatingButton || {};
      if (fb.enabled === false) return "";
      return `<a ${linkAttrs(h.floatingLink)} class="onair" data-onair aria-label="${esc(fb.label || "Chat Zalo")}">
    ${icon(fb.type === "phone" ? "phone" : "zalo", "onair__icon")}
    <span class="onair__tag" aria-hidden="true">ON AIR</span>
  </a>`;
    },

    // ─── HỘP THOẠI: XEM ẢNH + PHÁT VIDEO ─────────────
    dialogs() {
      return `<dialog id="lightbox" class="viewer" aria-label="Xem ảnh">
    <div class="viewer__bar">
      <p class="viewer__count" data-count aria-live="polite"></p>
      <button type="button" class="viewer__btn" data-close aria-label="${esc(ui.closeLabel)}">${icon("close", "viewer__icon")}</button>
    </div>
    <figure class="viewer__stage" data-stage>
      <img alt="" class="viewer__img" data-img>
      <figcaption class="viewer__cap" data-caption></figcaption>
    </figure>
    <div class="viewer__nav">
      <button type="button" class="viewer__btn" data-prev aria-label="${esc(ui.prevLabel)}">${icon("arrowLeft", "viewer__icon")}</button>
      <button type="button" class="viewer__btn" data-next aria-label="${esc(ui.nextLabel)}">${icon("arrowRight", "viewer__icon")}</button>
    </div>
  </dialog>

  <dialog id="player" class="viewer viewer--video" aria-label="Trình phát video">
    <div class="viewer__bar">
      <p class="viewer__count" data-video-title></p>
      <button type="button" class="viewer__btn" data-close aria-label="${esc(ui.closeLabel)}">${icon("close", "viewer__icon")}</button>
    </div>
    <div class="viewer__screen" data-player></div>
    <div class="viewer__missing" data-missing-note hidden>
      <p>${esc(ui.videoMissing)}</p>
      <a href="#contact" class="btn btn--lemon" data-close-link>Liên hệ ngay</a>
    </div>
  </dialog>`;
    },
  };
}

// ─── RENDER PAGE ────────────────────────────────────────

/**
 * Ghép template + config → HTML hoàn chỉnh
 * @param {string} template — Nội dung index.html (file khung)
 * @param {object} config — SITE_CONFIG
 * @returns {{ html: string, missing: string[] }}
 */
export function renderPage(template, config) {
  const renderers = createRenderers(config);
  const missing = [];

  // Xóa comment hướng dẫn ở đầu file
  let html = template.replace(/<!--\s*ĐÂY LÀ FILE KHUNG[\s\S]*?-->\s*\n?/, "");

  // 1) Thay thế renderer blocks: {{{ @tenRenderer }}}
  html = html.replace(/\{\{\{\s*@(\w+)\s*\}\}\}/g, (match, name) => {
    if (typeof renderers[name] === "function") {
      return renderers[name]();
    }
    missing.push(`@${name}`);
    return "";
  });

  // 2) Thay thế giá trị: {{ duong.dan }}
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
    const val = path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), config);
    if (val === undefined || val === null || typeof val === "object") {
      missing.push(path);
      return "";
    }
    return esc(String(val));
  });

  return { html, missing };
}
