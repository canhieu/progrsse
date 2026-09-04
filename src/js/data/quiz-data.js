/* ==========================================================================
   BrowserFlow Lab - Quiz Data (8 In-depth Browser Questions)
   ========================================================================== */

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "1. Tại sao cơ chế HSTS Preload lại giúp trình duyệt ngăn chặn tấn công SSL Stripping tốt hơn một phản hồi HTTP 301 Redirect từ server?",
    options: [
      { id: "A", text: "A. Vì HSTS Preload mã hóa toàn bộ dữ liệu bằng thuật toán lượng tử." },
      { id: "B", text: "B. Vì trình duyệt tự động chuyển hướng nội bộ (307 Internal Redirect) sang HTTPS trước khi gửi bất kỳ gói tin nào qua mạng, loại bỏ cửa sổ bị nghe lén ở request đầu tiên.", correct: true },
      { id: "C", text: "C. Vì HSTS Preload bỏ qua việc kiểm tra chứng chỉ SSL/TLS của website." },
      { id: "D", text: "D. Vì HSTS Preload lưu toàn bộ mã HTML vào bộ nhớ đệm vĩnh viễn." }
    ],
    explanation: "Chính xác! Khi chưa có HSTS Preload, yêu cầu đầu tiên người dùng gõ thường là HTTP plaintext (hoặc trình duyệt ngầm định gửi HTTP). Kẻ tấn công trên cùng mạng (Wi-Fi công cộng) có thể chặn request này và tước bỏ SSL (SSL Stripping). HSTS Preload được nạp sẵn vào mã nguồn trình duyệt, khiến trình duyệt sinh mã điều hướng nội bộ 307 và chỉ giao tiếp qua HTTPS."
  },
  {
    id: 2,
    question: "2. Trong phân giải tên miền DNS đệ quy, nếu Cache ở Browser, OS và Router đều bị MISS, Resolver sẽ gửi yêu cầu lần lượt tới các máy chủ nào?",
    options: [
      { id: "A", text: "A. Web Origin Server -> Authoritative Nameserver -> Root Nameserver" },
      { id: "B", text: "B. Root Nameserver (.) -> TLD Nameserver (.com/.vn) -> Authoritative Nameserver", correct: true },
      { id: "C", text: "C. Google DNS (8.8.8.8) -> Cloudflare (1.1.1.1) -> Server lưu trữ" },
      { id: "D", text: "D. TLD Nameserver -> Root Nameserver -> File hosts trên máy cục bộ" }
    ],
    explanation: "Đúng! Trình phân giải đệ quy (Recursive Resolver) bắt đầu hỏi Root Nameserver (gốc '.') để biết máy chủ TLD (Top-Level Domain, ví dụ: .com, .vn), sau đó hỏi TLD để lấy địa chỉ Authoritative Nameserver của tên miền, và cuối cùng Authoritative Nameserver sẽ trả về bản ghi A (IPv4) hoặc AAAA (IPv6) thực sự của website."
  },
  {
    id: 3,
    question: "3. Trong TLS 1.3, số vòng truyền nhận (Round Trip Time - RTT) cần thiết để hoàn tất bắt tay TLS được rút ngắn xuống còn bao nhiêu so với TLS 1.2?",
    options: [
      { id: "A", text: "A. Giảm từ 2 RTT xuống còn 1 RTT (hoặc 0-RTT khi khôi phục phiên)", correct: true },
      { id: "B", text: "B. Giảm từ 5 RTT xuống còn 3 RTT" },
      { id: "C", text: "C. Không thay đổi, vẫn là 2 RTT" },
      { id: "D", text: "D. Tăng lên 3 RTT để tăng cường độ dài khóa mã hóa" }
    ],
    explanation: "Chính xác! Trong TLS 1.2 cần 2 RTT để thương lượng cipher suite và trao đổi khóa. TLS 1.3 gửi kèm tham số chia sẻ khóa (Key Share) ngay trong bản tin Client Hello đầu tiên, giúp bắt tay hoàn tất chỉ sau 1 RTT (và hỗ trợ 0-RTT Resumption khi kết nối lại), giúp giảm đáng kể độ trễ mạng ban đầu."
  },
  {
    id: 4,
    question: "4. Gói tin HTML đầu tiên truyền về thường có kích thước khoảng ~14KB. Con số này bắt nguồn từ nguyên lý mạng nào?",
    options: [
      { id: "A", text: "A. Giới hạn kích thước của thẻ <head> theo chuẩn W3C" },
      { id: "B", text: "B. Thuật toán TCP Slow Start với cửa sổ tắc nghẽn ban đầu (Initial Congestion Window - initcwnd) thường là 10 gói TCP MSS (khoảng 14.6 KB)", correct: true },
      { id: "C", text: "C. Dung lượng tối đa của một bản ghi DNS" },
      { id: "D", text: "D. Bộ đệm RAM tối đa của card mạng Wi-Fi" }
    ],
    explanation: "Chuẩn xác! Để tránh gây nghẽn mạng đột ngột trên đường truyền, giao thức TCP sử dụng cơ chế Slow Start. Server bắt đầu với cửa sổ tắc nghẽn (initcwnd) là 10 Segment (mỗi segment khoảng 1460 bytes ≈ 14.6 KB). Do đó, giữ phần Critical HTML & CSS trong 14KB đầu tiên sẽ giúp trang web đạt First Paint nhanh nhất mà không phải chờ thêm RTT tiếp theo."
  },
  {
    id: 5,
    question: "5. Nhiệm vụ tối quan trọng của 'Preload Scanner' (Bộ quét tải trước) trong trình duyệt là gì?",
    options: [
      { id: "A", text: "A. Quét virus và mã độc trong các tệp script trước khi thực thi" },
      { id: "B", text: "B. Quét trước mã HTML thô để phát hiện các tài nguyên bên ngoài (CSS, Script, Ảnh) và bắt đầu tải song song trong khi HTML Parser chính đang bị chặn", correct: true },
      { id: "C", text: "C. Tự động nén ảnh WebP trên máy người dùng" },
      { id: "D", text: "D. Biên dịch mã JavaScript sang ngôn ngữ Assembly" }
    ],
    explanation: "Rất chính xác! Khi HTML parser chính bị tạm dừng do gặp thẻ `<script>` đồng bộ (parser-blocking), Preload Scanner chạy song song ở tiến trình phụ sẽ quét nhanh các thẻ `<link rel='stylesheet'>`, `<script>`, `<img>` tiếp theo trong văn bản và gửi yêu cầu tải về qua mạng ngay lập tức, tiết kiệm rất nhiều thời gian chờ đợi."
  },
  {
    id: 6,
    question: "6. Điểm khác biệt mấu chốt giữa thuộc tính 'defer' và 'async' trên thẻ `<script>` là gì?",
    options: [
      { id: "A", text: "A. 'async' chạy sau khi DOM dựng xong, còn 'defer' chạy ngay khi tải xong" },
      { id: "B", text: "B. Cả hai đều tải bất đồng bộ, nhưng 'defer' giữ đúng thứ tự xuất hiện và chỉ chạy sau khi DOM đã parsed xong (trước DOMContentLoaded); còn 'async' tải xong lúc nào là dừng parser để thực thi ngay lúc đó", correct: true },
      { id: "C", text: "C. 'defer' chỉ hỗ trợ file nhỏ hơn 100KB, 'async' hỗ trợ file lớn" },
      { id: "D", text: "D. 'defer' không gửi cookie khi tải script" }
    ],
    explanation: "Đúng! Cả hai đều không chặn quá trình parse HTML khi đang tải (download). Tuy nhiên, script 'async' một khi tải xong sẽ lập tức tạm dừng HTML parser để chạy (không đảm bảo thứ tự). Script 'defer' luôn chờ HTML parser hoàn thành toàn bộ cây DOM và thực thi tuần tự theo đúng thứ tự khai báo trước sự kiện DOMContentLoaded."
  },
  {
    id: 7,
    question: "7. Tại sao một phần tử có `display: none` trong CSS lại có mặt trong cây DOM nhưng KHÔNG có mặt trong cây Render Tree?",
    options: [
      { id: "A", text: "A. Vì Render Tree chỉ chứa các node hình học thực sự được hiển thị ra màn hình; còn DOM đại diện cho cấu trúc tài liệu HTML", correct: true },
      { id: "B", text: "B. Vì JavaScript tự động xóa phần tử đó khỏi bộ nhớ" },
      { id: "C", text: "C. Vì GPU không hỗ trợ hiển thị màu đen" },
      { id: "D", text: "D. Vì trình duyệt coi `display: none` là một lỗi cú pháp" }
    ],
    explanation: "Chính xác! Cây DOM chứa tất cả các phần tử HTML (kể cả `<head>`, `<meta>`, `<script>`). Render Tree được tạo ra bằng cách kết hợp DOM và CSSOM, nhưng loại bỏ các node không trực quan như `<head>` và các node có computed style là `display: none`. (Lưu ý: `visibility: hidden` vẫn chiếm chỗ hình học nên VẪN nằm trong Render Tree)."
  },
  {
    id: 8,
    question: "8. Khi tạo animation cho giao diện, tại sao các chuyên gia hiệu năng khuyên chỉ nên thay đổi thuộc tính `transform` và `opacity`?",
    options: [
      { id: "A", text: "A. Vì hai thuộc tính này có thể được xử lý trực tiếp bởi GPU ở giai đoạn Composite mà không kích hoạt lại Layout (Reflow) và Paint", correct: true },
      { id: "B", text: "B. Vì các thuộc tính khác làm tăng kích thước bộ nhớ RAM lên gấp đôi" },
      { id: "C", text: "C. Vì JavaScript không thể đọc được giá trị của transform" },
      { id: "D", text: "D. Vì CSS Grid chỉ hoạt động với transform" }
    ],
    explanation: "Chuẩn xác 100%! Thay đổi các thuộc tính hình học (như `width`, `height`, `margin`, `top`, `left`) sẽ kích hoạt lại toàn bộ chu trình Layout -> Paint -> Composite (gây giật lag/jank). Thay đổi màu sắc (`background-color`, `color`) kích hoạt lại Paint -> Composite. Riêng `transform` và `opacity` chỉ cần GPU tổng hợp lại các lớp (Compositing), duy trì 60fps - 120fps siêu mượt mà!"
  }
];
