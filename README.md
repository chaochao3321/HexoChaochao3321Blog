# Chaochao Blog

一个极简的无编译静态博客系统，基于 GitHub Pages 构建，支持完全响应式设计和移动端优化。

## 🌟 特性

### 核心优势
- **无编译架构**：纯静态 HTML/CSS/JavaScript，无需构建工具
- **Markdown 驱动**：文章使用 Markdown 格式，简单易维护
- **Git Push 即发布**：更新内容只需提交并推送代码
- **完全响应式**：精心优化的移动端体验

### 技术特点
- **现代 CSS**：使用 CSS Grid、Flexbox 和现代选择器
- **主题系统**：支持亮色/暗色模式自动切换
- **客户端渲染**：使用 Marked.js 解析 Markdown
- **单页应用**：基于 hash 路由的 SPA 体验

## 📱 移动端优化

### 响应式断点
- **桌面端** (> 980px)：双栏布局，完整功能
- **平板端** (768px - 980px)：调整侧边栏宽度
- **手机端** (480px - 768px)：单栏布局，触摸优化
- **小屏手机** (< 480px)：紧凑布局，极致适配

### 移动端特色功能
- 🍔 **汉堡菜单**：节省顶部空间的导航方案
- 👆 **触摸友好**：所有交互元素符合移动端最佳实践
- 📱 **安全区域适配**：完美支持 iPhone X 系列刘海屏
- 🎨 **流畅动画**：优化的过渡效果和视觉反馈

## 🏗️ 项目结构

```
.
├── index.html              # 主页面文件
├── README.md               # 项目说明文档
├── .nojekyll              # GitHub Pages 配置
├── .gitignore             # Git 忽略规则
├── CNAME                  # 自定义域名配置
├── assets/                # 静态资源目录
│   ├── app.js             # 核心 JavaScript 逻辑
│   └── style.css          # 样式文件（含响应式设计）
└── posts/                 # 文章目录
    ├── index.json         # 文章索引文件
    └── *.md               # Markdown 文章文件
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/yourusername/your-blog-repo.git
cd your-blog-repo
```

### 2. 本地开发
```bash
# 使用 Python 启动本地服务器
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

### 3. 访问博客
打开浏览器访问 `http://localhost:8000`

## ✍️ 内容管理

### 添加新文章
1. 在 `posts/` 目录下创建新的 `.md` 文件
2. 在 `posts/index.json` 中添加文章元数据：

```json
{
  "file": "2026-02-09-new-post.md",
  "title": "文章标题",
  "date": "2026-02-09",
  "tags": ["tag1", "tag2"],
  "summary": "文章摘要"
}
```

### 发布流程
```bash
git add .
git commit -m "Add new blog post"
git push origin main
```

## 🎨 自定义配置

### 修改主题颜色
在 `assets/style.css` 中修改 CSS 变量：

```css
:root {
  --brand: #8ab4ff;        /* 主题色 */
  --bg: #0b0d12;           /* 背景色 */
  --text: #e9edf5;         /* 文字色 */
}
```

### 更改个人信息
修改 `index.html` 中的个人信息部分：

```html
<div class="profile">
  <div class="avatar">C</div>
  <div>
    <div class="name">你的名字</div>
    <div class="desc">你的简介</div>
  </div>
</div>
```

## 🔧 技术栈

- **HTML5**：语义化标记
- **CSS3**：Grid/Flexbox 布局，自定义属性
- **Vanilla JavaScript**：原生 JS 实现所有功能
- **Marked.js**：Markdown 解析库
- **GitHub Pages**：免费静态网站托管

## 📱 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发建议
- 保持无编译架构的简洁性
- 确保移动端体验优先
- 遵循现有的代码风格

## 📄 许可证

MIT License

## 🙏 致谢

- [Marked.js](https://marked.js.org/) - Markdown 解析引擎
- [GitHub Pages](https://pages.github.com/) - 免费托管服务

---

✨ *享受简洁的写作体验！*