// 博客文章列表
let blogPosts = [];

// 初始化博客页面
async function initBlog() {
    await loadBlogPosts();
    renderBlogList();
}

// 加载所有博客文章
async function loadBlogPosts() {
    try {
        // 获取博客列表页面
        const response = await fetch('blogs/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 获取所有博客文章链接
        const links = Array.from(doc.querySelectorAll('a[href$=".html"]'))
           .map(a => a.getAttribute('href'))
           .filter(href => href.endsWith('.html'))
           .map(href => `blogs/${href}`);

        console.log('Found blog links:', links);

        // 并行加载每篇文章的元数据
        blogPosts = await Promise.all(links.map(loadPostMeta));
        
        // 过滤掉加载失败的文章
        blogPosts = blogPosts.filter(post => post!== null);
        
        // 按日期排序（最新的在前）
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
    } catch (error) {
        console.error('加载博客文章失败:', error);
        // 可以在这里添加错误提示 UI
    }
}

// 加载文章元数据（标题、日期等）
async function loadPostMeta(url) {
    try {
        // 确保 URL 是字符串
        if (typeof url!== 'string') {
            console.error(`无效的 URL: ${url}`);
            return null;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`无法加载文章: ${url}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 安全获取元数据
        const titleElement = doc.querySelector('title');
        const dateMeta = doc.querySelector('meta[name="date"]');
        const tagsMeta = doc.querySelector('meta[name="tags"]');
        const excerptMeta = doc.querySelector('meta[name="excerpt"]');

        return {
            title: titleElement?.textContent || url.split('/').pop(),
            date: dateMeta?.getAttribute('content') || new Date().toISOString().split('T')[0],
            tags: tagsMeta?.getAttribute('content')?.split(',') || [],
            excerpt: excerptMeta?.getAttribute('content') || '无摘要',
            url
        };
    } catch (error) {
        console.error(`加载文章元数据失败 (${url}):`, error);
        return null; // 返回 null 而不是抛出错误，避免中断整个过程
    }
}

// 渲染博客列表
function renderBlogList() {
    const container = document.getElementById('latest-posts');
    if (!container) return;
    
    if (blogPosts.length === 0) {
        container.innerHTML = '<p>暂无博客文章</p>';
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建博客列表
    const postList = document.createElement('ul');
    postList.className = 'blog-list';
    
    blogPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.className = 'blog-item';
        
        const link = document.createElement('a');
        link.href = post.url;
        link.className = 'blog-link';
        link.innerHTML = `
            <h2 class="blog-title">${post.title}</h2>
            <p class="blog-date">${post.date}</p>
            <p class="blog-excerpt">${post.excerpt}</p>
        `;
        
        listItem.appendChild(link);
        postList.appendChild(listItem);
    });
    
    container.appendChild(postList);
}

// 页面加载完成后初始化博客
document.addEventListener('DOMContentLoaded', initBlog);