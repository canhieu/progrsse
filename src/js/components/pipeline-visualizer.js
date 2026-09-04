/* ==========================================================================
   BrowserFlow Lab - Pipeline & Packet Flow Visualizer
   ========================================================================== */

export class PipelineVisualizer {
  constructor(containerId, svgId) {
    this.container = document.getElementById(containerId);
    this.svg = document.getElementById(svgId);
    this.expTitle = document.getElementById("arch-exp-title");
    this.expBody = document.getElementById("arch-exp-body");
    this.packetDataBox = document.getElementById("packet-data-box");
    this.activePacketEl = null;

    window.addEventListener("resize", () => {
      this.drawConnections();
    });
  }

  drawConnections() {
    if (!this.container || !this.svg) return;
    this.svg.innerHTML = "";

    const connections = [
      { from: "node-user-ui", to: "node-browser-proc" },
      { from: "node-browser-proc", to: "node-network-thread" },
      { from: "node-network-thread", to: "node-dns-server" },
      { from: "node-network-thread", to: "node-web-server" },
      { from: "node-web-server", to: "node-network-thread" },
      { from: "node-network-thread", to: "node-renderer-proc" }
    ];

    const containerRect = this.container.getBoundingClientRect();

    connections.forEach(conn => {
      const fromEl = document.getElementById(conn.from);
      const toEl = document.getElementById(conn.to);
      if (!fromEl || !toEl) return;

      const r1 = fromEl.getBoundingClientRect();
      const r2 = toEl.getBoundingClientRect();

      const x1 = r1.left + r1.width / 2 - containerRect.left;
      const y1 = r1.top + r1.height / 2 - containerRect.top;
      const x2 = r2.left + r2.width / 2 - containerRect.left;
      const y2 = r2.top + r2.height / 2 - containerRect.top;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const dx = (x2 - x1) * 0.3;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      path.setAttribute("d", d);
      path.setAttribute("stroke", "rgba(255, 255, 255, 0.08)");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-dasharray", "4,4");
      path.setAttribute("fill", "none");

      this.svg.appendChild(path);
    });
  }

  update(stepData) {
    const { stageMeta, substepMeta, stageIndex, substepIndex } = stepData;

    // Reset node cards
    const allCards = document.querySelectorAll(".node-card");
    allCards.forEach(card => {
      card.classList.remove("active");
      const pill = card.querySelector(".node-status-pill");
      if (pill) {
        pill.textContent = "Chờ";
      }
    });

    // Highlight active nodes
    if (substepMeta.activeNodes) {
      substepMeta.activeNodes.forEach(nodeId => {
        const el = document.getElementById(nodeId);
        if (el) {
          el.classList.add("active");
          const pill = el.querySelector(".node-status-pill");
          if (pill) {
            pill.textContent = "Đang xử lý";
          }
        }
      });
    }

    // Animate packet
    if (substepMeta.packet) {
      this.animatePacket(substepMeta.packet);
    }

    // Update explanation
    if (this.expTitle && this.expBody) {
      this.expTitle.textContent = `Giai đoạn ${stageIndex}.${substepIndex + 1}: ${substepMeta.name}`;
      this.expBody.textContent = substepMeta.desc;
    }

    // Update Live Packet data
    if (this.packetDataBox) {
      this.packetDataBox.textContent = this.generatePacketPayload(stageIndex, substepIndex);
    }
  }

  generatePacketPayload(stageIndex, substepIndex) {
    switch (stageIndex) {
      case 1:
        return `[URL Parsing & HSTS]
Input: "https://techvn-news.io/article/how-browsers-work"
Protocol: https (Port 443) | Host: techvn-news.io | Path: /article/how-browsers-work
HSTS Preload Query: Matched in Chrome binary -> Enforce HTTPS via 307 Internal Redirect`;

      case 2:
        return `[DNS Query Packet - UDP 53]
Transaction ID: 0x8a4f | Flags: 0x0100 (Standard query)
Questions: 1 -> Name: techvn-news.io (Type: A, Class: IN)
Resolver Response: 93.184.216.34 (TTL: 300s)
Cached in Browser DNS Cache & OS getaddrinfo()`;

      case 3:
        return `[TCP & TLS 1.3 Handshake]
1. TCP SYN (Seq=0) -> SYN-ACK (Seq=0, Ack=1) -> ACK (Seq=1) [1 RTT: 24ms]
2. TLS 1.3 ClientHello (Supported Cipher: TLS_AES_256_GCM_SHA384, KeyShare: X25519)
3. ServerHello + Certificate (Issuer: Let's Encrypt R3) + Finished
Session Keys Derived: Symmetrical 256-bit AES encryption established.`;

      case 4:
        return `[HTTP/2 GET Request & Stream]
:method: GET
:scheme: https
:authority: techvn-news.io
:path: /article/how-browsers-work
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
accept-encoding: gzip, deflate, br

[Response Header Received - TTFB: 45ms]
:status: 200 OK
content-type: text/html; charset=UTF-8
content-encoding: br
Initial 14KB TCP Congestion Window streamed to Blink Parser.`;

      case 5:
        return `[HTML Tokenizer & Preload Scanner]
Raw Bytes: 3c 21 44 4f 43 54 59 50 45 ... -> <!DOCTYPE html>
Tokens: [DOCTYPE: html], [StartTag: head], [StartTag: link rel="stylesheet" href="style.css"]
Preload Scanner Action: Dispatched background download for 'style.css' & 'app.js'.
CSSOM Construction: Parsed CSS rules, computed specificity and cascading inheritance.`;

      case 6:
        return `[Render Tree, Layout (Reflow) & Paint]
Render Tree Nodes: Combine DOM + CSSOM (Excluding <head>, <script>, and display:none nodes).
Layout Calculation:
- body: { x: 0, y: 0, width: 1200px, height: 800px }
- article: { x: 120, y: 60, width: 960px, height: 680px }
Rasterization: Generating Paint Display Lists -> GPU Skia Draw Calls.`;

      case 7:
        return `[Compositing & Final Render]
Layer Tree: Divided into independent GPU Texture Layers.
GPU Process: Uploaded quads and textures to Direct3D / Metal / Vulkan.
Frame Swapped to Screen:
- First Contentful Paint (FCP): Complete
- Largest Contentful Paint (LCP): Complete
- DOMContentLoaded & window.onload dispatched!`;

      default:
        return "Waiting for simulation...";
    }
  }

  animatePacket(packetConfig) {
    if (this.activePacketEl && this.activePacketEl.parentNode) {
      this.activePacketEl.remove();
    }

    const fromEl = document.getElementById(packetConfig.from);
    const toEl = document.getElementById(packetConfig.to);
    if (!fromEl || !toEl || !this.container) return;

    const containerRect = this.container.getBoundingClientRect();
    const r1 = fromEl.getBoundingClientRect();
    const r2 = toEl.getBoundingClientRect();

    const startX = r1.left + r1.width / 2 - containerRect.left;
    const startY = r1.top + r1.height / 2 - containerRect.top;
    const endX = r2.left + r2.width / 2 - containerRect.left;
    const endY = r2.top + r2.height / 2 - containerRect.top;

    const packet = document.createElement("div");
    packet.className = `flying-packet ${packetConfig.type === 'tls' ? 'packet-tls' : ''}`;
    packet.style.left = `${startX}px`;
    packet.style.top = `${startY}px`;

    this.container.appendChild(packet);
    this.activePacketEl = packet;

    requestAnimationFrame(() => {
      packet.style.left = `${endX}px`;
      packet.style.top = `${endY}px`;
    });
  }
}
