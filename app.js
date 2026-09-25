(() => {
  const C = window.DLOVE_CONFIG || {};
  const $ = (id) => document.getElementById(id);

  const app = $("app");
  const video = $("scene");
  const holdZone = $("holdZone");
  const holdHint = $("holdHint");
  const gift = $("gift");
  const letterHit = $("letterHit");
  const close = $("close");
  const sound = $("sound");
  const soundImg = $("soundImg");
  const music = $("music");
  const loading = $("loading");
  const toast = $("toast");
  const pageTitle = $("pageTitle");

  const clips = C.clips || {};
  const state = { name: "intro", holdTimer: null, pressing: false, audioOn: false, switching: false };

  pageTitle.textContent = C.title || "DLove";
  holdHint.textContent = C.content?.holdHint || "Ấn giữ vào mặt trăng";
  close.setAttribute("aria-label", C.content?.letterClose || "Đóng thư");
  loading.querySelector("span").textContent = C.content?.loading || "Đang chuẩn bị món quà…";

  const preload = Object.values(clips).map(src => new Promise(resolve => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.src = src;
    v.onloadeddata = () => resolve();
    v.onerror = () => resolve();
  }));

  function setState(name) {
    state.name = name;
    app.dataset.scene = name;
    app.className = `scene-${name}`;
    holdHint.hidden = !((name === "intro") && C.showHint !== false);
    holdZone.hidden = name !== "intro";
    letterHit.hidden = !(name === "heart" || name === "flying");
    gift.hidden = name === "intro" || name === "letter";
    close.hidden = name !== "letter";
  }

  function safePlay() {
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  function showLoading(on) {
    loading.classList.toggle("visible", on);
  }

  async function playScene(name, { loop = false, fade = true } = {}) {
    if (!clips[name] || state.switching && name !== "letter") return;
    state.switching = true;
    setState(name);

    if (fade) app.classList.add("is-switching");
    showLoading(!video.readyState);

    video.pause();
    video.loop = loop;
    video.src = clips[name];
    video.currentTime = 0;
    video.muted = true;

    try { video.load(); } catch (_) {}
    await new Promise(resolve => {
      if (video.readyState >= 2) return resolve();
      const done = () => { cleanup(); resolve(); };
      const cleanup = () => {
        video.removeEventListener("loadeddata", done);
        video.removeEventListener("error", done);
      };
      video.addEventListener("loadeddata", done, { once: true });
      video.addEventListener("error", done, { once: true });
    });

    showLoading(false);
    safePlay();
    if (fade) setTimeout(() => app.classList.remove("is-switching"), C.transitionFade || 420);
    state.switching = false;
  }

  video.addEventListener("ended", () => {
    if (state.name === "intro") {
      // Giữ frame cuối để người dùng có thời gian ấn giữ.
      video.currentTime = Math.max(0, video.duration - 0.04);
      video.pause();
    } else if (state.name === "flying") {
      playScene("heart", { loop: true });
    } else if (state.name === "heart") {
      video.currentTime = Math.max(0, video.duration - 0.04);
      video.pause();
    } else if (state.name === "letter") {
      video.currentTime = Math.max(0, video.duration - 0.04);
      video.pause();
    }
  });

  function startHold(e) {
    if (state.name !== "intro" || state.pressing) return;
    e?.preventDefault?.();
    state.pressing = true;
    holdZone.classList.add("holding");
    state.holdTimer = setTimeout(() => {
      state.pressing = false;
      holdZone.classList.remove("holding");
      playScene("flying");
    }, C.holdDuration || 650);
  }

  function stopHold() {
    if (!state.pressing) return;
    state.pressing = false;
    clearTimeout(state.holdTimer);
    holdZone.classList.remove("holding");
  }

  ["pointerdown", "touchstart"].forEach(type => holdZone.addEventListener(type, startHold, { passive: false }));
  ["pointerup", "pointercancel", "pointerleave", "touchend", "touchcancel"].forEach(type => holdZone.addEventListener(type, stopHold, { passive: true }));

  function openLetter() {
    if (state.name === "letter") return;
    playScene("letter");
  }
  gift.addEventListener("click", openLetter);
  letterHit.addEventListener("click", openLetter);

  close.addEventListener("click", () => playScene("heart", { loop: true }));

  sound.addEventListener("click", async () => {
    try {
      if (music.paused) {
        music.volume = C.musicVolume ?? 0.72;
        await music.play();
        state.audioOn = true;
        soundImg.style.opacity = "1";
        sound.setAttribute("aria-label", "Tắt âm thanh");
      } else {
        music.pause();
        state.audioOn = false;
        soundImg.style.opacity = ".48";
        sound.setAttribute("aria-label", "Bật âm thanh");
      }
    } catch (_) {
      showToast("Chạm lại nút âm thanh để phát nhạc");
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      state.pressing = false;
      clearTimeout(state.holdTimer);
      holdZone.classList.remove("holding");
    }
  });

  // Prevent accidental page scrolling/zoom gestures on mobile.
  document.addEventListener("gesturestart", e => e.preventDefault(), { passive: false });

  setState("intro");
  music.volume = C.musicVolume ?? 0.72;
  soundImg.style.opacity = ".48";
  Promise.all(preload).finally(() => {
    showLoading(false);
    playScene("intro", { fade: false });
  });
})();
