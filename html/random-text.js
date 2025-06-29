function loadRandomText() {
    fetch('html/random.txt')
       .then(response => response.text())
       .then(data => {
            const lines = data.split('\n');
            const randomIndex = Math.floor(Math.random() * lines.length);
            const randomLine = lines[randomIndex];
            document.getElementById('random-text').textContent = randomLine;
        })
       .catch(error => console.error('读取随机文本文件失败:', error));
}

window.onload = function () {
    loadRandomText();
};