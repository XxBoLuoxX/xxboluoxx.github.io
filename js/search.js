// 搜索功能直接使用全局的 blogPosts 和 renderPosts
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();

    if (!query) {
        renderPosts(blogPosts, 'posts-container');
        return;
    }

    const results = blogPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
    );

    renderPosts(results, 'posts-container');
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', initSearch);