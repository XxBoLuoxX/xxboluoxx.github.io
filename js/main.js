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

// 切换深色模式
function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '浅色模式';
    } else {
        toggleButton.textContent = '深色模式';
    }
}

// 添加点击事件监听器
const toggleButton = document.getElementById('dark-mode-toggle');
if (toggleButton) {
    toggleButton.addEventListener('click', toggleDarkMode);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadRandomText();
});