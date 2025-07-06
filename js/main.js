// 高亮当前导航菜单
function highlightCurrentNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (currentPath === linkPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 从外部文件加载随机文本
async function loadRandomText() {
    try {
        const response = await fetch('/data/random_text.txt');
        const text = await response.text();
        const texts = text.split('\n').filter(line => line.trim()!== '');
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        const element = document.getElementById('randomText');
        if (element) element.textContent = randomText;
    } catch (error) {
        console.error('加载随机文本失败:', error);
        const element = document.getElementById('randomText');
        if (element) element.textContent = '随机文本加载失败，请稍后重试。'; // 添加默认提示
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', async () => {
  highlightCurrentNav();
  await loadRandomText();
});