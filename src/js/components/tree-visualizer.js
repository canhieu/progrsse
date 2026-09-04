/* ==========================================================================
   BrowserFlow Lab - Tree Visualizer (DOM, CSSOM & Render Tree)
   ========================================================================== */

export class TreeVisualizer {
  constructor(canvasContainerId, sidebarId) {
    this.container = document.getElementById(canvasContainerId);
    this.sidebar = document.getElementById(sidebarId);
    this.currentMode = "dom";
    this.scenario = null;
    this.selectedNode = null;

    this.bindSubNav();
  }

  bindSubNav() {
    const btns = document.querySelectorAll(".tree-toggle-btn");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentMode = btn.dataset.tree;
        this.render();
      });
    });
  }

  setScenario(scenario) {
    this.scenario = scenario;
    this.render();
  }

  render() {
    if (!this.container || !this.scenario) return;
    this.container.innerHTML = "";

    switch (this.currentMode) {
      case "dom":
        this.renderDomTree();
        break;
      case "cssom":
        this.renderCssomTree();
        break;
      case "render":
        this.renderRenderTree();
        break;
      case "comparison":
        this.renderComparisonView();
        break;
    }
  }

  renderDomTree() {
    const nodes = this.scenario.domNodes || [];
    const treeWrapper = document.createElement("div");
    treeWrapper.style.display = "flex";
    treeWrapper.style.flexDirection = "column";
    treeWrapper.style.gap = "4px";

    nodes.forEach(n => {
      const nodeEl = document.createElement("div");
      nodeEl.className = "tree-node-item";
      nodeEl.style.marginLeft = `${n.depth * 20}px`;
      
      const tagColor = n.tag === "html" || n.tag === "body" ? "color: var(--accent-cyan);" : "color: var(--accent-amber);";

      nodeEl.innerHTML = `
        <span style="opacity: 0.5;">${"└─".repeat(Math.min(1, n.depth))}</span>
        <strong style="${tagColor} font-family: var(--font-mono);">${n.tag}</strong>
        <span style="color: var(--text-muted); font-size: 10px;">${n.text}</span>
      `;

      nodeEl.addEventListener("click", () => {
        this.selectNode(n, "dom");
      });

      treeWrapper.appendChild(nodeEl);
    });

    this.container.appendChild(treeWrapper);
  }

  renderCssomTree() {
    const rules = this.scenario.cssomRules || [];
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";

    rules.forEach(r => {
      const ruleEl = document.createElement("div");
      ruleEl.className = "tree-node-item";
      ruleEl.style.display = "flex";
      ruleEl.style.flexDirection = "column";
      ruleEl.style.alignItems = "flex-start";
      ruleEl.style.padding = "8px 12px";

      ruleEl.innerHTML = `
        <div style="color: var(--accent-purple); font-weight: 700; font-family: var(--font-mono); font-size: 12px;">
          ${r.selector} {
        </div>
        <div style="color: var(--text-muted); padding-left: 14px; font-family: var(--font-mono); font-size: 11px;">
          ${r.rules.split(";").map(s => s.trim()).filter(Boolean).map(line => `<div>${line};</div>`).join("")}
        </div>
        <div style="color: var(--accent-purple); font-weight: 700; font-family: var(--font-mono); font-size: 12px;">}</div>
      `;

      ruleEl.addEventListener("click", () => {
        this.selectNode(r, "cssom");
      });

      wrapper.appendChild(ruleEl);
    });

    this.container.appendChild(wrapper);
  }

  renderRenderTree() {
    const renderNodes = this.scenario.renderTree || [];
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "6px";

    renderNodes.forEach(rn => {
      const el = document.createElement("div");
      el.className = `tree-node-item ${rn.visible ? '' : 'hidden-in-render'}`;
      
      const badge = rn.visible 
        ? `<span class="badge-perf" style="font-size: 9px;">RENDER</span>`
        : `<span style="color: var(--accent-red); font-size: 9px; font-weight: 700;">LOẠI BỎ (Excluded)</span>`;

      el.innerHTML = `
        <strong style="color: ${rn.visible ? 'var(--accent-green)' : 'var(--accent-red)'}; font-family: var(--font-mono);">
          ${rn.tag}
        </strong>
        ${badge}
        <span style="color: var(--text-muted); font-size: 10px;">${rn.reason}</span>
      `;

      el.addEventListener("click", () => {
        this.selectNode(rn, "render");
      });

      wrapper.appendChild(el);
    });

    this.container.appendChild(wrapper);
  }

  renderComparisonView() {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gridTemplateColumns = "1fr 1fr";
    wrapper.style.gap = "12px";

    wrapper.innerHTML = `
      <div style="background: var(--bg-dark-800); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 8px; font-size: 12px;">Cây DOM (Toàn bộ thẻ HTML)</h4>
        <p style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">Đại diện cho cấu trúc văn bản tài liệu:</p>
        <ul style="font-size: 11px; padding-left: 14px; color: var(--text-main); font-family: var(--font-mono); line-height: 1.8;">
          <li>&lt;html&gt;</li>
          <li>├─ &lt;head&gt; (Có trong DOM)</li>
          <li>│  ├─ &lt;title&gt;</li>
          <li>│  └─ &lt;link rel="stylesheet"&gt;</li>
          <li>└─ &lt;body&gt;</li>
          <li>   ├─ &lt;nav&gt;</li>
          <li>   ├─ &lt;article&gt;</li>
          <li>   └─ &lt;div class="ad-banner"&gt; (Có trong DOM)</li>
        </ul>
      </div>

      <div style="background: var(--bg-dark-800); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
        <h4 style="color: var(--accent-green); margin-bottom: 8px; font-size: 12px;">Cây Render Tree (Chỉ node hiển thị)</h4>
        <p style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">Kết hợp DOM + CSSOM, bỏ qua node ẩn:</p>
        <ul style="font-size: 11px; padding-left: 14px; color: var(--text-main); font-family: var(--font-mono); line-height: 1.8;">
          <li>RenderObject (body)</li>
          <li>├─ RenderBlock (nav)</li>
          <li>├─ RenderBlock (article)</li>
          <li>│  ├─ RenderText (h1)</li>
          <li>│  └─ RenderImage (banner)</li>
          <li style="color: var(--accent-red); opacity: 0.6; text-decoration: line-through;">head (Bị loại trừ)</li>
          <li style="color: var(--accent-red); opacity: 0.6; text-decoration: line-through;">.ad-banner [display:none] (Bị loại trừ)</li>
        </ul>
      </div>
    `;

    this.container.appendChild(wrapper);
  }

  selectNode(nodeData, mode) {
    const metaBox = document.getElementById("sidebar-node-meta");
    if (!metaBox) return;

    if (mode === "dom") {
      metaBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div><strong>Thẻ (Tag):</strong> <span class="text-cyan">${nodeData.tag}</span></div>
          <div><strong>Node ID:</strong> <span class="pill-value">${nodeData.id}</span></div>
          <div><strong>Độ sâu phân cấp:</strong> Level ${nodeData.depth}</div>
          <div><strong>Mô tả:</strong> ${nodeData.desc}</div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border-glass);">
            <strong>Computed Box Model:</strong>
            <div style="font-family: var(--font-mono); color: var(--accent-green); margin-top: 4px;">
              display: ${nodeData.tag === 'div' || nodeData.tag === 'article' ? 'block' : (nodeData.tag === 'nav' ? 'flex' : 'inline')}
            </div>
          </div>
        </div>
      `;
    } else if (mode === "cssom") {
      metaBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div><strong>Selector:</strong> <span class="text-purple">${nodeData.selector}</span></div>
          <div><strong>Đặc tính CSS:</strong></div>
          <div style="font-family: var(--font-mono); background: var(--bg-dark-900); padding: 6px; border-radius: 4px; color: var(--text-main);">
            ${nodeData.rules}
          </div>
        </div>
      `;
    } else if (mode === "render") {
      metaBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div><strong>Render Node:</strong> <span class="text-green">${nodeData.tag}</span></div>
          <div><strong>Trạng thái hiển thị:</strong> ${nodeData.visible ? '<span class="text-green">Hiển thị trên màn hình</span>' : '<span class="text-amber">Bị loại trừ khỏi Render Tree</span>'}</div>
          <div><strong>Lý do:</strong> ${nodeData.reason}</div>
        </div>
      `;
    }
  }
}
