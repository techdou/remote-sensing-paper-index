const state = { papers: [], sheet: "", venue: "", year: "", query: "", pdfOnly: false };

const $ = (selector) => document.querySelector(selector);
const esc = (value = "") => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function splitAbstract(value = "") {
  const en = value.match(/\[EN\]\s*([\s\S]*?)(?=\n\s*\n\[中文\]|\n\[中文\]|$)/)?.[1]?.trim() || value;
  const zh = value.match(/\[中文\]\s*([\s\S]*)$/)?.[1]?.trim() || "";
  return { en, zh };
}

function filteredPapers() {
  const q = state.query.trim().toLowerCase();
  return state.papers.filter(p => {
    const haystack = [p.titleEn, p.titleZh, p.abstract, p.venue, p.relation, p.positioning, p.modalities, p.mechanism, p.evaluation].join(" ").toLowerCase();
    return (!state.sheet || p.sheet === state.sheet)
      && (!state.venue || p.venue === state.venue)
      && (!state.year || String(p.year) === state.year)
      && (!state.pdfOnly || p.pdfUrl)
      && (!q || haystack.includes(q));
  });
}

function renderStats() {
  const unique = new Set(state.papers.map(p => p.titleEn)).size;
  const pdfs = new Set(state.papers.filter(p => p.pdfUrl).map(p => p.titleEn)).size;
  const venues = new Set(state.papers.map(p => p.venue)).size;
  $("#stats").innerHTML = [
    [unique, "篇唯一论文"],
    [pdfs, "篇可下载 PDF"],
    [venues, "个会议 / 期刊"],
    ["2023–2026", "研究年份"]
  ].map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderFilters() {
  const counts = new Map();
  state.papers.forEach(p => counts.set(p.sheet, (counts.get(p.sheet) || 0) + 1));
  const chips = [["", "全部", state.papers.length], ...[...counts].map(([name, count]) => [name, name, count])];
  $("#sheetFilters").innerHTML = chips.map(([value, label, count]) =>
    `<button class="filter-chip ${state.sheet === value ? "active" : ""}" data-sheet="${esc(value)}">${esc(label)} · ${count}</button>`
  ).join("");

  const venues = [...new Set(state.papers.map(p => p.venue))].sort((a, b) => a.localeCompare(b));
  $("#venueFilter").innerHTML = `<option value="">全部期刊 / 会议</option>${venues.map(v => `<option>${esc(v)}</option>`).join("")}`;
  const years = [...new Set(state.papers.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
  $("#yearFilter").innerHTML = `<option value="">全部年份</option>${years.map(y => `<option>${y}</option>`).join("")}`;
}

function paperCard(p) {
  const abstract = splitAbstract(p.abstract);
  return `<article class="paper-card">
    <div class="card-meta">
      <span class="tag sheet">${esc(p.sheet)}</span>
      <span class="tag">${esc(p.venue)}</span>
      <span class="tag">${esc(p.year)}</span>
    </div>
    <h3>${esc(p.titleEn)}</h3>
    <p class="summary">${esc(abstract.zh || abstract.en)}</p>
    <div class="card-actions">
      <button class="btn primary" data-detail="${p.id}">查看详情</button>
      ${p.pdfUrl ? `<a class="btn" href="${esc(p.pdfUrl)}" download>PDF</a>` : `<span class="btn disabled">暂无 PDF</span>`}
    </div>
  </article>`;
}

function render() {
  const papers = filteredPapers();
  $("#paperGrid").innerHTML = papers.map(paperCard).join("");
  $("#emptyState").hidden = papers.length !== 0;
  $("#resultCount").textContent = `${papers.length} 条记录`;
  $("#resultTitle").textContent = state.sheet || "全部论文";
  document.querySelectorAll(".filter-chip").forEach(button => button.classList.toggle("active", button.dataset.sheet === state.sheet));
}

function showDetail(id) {
  const p = state.papers.find(item => item.id === id);
  if (!p) return;
  const abstract = splitAbstract(p.abstract);
  $("#dialogContent").innerHTML = `
    <div class="card-meta"><span class="tag sheet">${esc(p.sheet)}</span><span class="tag">${esc(p.venue)}</span><span class="tag">${esc(p.year)}</span></div>
    <h2>${esc(p.titleEn)}</h2>
    <p class="detail-cn">${esc(p.titleZh)}</p>
    <div class="detail-grid detail-block">
      ${[
        ["遥感分类关系", p.relation],
        ["分类定位", p.positioning],
        ["输入模态", p.modalities],
        ["核心机制", p.mechanism],
        ["数据集 / 评估", p.evaluation]
      ].filter(([, value]) => value).map(([label, value]) => `<div class="detail-field"><span>${label}</span>${esc(value)}</div>`).join("")}
    </div>
    <div class="detail-block"><h4>中文摘要</h4><p>${esc(abstract.zh || "暂无中文摘要")}</p></div>
    <div class="detail-block"><h4>English Abstract</h4><p>${esc(abstract.en || "No abstract available.")}</p></div>
    <div class="detail-actions">
      <a class="btn primary" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">访问正式来源 ↗</a>
      ${p.pdfUrl ? `<a class="btn" href="${esc(p.pdfUrl)}" download>下载公开 PDF</a>` : `<span class="btn disabled">暂无公开 PDF</span>`}
      <a class="btn" href="#/paper/${p.id}">复制详情链接</a>
    </div>`;
  $("#paperDialog").showModal();
  history.replaceState(null, "", `#/paper/${p.id}`);
}

function bindEvents() {
  $("#searchInput").addEventListener("input", e => { state.query = e.target.value; render(); });
  $("#sheetFilters").addEventListener("click", e => {
    const button = e.target.closest("[data-sheet]");
    if (!button) return;
    state.sheet = button.dataset.sheet;
    render();
  });
  $("#venueFilter").addEventListener("change", e => { state.venue = e.target.value; render(); });
  $("#yearFilter").addEventListener("change", e => { state.year = e.target.value; render(); });
  $("#pdfOnly").addEventListener("change", e => { state.pdfOnly = e.target.checked; render(); });
  $("#paperGrid").addEventListener("click", e => {
    const button = e.target.closest("[data-detail]");
    if (button) showDetail(button.dataset.detail);
  });
  $("#dialogClose").addEventListener("click", () => $("#paperDialog").close());
  $("#paperDialog").addEventListener("close", () => history.replaceState(null, "", "#/"));
}

async function init() {
  const response = await fetch("./data/papers.json");
  state.papers = await response.json();
  renderStats();
  renderFilters();
  bindEvents();
  render();
  const match = location.hash.match(/^#\/paper\/(.+)$/);
  if (match) showDetail(match[1]);
}

init().catch(error => {
  $("#paperGrid").innerHTML = `<p class="empty">数据加载失败：${esc(error.message)}</p>`;
});
