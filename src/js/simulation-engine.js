/* ==========================================================================
   BrowserFlow Lab - Simulation Engine (Viblo Diagram Architecture)
   ========================================================================== */

export const VIBLO_STEPS = [
  {
    stepId: "0",
    title: "Bước 0: Người dùng nhập địa chỉ URL",
    shortLabel: "0. Nhập URL",
    activeArrow: "arrow-tony",
    activeBoxes: ["url-components-card", "browser-window-box"],
    viewportStatus: "Đang phân tích cú pháp URL...",
    showRenderedPage: false,
    meta: "Tiến trình: Browser Process (UI Thread)",
    explainer: "Tony gõ địa chỉ https://example.com/posts/sport vào thanh URL. Trình duyệt phân tách chuỗi ký tự thành: Giao thức (Scheme: https), Tên miền (Domain: example.com), Đường dẫn (Path: /posts/) và Tài nguyên (Resource: sport). Trình duyệt kiểm tra danh sách HSTS Preload để áp dụng HTTPS an toàn.",
    packet: `Input URL: https://example.com/posts/sport
Scheme: https:// (Port mặc định: 443)
Domain: example.com
Path: /posts/
Resource: sport
HSTS Check: Tên miền nằm trong danh sách HSTS -> Tự động chuyển tiếp 307 Internal Redirect`
  },
  {
    stepId: "1",
    title: "Bước 1: Trình duyệt tìm IP trong Bộ nhớ đệm (DNS Cache)",
    shortLabel: "1. DNS Cache",
    activeArrow: "arrow-step1",
    activeBoxes: ["browser-window-box", "box-dns-cache"],
    viewportStatus: "Đang tra cứu Local DNS Cache & file hosts...",
    showRenderedPage: false,
    meta: "Tiến trình: Network Thread -> OS Network Stack",
    explainer: "Trình duyệt kiểm tra xem IP của 'example.com' đã được lưu trong bộ nhớ đệm (Browser DNS Cache) hay chưa. Nếu không có, trình duyệt gọi hàm hệ điều hành (như getaddrinfo()) để kiểm tra DNS Cache của OS và file hosts (C:\\Windows\\System32\\drivers\\etc\\hosts). Kết quả: Cache MISS.",
    packet: `1. Browser DNS Cache Check: MISS (Không tìm thấy bản ghi)
2. OS DNS Client Cache Check: MISS
3. Hosts file (/etc/hosts) Check: Không có cấu hình tĩnh
-> Cần gửi yêu cầu truy vấn ra mạng tới DNS Server bên ngoài.`
  },
  {
    stepId: "1.1",
    title: "Bước 1.1: Trình duyệt tra cứu IP qua DNS Server đệ quy",
    shortLabel: "1.1 DNS Server",
    activeArrow: "arrow-step1-1",
    activeBoxes: ["browser-window-box", "box-dns-server"],
    viewportStatus: "Đang truy vấn DNS Server đệ quy (UDP 53)...",
    showRenderedPage: false,
    meta: "Giao thức: UDP Port 53 -> DNS Resolver (1.1.1.1 / 8.8.8.8)",
    explainer: "Do local cache bị MISS, Network Thread gửi gói tin UDP Port 53 tới DNS Recursive Resolver (thường do ISP cung cấp hoặc 1.1.1.1, 8.8.8.8). Resolver thực hiện đệ quy hỏi Root Server (.) -> hỏi TLD Server (.com) -> hỏi Authoritative Server của example.com và nhận về IP đích: 72.10.20.8.",
    packet: `[DNS Query Packet - UDP 53]
Query: example.com (Type: A, Class: IN)
Recursive resolution path:
  Root Server (.) -> TLD Server (.com) -> ns1.example.com
[DNS Response]
Answer: example.com -> A Record: 72.10.20.8 (TTL: 300s)
IP được nạp vào OS Cache & Browser Cache.`
  },
  {
    stepId: "2",
    title: "Bước 2: Bắt tay kết nối TCP và bảo mật SSL/TLS",
    shortLabel: "2. TCP & TLS",
    activeArrow: "arrow-step2",
    activeBoxes: ["browser-window-box", "box-web-server"],
    viewportStatus: "Bắt tay 3 bước TCP & TLS 1.3 với Web Server (72.10.20.8)...",
    showRenderedPage: false,
    meta: "Giao thức: TCP Port 443 + TLS 1.3",
    explainer: "Khi đã có IP 72.10.20.8, trình duyệt mở socket kết nối tới cổng 443 của Web Server. Đầu tiên thực hiện bắt tay 3 bước TCP (SYN -> SYN-ACK -> ACK) trong 1 RTT. Tiếp theo, trình duyệt và máy chủ thực hiện bắt tay bảo mật TLS 1.3 (ClientHello kèm KeyShare -> ServerHello kèm Chứng chỉ X.509) để tạo Session Key mã hóa đối xứng AES-256.",
    packet: `1. TCP 3-Way Handshake:
   Client -> [SYN] (Seq=0)
   Server -> [SYN, ACK] (Seq=0, Ack=1)
   Client -> [ACK] (Seq=1, Ack=1) [1 RTT: 28ms]
2. TLS 1.3 Handshake:
   ClientHello: CipherSuites=TLS_AES_256_GCM_SHA384, KeyShare=X25519
   ServerHello: SelectedCipher, ServerCert (Issuer: Let's Encrypt), Finished
3. Kênh truyền mã hóa an toàn hoàn tất thiết lập.`
  },
  {
    stepId: "3",
    title: "Bước 3: Trình duyệt gửi HTTP Request tới Máy chủ",
    shortLabel: "3. HTTP Request",
    activeArrow: "arrow-step3",
    activeBoxes: ["browser-window-box", "box-web-server"],
    viewportStatus: "Đã gửi bản tin GET /posts/sport...",
    showRenderedPage: false,
    meta: "Giao thức: HTTP/2 qua kết nối TLS bảo mật",
    explainer: "Sau khi đường truyền mã hóa sẵn sàng, trình duyệt gửi bản tin HTTP GET /posts/sport kèm các Request Headers như User-Agent, Accept: text/html, Accept-Encoding: gzip, deflate, br (hỗ trợ nén dữ liệu), và Cookie phiên làm việc.",
    packet: `[HTTP/2 GET Request Stream]
:method: GET
:scheme: https
:authority: example.com
:path: /posts/sport
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
accept-encoding: gzip, deflate, br
accept-language: vi-VN,vi;q=0.9,en-US;q=0.8`
  },
  {
    stepId: "4",
    title: "Bước 4: Máy chủ xử lý và trả về HTTP Response",
    shortLabel: "4. HTTP Response",
    activeArrow: "arrow-step4",
    activeBoxes: ["box-web-server", "browser-window-box"],
    viewportStatus: "Đã nhận phản hồi HTTP 200 OK và byte đầu tiên (TTFB: 42ms)...",
    showRenderedPage: false,
    meta: "Chỉ số: Time to First Byte (TTFB) ≈ 42ms",
    explainer: "Web Server xử lý yêu cầu, định tuyến tới ứng dụng và gửi trả dòng trạng thái HTTP/2 200 OK kèm các Response Headers (Content-Type: text/html; charset=UTF-8, Content-Encoding: br). Khối dữ liệu HTML ban đầu (~14KB - TCP Slow Start initial window) được truyền về máy khách và stream tới Renderer Process.",
    packet: `[HTTP/2 200 OK Response Stream]
:status: 200 OK
content-type: text/html; charset=UTF-8
content-encoding: br
cache-control: max-age=3600, public
date: Fri, 04 Sep 2026 15:45:00 GMT
server: nginx/1.24.0

Time to First Byte (TTFB): 42ms
Dữ liệu HTML thô bắt đầu được nạp vào luồng xử lý của Renderer.`
  },
  {
    stepId: "5",
    title: "Bước 5: Trình duyệt biên dịch và Render toàn bộ nội dung",
    shortLabel: "5. Browser Render",
    activeArrow: null,
    activeBoxes: ["browser-window-box"],
    viewportStatus: "Hoàn tất Render (DOM + CSSOM + Layout + Paint)!",
    showRenderedPage: true,
    meta: "Tiến trình: Renderer Process (Blink + V8 Engine) & GPU Process",
    explainer: "Renderer Process thực hiện chu trình Critical Rendering Path:\n1. Tokenization & DOM: Chuyển chuỗi HTML thành Cây DOM.\n2. Preload Scanner: Quét trước và tải song song file CSS, JS, ảnh.\n3. CSSOM: Phân tích cú pháp CSS thành Cây CSSOM.\n4. Render Tree: Kết hợp DOM và CSSOM (loại bỏ thẻ <head> và các node có display: none).\n5. Layout (Reflow): Tính toán kích thước Box Model (width, height, x, y).\n6. Paint & Composite: Vẽ các điểm ảnh lên Layer và GPU Process hiển thị trang web hoàn chỉnh lên màn hình người dùng!",
    packet: `[Critical Rendering Path Pipeline]
1. DOM Tree: 12 nodes được khởi tạo (html, head, body, article, h2, p, button...)
2. CSSOM: Áp dụng style font, padding, background gradient, display
3. Render Tree: Ghép DOM + CSSOM thành công
4. Layout Reflow: Tính toán viewport 480x320
5. Paint & GPU Rasterization: Vẽ các quads bitmap lên khung nhìn
Chỉ số Web Vitals:
- FCP (First Contentful Paint): 0.58s
- LCP (Largest Contentful Paint): 1.12s
- Trạng thái: Tương tác tức thì (Interactive)`
  }
];

