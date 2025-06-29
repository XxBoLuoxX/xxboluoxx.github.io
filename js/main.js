// 主入口文件
document.addEventListener('DOMContentLoaded', function() {
    initBlog();
    
    // 如果在分类或博文页面，初始化搜索
    if (window.location.pathname.includes('categories.html') || 
        window.location.pathname.includes('posts.html')) {
        initSearch();
    }
});