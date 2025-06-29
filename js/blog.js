// 全局博客数据
var blogPosts = [];

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

// 其他函数保持不变（loadPostMeta, renderPosts, renderCategories, loadRandomText, formatDate）
// 只需移除所有 export 语句