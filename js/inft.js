// js/init.js
function loadHeaderFooter() {
    // 加载 header
    fetch('html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });

    // 加载 footer
    fetch('html/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            // 加载随机文本
            const script = document.createElement('script');
            script.src = 'html/random-text.js';
            document.body.appendChild(script);
        });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadHeaderFooter);