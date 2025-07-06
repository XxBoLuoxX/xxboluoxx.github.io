// 全局博客数据
var blogPosts = [];

// 初始化博客系统
async function initBlog() {
    try {
        showLoading(true);
        await loadBlogPosts();
        renderBlogContent();
    } catch (error) {
        console.error('初始化博客失败:', error);
        showError('加载博客内容失败，请稍后再试');
    } finally {
        showLoading(false);
    }
}

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

// 获取文章元数据（标题、日期、标签等）
async function fetchPostMetadata(file) {
    try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`获取文章内容失败: ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取元数据
        const title = doc.querySelector('title')?.textContent || file.name.replace('.html', '');
        const dateMeta = doc.querySelector('meta[name="date"]');
        const tagsMeta = doc.querySelector('meta[name="tags"]');
        const excerptMeta = doc.querySelector('meta[name="excerpt"]');
        
        const date = dateMeta?.getAttribute('content') || 
                    extractDateFromFilename(file.name) || 
                    new Date().toISOString().split('T')[0];
        
        const tags = tagsMeta?.getAttribute('content')?.split(',')?.filter(t => t.trim()) || [];
        const excerpt = excerptMeta?.getAttribute('content') || '阅读更多...';
        
        return {
            ...file,
            title,
            date,
            tags,
            excerpt
        };
    } catch (error) {
        console.error(`获取文章 ${file.name} 元数据失败:`, error);
        return null;
    }
}

// 从文件名提取日期（格式：YYYY-MM-DD-title.html）
function extractDateFromFilename(filename) {
    const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
}

// 渲染博客内容到不同页面
function renderBlogContent() {
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
    loadRandomText();
}

// 渲染文章列表
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">暂无文章</p>';
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg';
        
        postCard.innerHTML = `
            <div class="p-6">
                <h2 class="text-xl font-bold mb-2 text-gray-800">
                    <a href="${post.url}" class="hover:text-primary">${post.title}</a>
                </h2>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <span class="mr-4"><i class="fas fa-calendar-alt mr-1"></i> ${post.date}</span>
                    <span><i class="fas fa-tags mr-1"></i> ${post.tags.join(', ') || '无标签'}</span>
                </div>
                <p class="text-gray-600 mb-4">${post.excerpt}</p>
                <a href="${post.url}" class="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    阅读更多
                </a>
            </div>
        `;
        
        container.appendChild(postCard);
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
    tagCloud.className = 'flex flex-wrap gap-2 mb-6';

    sortedTags.forEach(({ tag, count }) => {
        const tagElement = document.createElement('a');
        tagElement.href = `javascript:void(0)`;
        tagElement.className = 'px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors';
        tagElement.textContent = `${tag} (${count})`;
        tagElement.addEventListener('click', () => filterPostsByTag(tag));
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

// 加载随机文本
async function loadRandomText() {
    try {
        const response = await fetch('/data/random_text.txt');
        const text = await response.text();
        const texts = text.split('\n').filter(line => line.trim()!== '');
        
        if (texts.length > 0) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            const element = document.getElementById('randomText');
            if (element) element.textContent = randomText;
        }
    } catch (error) {
        console.error('加载随机文本失败:', error);
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// 显示错误信息
function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', initBlog);