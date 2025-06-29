window.onload = function () {
    const blogContent = localStorage.getItem('blogContent');
    // 修改为正确的 ID
    const detailContent = document.getElementById('blog-detail-content');
    if (detailContent) {
        detailContent.innerHTML = blogContent;
    }
};