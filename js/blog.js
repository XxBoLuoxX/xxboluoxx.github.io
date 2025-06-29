// 博客文章数据
let blogPosts = [];

// 初始化博客系统
async function initBlog() {
    await loadBlogPosts();
    
    // 首页只显示最新3篇文章
    if (document.getElementById('latest-posts')) {
        renderPosts(blogPosts.slice(0, 3), 'latest-posts');
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

// 加载所有博客文章
async function loadBlogPosts() {
    try {
        const response = await fetch('blogs/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 获取所有博客文章链接
        const links = Array.from(doc.querySelectorAll('a[href$=".html"]'))
            .map(a => a.getAttribute('href'))
            .filter(href => href.endsWith('.html'))
            .map(href => `blogs/${href}`);
        
        // 加载每篇文章的元数据
        blogPosts = await Promise.all(links.map(loadPostMeta));
        
        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('加载博客文章失败:', error);
    }
}

// 加载单篇文章元数据
async function loadPostMeta(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        return {
            title: doc.querySelector('title')?.textContent || '无标题',
            url: url,
            date: doc.querySelector('meta[name="date"]')?.content || '1970-01-01',
            tags: doc.querySelector('meta[name="tags"]')?.content?.split(',').map(tag => tag.trim()) || [],
            excerpt: doc.querySelector('meta[name="excerpt"]')?.content || '',
            content: html
        };
    } catch (error) {
        console.error(`加载文章 ${url} 失败:`, error);
        return {
            title: '加载失败',
            url: '#',
            date: '1970-01-01',
            tags: [],
            excerpt: '无法加载此文章',
            content: ''
        };
    }
}

// 渲染文章列表
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId) || 
                      document.querySelector('.content');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = '<p class="no-posts">没有找到相关文章</p>';
        return;
    }
    
    posts.forEach(post => {
        const postEl = document.createElement('article');
        postEl.className = 'post-card';
        postEl.innerHTML = `
            <div class="post-header">
                <h2><a href="${post.url}">${post.title}</a></h2>
            </div>
            <div class="post-content">
                <p>${post.excerpt}</p>
                <div class="post-meta">
                    <span>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
        `;
        container.appendChild(postEl);
    });
}

// 渲染分类标签
function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    // 获取所有标签
    const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
    
    // 创建标签云
    const tagsHtml = allTags.map(tag => 
        `<button class="tag" data-tag="${tag}">${tag}</button>`
    ).join('');
    
    container.innerHTML = `
        <div class="search-container">
            <input type="text" id="search-input" placeholder="搜索博文...">
            <button id="search-btn">搜索</button>
        </div>
        <div class="tag-cloud">${tagsHtml}</div>
        <div id="filtered-posts"></div>
    `;
    
    // 添加标签点击事件
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedTag = tag.dataset.tag;
            const filteredPosts = blogPosts.filter(post => 
                post.tags.includes(selectedTag)
            );
            renderPosts(filteredPosts, 'filtered-posts');
        });
    });
}

// 加载随机文本
async function loadRandomText() {
    try {
        const response = await fetch('data/random_text.txt');
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length > 0) {
            const randomIndex = Math.floor(Math.random() * lines.length);
            const randomTextElement = document.getElementById('randomText');
            if (randomTextElement) {
                randomTextElement.textContent = lines[randomIndex];
            }
        }
    } catch (error) {
        console.error('加载随机文本失败:', error);
    }
}

// 日期格式化
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
}

// 导出函数
export { initBlog, blogPosts };