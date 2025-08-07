// Funciones básicas para la página

document.addEventListener('DOMContentLoaded', () => {
    console.log('La página está lista.');
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];

    function mostrarNotificacion(msg) {
        let notif = document.createElement('div');
        notif.className = 'notificacion-carrito';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.classList.add('visible'), 10);
        setTimeout(() => {
            notif.classList.remove('visible');
            setTimeout(() => notif.remove(), 400);
        }, 1800);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.producto');
            const nombre = button.getAttribute('data-product');
            const precioText = productElement.querySelector('.precio').textContent;  // Ej: "Precio: $19.99"
            const precio = parseFloat(precioText.replace(/[^0-9\.]/g, ''));
            // Buscar si el producto ya está en el carrito
            const idx = cart.findIndex(item => item.nombre === nombre);
            if (idx !== -1) {
                cart[idx].cantidad += 1;
            } else {
                cart.push({ nombre, precio, cantidad: 1 });
            }
            localStorage.setItem('carrito', JSON.stringify(cart));

            // Actualizar contador del carrito
            document.querySelector('.cart-count').textContent = cart.length;

            mostrarNotificacion(nombre + ' agregado al carrito.');
            console.log('Carrito:', cart);
        });
    });

    // Lógica del Carrusel
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    let counter = 0;
    const slideWidth = carouselImages[0].clientWidth; // Asume que todas las imágenes tienen el mismo ancho
    let autoSlideInterval;

    // Crear puntos de paginación
    carouselImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            counter = index;
            updateCarousel();
            startAutoSlide();
        });
        carouselDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dots .dot');

    function updateCarousel() {
        carouselSlide.style.transition = 'transform 0.5s ease-in-out';
        carouselSlide.style.transform = 'translateX(' + (-slideWidth * counter) + 'px)';

        dots.forEach((dot, index) => {
            if (index === counter) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Botones de navegación
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        if (counter >= carouselImages.length - 1) {
            counter = 0; // Vuelve al inicio si llega al final
        } else {
            counter++;
        }
        updateCarousel();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        if (counter <= 0) {
            counter = carouselImages.length - 1; // Vuelve al final si llega al inicio
        } else {
            counter--;
        }
        updateCarousel();
        startAutoSlide();
    });

    // Función para el auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (counter >= carouselImages.length - 1) {
                counter = 0;
            } else {
                counter++;
            }
            updateCarousel();
        }, 3000); // Cambia cada 3 segundos
    }

    // Iniciar el auto-slide al cargar la página
    startAutoSlide();

    // Ajustar el tamaño del slide si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        const newSlideWidth = carouselImages[0].clientWidth;
        carouselSlide.style.transform = 'translateX(' + (-newSlideWidth * counter) + 'px)';
    });
});