export class SimulationEngine {
  constructor() {
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.speed = 1.0;
    this.timer = null;
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  getCurrentStep() {
    return VIBLO_STEPS[this.currentStepIndex];
  }

  setSpeed(speed) {
    this.speed = parseFloat(speed);
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.emit("playStateChange", true);
    this.scheduleNext();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.emit("playStateChange", false);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  scheduleNext() {
    if (!this.isPlaying) return;
    const baseDelay = 3000;
    const delay = baseDelay / this.speed;

    this.timer = setTimeout(() => {
      const hasNext = this.stepNext();
      if (hasNext && this.isPlaying) {
        this.scheduleNext();
      } else {
        this.pause();
      }
    }, delay);
  }

  stepNext() {
    if (this.currentStepIndex < VIBLO_STEPS.length - 1) {
      this.currentStepIndex++;
      this.notifyUpdate();
      return true;
    } else {
      this.emit("simulationComplete");
      return false;
    }
  }

  stepPrev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notifyUpdate();
    }
  }

  goToStep(stepId) {
    const idx = VIBLO_STEPS.findIndex(s => s.stepId === String(stepId));
    if (idx !== -1) {
      this.currentStepIndex = idx;
      this.notifyUpdate();
    }
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.notifyUpdate();
    this.emit("reset");
  }

  notifyUpdate() {
    const step = this.getCurrentStep();
    this.emit("stepChange", {
      stepIndex: this.currentStepIndex,
      step: step
    });
  }
}
