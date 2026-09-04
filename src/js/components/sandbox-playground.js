/* ==========================================================================
   BrowserFlow Lab - Sandbox Playground (Optimization Lab & Metric Engine)
   ========================================================================== */

export class SandboxPlayground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.options = {
      http2: true,
      deferJs: true,
      minifyCss: true,
      webp: true,
      brotli: true,
      caching: false
    };

    this.bindEvents();
    this.calculateAndRender();
  }

  bindEvents() {
    const checkboxes = this.container.querySelectorAll(".opt-toggle");
    checkboxes.forEach(cb => {
      cb.addEventListener("change", (e) => {
        const key = e.target.dataset.opt;
        this.options[key] = e.target.checked;
        this.calculateAndRender();
      });
    });

    const resetBtn = document.getElementById("btn-reset-sandbox");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        checkboxes.forEach(cb => {
          cb.checked = true;
          this.options[cb.dataset.opt] = true;
        });
        this.calculateAndRender();
      });
    }
  }

  calculateAndRender() {
    let ttfb = 280; // ms base
    let fcp = 1800; // ms base
    let lcp = 3600; // ms base
    let totalPayload = 1850; // KB

    // Evaluate optimization impacts
    if (this.options.http2) {
      ttfb -= 80;
      fcp -= 350;
      lcp -= 450;
    }

    if (this.options.deferJs) {
      fcp -= 750; // Huge win: script doesn't block DOM parsing
      lcp -= 900;
    }

    if (this.options.minifyCss) {
      fcp -= 200;
      lcp -= 250;
      totalPayload -= 120;
    }

    if (this.options.webp) {
      lcp -= 1100; // Drastic reduction in image download time
      totalPayload -= 850;
    }

    if (this.options.brotli) {
      ttfb -= 30;
      fcp -= 100;
      totalPayload -= 220;
    }

    if (this.options.caching) {
      ttfb = Math.max(15, ttfb - 120);
      fcp = Math.max(250, fcp - 400);
      lcp = Math.max(500, lcp - 600);
      totalPayload = Math.round(totalPayload * 0.1); // 90% served from disk/memory cache
    }

    // Ensure realistic minimum bounds
    ttfb = Math.max(20, Math.round(ttfb));
    fcp = Math.max(300, Math.round(fcp));
    lcp = Math.max(650, Math.round(lcp));

    // Calculate simulated Lighthouse Performance Score (0 - 100)
    let score = 100;
    if (fcp > 1800) score -= 25;
    else if (fcp > 1000) score -= 12;

    if (lcp > 2500) score -= 35;
    else if (lcp > 1500) score -= 18;

    if (ttfb > 200) score -= 15;
    if (totalPayload > 1000) score -= 15;

    score = Math.max(35, Math.min(100, score));

    // Render results to DOM
    this.renderMetrics(ttfb, fcp, lcp, totalPayload, score);
  }

  renderMetrics(ttfb, fcp, lcp, payload, score) {
    const scoreValEl = document.getElementById("sandbox-score-val");
    const scoreCircleEl = document.getElementById("sandbox-score-circle");
    const ttfbValEl = document.getElementById("sandbox-ttfb-val");
    const fcpValEl = document.getElementById("sandbox-fcp-val");
    const lcpValEl = document.getElementById("sandbox-lcp-val");
    const payloadValEl = document.getElementById("sandbox-payload-val");

    if (scoreValEl) scoreValEl.textContent = score;
    if (scoreCircleEl) {
      const color = score >= 90 ? "var(--accent-green)" : (score >= 50 ? "var(--accent-amber)" : "var(--accent-red)");
      scoreCircleEl.style.borderColor = color;
      if (scoreValEl) scoreValEl.style.color = color;
    }

    if (ttfbValEl) {
      ttfbValEl.textContent = `${ttfb} ms`;
      ttfbValEl.className = ttfb <= 100 ? "text-green" : (ttfb <= 250 ? "text-amber" : "text-red");
    }

    if (fcpValEl) {
      fcpValEl.textContent = `${(fcp / 1000).toFixed(2)} s`;
      fcpValEl.className = fcp <= 1000 ? "text-green" : (fcp <= 2000 ? "text-amber" : "text-red");
    }

    if (lcpValEl) {
      lcpValEl.textContent = `${(lcp / 1000).toFixed(2)} s`;
      lcpValEl.className = lcp <= 2500 ? "text-green" : (lcp <= 4000 ? "text-amber" : "text-red");
    }

    if (payloadValEl) {
      payloadValEl.textContent = `${payload} KB`;
      payloadValEl.className = payload <= 500 ? "text-green" : "text-amber";
    }

    // Comparison bars (Benchmark vs Optimized)
    const barFcp = document.getElementById("bar-fcp-progress");
    const barLcp = document.getElementById("bar-lcp-progress");
    if (barFcp) {
      const p = Math.min(100, Math.round((fcp / 2500) * 100));
      barFcp.style.width = `${p}%`;
      barFcp.style.backgroundColor = fcp <= 1000 ? "var(--accent-green)" : "var(--accent-amber)";
    }
    if (barLcp) {
      const p = Math.min(100, Math.round((lcp / 4500) * 100));
      barLcp.style.width = `${p}%`;
      barLcp.style.backgroundColor = lcp <= 2500 ? "var(--accent-green)" : "var(--accent-amber)";
    }
  }
}
