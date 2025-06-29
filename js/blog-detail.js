window.onload = function () {
    const blogContent = localStorage.getItem('blogContent');
    const detailContent = document.getElementById('blog-detail-content');
    if (detailContent) {
        detailContent.innerHTML = blogContent;
    }
};