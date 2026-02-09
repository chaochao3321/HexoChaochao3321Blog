/**
 * Static Markdown Blog (no build)
 * Routes:
 *   #/                -> list
 *   #/post/<file>     -> post page
 *   #/tag/<tag>       -> tag filtered list (tag=all shows tags page)
 *   #/about           -> about panel
 */

const listView = document.getElementById("listView");
const postView = document.getElementById("postView");
const aboutView = document.getElementById("aboutView");
const notice = document.getElementById("notice");
const qInput = document.getElementById("q");
const tagCloud = document.getElementById("tagCloud");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const yearEl = document.getElementById("year");

let postsIndex = []; // from posts/index.json

function esc(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function setNotice(msg = "", show = false) {
  if (!show || !msg) {
    notice.classList.add("hidden");
    notice.textContent = "";
    return;
  }
  notice.classList.remove("hidden");
  notice.textContent = msg;
}

function showOnly(view) {
  for (const el of [listView, postView, aboutView]) el.classList.add("hidden");
  view.classList.remove("hidden");
}

function normalizeTag(t) {
  return String(t || "").trim();
}

function collectTags(posts) {
  const map = new Map();
  for (const p of posts) {
    for (const t of (p.tags || [])) {
      const tag = normalizeTag(t);
      if (!tag) continue;
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
}

function renderTagCloud() {
  const tags = collectTags(postsIndex).slice(0, 24);
  tagCloud.innerHTML = tags.map(([t, n]) =>
    `<span class="tag" data-tag="${esc(t)}" title="${esc(t)} (${n})">${esc(t)} <span style="opacity:.65;">${n}</span></span>`
  ).join("");

  tagCloud.querySelectorAll(".tag").forEach(el => {
    el.addEventListener("click", () => {
      const tag = el.getAttribute("data-tag");
      location.hash = `#/tag/${encodeURIComponent(tag)}`;
    });
  });
}

function matchesFilter(p, text) {
  const ft = (text || "").trim().toLowerCase();
  if (!ft) return true;
  const hay = [
    p.title, p.summary, (p.tags || []).join(" "),
    p.date, p.file
  ].join(" ").toLowerCase();
  return hay.includes(ft);
}

function renderList({ tag = null, query = "" } = {}) {
  const isTagPage = tag === "all";
  const tagNorm = tag && tag !== "all" ? decodeURIComponent(tag) : null;

  let filtered = postsIndex.filter(p => matchesFilter(p, query));
  if (tagNorm) filtered = filtered.filter(p => (p.tags || []).includes(tagNorm));

  // header
  let head = "文章";
  if (isTagPage) head = "标签";
  if (tagNorm) head = `标签：${esc(tagNorm)}`;

  // tags page
  if (isTagPage) {
    const tags = collectTags(postsIndex);
    const html = tags.map(([t,n]) =>
      `<a class="pill" style="margin:4px 6px 0 0; display:inline-flex;" href="#/tag/${encodeURIComponent(t)}">${esc(t)} <span style="opacity:.65;margin-left:6px;">${n}</span></a>`
    ).join("");

    listView.innerHTML = `
      <div class="h1">${head}</div>
      <div class="muted small">点击标签过滤文章；也支持顶部搜索。</div>
      <div style="margin-top:12px;">${html || `<div class="muted">暂无标签</div>`}</div>
      <div style="margin-top:16px;">
        <a class="pill" href="#/">返回文章列表</a>
      </div>
    `;
    return;
  }

  // list cards
  const rows = filtered.map(p => `
    <div class="postcard">
      <h2 class="post-title">
        <a href="#/post/${encodeURIComponent(p.file)}">${esc(p.title)}</a>
      </h2>

      <div class="post-meta">
        <span>${esc(p.date || "")}</span>
        ${(p.tags || []).slice(0, 6).map(t =>
          `<a class="pill" href="#/tag/${encodeURIComponent(t)}" style="padding:4px 10px;">${esc(t)}</a>`
        ).join("")}
      </div>

      ${p.summary ? `<p class="post-summary">${esc(p.summary)}</p>` : ""}
    </div>
  `).join("");

  listView.innerHTML = `
    <div class="h1">${head}</div>
    ${tagNorm ? `<div class="muted small" style="margin-bottom:10px;">过滤条件：标签 = ${esc(tagNorm)}（<a href="#/tag/all">查看全部标签</a>）</div>` : ""}
    ${rows || `<div class="muted">没有匹配结果</div>`}
  `;
}

async function loadIndex() {
  const res = await fetch("./posts/index.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load posts/index.json: ${res.status}`);
  postsIndex = await res.json();

  // sort: date desc, fallback file desc
  postsIndex.sort((a, b) => (b.date || b.file).localeCompare(a.date || a.file));
}

async function loadPost(file) {
  const url = `./posts/${file}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const md = await res.text();

  marked.setOptions({ gfm: true, breaks: false });

  const meta = postsIndex.find(p => p.file === file) || {};
  const title = meta.title || file;
  const date = meta.date || "";
  const tags = (meta.tags || []).map(t => `<a class="pill" href="#/tag/${encodeURIComponent(t)}" style="padding:4px 10px;">${esc(t)}</a>`).join("");

  const html = marked.parse(md);

  postView.innerHTML = `
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <a class="pill" href="#/" style="padding:6px 10px;">← 返回</a>
      <span class="muted small">/</span>
      <span class="muted small">${esc(file)}</span>
    </div>

    <div style="margin-top:12px;">
      <div style="font-size:26px;font-weight:950;line-height:1.25;">${esc(title)}</div>
      <div class="post-meta" style="margin-top:10px;">
        ${date ? `<span>${esc(date)}</span>` : ""}
        ${tags}
      </div>
    </div>

    <hr style="border:0;border-top:1px solid var(--line);margin:16px 0;">
    <div class="md">${html}</div>
  `;
}

function renderAbout() {
  aboutView.innerHTML = `
    <div class="h1">About</div>
    <div class="muted" style="line-height:1.85;">
      这是一个 <b>无编译</b> 的静态博客：文章用 Markdown 维护，浏览器端渲染。<br/>
      适合“本地 AI 改文件 → git push 发布”的工作流。<br/><br/>
      目录结构固定：<code>posts/*.md</code> + <code>posts/index.json</code>。
    </div>

    <div style="margin-top:14px;">
      <a class="pill" href="#/">回到文章列表</a>
      <a class="pill" href="#/tag/all">标签</a>
    </div>
  `;
}

function route() {
  const hash = location.hash || "#/";
  setNotice("", false);

  const postMatch = hash.match(/^#\/post\/(.+)$/);
  const tagMatch  = hash.match(/^#\/tag\/(.+)$/);

  if (postMatch) {
    const file = decodeURIComponent(postMatch[1]);
    showOnly(postView);
    loadPost(file).catch(err => setNotice(`文章加载失败：${err.message}`, true));
    return;
  }

  if (tagMatch) {
    const tag = decodeURIComponent(tagMatch[1]);
    showOnly(listView);
    renderList({ tag, query: qInput.value });
    return;
  }

  if (hash === "#/about") {
    showOnly(aboutView);
    renderAbout();
    return;
  }

  // default list
  showOnly(listView);
  renderList({ query: qInput.value });
}

/* theme */
function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.textContent = "☀";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "☾";
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(cur === "light" ? "dark" : "light");
}

/* init */
(async function init() {
  yearEl.textContent = String(new Date().getFullYear());

  applyTheme(getPreferredTheme());
  themeBtn.addEventListener("click", toggleTheme);

  // Cmd/Ctrl + K focus search
  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      qInput.focus();
    }
  });

  try {
    await loadIndex();
    renderTagCloud();
    route();
  } catch (e) {
    showOnly(listView);
    setNotice(`初始化失败：${e.message}`, true);
  }

  window.addEventListener("hashchange", route);
  qInput.addEventListener("input", () => {
    // 只在 list/tag 页实时过滤
    if (!location.hash || location.hash === "#/" || location.hash.startsWith("#/tag/")) {
      route();
    }
  });
})();