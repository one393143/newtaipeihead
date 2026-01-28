document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('official-grid');
    const searchInput = document.getElementById('searchInput');

    let officials = [];

    // Use data from data.js
    if (typeof officialsData !== 'undefined') {
        renderCards(officialsData);
    } else {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:red;">無法載入資料，請確認 data/data.js 是否存在。</p>';
    }

    // Render Function
    function renderCards(data) {
        grid.innerHTML = '';

        if (data.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%; color:#666;">沒有找到符合的結果。</p>';
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.05}s`; // Staggered animation

            // Handle missing image
            // We expect image_path to be "img/filename.jpg"
            // If it's missing or empty, use a placeholder
            // But 'image_path' from crawler includes 'img/' prefix? 
            // The crawler uses os.path.join(IMG_DIR, filename), so it might be 'img/foo.jpg'
            // We need to make sure the relative path is correct for the HTML which is in root of 'ntpc_heads'.
            // If index.html is in 'ntpc_heads', and img is in 'ntpc_heads/img', then src="img/foo.jpg" is correct.
            // However, crawler might output 'data\\foo.jpg' on windows or absolute path?
            // Crawler logic: `return os.path.join(IMG_DIR, filename)` -> 'img/filename.jpg' (relative) if CWD is correct.
            // But let's verify what the crawler actually wrote.

            // Fix backslashes if any (though Python usually handles join well, on mixed OS text might be weird)
            let imgSrc = item.image_path ? item.image_path.replace(/\\\\/g, '/') : '';

            if (!imgSrc) {
                // Placeholder
                imgSrc = 'https://via.placeholder.com/400x400?text=No+Image';
            }

            card.innerHTML = `
                <div class="card-image">
                    <img src="${imgSrc}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x400?text=Image+Error'">
                </div>
                <div class="card-content">
                    <div class="card-category">${item.category}</div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-name">${item.name}</div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    // Search Function
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        const filtered = officials.filter(item => {
            return (
                (item.name && item.name.toLowerCase().includes(term)) ||
                (item.title && item.title.toLowerCase().includes(term)) ||
                (item.category && item.category.toLowerCase().includes(term))
            );
        });

        renderCards(filtered);
    });
});
