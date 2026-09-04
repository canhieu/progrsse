/* ==========================================================================
   BrowserFlow Lab - Scenarios Data & Configurations
   ========================================================================== */

export const SCENARIOS = {
  standard: {
    id: "standard",
    name: "1. Trang Tin tức tiêu chuẩn",
    description: "Trang tin tức tối ưu với HTML truyền tải 14KB ban đầu, CSS ngoài, JavaScript được nạp với thuộc tính defer, ảnh WebP nén và phông chữ tự lưu trữ (self-hosted).",
    url: "https://techvn-news.io/article/how-browsers-work",
    displayUrl: "techvn-news.io/article/how-browsers-work",
    urlBreakdown: {
      scheme: "HTTPS (TLS 1.3)",
      host: "techvn-news.io",
      port: "443",
      path: "/article/how-browsers-work",
      hsts: "Active (307 Internal Redirect)",
      ip: "93.184.216.34"
    },
    dnsChain: [
      { step: "Browser Cache", status: "MISS" },
      { step: "OS Hosts & Cache", status: "MISS" },
      { step: "Router Gateway", status: "MISS" },
      { step: "ISP Recursive Resolver (1.1.1.1)", status: "LOOKUP" },
      { step: "Root Server (.)", status: "REFERRAL -> .io" },
      { step: "TLD Server (.io)", status: "REFERRAL -> ns1.techvn-news.io" },
      { step: "Authoritative NS", status: "RESOLVED -> 93.184.216.34 (A Record, TTL 3600s)" }
    ],
    handshake: {
      tcpRtt: "24 ms",
      tlsVersion: "TLS 1.3 (ECDHE-ECDSA-AES256-GCM-SHA384)",
      tlsRtt: "24 ms (1-RTT Key Exchange)"
    },
    resources: [
      {
        name: "how-browsers-work",
        url: "https://techvn-news.io/article/how-browsers-work",
        status: "200 OK",
        type: "Doc",
        size: "14.2 KB",
        time: "115 ms",
        timing: { dns: 22, connect: 24, ssl: 24, ttfb: 35, download: 10 },
        headers: {
          "status": "200 OK",
          "content-type": "text/html; charset=UTF-8",
          "content-encoding": "br",
          "cache-control": "max-age=600, stale-while-revalidate=86400",
          "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
          "x-content-type-options": "nosniff"
        }
      },
      {
        name: "style-v2.css",
        url: "https://techvn-news.io/assets/style-v2.css",
        status: "200 OK",
        type: "CSS",
        size: "18.4 KB",
        time: "65 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 45, download: 20 },
        headers: {
          "status": "200 OK",
          "content-type": "text/css; charset=UTF-8",
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      {
        name: "app-defer.js",
        url: "https://techvn-news.io/assets/app-defer.js",
        status: "200 OK",
        type: "JS",
        size: "32.8 KB",
        time: "80 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 48, download: 32 },
        headers: {
          "status": "200 OK",
          "content-type": "application/javascript; charset=UTF-8",
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      {
        name: "inter-font.woff2",
        url: "https://techvn-news.io/fonts/inter-font.woff2",
        status: "200 OK",
        type: "Font",
        size: "28.5 KB",
        time: "55 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 35, download: 20 },
        headers: {
          "status": "200 OK",
          "content-type": "font/woff2",
          "access-control-allow-origin": "*"
        }
      },
      {
        name: "hero-browser.webp",
        url: "https://techvn-news.io/images/hero-browser.webp",
        status: "200 OK",
        type: "Img",
        size: "48.2 KB",
        time: "95 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 45, download: 50 },
        headers: {
          "status": "200 OK",
          "content-type": "image/webp",
          "cache-control": "public, max-age=86400"
        }
      }
    ],
    domNodes: [
      { id: "n1", tag: "html", text: "<html>", depth: 0, parent: null, desc: "Root HTML Document" },
      { id: "n2", tag: "head", text: "<head>", depth: 1, parent: "n1", desc: "Metadata, Title, Links, Styles" },
      { id: "n3", tag: "title", text: "<title>Hành Trình Gói Tin</title>", depth: 2, parent: "n2", desc: "Tiêu đề trang tab" },
      { id: "n4", tag: "link", text: "<link rel='stylesheet' href='style.css'>", depth: 2, parent: "n2", desc: "Render-blocking CSS" },
      { id: "n5", tag: "script", text: "<script defer src='app.js'>", depth: 2, parent: "n2", desc: "Non-blocking JavaScript (defer)" },
      { id: "n6", tag: "body", text: "<body>", depth: 1, parent: "n1", desc: "Thân văn bản hiển thị" },
      { id: "n7", tag: "nav", text: "<nav class='mock-nav'>", depth: 2, parent: "n6", desc: "Thanh điều hướng Navbar" },
      { id: "n8", tag: "article", text: "<article class='mock-article'>", depth: 2, parent: "n6", desc: "Khung bài viết chính" },
      { id: "n9", tag: "h1", text: "<h1>Hành Trình Gói Tin</h1>", depth: 3, parent: "n8", desc: "Tiêu đề bài viết H1" },
      { id: "n10", tag: "div", text: "<div class='banner'>", depth: 3, parent: "n8", desc: "Khối ảnh LCP Hero Banner" },
      { id: "n11", tag: "div", text: "<div class='ad-banner' style='display:none'>", depth: 3, parent: "n8", desc: "Quảng cáo ẩn (display: none)" },
      { id: "n12", tag: "p", text: "<p>Nội dung bài viết...", depth: 3, parent: "n8", desc: "Đoạn văn bản mô tả" }
    ],
    cssomRules: [
      { selector: "body", rules: "margin: 0; font-family: Inter; background: #fff; color: #0f172a;" },
      { selector: ".mock-nav", rules: "display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e2e8f0;" },
      { selector: ".mock-article", rules: "max-width: 800px; margin: 0 auto; padding: 16px;" },
      { selector: "h1", rules: "font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px;" },
      { selector: ".banner", rules: "height: 120px; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 6px;" },
      { selector: ".ad-banner", rules: "display: none !important;" }
    ],
    renderTree: [
      { id: "r1", tag: "body", visible: true, reason: "Phần tử gốc hiển thị" },
      { id: "r2", tag: "nav", visible: true, reason: "Hiển thị flexbox" },
      { id: "r3", tag: "article", visible: true, reason: "Hiển thị block" },
      { id: "r4", tag: "h1", visible: true, reason: "Hiển thị text node 'Hành Trình Gói Tin'" },
      { id: "r5", tag: "div.banner", visible: true, reason: "Hiển thị background layer GPU" },
      { id: "r6", tag: "p", visible: true, reason: "Hiển thị paragraph" },
      { id: "ex-head", tag: "head", visible: false, reason: "Loại trừ: Thẻ <head> không có biểu diễn trực quan" },
      { id: "ex-ad", tag: "div.ad-banner", visible: false, reason: "Loại trừ: CSS có quy tắc 'display: none'" }
    ],
    vitals: {
      ttfb: "85 ms",
      fcp: "280 ms",
      lcp: "510 ms",
      dcl: "320 ms",
      totalTime: "580 ms",
      transferred: "142 KB",
      rating: "Tốt (100/100 PageSpeed)"
    }
  },

  "heavy-js": {
    id: "heavy-js",
    name: "2. Trang nặng JS (Parser Blocking)",
    description: "Trang thương mại điện tử chứa file JavaScript đồng bộ 850KB nằm ở thẻ <head> không có defer/async, khiến HTML Parser bị đóng băng hoàn toàn trong khi tải và biên dịch JS.",
    url: "https://shop-gadget.vn/products/ultra-laptop",
    displayUrl: "shop-gadget.vn/products/ultra-laptop",
    urlBreakdown: {
      scheme: "HTTPS (TLS 1.2)",
      host: "shop-gadget.vn",
      port: "443",
      path: "/products/ultra-laptop",
      hsts: "Inactive (Server gửi 301 Redirect chậm)",
      ip: "104.21.45.18"
    },
    dnsChain: [
      { step: "Browser Cache", status: "MISS" },
      { step: "OS Cache", status: "MISS" },
      { step: "ISP Recursive Resolver", status: "LOOKUP (60ms)" },
      { step: "Authoritative NS", status: "RESOLVED -> 104.21.45.18" }
    ],
    handshake: {
      tcpRtt: "45 ms",
      tlsVersion: "TLS 1.2 (2-RTT Handshake)",
      tlsRtt: "90 ms"
    },
    resources: [
      {
        name: "ultra-laptop",
        url: "https://shop-gadget.vn/products/ultra-laptop",
        status: "200 OK",
        type: "Doc",
        size: "38.5 KB",
        time: "210 ms",
        timing: { dns: 50, connect: 45, ssl: 90, ttfb: 95, download: 20 }
      },
      {
        name: "heavy-analytics-bundle.js",
        url: "https://shop-gadget.vn/js/heavy-analytics-bundle.js",
        status: "200 OK",
        type: "JS",
        size: "850.4 KB",
        time: "980 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 180, download: 800 }
      },
      {
        name: "theme-huge.css",
        url: "https://shop-gadget.vn/css/theme-huge.css",
        status: "200 OK",
        type: "CSS",
        size: "140.2 KB",
        time: "320 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 120, download: 200 }
      },
      {
        name: "unoptimized-banner.png",
        url: "https://shop-gadget.vn/img/unoptimized-banner.png",
        status: "200 OK",
        type: "Img",
        size: "2.4 MB",
        time: "1450 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 150, download: 1300 }
      }
    ],
    domNodes: [
      { id: "n1", tag: "html", text: "<html>", depth: 0, parent: null, desc: "Root HTML Document" },
      { id: "n2", tag: "head", text: "<head>", depth: 1, parent: "n1", desc: "Metadata & Blocking Assets" },
      { id: "n3", tag: "script", text: "<script src='heavy-analytics-bundle.js'>", depth: 2, parent: "n2", desc: "⚠️ CHẶN PARSER: Tải 850KB + chạy 400ms V8 execution!" },
      { id: "n4", tag: "link", text: "<link rel='stylesheet' href='theme-huge.css'>", depth: 2, parent: "n2", desc: "Render-blocking CSS 140KB" },
      { id: "n5", tag: "body", text: "<body>", depth: 1, parent: "n1", desc: "Bị hoãn khởi tạo cho tới khi script chạy xong" },
      { id: "n6", tag: "h1", text: "<h1>Ultra Laptop 2026</h1>", depth: 2, parent: "n5", desc: "Tiêu đề sản phẩm" },
      { id: "n7", tag: "img", text: "<img src='unoptimized-banner.png'>", depth: 2, parent: "n5", desc: "Ảnh LCP chưa tối ưu dung lượng 2.4MB" }
    ],
    cssomRules: [
      { selector: "body", rules: "font-family: sans-serif; background: #fafafa;" },
      { selector: "h1", rules: "font-size: 28px; color: #111;" }
    ],
    renderTree: [
      { id: "r1", tag: "body", visible: true, reason: "Phần tử hiển thị sau khi JS mở khóa parser" },
      { id: "r2", tag: "h1", visible: true, reason: "Nội dung tiêu đề" },
      { id: "r3", tag: "img", visible: true, reason: "Ảnh sản phẩm lớn" }
    ],
    vitals: {
      ttfb: "210 ms",
      fcp: "1,190 ms",
      lcp: "2,450 ms",
      dcl: "1,980 ms",
      totalTime: "2,980 ms",
      transferred: "3.4 MB",
      rating: "Kém (Cần tối ưu Defer Script & Nén ảnh)"
    }
  },

  spa: {
    id: "spa",
    name: "3. Ứng dụng SPA (React / Vite)",
    description: "Ứng dụng Single Page Application với file HTML cực nhẹ (chỉ chứa một thẻ <div id='root'>), toàn bộ giao diện và routing do JavaScript Client-side Bundle (React DOM) tự mount sau khi tải xong.",
    url: "https://dashboard.saas-flow.com/analytics",
    displayUrl: "dashboard.saas-flow.com/analytics",
    urlBreakdown: {
      scheme: "HTTPS (TLS 1.3)",
      host: "dashboard.saas-flow.com",
      port: "443",
      path: "/analytics",
      hsts: "Active",
      ip: "76.76.21.21"
    },
    dnsChain: [
      { step: "Browser Cache", status: "MISS" },
      { step: "OS Cache", status: "MISS" },
      { step: "Cloudflare Anycast DNS", status: "RESOLVED -> 76.76.21.21 (15ms)" }
    ],
    handshake: {
      tcpRtt: "18 ms",
      tlsVersion: "TLS 1.3 (0-RTT TLS Session Resumption)",
      tlsRtt: "18 ms"
    },
    resources: [
      {
        name: "analytics",
        url: "https://dashboard.saas-flow.com/analytics",
        status: "200 OK",
        type: "Doc",
        size: "1.2 KB",
        time: "65 ms",
        timing: { dns: 15, connect: 18, ssl: 18, ttfb: 25, download: 5 }
      },
      {
        name: "vendor-react.js",
        url: "https://dashboard.saas-flow.com/assets/vendor-react.js",
        status: "200 OK",
        type: "JS",
        size: "128.4 KB",
        time: "140 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 40, download: 100 }
      },
      {
        name: "app-client.js",
        url: "https://dashboard.saas-flow.com/assets/app-client.js",
        status: "200 OK",
        type: "JS",
        size: "74.2 KB",
        time: "110 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 40, download: 70 }
      }
    ],
    domNodes: [
      { id: "n1", tag: "html", text: "<html>", depth: 0, parent: null, desc: "Root HTML Document" },
      { id: "n2", tag: "head", text: "<head>", depth: 1, parent: "n1", desc: "Vite Client Script tags" },
      { id: "n3", tag: "body", text: "<body>", depth: 1, parent: "n1", desc: "Ban đầu chỉ có vỏ khung rỗng" },
      { id: "n4", tag: "div#root", text: "<div id='root'></div>", depth: 2, parent: "n3", desc: "React Root Container (Chờ JS Mount)" },
      { id: "n5", tag: "script", text: "<script type='module' src='/src/main.jsx'>", depth: 2, parent: "n3", desc: "Client Bundle kích hoạt ReactDOM.createRoot" }
    ],
    cssomRules: [
      { selector: "#root", rules: "min-height: 100vh; display: flex; flex-direction: column;" }
    ],
    renderTree: [
      { id: "r1", tag: "div#root", visible: true, reason: "Khung rỗng ban đầu (Blank Screen tạm thời)" },
      { id: "r2", tag: "div.dashboard-mounted", visible: true, reason: "Được React DOM sinh ra sau khi hoàn tất JS Execution" }
    ],
    vitals: {
      ttfb: "65 ms",
      fcp: "390 ms",
      lcp: "620 ms",
      dcl: "280 ms",
      totalTime: "680 ms",
      transferred: "204 KB",
      rating: "Tốt (Cấu trúc SPA hiện đại)"
    }
  },

  cached: {
    id: "cached",
    name: "4. Trang đã Cache (Warm Visit)",
    description: "Người dùng truy cập lại lần thứ hai (Warm Visit). DNS và TCP/TLS được tái sử dụng hoặc bỏ qua hoàn toàn. Toàn bộ CSS, JS và Ảnh được nạp siêu tốc trực tiếp từ Disk Cache hoặc Service Worker.",
    url: "https://techvn-news.io/article/how-browsers-work",
    displayUrl: "techvn-news.io/article/how-browsers-work",
    urlBreakdown: {
      scheme: "HTTPS (TLS 1.3)",
      host: "techvn-news.io",
      port: "443",
      path: "/article/how-browsers-work",
      hsts: "Cached (0ms)",
      ip: "93.184.216.34 (Cached Socket)"
    },
    dnsChain: [
      { step: "Browser DNS Cache", status: "HIT (0 ms) -> 93.184.216.34" }
    ],
    handshake: {
      tcpRtt: "0 ms (Reused Persistent Socket)",
      tlsVersion: "TLS 1.3 (Reused)",
      tlsRtt: "0 ms"
    },
    resources: [
      {
        name: "how-browsers-work",
        url: "https://techvn-news.io/article/how-browsers-work",
        status: "304 Not Modified",
        type: "Doc",
        size: "340 B",
        time: "18 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 15, download: 3 }
      },
      {
        name: "style-v2.css",
        url: "https://techvn-news.io/assets/style-v2.css",
        status: "200 (disk cache)",
        type: "CSS",
        size: "0 B",
        time: "2 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 1, download: 1 }
      },
      {
        name: "app-defer.js",
        url: "https://techvn-news.io/assets/app-defer.js",
        status: "200 (disk cache)",
        type: "JS",
        size: "0 B",
        time: "2 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 1, download: 1 }
      },
      {
        name: "hero-browser.webp",
        url: "https://techvn-news.io/images/hero-browser.webp",
        status: "200 (memory cache)",
        type: "Img",
        size: "0 B",
        time: "1 ms",
        timing: { dns: 0, connect: 0, ssl: 0, ttfb: 0, download: 1 }
      }
    ],
    domNodes: [
      { id: "n1", tag: "html", text: "<html>", depth: 0, parent: null, desc: "HTML nạp từ cache 304" },
      { id: "n2", tag: "head", text: "<head>", depth: 1, parent: "n1", desc: "Tài nguyên nạp tức thì từ Disk Cache" },
      { id: "n3", tag: "body", text: "<body>", depth: 1, parent: "n1", desc: "Không có độ trễ mạng" }
    ],
    cssomRules: [
      { selector: "body", rules: "font-family: Inter; background: #fff;" }
    ],
    renderTree: [
      { id: "r1", tag: "body", visible: true, reason: "Render ngay lập tức" },
      { id: "r2", tag: "article", visible: true, reason: "Trang đạt trạng thái hoàn thiện dưới 100ms" }
    ],
    vitals: {
      ttfb: "15 ms",
      fcp: "85 ms",
      lcp: "140 ms",
      dcl: "65 ms",
      totalTime: "160 ms",
      transferred: "0.3 KB",
      rating: "Xuất sắc (Tối ưu Cache Hit tuyệt đối)"
    }
  }
};
