function loadBlogs() {
    const blogList = document.getElementById('blog - list');
    const blogs = ['blog/blog1.html', 'blog/blog2.html'];
    const allTags = [];
    blogs.forEach((blogPath) => {
        const blogContainer = document.createElement('div');
        fetch(blogPath)
          .then(response => response.text())
          .then(data => {
                blogContainer.innerHTML = data;
                const article = blogContainer.querySelector('article');
                const tags = article.dataset.tags.split(',');
                tags.forEach(tag => allTags.push(tag.trim()));
                blogContainer.addEventListener('click', function () {
                    const blogId = blogPath.split('/').pop();
                    localStorage.setItem('blogId', blogId);
                    localStorage.setItem('blogContent', data);
                    window.location.href = 'blog - detail.html';
                });
                blogList.appendChild(blogContainer);
            });
    });
    const uniqueTags = [...new Set(allTags)];
    const categoryLink = document.getElementById('category - link');
    uniqueTags.forEach(tag => {
        const tagLink = document.createElement('a');
        tagLink.href = '#';
        tagLink.textContent = tag;
        tagLink.classList.add('sub - category - link');
        document.getElementById('sub - category - container').appendChild(tagLink);
    });
    const subCategoryLinks = document.querySelectorAll('.sub - category - link');
    subCategoryLinks.forEach((link) => {
        link.addEventListener('click', function () {
            const targetTag = this.textContent;
            const blogs = document.querySelectorAll('.blog - post');
            blogs.forEach((blog) => {
                const blogTags = blog.dataset.tags.split(',');
                if (blogTags.includes(targetTag)) {
                    blog.style.display = 'block';
                } else {
                    blog.style.display = 'none';
                }
            });
        });
    });
}
window.onload = loadBlogs;