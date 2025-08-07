document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.add-to-cart');
    if (!btn) return;

    btn.addEventListener('click', function() {
        const nombre = 'Funda para celular';
        const precio = 55.99;
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const idx = carrito.findIndex(item => item.nombre === nombre);
        if (idx !== -1) {
            carrito[idx].cantidad += 1;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarNotificacion('¡Producto agregado al carrito!');
    });

    function mostrarNotificacion(msg) {
        let notif = document.createElement('div');
        notif.textContent = msg;
        notif.style.position = 'fixed';
        notif.style.top = '30px';
        notif.style.right = '30px';
        notif.style.background = 'linear-gradient(90deg, #6A5ACD 60%, #BA55D3 100%)';
        notif.style.color = '#fff';
        notif.style.padding = '16px 28px';
        notif.style.borderRadius = '8px';
        notif.style.fontWeight = 'bold';
        notif.style.fontSize = '1.1rem';
        notif.style.boxShadow = '0 2px 12px rgba(106,90,205,0.18)';
        notif.style.zIndex = 9999;
        notif.style.opacity = 0;
        notif.style.transition = 'opacity 0.3s';
        document.body.appendChild(notif);
        setTimeout(() => { notif.style.opacity = 1; }, 10);
        setTimeout(() => {
            notif.style.opacity = 0;
            setTimeout(() => notif.remove(), 400);
        }, 1800);
    }
});
