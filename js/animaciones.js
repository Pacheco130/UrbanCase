document.addEventListener('DOMContentLoaded', function() {
    function shakeAndPulseCategories() {
        const items = document.querySelectorAll('.categories-grid .category-item');
        items.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('shake-animate');
                const img = item.querySelector('img');
                if (img) img.classList.add('pulse-animate');
                setTimeout(() => {
                    item.classList.remove('shake-animate');
                    if (img) img.classList.remove('pulse-animate');
                }, 700); // duración del shake/pulse
            }, i * 400);
        });
    }
    shakeAndPulseCategories();
    setInterval(shakeAndPulseCategories, 6000);
});
