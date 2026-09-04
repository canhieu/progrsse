/* ==========================================================================
   BrowserFlow Lab - App Coordinator (Viblo Pedagogical Architecture)
   ========================================================================== */

import { SimulationEngine, VIBLO_STEPS } from './simulation-engine.js';
import { QuizSystem } from './components/quiz-system.js';

class App {
  constructor() {
    this.engine = new SimulationEngine();
    this.quizSystem = new QuizSystem("quiz-mount-point");

    this.urlPresets = {
      "example-sport": {
        scheme: "https://",
        domain: "example.com/",
        path: "posts/",
        resource: "sport",
        ip: "72.10.20.8",
        pageTitle: "Trực tiếp Chung kết Bóng đá: Phân tích Chiến thuật"
      },
      "tech-news": {
        scheme: "https://",
        domain: "techvn-news.io/",
        path: "article/",
        resource: "browser-engines",
        ip: "104.21.55.12",
        pageTitle: "So sánh Kiến trúc Trình duyệt: Blink vs Gecko vs WebKit"
      },
      "ecommerce": {
        scheme: "https://",
        domain: "shopvn.com/",
        path: "products/",
        resource: "keyboard",
        ip: "151.101.65.140",
        pageTitle: "Bàn phím cơ Custom không dây - ShopVN Official"
      }
    };

    this.currentPresetKey = "example-sport";

    this.initWaterfall();
    this.bindControls();
    this.bindTabs();
    this.bindEngine();
    
    // Initial display at Step 0
    this.engine.notifyUpdate();
  }

