function loadBlogs() {
    // 修改为正确的 ID
    const blogList = document.getElementById('blog-list-container');
    if (!blogList) {
        console.error('未找到博客列表容器');
        return;
    }

    const blogs = ['blog/blog1.html', 'blog/blog2.html'];
    const allTags = [];
    
    blogs.forEach((blogPath) => {
        const blogContainer = document.createElement('div');
        blogContainer.className = 'blog-post'; // 添加类名用于后续筛选
        
        fetch(blogPath)
           .then(response => {
                if (!response.ok) {
                    throw new Error(`加载博客失败: ${response.status}`);
                }
                return response.text();
            })
           .then(data => {
                blogContainer.innerHTML = data;
                
                // 检查 article 元素是否存在
                const article = blogContainer.querySelector('article');
                if (!article || !article.dataset.tags) {
                    console.warn(`博客 ${blogPath} 中未找到 article 元素或 tags 数据属性`);
                    return;
                }
                
                const tags = article.dataset.tags.split(',');
                tags.forEach(tag => allTags.push(tag.trim()));
                
                blogContainer.addEventListener('click', function() {
                    const blogId = blogPath.split('/').pop();
                    localStorage.setItem('blogId', blogId);
                    localStorage.setItem('blogContent', data);
                    window.location.href = 'blog-detail.html';
                });
                
                // 确保 blogList 存在
                if (blogList) {
                    blogList.appendChild(blogContainer);
                }
            })
           .catch(error => {
                console.error(`加载博客 ${blogPath} 失败:`, error);
                // 显示错误信息
                blogContainer.innerHTML = `
                    <div class="error-message">
                        <p>无法加载此博客</p>
                        <p class="text-sm text-red-500">错误: ${error.message}</p>
                    </div>
                `;
                if (blogList) {
                    blogList.appendChild(blogContainer);
                }
            });
    });
    
    // 等待所有博客加载完成后处理标签
    Promise.all(blogs.map(blogPath => 
        fetch(blogPath)
           .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
           .catch(() => '') // 忽略加载失败的博客
    )).then(() => {
        const uniqueTags = [...new Set(allTags)];
        
        // 修正 ID 选择器，移除多余空格
        const subCategoryContainer = document.getElementById('sub-category-container');
        if (!subCategoryContainer) {
            console.error('未找到子分类容器');
            return;
        }
        
        uniqueTags.forEach(tag => {
            const tagLink = document.createElement('a');
            tagLink.href = '#';
            tagLink.textContent = tag;
            // 修正类名，移除多余空格
            tagLink.classList.add('sub-category-link');
            subCategoryContainer.appendChild(tagLink);
        });
        
        // 修正类选择器，移除多余空格
        const subCategoryLinks = document.querySelectorAll('.sub-category-link');
        subCategoryLinks.forEach((link) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTag = this.textContent;
                
                // 修正类选择器，移除多余空格
                const blogPosts = document.querySelectorAll('.blog-post');
                blogPosts.forEach((post) => {
                    const article = post.querySelector('article');
                    if (article && article.dataset.tags) {
                        const postTags = article.dataset.tags.split(',').map(t => t.trim());
                        if (postTags.includes(targetTag)) {
                            post.style.display = 'block';
                        } else {
                            post.style.display = 'none';
                        }
                    }
                });
            });
        });
    });
}

window.onload = loadBlogs;