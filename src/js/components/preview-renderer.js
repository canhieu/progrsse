/* ==========================================================================
   BrowserFlow Lab - Preview Renderer (Simulated Viewport & Telemetry)
   ========================================================================== */

export class PreviewRenderer {
  constructor() {
    this.screenEl = document.getElementById("viewport-screen");
    this.blankStateEl = document.getElementById("render-blank-state");
    this.skeletonStateEl = document.getElementById("render-skeleton-state");
    this.actualStateEl = document.getElementById("render-actual-state");
    this.tabTitleEl = document.getElementById("preview-tab-title");
    this.tabSpinnerEl = document.getElementById("preview-tab-spinner");
    this.renderStateOverlay = document.getElementById("overlay-render-state");
    this.blankTextEl = document.getElementById("blank-screen-text");

    // Telemetry Vitals
    this.vTtfb = document.getElementById("v-ttfb");
    this.vFcp = document.getElementById("v-fcp");
    this.vLcp = document.getElementById("v-lcp");
    this.vNodes = document.getElementById("v-nodes");
    this.logEntries = document.getElementById("stream-log-entries");

    this.bindInteractions();
  }

  bindInteractions() {
    const ctaBtn = document.getElementById("mock-cta-button");
    const resultText = document.getElementById("mock-click-result");
    if (ctaBtn && resultText) {
      ctaBtn.addEventListener("click", () => {
        resultText.textContent = "✓ Tương tác phản hồi tốt (INP: 14ms)";
        this.addLog("Sự kiện người dùng: Click chuột -> Main Thread thực thi JavaScript -> Phản hồi trong 14ms", "log-success");
      });
    }

    const clearLogBtn = document.getElementById("btn-clear-log");
    if (clearLogBtn && this.logEntries) {
      clearLogBtn.addEventListener("click", () => {
        this.logEntries.innerHTML = '<div class="log-entry log-info">[00:00.000] Đã xóa nhật ký.</div>';
      });
    }
  }

  update(stepData) {
    const { stageIndex, substepIndex, scenario } = stepData;

    // 1. Update Tab Title & Spinner
    if (this.tabTitleEl) {
      this.tabTitleEl.textContent = stageIndex >= 5 ? scenario.name.replace(/^\d+\.\s*/, '') : "Đang tải...";
    }
    if (this.tabSpinnerEl) {
      this.tabSpinnerEl.style.display = stageIndex === 7 ? "none" : "inline-block";
    }

    // 2. State Machine for Viewport Rendering
    if (stageIndex <= 3) {
      // White screen before TTFB
      this.showBlankState(`Giai đoạn ${stageIndex}: Đang phân giải DNS & bắt tay TLS 1.3...`);
      if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Chờ TTFB (Màn hình trắng)";
    } else if (stageIndex === 4) {
      // TTFB arrived
      this.showBlankState(`Đã nhận 14KB HTML ban đầu (TTFB: ${scenario.vitals.ttfb})`);
      if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Nhận HTML Stream";
      if (this.vTtfb) this.vTtfb.textContent = scenario.vitals.ttfb;
      this.addLog(`[HTTP] Nhận byte đầu tiên (TTFB: ${scenario.vitals.ttfb}). Bắt đầu stream HTML.`, "log-info");
    } else if (stageIndex === 5) {
      // Skeleton screen while parsing DOM & CSSOM
      this.showSkeletonState();
      if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Dựng DOM & CSSOM (Skeleton)";
      if (this.vNodes) this.vNodes.textContent = (scenario.domNodes || []).length;
      this.addLog(`[Blink] Xây dựng cây DOM (${scenario.domNodes.length} nodes) & tải trước tài nguyên qua Preload Scanner.`, "log-info");
    } else if (stageIndex === 6) {
      // Layout & Paint
      this.showSkeletonState();
      if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Reflow (Layout) & Paint";
      this.addLog(`[Layout] Tính toán kích thước hình học Box Model & tạo danh sách lệnh vẽ Display List.`, "log-info");
    } else if (stageIndex === 7) {
      // Compositing & Final Render
      this.showActualState(scenario);
      if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Hoàn tất Render (Interactive)";
      if (this.vFcp) this.vFcp.textContent = scenario.vitals.fcp;
      if (this.vLcp) this.vLcp.textContent = scenario.vitals.lcp;
      this.addLog(`[Render] FCP: ${scenario.vitals.fcp} | LCP: ${scenario.vitals.lcp} | Trang sẵn sàng tương tác 100%!`, "log-success");
    }
  }

  showBlankState(msg) {
    if (this.blankStateEl) this.blankStateEl.style.display = "flex";
    if (this.skeletonStateEl) this.skeletonStateEl.style.display = "none";
    if (this.actualStateEl) this.actualStateEl.style.display = "none";
    if (this.blankTextEl && msg) this.blankTextEl.textContent = msg;
  }

  showSkeletonState() {
    if (this.blankStateEl) this.blankStateEl.style.display = "none";
    if (this.skeletonStateEl) this.skeletonStateEl.style.display = "flex";
    if (this.actualStateEl) this.actualStateEl.style.display = "none";
  }

  showActualState(scenario) {
    if (this.blankStateEl) this.blankStateEl.style.display = "none";
    if (this.skeletonStateEl) this.skeletonStateEl.style.display = "none";
    if (this.actualStateEl) this.actualStateEl.style.display = "block";

    const h1 = this.actualStateEl.querySelector(".mock-h1");
    if (h1) h1.textContent = scenario.name.replace(/^\d+\.\s*/, '');
  }

  reset() {
    this.showBlankState("Màn hình trắng (Sẵn sàng bắt đầu mô phỏng)...");
    if (this.renderStateOverlay) this.renderStateOverlay.textContent = "Chờ bắt đầu";
    if (this.tabTitleEl) this.tabTitleEl.textContent = "Tab mới";
    if (this.tabSpinnerEl) this.tabSpinnerEl.style.display = "none";
    if (this.vTtfb) this.vTtfb.textContent = "-- ms";
    if (this.vFcp) this.vFcp.textContent = "-- ms";
    if (this.vLcp) this.vLcp.textContent = "-- ms";
    if (this.vNodes) this.vNodes.textContent = "0";

    const resultText = document.getElementById("mock-click-result");
    if (resultText) resultText.textContent = "";
    this.addLog("Đặt lại môi trường mô phỏng.", "log-info");
  }

  addLog(message, type = "log-info") {
    if (!this.logEntries) return;
    const row = document.createElement("div");
    row.className = `log-entry ${type}`;

    const now = new Date();
    const timeStr = `[${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}]`;

    row.textContent = `${timeStr} ${message}`;
    this.logEntries.appendChild(row);
    this.logEntries.scrollTop = this.logEntries.scrollHeight;
  }
}
