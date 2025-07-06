// 加载所有partials
async function loadPartials() {
    try {
        // 加载头部
        const headPartial = await fetch('/partials/head.html');
        if (!headPartial.ok) {
            throw new Error(`请求 /partials/head.html 失败，状态码: ${headPartial.status}`);
        }
        document.head.innerHTML += await headPartial.text();

        // 加载导航栏
        const navPartial = await fetch('/partials/navbar.html');
        if (!navPartial.ok) {
            throw new Error(`请求 /partials/navbar.html 失败，状态码: ${navPartial.status}`);
        }
        document.body.insertAdjacentHTML('afterbegin', await navPartial.text());

        // 加载页脚
        const footerPartial = await fetch('/partials/footer.html');
        if (!footerPartial.ok) {
            throw new Error(`请求 /partials/footer.html 失败，状态码: ${footerPartial.status}`);
        }
        document.body.insertAdjacentHTML('beforeend', await footerPartial.text());

        // 高亮当前导航项
        highlightCurrentNav();
    } catch (error) {
        console.error('加载partials失败:', error);
    }
}

// 高亮当前导航项
function highlightCurrentNav() {
    const path = window.location.pathname;
    let navId = '';

    if (path.includes('posts.html')) navId = 'nav-posts';
    else if (path.includes('categories.html')) navId = 'nav-categories';
    else if (path.includes('about.html')) navId = 'nav-about';

    if (navId) {
        const navItem = document.getElementById(navId);
        if (navItem) navItem.classList.add('active');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', loadPartials);