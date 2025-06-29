import { initBlog } from './blog.js';
import { initSearch } from './search.js';

// 初始化整个博客
document.addEventListener('DOMContentLoaded', () => {
    initBlog();
    
    // 如果在分类页面，初始化搜索
    if (window.location.pathname.includes('categories.html')) {
        initSearch();
    }
});