  bindControls() {
    // Stepper buttons
    const stepBtns = document.querySelectorAll(".step-btn");
    stepBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.engine.goToStep(btn.dataset.step);
      });
    });

    // Arrow text labels (also clickable in diagram)
    const arrowLabels = document.querySelectorAll(".arrow-text-label");
    arrowLabels.forEach(label => {
      label.addEventListener("click", () => {
        this.engine.goToStep(label.dataset.step);
      });
    });

    // Playback buttons
    const togglePlayBtn = document.getElementById("btn-toggle-play");
    const playText = document.getElementById("play-btn-text");
    if (togglePlayBtn) {
      togglePlayBtn.addEventListener("click", () => {
        this.engine.togglePlay();
      });
    }

    const prevBtn = document.getElementById("btn-prev-step");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.engine.stepPrev();
      });
    }

    const nextBtn = document.getElementById("btn-next-step");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.engine.stepNext();
      });
    }

    const resetBtn = document.getElementById("btn-reset-sim");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.engine.reset();
      });
    }

    const speedSelect = document.getElementById("select-speed");
    if (speedSelect) {
      speedSelect.addEventListener("change", (e) => {
        this.engine.setSpeed(e.target.value);
      });
    }

    // URL Preset Selector
    const presetSelect = document.getElementById("url-preset-select");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        this.applyPreset(e.target.value);
      });
    }

    // Interactive button inside rendered page
    const ctaBtn = document.getElementById("btn-test-interactive");
    const ctaFeedback = document.getElementById("interactive-feedback");
    if (ctaBtn && ctaFeedback) {
      ctaBtn.addEventListener("click", () => {
        ctaFeedback.textContent = "✓ Tương tác JavaScript phản hồi trong 12ms (INP Tốt)!";
      });
    }
  }

  applyPreset(presetKey) {
    const data = this.urlPresets[presetKey];
    if (!data) return;

    this.currentPresetKey = presetKey;

    // Update URL components display
    document.getElementById("comp-scheme").textContent = data.scheme;
    document.getElementById("comp-domain").textContent = data.domain;
    document.getElementById("comp-path").textContent = data.path;
    document.getElementById("comp-resource").textContent = data.resource;

    // Update browser address bar
    const addr = document.getElementById("address-bar-content");
    if (addr) {
      addr.innerHTML = `
        <span class="url-scheme">${data.scheme}</span><span class="url-domain">${data.domain}</span><span class="url-path">${data.path}</span><span class="url-resource">${data.resource}</span>
      `;
    }

    // Update server IP
    const ipDisplay = document.getElementById("server-ip-display");
    if (ipDisplay) ipDisplay.textContent = data.ip;

    // Update article title
    const titleEl = document.getElementById("rendered-page-title");
    if (titleEl) titleEl.textContent = data.pageTitle;

    this.engine.reset();
  }

  bindTabs() {
    const navBtns = document.querySelectorAll(".details-nav-btn");
    const panes = document.querySelectorAll(".details-tab-pane");

    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        navBtns.forEach(b => b.classList.remove("active"));
        panes.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPane = document.getElementById(`pane-${btn.dataset.tab}`);
        if (targetPane) targetPane.classList.add("active");
      });
    });
  }

  bindEngine() {
    this.engine.on("playStateChange", (isPlaying) => {
      const playText = document.getElementById("play-btn-text");
      if (playText) {
        playText.textContent = isPlaying ? "⏸ Tạm dừng" : "▶ Chạy tự động";
      }
    });

    this.engine.on("stepChange", ({ stepIndex, step }) => {
      this.updateUIForStep(stepIndex, step);
    });

    this.engine.on("simulationComplete", () => {
      const playText = document.getElementById("play-btn-text");
      if (playText) playText.textContent = "▶ Chạy lại tự động";
    });

    this.engine.on("reset", () => {
      const feedback = document.getElementById("interactive-feedback");
      if (feedback) feedback.textContent = "";
    });
  }

  updateUIForStep(stepIndex, step) {
    // 1. Update Stepper Buttons active state
    const stepBtns = document.querySelectorAll(".step-btn");
    stepBtns.forEach((btn, idx) => {
      btn.classList.remove("active", "completed");
      if (idx < stepIndex) {
        btn.classList.add("completed");
      } else if (idx === stepIndex) {
        btn.classList.add("active");
      }
    });

    // 2. Reset and Highlight Diagram Arrows
    const arrowPaths = document.querySelectorAll(".diagram-arrow-path");
    arrowPaths.forEach(p => {
      p.classList.remove("active");
      p.setAttribute("marker-end", "url(#arrowhead)");
    });

    if (step.activeArrow) {
      const activePath = document.getElementById(step.activeArrow);
      if (activePath) {
        activePath.classList.add("active");
        activePath.setAttribute("marker-end", "url(#arrowhead-active)");
      }
    }

    // 3. Highlight Arrow Text Labels
    const arrowLabels = document.querySelectorAll(".arrow-text-label");
    arrowLabels.forEach(lbl => {
      lbl.classList.toggle("active", lbl.dataset.step === step.stepId);
    });

    // 4. Highlight Participating Boxes
    const allBoxes = [
      document.getElementById("url-components-card"),
      document.getElementById("browser-window-box"),
      document.getElementById("box-dns-cache"),
      document.getElementById("box-dns-server"),
      document.getElementById("box-web-server")
    ];

    allBoxes.forEach(box => {
      if (box) box.classList.remove("highlight-step");
    });

    if (step.activeBoxes) {
      step.activeBoxes.forEach(boxId => {
        const b = document.getElementById(boxId);
        if (b) b.classList.add("highlight-step");
      });
    }

    // 5. Update Browser Viewport
    const emptyMsg = document.getElementById("viewport-empty-msg");
    const renderedPage = document.getElementById("viewport-rendered-page");
    const statusText = document.getElementById("viewport-status-text");

    if (step.showRenderedPage) {
      if (emptyMsg) emptyMsg.style.display = "none";
      if (renderedPage) renderedPage.style.display = "flex";
    } else {
      if (emptyMsg) emptyMsg.style.display = "flex";
      if (renderedPage) renderedPage.style.display = "none";
      if (statusText) statusText.textContent = `(${step.viewportStatus})`;
    }

    // 6. Update Explainer Details
    const titleEl = document.getElementById("step-detail-title");
    const textEl = document.getElementById("step-detail-text");
    const metaEl = document.getElementById("step-detail-meta");
    const packetEl = document.getElementById("step-packet-content");

    if (titleEl) titleEl.textContent = step.title;
    if (textEl) textEl.textContent = step.explainer;
    if (metaEl) metaEl.innerHTML = step.meta;
    if (packetEl) packetEl.textContent = step.packet;
  }

  initWaterfall() {
    const container = document.getElementById("waterfall-rows-container");
    if (!container) return;

    const resources = [
      { name: "sport (HTML Document)", status: "200 OK", type: "document", size: "14.2 KB", time: "42 ms", pct: [10, 15, 20, 25, 30] },
      { name: "style.css", status: "200 OK", type: "stylesheet", size: "28.6 KB", time: "35 ms", pct: [0, 0, 0, 30, 70] },
      { name: "app.js (defer)", status: "200 OK", type: "script", size: "45.1 KB", time: "48 ms", pct: [0, 0, 0, 25, 75] },
      { name: "hero-banner.webp", status: "200 OK", type: "image", size: "120.4 KB", time: "85 ms", pct: [0, 0, 0, 20, 80] },
      { name: "inter-font.woff2", status: "200 OK", type: "font", size: "32.0 KB", time: "30 ms", pct: [0, 0, 0, 35, 65] }
    ];

    container.innerHTML = resources.map(res => `
      <tr>
        <td><strong>${res.name}</strong></td>
        <td><span style="color: #16a34a; font-weight: 700;">${res.status}</span></td>
        <td><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${res.type}</span></td>
        <td>${res.size}</td>
        <td style="font-family: var(--font-mono); color: #2563eb;">${res.time}</td>
        <td>
          <div class="waterfall-bar-outer" title="Download time: ${res.time}">
            <div style="width: ${res.pct[0]}%; background: #06b6d4;"></div>
            <div style="width: ${res.pct[1]}%; background: #f97316;"></div>
            <div style="width: ${res.pct[2]}%; background: #a855f7;"></div>
            <div style="width: ${res.pct[3]}%; background: #10b981;"></div>
            <div style="width: ${res.pct[4]}%; background: #3b82f6;"></div>
          </div>
        </td>
      </tr>
    `).join("");
  }
}

// Start application
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
