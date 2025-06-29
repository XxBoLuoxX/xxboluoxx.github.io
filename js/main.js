// 高亮当前导航项
function highlightNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
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
  document.getElementById('randomText').textContent = randomText;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  loadRandomText();
});