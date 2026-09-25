# DLove — bản hoàn chỉnh

Đây là bản tái dựng tương tác từ recording bạn cung cấp, ưu tiên độ giống visual/animation và trải nghiệm mobile.

## Chạy

Có thể mở `index.html` trực tiếp hoặc dùng static server:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Luồng tương tác

1. Màn hình mở đầu giữ frame cuối của cảnh intro.
2. Ấn giữ vùng mặt trăng khoảng 650ms → cảnh bay.
3. Cảnh bay kết thúc → cảnh trái tim.
4. Nút quà hoặc chạm màn hình ở cảnh trái tim → mở thư.
5. Nút `×` → quay lại trái tim.
6. Nút loa → bật/tắt nhạc.

## Chỉnh nội dung sau này

Sửa `config.js` trước. Các text như tiêu đề, câu hướng dẫn, loading text và đường dẫn asset đều nằm ở đây.

### Quan trọng về phần nội dung trong video

Các file `intro.mp4`, `flying.mp4`, `heart.mp4`, `letter.mp4` hiện là asset hình động đã được dựng từ recording để giữ độ giống cao. Vì vậy chữ/hình nằm **bên trong video** không thể sửa bằng HTML.

Nếu muốn thay nội dung mà vẫn giữ animation, có hai hướng:

- Thay trực tiếp các file MP4 bằng scene MP4 mới.
- Hoặc chuyển từng scene sang HTML/CSS/Canvas/Three.js. Khi đó toàn bộ chữ, ảnh, particle, vị trí và timing sẽ sửa được trong code.

Cấu trúc đã được tách `config.js` / `app.js` / `styles.css` để thuận tiện chuyển sang hướng thứ hai.
