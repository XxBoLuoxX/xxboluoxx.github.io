// 博客文章数据结构
let blogPosts = [];

// 初始化博客系统
async function initBlog() {
    await loadBlogPosts();
    renderPosts();
    renderCategories();
}

// 加载所有博客文章
async function loadBlogPosts() {
    const response = await fetch('blogs/');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 获取所有博客文章链接
    const links = Array.from(doc.querySelectorAll('a[href$=".html"]'))
        .map(a => a.href)
        .filter(href => href.includes('/blogs/'));
    
    // 加载每篇文章的元数据
    blogPosts = await Promise.all(links.map(loadPostMeta));
    
    // 按日期排序
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 加载单篇文章元数据
async function loadPostMeta(url) {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return {
        title: doc.querySelector('title')?.textContent || '无标题',
        url: url,
        date: doc.querySelector('meta[name="date"]')?.content || '1970-01-01',
        tags: doc.querySelector('meta[name="tags"]')?.content?.split(',') || [],
        excerpt: doc.querySelector('meta[name="excerpt"]')?.content || '',
        content: html
    };
}

// 渲染文章列表
function renderPosts(posts = blogPosts) {
    const container = document.getElementById('posts-container') || 
                      document.querySelector('.content');
    
    container.innerHTML = '';
    
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
                    <span>${post.tags.join(', ')}</span>
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

// 日期格式化
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
}