# 波萝格博客项目

## 项目介绍
这是我自己弄的个人博客，叫波萝格。我怕自己忘记一些重要的东西，就搞了这么个博客，平时想到啥就会往上发点内容，希望里面有些东西能对大家有点帮助。

因为这个博客是用 GitHub Pages 搭建的静态网站，所以在看其他页面的时候可能会出现一些小问题。

## 项目结构
- `blogs` 文件夹：放博客文章的地方。
- `data` 文件夹：里面有个 `random_text.txt` 文件，存着一些随机文本。
- `images` 文件夹：放图片的，分了不同的小文件夹。
- `js` 文件夹：放 JavaScript 文件，像 `loadPartials.js`、`main.js`、`blog.js` 这些。
- `partials` 文件夹：有 `head.html` 和 `footer.html` 这些页面模板。
- `css` 文件夹：放 CSS 文件，就一个 `style.css`。
- `html` 文件夹：有个 `about.html` 页面。
- `index.html`：博客的首页。
- `template.txt`：博客文章的模板。

## 功能特点
- 能动态加载文章，用 GitHub API 从 `blogs` 文件夹把文章列表和元数据（标题、日期、标签、摘要）弄出来。
- 文章会按日期排序，新文章在前面。
- 有分类标签云，点标签能只看相关的文章。
- 页脚会显示随机文本，挺好玩的。
- 文章卡片能点击，也能用键盘操作，用起来方便。

## 安装步骤
1. 把仓库克隆到本地：
   ```sh
   git clone https://github.com/XxBoLuoxX/xxboluoxx.github.io.git
   cd xxboluoxx.github.io
   ```
2. 配置 GitHub API：
   打开 `js/blog.js` 文件，把 `owner` 和 `repo` 改成你自己的 GitHub 用户名和仓库名。
3. 启动本地服务器：
   可以用 `http-server` 这个工具：
   ```sh
   npm install -g http-server
   http-server
   ```
   然后在浏览器里打开 `http://localhost:8080` 就能看到博客了。

## 使用说明
### 发新博客
1. 把 `template.txt` 文件复制一份，重命名成 `postX.html`（X 是文章编号），放到 `blogs` 文件夹里。
2. 打开 `postX.html` 文件，把文章的标题、日期、标签、摘要和正文内容填好。
3. 把改动提交到 GitHub 仓库，新文章就会自动显示在博客里了。

### 管理分类标签
文章的标签是通过 `<meta name="tags" content="标签1,标签2">` 来设置的。博客会自动统计每个标签用了多少次，然后在分类页面显示标签云。点击标签云里的标签，就能只看带这个标签的文章。

## 贡献代码
如果你想给这个项目贡献代码，按下面的步骤来：
1. Fork 这个仓库。
2. 新建一个分支：`git checkout -b feature/你的功能名`。
3. 提交你的改动：`git commit -m "写清楚你改了啥"`。
4. 把分支推到你的 Fork 仓库：`git push origin feature/你的功能名`。
5. 打开一个 Pull Request，说明你改了什么。

## 许可证
这个项目用的是 [MIT 许可证](LICENSE)。 
