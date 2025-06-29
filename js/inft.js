// js/init.js
function loadHeaderFooter() {
    // 加载 header
    fetch('html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => {
            console.error('加载header失败:', error);
        });

    // 加载 footer
    fetch('html/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('加载footer失败:', error);
        });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadHeaderFooter);