import { blogPosts, renderPosts } from './blog.js';

// 初始化搜索功能
export function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// 执行搜索
function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!query) {
        renderPosts(blogPosts);
        return;
    }
    
    const results = blogPosts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    renderPosts(results, document.getElementById('filtered-posts') ? 'filtered-posts' : undefined);
}