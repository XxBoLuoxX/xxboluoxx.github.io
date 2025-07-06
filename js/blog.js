// blog.js - 使用 GitHub API 获取博客列表并展示
let blogPosts = [];

// 初始化博客页面
async function initBlog() {
    await loadBlogPosts();
    renderBlogList();
}

// 从 GitHub API 加载博客文章列表
async function loadBlogPosts() {
    try {
        // GitHub API 配置
        const owner = 'XxBoLuoxX'; // 你的 GitHub 用户名
        const repo = 'xxboluoxx.github.io'; // 你的仓库名
        const path = 'blogs'; // 博客文章存放的目录
        
        // 构建 GitHub API 请求 URL
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        // 发送请求获取文件列表
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`GitHub API 请求失败: ${response.status}`);
        }
        
        // 解析响应数据
        const files = await response.json();
        
        // 过滤并处理 HTML 文件
        blogPosts = files
            .filter(file => file.name.endsWith('.html'))
            .map(file => {
                // 提取文件名作为标题（去掉 .html 后缀）
                const title = file.name.replace('.html', '');
                
                // 尝试从文件路径提取日期（假设文件名格式为 YYYY-MM-DD-title.html）
                const dateMatch = file.name.match(/(\d{4}-\d{2}-\d{2})/);
                const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
                
                // 构建博客文章对象
                return {
                    title: title,
                    date: date,
                    path: file.path,
                    url: `https://${owner}.github.io/${repo}/${file.path}`
                };
            });
            
        // 按日期排序（最新的在前）
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 缓存结果到 localStorage
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        localStorage.setItem('blogPostsCacheTime', Date.now().toString());
        
    } catch (error) {
        console.error('加载博客文章失败:', error);
        
        // 尝试使用缓存数据
        const cachedPosts = localStorage.getItem('blogPosts');
        if (cachedPosts) {
            blogPosts = JSON.parse(cachedPosts);
            console.log('使用缓存的博客列表');
        } else {
            showError('博客列表加载失败，请稍后重试');
        }
    }
}

// 渲染博客列表到页面
function renderBlogList() {
    const container = document.getElementById('latest-posts');
    if (!container) return;
    
    if (blogPosts.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500">暂无博客文章</p>';
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建博客列表
    const postList = document.createElement('ul');
    postList.className = 'blog-list grid grid-cols-1 md:grid-cols-2 gap-6';
    
    blogPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.className = 'blog-item bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105';
        
        const link = document.createElement('a');
        link.href = post.url;
        link.className = 'blog-link block h-full';
        link.innerHTML = `
            <div class="p-6">
                <h2 class="blog-title text-xl font-bold mb-2 text-gray-800">${post.title}</h2>
                <p class="blog-date text-sm text-gray-500 mb-4">发布于 ${post.date}</p>
                <p class="blog-excerpt text-gray-600">加载中...</p>
            </div>
        `;
        
        listItem.appendChild(link);
        postList.appendChild(listItem);
    });
    
    container.appendChild(postList);
}

// 显示错误信息
function showError(message) {
    const container = document.getElementById('latest-posts');
    if (container) {
        container.innerHTML = `
            <div class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong class="font-bold">错误:</strong>
                <span class="block sm:inline">${message}</span>
            </div>
        `;
    }
}

// 页面加载完成后初始化博客
document.addEventListener('DOMContentLoaded', initBlog);