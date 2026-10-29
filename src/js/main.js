/**
 * ═══════════════════════════════════════════════════════════
 *  MAIN.JS — JavaScript phía trình duyệt (giao diện "Rundown")
 *  - Máy nhắc chữ: gõ từng ký tự các dòng mở đầu, rồi "bật sáng" tiêu đề
 *  - Thanh mục lục mốc giờ: sáng theo tiết mục đang xem + vạch tiến trình đỏ
 *  - Tên tiết mục tự gõ khi cuộn tới, nội dung hiện dần
 *  - Thu gọn danh sách trên điện thoại, lọc ảnh, lightbox (vuốt), trình phát video
 *  - Đèn ON AIR nổi, form báo giá gửi qua ứng dụng email
 *  Không dùng thư viện ngoài. Trang vẫn đọc được đầy đủ khi không có JS.
 * ═══════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── GÕ CHỮ ────────────────────────────────────────────
  /**
   * Tách chữ của `el` thành từng ký tự (span .ch, ẩn bằng visibility → không xô bố cục),
   * bản đầy đủ để lại cho trình đọc màn hình. Trả về Promise khi gõ xong.
   */
  function typeText(el, speed = 38) {
    const text = el.textContent;
    if (reduceMotion || !text.trim()) return Promise.resolve();

    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    const chars = Array.from(text).map((ch) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      vis.appendChild(s);
      return s;
    });
    el.replaceChildren(sr, vis);
    el.classList.add("is-typed");

    // Con trỏ = bóng đổ của ký tự vừa gõ (.cur) → mỗi nhịp chỉ đổi class, không chèn DOM, không dựng lại bố cục
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        if (i < chars.length) {
          if (i) chars[i - 1].classList.remove("cur");
          chars[i].classList.add("on", "cur");
          i++;
          // Dừng lâu hơn một chút sau dấu câu, như người đọc lấy hơi
          setTimeout(tick, /[,.!?…]/.test(chars[i - 1].textContent) ? speed * 6 : speed);
        } else {
          setTimeout(() => {
            chars[i - 1]?.classList.remove("cur");
            resolve();
          }, 260);
        }
      };
      tick();
    });
  }

  // ─── MÁY NHẮC CHỮ (HERO) ──────────────────────────────
  const prompter = $(".prompter");
  if (prompter) {
    const lines = $$(".prompter__line[data-type]", prompter);
    const title = $("[data-cue-title]", prompter);

    if (!reduceMotion && lines.length) {
      prompter.classList.add("is-typing");
      (async () => {
        await new Promise((r) => setTimeout(r, 350));
        for (const line of lines) {
          line.classList.add("is-current");
          await typeText(line, 42);
          line.classList.remove("is-current");
        }
        title?.classList.add("is-live");
        prompter.classList.remove("is-typing");
      })();
    } else {
      lines.forEach((l) => l.classList.add("is-typed"));
      title?.classList.add("is-live");
    }

    // Đồng hồ timecode chạy từ lúc mở trang (chỉ trang trí)
    const tc = $("[data-tc]", prompter);
    if (tc) {
      const start = Date.now();
      const pad = (n) => String(n).padStart(2, "0");
      setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
      }, 1000);
    }
  }

  // ─── HIỆN DẦN + GÕ TÊN TIẾT MỤC KHI CUỘN TỚI ──────────
  const revealTargets = $$(".reveal, .cue-head");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          io.unobserve(el);
          if (el.classList.contains("cue-head")) {
            const label = $(".cue-head__label", el);
            if (label) typeText(label, 34);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  // ─── THANH MỤC LỤC: TIẾT MỤC ĐANG XEM ─────────────────
  const railLinks = $$("[data-cue-link]");
  const cues = railLinks.map((a) => document.getElementById(a.dataset.cueLink)).filter(Boolean);

  function setCurrent(id) {
    let passed = true;
    railLinks.forEach((a) => {
      const on = a.dataset.cueLink === id;
      if (on) {
        a.setAttribute("aria-current", "true");
        passed = false;
      } else {
        a.removeAttribute("aria-current");
      }
      a.classList.toggle("is-done", passed && !on);
    });
    cues.forEach((c) => c.classList.toggle("is-current", c.id === id));
  }

  if (cues.length && "IntersectionObserver" in window) {
    // Tiết mục "đang diễn" = tiết mục cắt qua đường ngang 35% chiều cao màn hình
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -64% 0px" }
    );
    cues.forEach((c) => spy.observe(c));
    setCurrent(cues[0].id);
  }

  // Vạch tiến trình đỏ trên trục thời gian
  const fill = $(".rail__fill");
  if (fill) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    requestAnimationFrame(update);
  }

  // ─── THU GỌN / MỞ RỘNG ("Xem thêm (N)") ───────────────
  $$("[data-more]").forEach((btn) => {
    const target = document.getElementById(btn.getAttribute("aria-controls"));
    const text = $("[data-more-text]", btn);
    if (!target) return;
    btn.addEventListener("click", () => {
      const open = !target.classList.contains("is-open");
      target.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (text) text.textContent = open ? btn.dataset.labelLess : btn.dataset.labelMore;
      // Thu gọn lại → đưa người xem về đầu danh sách để không bị "lạc"
      if (!open) target.closest(".cue")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  // ─── LỌC ẢNH ──────────────────────────────────────────
  const galleryList = $("#gallery-list");
  const filterBtns = $$("[data-filter]");
  const galleryMore = $('[data-more][aria-controls="gallery-list"]');
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$(".frame", galleryList).forEach((li) => {
        li.hidden = cat !== "*" && li.dataset.category !== cat;
      });
      // Đang lọc → hiện đủ ảnh của loại đó, ẩn nút "Xem thêm"
      if (galleryList) {
        const filtering = cat !== "*";
        galleryList.classList.toggle("is-open", filtering || galleryMore?.getAttribute("aria-expanded") === "true");
        if (galleryMore) galleryMore.hidden = filtering;
      }
    });
  });

  // ─── HỘP THOẠI CHUNG ──────────────────────────────────
  /** Mở <dialog> dạng modal, khóa cuộn trang, trả focus về nút đã bấm khi đóng */
  function setupDialog(dlg, onClose) {
    let opener = null;
    dlg.addEventListener("close", () => {
      document.body.classList.remove("is-locked");
      onClose?.();
      opener?.focus();
    });
    // Bấm ra vùng nền ngoài nội dung → đóng
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
    $$("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
    return function open(from) {
      opener = from || document.activeElement;
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
      document.body.classList.add("is-locked");
    };
  }

  // ─── LIGHTBOX ẢNH ─────────────────────────────────────
  const lightbox = $("#lightbox");
  if (lightbox) {
    const img = $("[data-img]", lightbox);
    const cap = $("[data-caption]", lightbox);
    const count = $("[data-count]", lightbox);
    const isPhone = window.matchMedia("(max-width: 767px)");
    let items = [];
    let index = 0;

    const open = setupDialog(lightbox, () => img.removeAttribute("src"));

    function show(i) {
      index = (i + items.length) % items.length;
      const btn = items[index];
      img.src = (isPhone.matches && btn.dataset.lightboxM) || btn.dataset.lightbox;
      img.alt = btn.dataset.alt || "";
      cap.textContent = btn.dataset.alt || "";
      count.textContent = `KHUNG ${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    }

    $$("[data-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Chỉ chuyển giữa các ảnh đang hiện (theo bộ lọc + thu gọn)
        items = $$("[data-lightbox]").filter((b) => b.offsetParent !== null);
        show(Math.max(0, items.indexOf(btn)));
        open(btn);
      });
    });

    $("[data-prev]", lightbox).addEventListener("click", () => show(index - 1));
    $("[data-next]", lightbox).addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    // Vuốt ngang trên điện thoại để chuyển ảnh
    const stage = $("[data-stage]", lightbox);
    let x0 = null;
    let y0 = null;
    stage.addEventListener("pointerdown", (e) => {
      x0 = e.clientX;
      y0 = e.clientY;
    });
    stage.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      x0 = y0 = null;
    });
    stage.addEventListener("pointercancel", () => (x0 = y0 = null));
  }

  // ─── TRÌNH PHÁT VIDEO ─────────────────────────────────
  const player = $("#player");
  if (player) {
    const screen = $("[data-player]", player);
    const title = $("[data-video-title]", player);
    const note = $("[data-missing-note]", player);
    const open = setupDialog(player, () => screen.replaceChildren());

    /** Link YouTube → link nhúng (youtube-nocookie); file .mp4/.webm → null (dùng thẻ <video>) */
    function toEmbed(url) {
      try {
        const u = new URL(url, location.href);
        let id = "";
        if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
        else if (u.hostname.includes("youtube")) {
          id = u.searchParams.get("v") || (u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/) || [])[2] || "";
        }
        if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
      } catch {
        /* link lạ → thử phát như file */
      }
      return null;
    }

    $$("[data-video], [data-video-missing]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.dataset.video;
        title.textContent = btn.dataset.title ? `▶ ${btn.dataset.title}` : "";
        screen.replaceChildren();
        note.hidden = Boolean(url);
        if (url) {
          const embed = toEmbed(url);
          if (embed) {
            const f = document.createElement("iframe");
            f.src = embed;
            f.title = btn.dataset.title || "Video";
            f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
            f.allowFullscreen = true;
            screen.appendChild(f);
          } else {
            const v = document.createElement("video");
            v.src = url;
            v.controls = true;
            v.autoplay = true;
            v.playsInline = true;
            screen.appendChild(v);
          }
        }
        open(btn);
      });
    });

    $("[data-close-link]", player)?.addEventListener("click", () => player.close());
  }

  // ─── ĐÈN ON AIR NỔI ───────────────────────────────────
  // Hiện khi đã cuộn qua màn hình nhắc chữ, ẩn khi đang xem mục Chốt lịch
  const onair = $("[data-onair]");
  const hero = $("#hero");
  const contact = $("#contact");
  if (onair && "IntersectionObserver" in window) {
    let pastHero = false;
    let atContact = false;
    const sync = () => onair.classList.toggle("is-shown", pastHero && !atContact);
    if (hero) {
      new IntersectionObserver(([e]) => {
        pastHero = !e.isIntersecting;
        sync();
      }, { rootMargin: "0px 0px -40% 0px" }).observe(hero);
    }
    if (contact) {
      new IntersectionObserver(([e]) => {
        atContact = e.isIntersecting;
        sync();
      }, { rootMargin: "0px 0px -30% 0px" }).observe(contact);
    }
  } else if (onair) {
    onair.classList.add("is-shown");
  }

  // ─── FORM BÁO GIÁ ─────────────────────────────────────
  const form = $("#contact-form");
  if (form) {
    const status = $("[data-form-status]", form);
    const say = (msg, isError) => {
      status.textContent = msg;
      status.classList.toggle("is-error", Boolean(isError));
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = $$("[required]", form);
      let firstBad = null;
      required.forEach((input) => {
        const bad = !input.value.trim() || !input.checkValidity();
        input.setAttribute("aria-invalid", String(bad));
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) {
        say("› Vui lòng điền đúng họ tên và số điện thoại.", true);
        firstBad.focus();
        return;
      }

      const data = new FormData(form);
      const email = form.dataset.email;
      if (!email) {
        say("› Email chưa được cài đặt — vui lòng bấm Gọi hoặc Nhắn Zalo ở trên.", true);
        return;
      }
      const subject = `Yêu cầu báo giá MC — ${data.get("eventType") || "Sự kiện"}`;
      const body = [
        `Họ tên: ${data.get("name")}`,
        `Điện thoại: ${data.get("phone")}`,
        `Loại sự kiện: ${data.get("eventType") || ""}`,
        `Ngày dự kiến: ${data.get("date") || "chưa chọn"}`,
        "",
        `${data.get("message") || ""}`,
      ].join("\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      say("› Đang mở ứng dụng email của bạn…");
    });

    $$("[required]", form).forEach((input) =>
      input.addEventListener("input", () => input.removeAttribute("aria-invalid"))
    );
  }
})();
