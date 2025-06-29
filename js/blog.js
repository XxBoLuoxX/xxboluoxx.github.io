function loadBlogs() {
    const blogList = document.getElementById('blog-list-container');
    if (!blogList) {
        console.error('未找到博客列表容器');
        return;
    }

    const blogs = ['blog/blog1.html', 'blog/blog2.html'];
    const allTags = [];

    blogs.forEach((blogPath) => {
        const blogContainer = document.createElement('div');
        blogContainer.className = 'blog-post';

        fetch(blogPath)
           .then(response => {
                if (!response.ok) {
                    throw new Error(`加载博客失败: ${response.status}`);
                }
                return response.text();
            })
           .then(data => {
                blogContainer.innerHTML = data;
                const article = blogContainer.querySelector('article');
                if (!article || !article.dataset.tags) {
                    console.warn(`博客 ${blogPath} 中未找到 article 元素或 tags 数据属性`);
                    return;
                }
                const tags = article.dataset.tags.split(',');
                tags.forEach(tag => allTags.push(tag.trim()));
                blogContainer.addEventListener('click', function () {
                    const blogId = blogPath.split('/').pop();
                    localStorage.setItem('blogId', blogId);
                    localStorage.setItem('blogContent', data);
                    window.location.href = 'html/blog-detail.html';
                });
                if (blogList) {
                    blogList.appendChild(blogContainer);
                }
            })
           .catch(error => {
                console.error(`加载博客 ${blogPath} 失败:`, error);
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

    Promise.all(blogs.map(blogPath =>
        fetch(blogPath)
           .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
           .catch(() => '')
    )).then(() => {
        const uniqueTags = [...new Set(allTags)];
        const subCategoryContainer = document.getElementById('sub-category-container');
        if (!subCategoryContainer) {
            console.error('未找到子分类容器');
            return;
        }

        uniqueTags.forEach(tag => {
            const tagLink = document.createElement('a');
            tagLink.href = '#';
            tagLink.textContent = tag;
            tagLink.classList.add('sub-category-link');
            tagLink.dataset.tag = tag;
            subCategoryContainer.appendChild(tagLink);
        });

        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const category = this.dataset.category;
                const subCategoryLinks = document.querySelectorAll('.sub-category-link');
                subCategoryLinks.forEach(subLink => {
                    const tag = subLink.dataset.tag;
                    if (category === 'all' || tag.includes(category)) {
                        subLink.style.display = 'inline-block';
                    } else {
                        subLink.style.display = 'none';
                    }
                });
            });
        });

        const subCategoryLinks = document.querySelectorAll('.sub-category-link');
        subCategoryLinks.forEach((link) => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetTag = this.textContent;
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