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

// 加载随机文本
function loadRandomText() {
  const texts = [
     "腾讯元宝申请出战",
    "豆包为什么不能叫邓超",
    "Wake  Up!!!",
    "其实我根本就不会看代码",
   "你想看什么",
    "这是什么"
  ];
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  const element = document.getElementById('randomText');
  if (element) element.textContent = randomText;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  highlightCurrentNav();
  loadRandomText();
});