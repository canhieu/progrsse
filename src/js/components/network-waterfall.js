/* ==========================================================================
   BrowserFlow Lab - Network Waterfall Component (DevTools Replica)
   ========================================================================== */

export class NetworkWaterfall {
  constructor(tbodyId, inspectorId) {
    this.tbody = document.getElementById(tbodyId);
    this.inspector = document.getElementById(inspectorId);
    this.resources = [];
    this.activeFilter = "all";
    this.selectedRequest = null;
    this.currentStage = 1;

    this.bindFilterEvents();
  }

  bindFilterEvents() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeFilter = btn.dataset.filter;
        this.render();
      });
    });
  }

  setResources(resources) {
    this.resources = resources || [];
    this.selectedRequest = this.resources[0] || null;
    this.render();
    this.renderInspector();
  }

  updateStage(stageIndex) {
    this.currentStage = stageIndex;
    this.render();
  }

  render() {
    if (!this.tbody) return;
    this.tbody.innerHTML = "";

    const filtered = this.resources.filter(res => {
      if (this.activeFilter === "all") return true;
      return res.type.toLowerCase() === this.activeFilter.toLowerCase();
    });

    filtered.forEach((res, index) => {
      const isVisibleInStage = this.isResourceVisibleInStage(res, this.currentStage);
      if (!isVisibleInStage) return;

      const tr = document.createElement("tr");
      if (this.selectedRequest && this.selectedRequest.name === res.name) {
        tr.classList.add("selected");
      }

      tr.addEventListener("click", () => {
        this.selectedRequest = res;
        this.render();
        this.renderInspector();
      });

      // Status badge color
      const is200 = res.status.includes("200");
      const is304 = res.status.includes("304") || res.status.includes("cache");
      const statusColor = is304 ? "text-cyan" : (is200 ? "text-green" : "text-amber");

      // Calculate waterfall bar widths
      const timing = res.timing || { dns: 10, connect: 10, ssl: 10, ttfb: 30, download: 40 };
      const totalTime = (timing.dns || 0) + (timing.connect || 0) + (timing.ssl || 0) + (timing.ttfb || 0) + (timing.download || 0) || 100;
      
      const pDns = ((timing.dns || 0) / totalTime) * 100;
      const pConnect = ((timing.connect || 0) / totalTime) * 100;
      const pSsl = ((timing.ssl || 0) / totalTime) * 100;
      const pTtfb = ((timing.ttfb || 0) / totalTime) * 100;
      const pDownload = ((timing.download || 0) / totalTime) * 100;

      tr.innerHTML = `
        <td>
          <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-main);">
            ${res.name}
          </span>
        </td>
        <td><span class="${statusColor}" style="font-weight: 700;">${res.status}</span></td>
        <td><span class="pill-value">${res.type}</span></td>
        <td><span style="color: var(--text-muted);">${res.size}</span></td>
        <td><span style="font-family: var(--font-mono); color: var(--accent-cyan);">${res.time}</span></td>
        <td>
          <div class="waterfall-bar-container" title="DNS: ${timing.dns}ms, Connect: ${timing.connect}ms, SSL: ${timing.ssl}ms, TTFB: ${timing.ttfb}ms, Download: ${timing.download}ms">
            ${pDns > 0 ? `<div class="w-segment w-dns" style="width: ${pDns}%;"></div>` : ''}
            ${pConnect > 0 ? `<div class="w-segment w-connect" style="width: ${pConnect}%;"></div>` : ''}
            ${pSsl > 0 ? `<div class="w-segment w-ssl" style="width: ${pSsl}%;"></div>` : ''}
            ${pTtfb > 0 ? `<div class="w-segment w-ttfb" style="width: ${pTtfb}%;"></div>` : ''}
            ${pDownload > 0 ? `<div class="w-segment w-download" style="width: ${pDownload}%;"></div>` : ''}
          </div>
        </td>
      `;

      this.tbody.appendChild(tr);
    });

    // Update summary counters
    const netCountEl = document.getElementById("net-count");
    const netTransferredEl = document.getElementById("net-transferred");
    if (netCountEl) netCountEl.textContent = `${filtered.length} requests`;
    if (netTransferredEl) {
      netTransferredEl.textContent = this.currentStage >= 5 ? "142 KB" : (this.currentStage >= 4 ? "14.2 KB" : "0 KB");
    }
  }

  isResourceVisibleInStage(res, stage) {
    if (stage <= 3) {
      // In stage 1-3, show initiating handshake request
      return res.type === "Doc";
    } else if (stage === 4) {
      // HTML Doc arrived
      return res.type === "Doc";
    } else {
      // Stage 5+: Preload scanner discovered everything
      return true;
    }
  }

  renderInspector() {
    const detailsContainer = document.getElementById("req-details-content");
    if (!detailsContainer || !this.selectedRequest) return;

    const res = this.selectedRequest;
    const headers = res.headers || {
      "status": res.status,
      "content-type": res.type === "CSS" ? "text/css" : (res.type === "JS" ? "application/javascript" : "text/html"),
      "cache-control": "public, max-age=3600"
    };

    let headerRowsHtml = "";
    for (const [key, value] of Object.entries(headers)) {
      headerRowsHtml += `
        <div class="req-header-row">
          <span class="req-h-key">${key}:</span>
          <span class="req-h-val">${value}</span>
        </div>
      `;
    }

    detailsContainer.innerHTML = `
      <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--border-glass);">
        <strong>URL:</strong> <span class="text-cyan">${res.url || ('https://techvn-news.io/' + res.name)}</span>
      </div>
      <div>
        <strong style="color: var(--text-main); display: block; margin-bottom: 4px;">Response Headers:</strong>
        ${headerRowsHtml}
      </div>
    `;
  }
}
