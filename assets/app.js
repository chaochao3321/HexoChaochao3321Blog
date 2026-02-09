/* Minimal Markdown blog (no build)
 * Routes:
 *   #/            list
 *   #/post/<file> show post, e.g. #/post/2026-02-09-hello.md
 */

const listView = document.getElementById("listView");
const postView = document.getElementById("postView");
const qInput = document.getElementById("q");

let postsIndex = []; // loaded from posts/index.json

function showList() {
  postView.classList.add("hidden");
  listView.classList.remove("hidden");
}

function showPost() {
  listView.classList.add("hidden");
  postView.classList.remove("hidden");
}

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function formatTags(tags) {
  if (!tags || !tags.length) return "";
  return tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
}

function renderList(filterText = "") {
  const ft = (filterText || "").trim().toLowerCase();
  const rows = postsIndex
    .filter(p => {
      if (!ft) return true;
      const hay = [
        p.title, p.summary, (p.tags || []).join(" "),
        p.date, p.file
      ].join(" ").toLowerCase();
      return hay.includes(ft);
    })
    .map(p => `
      <div class="post-item">
        <h2 class="post-title">
          <a href="#/post/${encodeURIComponent(p.file)}">${escapeHtml(p.title)}</a>
        </h2>
        <div class="post-meta">
          <span>${escapeHtml(p.date || "")}</span>
          ${formatTags(p.tags)}
        </div>
        ${p.summary ? `<p class="post-summary">${escapeHtml(p.summary)}</p>` : ""}
      </div>
    `)
    .join("");

  listView.innerHTML = `
    <h1 style="margin:0 0 12px;">文章</h1>
    ${rows || `<p style="color:var(--muted);margin:0;">没有匹配结果</p>`}
  `;
}

async function loadIndex() {
  // 关键：用相对路径，兼容 GitHub Pages /repo/ 目录
  const res = await fetch("./posts/index.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load posts/index.json: ${res.status}`);
  postsIndex = await res.json();

  // 默认按 date 倒序（如果没填 date，就按 file 名倒序）
  postsIndex.sort((a, b) => (b.date || b.file).localeCompare(a.date || a.file));
}

async function loadPost(file) {
  const url = `./posts/${file}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const md = await res.text();

  // 允许 Markdown 里带 HTML（你想更自由就开，安全起见默认关）
  marked.setOptions({ gfm: true, breaks: false });

  const html = marked.parse(md);
  postView.innerHTML = `
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <a href="#/" style="color:var(--muted);">← 返回列表</a>
      <span style="color:var(--muted);">/</span>
      <span style="color:var(--muted);">${escapeHtml(file)}</span>
    </div>
    <hr style="border:0;border-top:1px solid var(--line);margin:14px 0;">
    <div class="md">${html}</div>
  `;
}

function route() {
  const hash = location.hash || "#/";
  const m = hash.match(/^#\/post\/(.+)$/);

  if (m) {
    const file = decodeURIComponent(m[1]);
    showPost();
    loadPost(file).catch(err => {
      postView.innerHTML = `<p style="color:var(--muted);">文章加载失败：${escapeHtml(err.message)}</p>`;
    });
    return;
  }

  showList();
  renderList(qInput.value);
}

(async function init() {
  try {
    await loadIndex();
    renderList();
    route();
  } catch (e) {
    showList();
    listView.innerHTML = `<p style="color:var(--muted);">初始化失败：${escapeHtml(e.message)}</p>`;
  }

  window.addEventListener("hashchange", route);

  qInput.addEventListener("input", () => {
    // 只在列表页实时过滤
    if ((location.hash || "#/") === "#/") renderList(qInput.value);
  });
})();