# 🌐 BrowserFlow Lab - Mô phỏng Chu trình Xử lý của Trình duyệt (Từ URL đến Render)

> **Phòng lab học tập tương tác trực quan**, tái hiện chi tiết từng micro-step diễn ra ngầm bên trong trình duyệt và mạng máy tính từ lúc người dùng nhập địa chỉ website cho tới khi nội dung hiển thị hoàn tất trên màn hình.
> 
> *Thiết kế giao diện được chuẩn hóa theo sơ đồ giáo trình kiến trúc trình duyệt trực quan từ Viblo.*

---

## 📑 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Sơ đồ Kiến trúc & 6 Bước Xử lý](#-sơ-đồ-kiến-trúc--6-bước-xử-lý)
3. [Hướng dẫn Cài đặt & Khởi chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
4. [Hướng dẫn Sử dụng Phòng Lab](#-hướng-dẫn-sử-dụng-phòng-lab)
5. [Cấu trúc Thư mục Dự án](#-cấu-trúc-thư-mục-dự-án)
6. [Tài liệu Tham khảo](#-tài-liệu-tham-khảo)

---

## 🎯 Giới thiệu

Khi bạn gõ `https://example.com/posts/sport` vào trình duyệt và nhấn **Enter**, hàng loạt giao thức mạng và tiến trình phần mềm phối hợp với nhau trong chưa đầy 1 giây:
* **Hệ thống mạng (Network Stack)**: Xử lý URL, DNS Cache, DNS Resolver đệ quy, TCP 3-Way Handshake, TLS 1.3 Handshake.
* **Tầng ứng dụng (Application Layer)**: Gửi HTTP/2 Request, nhận HTTP Response Header và byte dữ liệu đầu tiên (TTFB).
* **Tiến trình Renderer (Renderer Process - Blink/V8)**: Tokenization HTML, dựng cây DOM, Preload Scanner, dựng cây CSSOM, kết hợp Render Tree, tính toán kích thước hình học (Layout/Reflow), vẽ điểm ảnh (Paint) và điều phối GPU (Compositing) để hiển thị trang web.

Phòng lab này giúp bạn **nhìn thấy, điều khiển và tương tác** với toàn bộ quá trình đó một cách trực quan, dễ hiểu nhất.

---

## 🧭 Sơ đồ Kiến trúc & 6 Bước Xử lý

```text
               Tony (User)
                   │
                   ▼ (Tony enters a URL)
   ┌───────────────────────────────┐               URL Components:
   │  [Page 1]               ○○○   │               https://example.com/posts/sport
   │  [⬅][➡][↻] [🔒 https://...]   │                ↑Scheme  ↑Domain    ↑Path  ↑Resource
   │ ───────────────────────────── │
   │                               │    2. TCP connection & TLS 1.3 handshake ───▶ ┌──────────────┐
   │                               │    3. Browser sends HTTPs request ──────────▶ │  Web Server  │
   │   5. Browser renders          │ ◀── 4. Server returns HTTP response ───────── │ (72.10.20.8) │
   │      HTTP content             │                                               └──────────────┘
   └───────────────┬───────────────┘
          │        │
          │        └──────────────────────┐
          ▼ 1. Browser looks up IP        ▼ 1.1 Recursive DNS lookup
     ┌──────────┐                     ┌────────────┐
     │DNS Cache │                     │ DNS Server │
     └──────────┘                     └────────────┘
```

### Chi tiết từng giai đoạn:

| Bước | Tên giai đoạn | Cơ chế hoạt động & Giao thức |
| :--- | :--- | :--- |
| **Bước 0** | **Nhập URL & Phân tích (URL Parsing)** | Trình duyệt bóc tách URL thành: `Scheme` (`https`), `Domain` (`example.com`), `Path` (`/posts/`), `Resource` (`sport`). Kiểm tra danh sách **HSTS Preload** để cưỡng chế HTTPS (307 Internal Redirect) tránh tấn công SSL Stripping. |
| **Bước 1** | **Tra cứu DNS Cache (Local DNS)** | Kiểm tra bộ nhớ đệm: Browser DNS Cache $\rightarrow$ OS DNS Cache (`ipconfig /displaydns`) $\rightarrow$ File `hosts` cục bộ. Nếu không có (Cache MISS), chuyển sang bước 1.1. |
| **Bước 1.1** | **Truy vấn DNS Server Đệ quy** | Gửi gói tin **UDP Port 53** tới DNS Resolver (1.1.1.1 / 8.8.8.8). Resolver lần lượt hỏi: Root Server (`.`) $\rightarrow$ TLD Server (`.com`) $\rightarrow$ Authoritative Server để nhận về địa chỉ IPv4 đích: **`72.10.20.8`** (bản ghi A Record). |
| **Bước 2** | **Bắt tay TCP & TLS 1.3** | Mở kết nối Socket tới cổng 443 của máy chủ: <br>1. **Bắt tay 3 bước TCP**: `SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK` (1 RTT).<br>2. **Bắt tay TLS 1.3**: `ClientHello` (kèm tham số KeyShare) $\rightarrow$ `ServerHello` (kèm chứng chỉ X.509) $\rightarrow$ Sinh khóa phiên đối xứng (AES-256-GCM). |
| **Bước 3** | **Gửi HTTP Request** | Trình duyệt gửi bản tin **HTTP/2 GET /posts/sport** qua kênh mã hóa TLS, kèm các Request Header: `User-Agent`, `Accept`, `Accept-Encoding: gzip, deflate, br` và `Cookie`. |
| **Bước 4** | **Nhận HTTP Response & TTFB** | Máy chủ phản hồi mã trạng thái **HTTP/2 200 OK** và trả về byte dữ liệu đầu tiên (**TTFB**). Khối dữ liệu HTML ban đầu (~14KB theo thuật toán **TCP Slow Start** - initial congestion window `initcwnd`) được stream về cho Renderer. |
| **Bước 5** | **Browser Render Nội dung** | Hoàn tất chu trình **Critical Rendering Path**:<br>• **DOM**: Bytes $\rightarrow$ Characters $\rightarrow$ Tokens $\rightarrow$ Nodes.<br>• **Preload Scanner**: Tải song song CSS, JS, Fonts, Ảnh.<br>• **CSSOM**: Xử lý tính kế thừa và độ ưu tiên CSS (Render-blocking).<br>• **Render Tree**: Kết hợp DOM + CSSOM (bỏ qua `<head>` và phần tử có `display: none`).<br>• **Layout (Reflow)**: Tính toán kích thước Box Model ($x, y, w, h$).<br>• **Paint & Composite**: Vẽ điểm ảnh (Rasterization) và GPU xuất ra màn hình (FCP, LCP). |

---

## 🛠 Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu hệ thống
* **Node.js** phiên bản 18.0 trở lên.
* Trình duyệt hiện đại (Chrome, Edge, Firefox, Brave, Safari).

### Các bước khởi chạy:

1. **Di chuyển vào thư mục dự án**:
   ```bash
   cd e:\lab\progrss
   ```

2. **Cài đặt thư viện phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```
   *Mặc định ứng dụng sẽ chạy tại địa chỉ:* **[http://localhost:5173/](http://localhost:5173/)**

4. **Biên dịch bản sản xuất (Production Build)** *(Tùy chọn)*:
   ```bash
   npm run build
   ```

---

## 🎮 Hướng dẫn Sử dụng Phòng Lab

### 1. Khu vực Điều khiển (Control Bar)
* **Nút `▶ Chạy tự động`**: Tự động diễn hoạt lần lượt từ Bước 0 đến Bước 5 theo thời gian thực.
* **Nút `⏮ Bước trước` / `⏭ Bước kế tiếp`**: Di chuyển thủ công từng bước để phân tích kỹ lưỡng.
* **Nút `↺ Đặt lại`**: Khôi phục trạng thái mô phỏng về ban đầu.
* **Hộp chọn `Tốc độ`**: Tùy chỉnh tốc độ chạy tự động (`0.5x` chậm, `1.0x` chuẩn, `2.0x` nhanh).
* **Thanh Bước (Stepper)**: Nhấp trực tiếp vào bất kỳ bước nào:
  * `0. Nhập URL`
  * `1. DNS Cache`
  * `1.1 DNS Server`
  * `2. TCP & TLS`
  * `3. HTTP Request`
  * `4. HTTP Response`
  * `5. Browser Render`

### 2. Tương tác trực tiếp trên Sơ đồ (Interactive Diagram)
* **Bấm vào mũi tên hoặc nhãn chữ trên sơ đồ**: Bạn có thể nhấp trực tiếp vào các dòng nhãn như `1. Browser looks up IP in cache`, `2. Browser establishes TCP connection...` để nhảy ngay tới bước đó.
* **Khung URL Components**: Quan sát cấu trúc 4 màu phân định Scheme, Domain, Path, Resource.
* **Cửa sổ trình duyệt**:
  * Khi ở các bước 0 đến 4: Hiển thị trạng thái chờ mạng (DNS, TCP Handshake, TTFB).
  * Khi đến **Bước 5**: Cửa sổ trình duyệt sẽ **render thực tế** bài viết tin tức thể thao. Bạn có thể nhấn nút **"Tương tác trang web"** để thử nghiệm độ trễ phản hồi JavaScript (chỉ số INP).

### 3. Khu vực Tab Chức năng bên dưới
* **Tab 1 - Giải thích chi tiết Bước hiện tại**: Đọc giải thích cơ chế chuyên sâu bằng tiếng Việt và xem cấu trúc gói tin thô (DNS Packet, TCP SYN/ACK, TLS 1.3 KeyShare, HTTP Request/Response Headers).
* **Tab 2 - DevTools Network Waterfall**: Bảng mô phỏng công cụ Chrome DevTools Network, hiển thị các tài nguyên nạp song song (HTML, CSS, JS, Ảnh, Font) cùng thanh thời gian waterfall (DNS, Connect, SSL, TTFB, Download).
* **Tab 3 - Cây DOM & CSSOM**: Xem cấu trúc phân cấp cây DOM đối sánh với cây thuộc tính CSSOM.
* **Tab 4 - Trắc nghiệm kiến thức (8 câu)**: Bài tập trắc nghiệm chuyên sâu giúp bạn củng cố và kiểm tra kiến thức sau khi thực hành, kèm phản hồi đúng/sai và giải thích chi tiết cho từng câu hỏi.

---

## 📂 Cấu trúc Thư mục Dự án

```text
e:\lab\progrss\
├── index.html                     # Giao diện chính của phòng lab
├── package.json                   # Cấu hình dự án Vite & dependencies
├── vite.config.js                 # Cấu hình máy chủ Vite
├── README.md                      # Tài liệu hướng dẫn sử dụng (File này)
└── src\
    ├── css\
    │   ├── base.css               # Hệ thống màu sắc chuẩn, reset CSS, typography
    │   ├── components.css         # Styling sơ đồ kiến trúc Viblo, các box và tab
    │   └── animations.css         # Hiệu ứng chuyển động mượt mà cho gói tin
    └── js\
        ├── app.js                 # Điều phối ứng dụng chính, sự kiện click & tab
        ├── simulation-engine.js   # Quản lý State Machine cho các bước mô phỏng
        ├── scenarios.js           # Dữ liệu kịch bản và tài nguyên mạng
        ├── data\
        │   └── quiz-data.js       # Ngân hàng 8 câu hỏi trắc nghiệm kiến thức
        └── components\
            ├── pipeline-visualizer.js # Vẽ kết nối SVG và gói tin chuyển động
            ├── network-waterfall.js   # Giả lập bảng DevTools Network
            ├── tree-visualizer.js     # Trực quan hóa cây DOM/CSSOM
            ├── preview-renderer.js    # Điều khiển hiển thị nội dung trình duyệt
            ├── sandbox-playground.js  # Thử nghiệm tối ưu hóa Web Vitals
            └── quiz-system.js         # Hệ thống hiển thị câu hỏi & chấm điểm
```

---

## 📚 Tài liệu Tham khảo
1. **Chu trình xử lý của trình duyệt từ khi nhập URL đến khi trang được hiển thị** - *Viblo Community*.
2. **How Browsers Work: Behind the scenes of modern web browsers** - *Tali Garsiel & Paul Irish (web.dev)*.
3. **Populating the page: how browsers work** - *MDN Web Docs*.
4. **RFC 8446 - The Transport Layer Security (TLS) Protocol Version 1.3** - *IETF*.
5. **High Performance Browser Networking** - *Ilya Grigorik (O'Reilly)*.

---
*Chúc bạn có những trải nghiệm học tập và nghiên cứu kiến trúc trình duyệt thật trực quan và bổ ích!*
