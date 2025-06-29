function loadBlogs() {
    // 修正ID选择器中的空格
    const blogList = document.getElementById('blog-list');
    const blogs = ['blog/blog1.html', 'blog/blog2.html'];
    const allTags = [];
    
    blogs.forEach((blogPath) => {
        const blogContainer = document.createElement('div');
        blogContainer.className = 'blog-post'; // 添加类名以便后续筛选
        
        fetch(blogPath)
            .then(response => response.text())
            .then(data => {
                blogContainer.innerHTML = data;
                const article = blogContainer.querySelector('article');
                
                // 添加安全检查，确保元素存在
                if (article && article.dataset.tags) {
                    const tags = article.dataset.tags.split(',');
                    tags.forEach(tag => allTags.push(tag.trim()));
                    
                    blogContainer.addEventListener('click', function () {
                        const blogId = blogPath.split('/').pop();
                        localStorage.setItem('blogId', blogId);
                        localStorage.setItem('blogContent', data);
                        window.location.href = 'blog-detail.html';
                    });
                    
                    // 添加安全检查，确保容器存在
                    if (blogList) {
                        blogList.appendChild(blogContainer);
                    }
                }
            })
            .catch(error => {
                console.error('Failed to load blog:', blogPath, error);
                // 可选：显示错误信息
                if (blogList) {
                    blogContainer.innerHTML = `<div class="error">Failed to load blog: ${error.message}</div>`;
                    blogList.appendChild(blogContainer);
                }
            });
    });
    
    // 等待所有博客加载完成后处理标签
    Promise.all(blogs.map(blogPath => 
        fetch(blogPath).then(response => response.text())
    )).then(() => {
        const uniqueTags = [...new Set(allTags)];
        
        // 修正ID选择器中的空格
        const subCategoryContainer = document.getElementById('sub-category-container');
        
        if (subCategoryContainer) {
            uniqueTags.forEach(tag => {
                const tagLink = document.createElement('a');
                tagLink.href = '#';
                tagLink.textContent = tag;
                // 修正类名中的空格
                tagLink.classList.add('sub-category-link');
                subCategoryContainer.appendChild(tagLink);
            });
            
            // 修正类选择器中的空格
            const subCategoryLinks = document.querySelectorAll('.sub-category-link');
            subCategoryLinks.forEach((link) => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetTag = this.textContent;
                    
                    // 修正类选择器中的空格
                    const blogs = document.querySelectorAll('.blog-post');
                    blogs.forEach((blog) => {
                        const article = blog.querySelector('article');
                        if (article && article.dataset.tags) {
                            const blogTags = article.dataset.tags.split(',').map(t => t.trim());
                            if (blogTags.includes(targetTag)) {
                                blog.style.display = 'block';
                            } else {
                                blog.style.display = 'none';
                            }
                        }
                    });
                });
            });
        }
    }).catch(error => {
        console.error('Error processing tags:', error);
    });
}

window.onload = loadBlogs;