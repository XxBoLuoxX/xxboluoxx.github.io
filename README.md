（以下内容为AI生成总结，我是真的不会写东西）
```markdown
# 波萝格博客

## 项目概述
波萝格博客是一个基于 HTML、CSS 和 JavaScript 构建的个人博客网站，使用 GitHub Pages 进行部署。博客旨在记录博主个人所需信息，同时分享一些有价值的内容。由于使用 GitHub Pages 搭建静态网站，在浏览部分页面时可能会出现一些小问题。

## 项目结构
```
xxboluoxx.github.io/
├── blogs/           # 博客文章存放目录
│   ├── post1.html
│   ├── post2.html
│   └── ...
├── data/            # 数据文件目录
│   └── random_text.txt
├── images/          # 图片文件目录
│   ├── about/
│   └── social-icons/
├── js/              # JavaScript 文件目录
│   ├── loadPartials.js
│   ├── main.js
│   ├── blog.js
│   └── search.js
├── partials/        # 页面部分模板目录
│   ├── head.html
│   └── footer.html
├── css/             # CSS 文件目录
│   └── style.css
├── html/            # 其他 HTML 页面目录
│   └── about.html
├── index.html       # 首页
└── template.txt     # 博客文章模板
```

## 功能特性
1. **动态加载文章**：利用 GitHub API 从 `blogs` 目录加载博客文章列表，并提取文章的元数据（标题、日期、标签、摘要）。
2. **文章排序**：文章按日期排序，最新的文章显示在最前面。
3. **分类标签**：支持分类标签云，点击标签可过滤显示相关文章。
4. **随机文本**：页脚显示随机文本，增加趣味性。
5. **页面交互**：文章卡片支持点击和键盘导航，增强用户体验。

## 技术实现
### HTML
- **`index.html`**：博客首页，展示欢迎信息和最新文章列表。
- **`partials/head.html`**：包含网页的元信息和样式表链接。
- **`partials/footer.html`**：页脚部分，包含社交链接和随机文本显示区域。
- **`html/about.html`**：关于页面，介绍博客搭建的协助工具、字体使用情况，以及友情链接和其他博客推荐。
- **`blogs/*.html`**：具体的博客文章页面，每篇文章包含标题、日期、标签、摘要和正文内容。

### CSS
- **`css/style.css`**：定义了博客的整体样式，包括导航栏、主体内容、文章卡片、页脚等部分的样式，同时支持响应式设计，适配不同屏幕尺寸。

### JavaScript
- **`js/loadPartials.js`**：用于动态加载页面的部分模板（如头部和页脚）。
- **`js/main.js`**：主要的脚本文件，可能包含一些全局的交互逻辑。
- **`js/blog.js`**：使用 GitHub API 加载博客文章列表，并处理文章的元数据和排序。
- **`js/search.js`**：实现搜索功能，方便用户查找文章。

## 示例文章内容
### [我常用的直播间弹幕样式](blogs/post8.html)
介绍了 B 站直播常用的弹幕样式，如 `bilivechat` 和 `LAPLACE Chat`，包括它们的特点和功能链接。

### [我直播会用来看弹幕的工具](blogs/post9.html)
分享了直播时看弹幕的工具，如 `B站弹幕姬`、`LAPLACE Chat`、`哔哩哔哩直播姬` 和 `咩播`，并提供了相应的功能介绍和链接。

### [一个直播歌曲显示小工具](blogs/post10.html)
推荐了 `NowPlaying 直播歌曲组件`，支持多种音乐软件和播放器，具有多种自定义样式和歌词显示功能。

### [看女性朋友发"战后评价"有感](blogs/post11.html)
博主分享了看到女性朋友发的 “战后评价” 动态后的感受和经历。

## 安装与部署
### 克隆项目
```sh
git clone https://github.com/XxBoLuoxX/xxboluoxx.github.io.git
cd xxboluoxx.github.io
```

### 配置 GitHub API
在 `js/blog.js` 文件中，确保 `owner` 和 `repo` 变量设置正确：
```javascript
const owner = 'XxBoLuoxX'; // 你的GitHub用户名
const repo = 'xxboluoxx.github.io'; // 你的仓库名
```

### 启动本地服务器
可以使用 `http-server` 启动本地服务器：
```sh
npm install -g http-server
http-server
```
然后在浏览器中访问 `http://localhost:8080`。

### 部署到 GitHub Pages
将项目推送到 GitHub 仓库，在仓库的设置中开启 GitHub Pages 功能，选择 `main` 分支作为源，即可完成部署。

## 贡献指南
如果你想为这个项目贡献代码，请遵循以下步骤：
1. Fork 这个仓库。
2. 创建一个新的分支：`git checkout -b feature/your-feature-name`。
3. 提交你的更改：`git commit -m "Add your commit message"`。
4. 推送分支到你的 Fork 仓库：`git push origin feature/your-feature-name`。
5. 打开一个 Pull Request，描述你的更改内容。

## 许可证
本项目采用 [MIT 许可证](LICENSE)。
```

你可以将上述内容复制到你的项目的 `README.md` 文件中，根据实际情况进行调整和完善。
