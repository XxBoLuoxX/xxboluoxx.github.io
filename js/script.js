// 可以在这里添加交互功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('博客加载完成');
    
    // 示例：获取当前年份用于页脚
    const year = new Date().getFullYear();
    const yearElement = document.createElement('span');
    yearElement.textContent = `© ${year} 波萝格博客`;
    document.querySelector('.footer').appendChild(yearElement);
});