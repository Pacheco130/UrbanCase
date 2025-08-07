// Datos de productos de ejemplo (puedes expandir este objeto)
const productos = [
  // Fundas
  {
    id: 'funda-transparente',
    nombre: 'Funda para celular',
    precio: 55.99,
    descripcion: 'Funda transparente de silicona flexible, protege tu celular de golpes y rayones sin perder el diseño original de tu equipo. Compatible con la mayoría de modelos.',
    imagen: '../Img/MT203.jpeg',
    categoria: 'fundas',
    categoriaNombre: 'Fundas'
  },
  {
    id: 'funda-colores',
    nombre: 'Funda de Colores',
    precio: 59.99,
    descripcion: 'Funda de silicona disponible en varios colores.',
    imagen: '../Img/colores.avif',
    categoria: 'fundas',
    categoriaNombre: 'Fundas'
  },
  {
    id: 'funda-dura',
    nombre: 'Funda Dura',
    precio: 69.99,
    descripcion: 'Protección extra para tu celular con diseño elegante.',
    imagen: '../Img/rudo.jpg',
    categoria: 'fundas',
    categoriaNombre: 'Fundas'
  },
  // Audio
  {
    id: 'auriculares-bluetooth',
    nombre: 'Auriculares Bluetooth',
    precio: 89.99,
    descripcion: 'Conecta inalámbricamente y disfruta tu música.',
    imagen: '../Img/Audifonos.webp',
    categoria: 'audio',
    categoriaNombre: 'Audio'
  },
  {
    id: 'auriculares-cable',
    nombre: 'Auriculares con Cable',
    precio: 29.99,
    descripcion: 'Sonido de alta calidad y conexión universal.',
    imagen: '../Img/conclable.webp',
    categoria: 'audio',
    categoriaNombre: 'Audio'
  },
  {
    id: 'bocina-bluetooth',
    nombre: 'Bocina Bluetooth',
    precio: 99.99,
    descripcion: 'Lleva tu música a todas partes con esta bocina port��til.',
    imagen: '../Img/bocina.jpeg',
    categoria: 'audio',
    categoriaNombre: 'Audio'
  },
  // Cargadores
  {
    id: 'cargador-inalambrico',
    nombre: 'Cargador Inalámbrico',
    precio: 19.99,
    descripcion: 'Disfruta de carga rápida y sin cables.',
    imagen: '../Img/CargadoIna.webp',
    categoria: 'cargadores',
    categoriaNombre: 'Cargadores'
  },
  {
    id: 'cargador-usbc',
    nombre: 'Cargador USB-C',
    precio: 44.99,
    descripcion: 'Carga rápida para tus dispositivos USB-C.',
    imagen: '../Img/Cargador.webp',
    categoria: 'cargadores',
    categoriaNombre: 'Cargadores'
  },
  {
    id: 'cargador-auto',
    nombre: 'Cargador para Auto',
    precio: 34.99,
    descripcion: 'Carga tus dispositivos mientras conduces.',
    imagen: '../Img/soprtecarro.jpg',
    categoria: 'cargadores',
    categoriaNombre: 'Cargadores'
  },
  // Soportes
  {
    id: 'soporte-celular',
    nombre: 'Soporte para celular',
    precio: 39.99,
    descripcion: 'Ideal para ver vídeos sin tenerlo en mano.',
    imagen: '../Img/SoporteP.webp',
    categoria: 'soportes',
    categoriaNombre: 'Soportes'
  },
  {
    id: 'soporte-auto',
    nombre: 'Soporte para Auto',
    precio: 49.99,
    descripcion: 'Fija tu celular de forma segura en el coche.',
    imagen: '../Img/soprtecarro.jpg',
    categoria: 'soportes',
    categoriaNombre: 'Soportes'
  },
  {
    id: 'soporte-mesa',
    nombre: 'Soporte de Mesa',
    precio: 29.99,
    descripcion: 'Perfecto para videollamadas y trabajo en escritorio.',
    imagen: '../Img/mesa.webp',
    categoria: 'soportes',
    categoriaNombre: 'Soportes'
  }
];

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', function() {
  const id = getQueryParam('id');
  const producto = productos.find(p => p.id === id);
  const detalle = document.getElementById('producto-detalle');
  const volverBtn = document.getElementById('volver-categoria');

  if (!producto) {
    detalle.innerHTML = '<p style="padding:2rem;">Producto no encontrado.</p>';
    volverBtn.href = '../index.html';
    return;
  }

  volverBtn.href = producto.categoria + '.html';
  volverBtn.textContent = '← Volver a ' + producto.categoriaNombre;

  detalle.innerHTML = `
    <div class="producto-detalle-img">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="producto-detalle-info">
      <h1>${producto.nombre}</h1>
      <p class="precio">Precio: $${producto.precio.toFixed(2)} MXN</p>
      <p>${producto.descripcion}</p>
      <button class="add-to-cart" id="btn-add-cart">Añadir al carrito</button>
    </div>
  `;

  document.getElementById('btn-add-cart').addEventListener('click', function() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const idx = carrito.findIndex(item => item.nombre === producto.nombre);
    if (idx !== -1) {
      carrito[idx].cantidad += 1;
    } else {
      carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
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
