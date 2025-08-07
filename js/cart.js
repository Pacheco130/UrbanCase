document.addEventListener('DOMContentLoaded', function() {
    const itemsList = document.getElementById('items-list');
    const totalSpan = document.getElementById('cart-total-amount');

    // Leer carrito de localStorage
    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Guardar carrito en localStorage
    function guardarCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Renderizar los productos en el carrito
    function renderizarCarrito() {
        const carrito = obtenerCarrito();
        itemsList.innerHTML = '';
        carrito.forEach((item, idx) => {
            const li = document.createElement('li');
            li.setAttribute('data-precio', item.precio);
            li.setAttribute('data-idx', idx);
            li.innerHTML = `
                ${item.nombre} x${item.cantidad} — <span style="color:#6A5ACD;font-weight:bold;">${item.precio.toFixed(2)} MXN</span>
                <button class="remove-btn">Eliminar</button>
            `;
            itemsList.appendChild(li);
        });
        actualizarTotal();
    }

    // Actualizar el total
    function actualizarTotal() {
        const carrito = obtenerCarrito();
        let total = 0;
        carrito.forEach(item => {
            total += item.precio * item.cantidad;
        });
        totalSpan.textContent = `$${total.toFixed(2)} MXN`;
    }

    // Eliminar producto del carrito
    itemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const li = e.target.closest('li');
            const idx = parseInt(li.getAttribute('data-idx'));
            let carrito = obtenerCarrito();
            carrito.splice(idx, 1); // Elimina el producto del array
            guardarCarrito(carrito);
            renderizarCarrito();
        }
    });

    // Renderiza el carrito al cargar la página
    renderizarCarrito();
});