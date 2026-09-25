/* ==========================================================
   DLOVE CUSTOM CONTENT
   Bạn có thể sửa các giá trị dưới đây mà không cần đụng app.js.
   ========================================================== */
window.DLOVE_CONFIG = {
  title: "DLove · Món quà nhỏ",
  holdDuration: 650,
  transitionFade: 420,
  musicVolume: 0.72,
  showHint: true,
  clips: {
    intro: "assets/intro.mp4",
    flying: "assets/flying.mp4",
    heart: "assets/heart.mp4",
    letter: "assets/letter.mp4"
  },
  // Nội dung dành cho phiên bản DOM/custom sau này.
  // Có thể đổi ở đây trước khi bạn thay asset video bằng scene HTML thật.
  content: {
    holdHint: "Ấn giữ vào mặt trăng",
    loading: "Đang chuẩn bị món quà…",
    letterClose: "Đóng thư"
  }
};
