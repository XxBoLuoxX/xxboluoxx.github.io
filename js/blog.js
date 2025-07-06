// 全局博客数据
var blogPosts = [];

// 初始化博客系统
async function initBlog() {
    try {
        // 显示加载状态
        showLoading(true);
        
        // 加载博客文章
        await loadBlogPosts();
        
        // 渲染博客内容
        renderBlogContent();
        
    } catch (error) {
        console.error('初始化博客失败:', error);
        showError('加载博客内容失败，请稍后再试');
    } finally {
        // 隐藏加载状态
        showLoading(false);
    }
}

// 加载所有博客文章
async function loadBlogPosts() {
    try {
        // 修改请求路径为根目录下的 blogs 文件夹
        const response = await fetch('/blogs/');
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }
        
        console.log('请求 blogs/ 的响应状态:', response.status);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 获取所有博客文章链接
        const links = Array.from(doc.querySelectorAll('a[href$=".html"]'))
           .map(a => a.getAttribute('href'))
           .filter(href => href.endsWith('.html'))
           .map(href => `/blogs/${href}`);

        console.log('获取到的博客文章链接:', links);

        // 并行加载每篇文章的元数据
        const postsWithMetadata = await Promise.all(
            links.map(loadPostMeta)
        );

        // 过滤掉加载失败的文章
        blogPosts = postsWithMetadata.filter(post => post!== null);

        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('成功加载博客文章:', blogPosts.length);
        
    } catch (error) {
        console.error('加载博客文章失败:', error);
        throw error; // 向上抛出错误，由 initBlog 处理
    }
}

// 加载文章元数据
async function loadPostMeta(url) {
    try {
        const response = await fetch(url);
        
        // 检查响应状态
        if (!response.ok) {
            console.warn(`获取文章 ${url} 失败: ${response.status}`);
            return null;
        }
        
        console.log(`请求 ${url} 的响应状态:`, response.status);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 提取元数据（添加安全检查）
        const title = doc.querySelector('title')?.textContent || '未找到标题';
        const date = doc.querySelector('meta[name="date"]')?.getAttribute('content') || '未找到日期';
        const tags = (doc.querySelector('meta[name="tags"]')?.getAttribute('content') || '').split(',');
        const excerpt = doc.querySelector('meta[name="excerpt"]')?.getAttribute('content') || '未找到摘要';

        return { title, date, tags, excerpt, url };
    } catch (error) {
        console.error(`加载文章元数据失败: ${url}`, error);
        return null; // 返回 null 而不是抛出错误，避免中断整个过程
    }
}

// 渲染博客内容
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
function renderPosts(posts, containerId = 'posts-container') {
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