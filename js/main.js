// 全局变量
var blogPosts = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化博客功能
    if (typeof initBlog === 'function') {
        initBlog();
    }
    
    // 初始化搜索功能（如果在分类或博文页面）
    if ((window.location.pathname.includes('categories.html') || 
         window.location.pathname.includes('posts.html')) &&
        typeof initSearch === 'function') {
        initSearch();
    }
    
    // 加载随机文本
    loadRandomText();
});

// 加载随机文本
function loadRandomText() {
    fetch('data/random_text.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length > 0) {
                const randomIndex = Math.floor(Math.random() * lines.length);
                const randomTextElement = document.getElementById('randomText');
                if (randomTextElement) {
                    randomTextElement.textContent = lines[randomIndex];
                }
            }
        })
        .catch(error => {
            console.error('加载随机文本失败:', error);
        });
}