// 全局变量用于存储博客文章
let blogPosts = [];

// 使用GitHub API加载博客文章列表
async function loadBlogPosts() {
    try {
        // GitHub API配置
        const owner = 'XxBoLuoxX'; // 你的GitHub用户名
        const repo = 'xxboluoxx.github.io'; // 你的仓库名
        const path = 'blogs'; // 博客文章存放的目录
        
        // 构建GitHub API请求URL
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        // 发送请求获取文件列表
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API请求失败: ${response.status}`);
        }
        
        // 解析响应数据
        const files = await response.json();
        
        // 过滤并处理HTML文件
        const blogFiles = files
            .filter(file => file.name.endsWith('.html'))
            .map(file => ({
                name: file.name,
                path: file.path,
                url: `/${file.path}`
            }));

        console.log('获取到的博客文件:', blogFiles);
        
        // 并行加载每篇文章的元数据
        const postsWithMetadata = await Promise.all(
            blogFiles.map(file => fetchPostMetadata(file))
        );
        
        // 过滤掉加载失败的文章
        blogPosts = postsWithMetadata.filter(post => post!== null);
        
        // 按日期排序（最新的在前）
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('从GitHub API加载博客列表成功:', blogPosts);
        
    } catch (error) {
        console.error('加载博客文章失败:', error);
        throw error;
    }
}

// 获取文章的元数据
async function fetchPostMetadata(file) {
    try {
        const response = await fetch(file.url);
        if (!response.ok) {
            throw new Error(`请求 ${file.url} 失败，状态码: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const title = doc.title;
        const date = doc.querySelector('meta[name="date"]')?.content;
        const tags = doc.querySelector('meta[name="tags"]')?.content.split(',').map(tag => tag.trim());
        const excerpt = doc.querySelector('meta[name="excerpt"]')?.content;

        return {
            title,
            date,
            tags,
            excerpt,
            url: file.url
        };
    } catch (error) {
        console.error(`获取 ${file.url} 的元数据失败:`, error);
        return null;
    }
}

// 渲染博客内容
async function renderBlogContent() {
    try {
        await loadBlogPosts();
        renderLatestPosts();
        renderCategories();
    } catch (error) {
        console.error('渲染博客内容失败:', error);
    }
}

// 渲染最新文章
function renderLatestPosts() {
    const container = document.getElementById('latest-posts');
    if (!container) return;

    const latestPosts = blogPosts.slice(0, 5); // 显示最新的5篇文章

    latestPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';

        const titleElement = document.createElement('a');
        titleElement.href = post.url;
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);

        const dateElement = document.createElement('p');
        dateElement.textContent = `日期: ${post.date}`;
        postElement.appendChild(dateElement);

        const tagsElement = document.createElement('p');
        tagsElement.textContent = `标签: ${post.tags.join(', ')}`;
        postElement.appendChild(tagsElement);

        const excerptElement = document.createElement('p');
        excerptElement.textContent = post.excerpt;
        postElement.appendChild(excerptElement);

        container.appendChild(postElement);
    });
}

// 渲染分类标签云
function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    // 统计每个标签的使用次数
    const tagCount = {};
    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
    });

    // 按使用次数排序
    const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count }));

    const tagCloud = document.createElement('div');
    tagCloud.className = 'tag-cloud';

    sortedTags.forEach(({ tag, count }) => {
        const tagElement = document.createElement('a');
        tagElement.href = `/html/categories.html?tag=${encodeURIComponent(tag)}`;
        tagElement.className = 'tag transition-all duration-300 hover:bg-primary-dark hover:scale-105';
        tagElement.textContent = `${tag} (${count})`;
        tagCloud.appendChild(tagElement);
    });

    container.appendChild(tagCloud);
}

// 根据标签过滤文章
function filterPostsByTag(tag) {
    const filteredPosts = blogPosts.filter(post => post.tags.includes(tag));
    renderPosts(filteredPosts, 'posts-container');

    // 更新页面标题
    const titleElement = document.querySelector('.page-title');
    if (titleElement) {
        titleElement.textContent = `标签: ${tag}`;
    }
}

// 渲染文章列表
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';

        const titleElement = document.createElement('a');
        titleElement.href = post.url;
        titleElement.textContent = post.title;
        postElement.appendChild(titleElement);

        const dateElement = document.createElement('p');
        dateElement.textContent = `日期: ${post.date}`;
        postElement.appendChild(dateElement);

        const tagsElement = document.createElement('p');
        tagsElement.textContent = `标签: ${post.tags.join(', ')}`;
        postElement.appendChild(tagsElement);

        const excerptElement = document.createElement('p');
        excerptElement.textContent = post.excerpt;
        postElement.appendChild(excerptElement);

        container.appendChild(postElement);
    });
}

// 初始化博客系统
async function initBlog() {
    try {
        await loadBlogPosts();
        renderBlogContent();

        // 检查URL参数中的标签
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');
        if (tag) {
            filterPostsByTag(tag);
        }
    } catch (error) {
        console.error('初始化博客失败:', error);
    }
}

document.addEventListener('DOMContentLoaded', initBlog);