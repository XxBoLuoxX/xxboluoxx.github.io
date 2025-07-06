// 全局博客数据
var blogPosts = [];

// 博客文章列表（手动维护或从索引文件加载）
const blogPostList = [
    { url: '/blogs/post1.html' },
    { url: '/blogs/post2.html' },
    // 添加更多文章...
];

// 初始化博客系统
async function initBlog() {
    try {
        await loadBlogPosts();

        // 首页只显示最新1篇文章
        if (document.getElementById('latest-posts')) {
            renderPosts(blogPosts.slice(0, 1), 'latest-posts');
        }

        // 博文页面显示全部文章
        if (document.getElementById('posts-container')) {
            renderPosts(blogPosts, 'posts-container');
        }

        // 分类页面渲染标签
        if (document.getElementById('categories-container')) {
            renderCategories();
        }

        // 加载随机文本
        await loadRandomText();

        // 初始化搜索功能
        if (typeof initSearch === 'function') {
            initSearch();
        } else {
            console.error('initSearch 函数未定义');
        }
    } catch (error) {
        console.error('初始化博客系统失败:', error);
    }
}

// 加载所有博客文章
async function loadBlogPosts() {
    try {
        // 使用预定义的文章列表而非尝试浏览目录
        blogPosts = await Promise.all(blogPostList.map(loadPostMeta));

        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('加载博客文章失败:', error);
    }
}

// 加载文章元数据
async function loadPostMeta(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const title = doc.querySelector('title').textContent;
        const date = doc.querySelector('meta[name="date"]').getAttribute('content');
        const tags = doc.querySelector('meta[name="tags"]').getAttribute('content').split(',');
        const excerpt = doc.querySelector('meta[name="excerpt"]').getAttribute('content');

        return { title, date, tags, excerpt, url };
    } catch (error) {
        console.error(`加载文章元数据失败: ${url}`, error);
        return null;
    }
}

// 渲染文章
function renderPosts(posts, containerId = 'posts-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (posts.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = '又出bug了';
        container.appendChild(noResults);
        return;
    }

    posts.forEach(post => {
        if (!post) return;

        const postCard = document.createElement('div');
        postCard.classList.add('post-card');

        const title = document.createElement('h2');
        title.textContent = post.title;
        postCard.appendChild(title);

        const excerpt = document.createElement('p');
        excerpt.textContent = post.excerpt;
        postCard.appendChild(excerpt);

        const meta = document.createElement('div');
        meta.classList.add('post-meta');

        const tags = document.createElement('span');
        tags.textContent = `标签: ${post.tags.join(', ')}`;
        meta.appendChild(tags);

        const date = document.createElement('span');
        date.textContent = `日期: ${post.date}`;
        meta.appendChild(date);

        postCard.appendChild(meta);

        container.appendChild(postCard);
    });
}

// 渲染分类
function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const allTags = blogPosts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];

    const tagCloud = document.createElement('div');
    tagCloud.classList.add('tag-cloud');

    uniqueTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => filterPostsByTag(tag));
        tagCloud.appendChild(tagElement);
    });

    container.appendChild(tagCloud);
}

// 根据标签过滤文章
function filterPostsByTag(tag) {
    const filteredPosts = blogPosts.filter(post => post.tags.includes(tag));
    renderPosts(filteredPosts, 'posts-container');
}

// 加载随机文本
async function loadRandomText() {
    try {
        const response = await fetch('/data/random_text.txt');
        const text = await response.text();
        const texts = text.split('\n').filter(line => line.trim()!== '');
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        const element = document.getElementById('randomText');
        if (element) element.textContent = randomText;
    } catch (error) {
        console.error('加载随机文本失败:', error);
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', initBlog);
