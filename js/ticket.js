function getDatosCompra() {
    const formEntrega = document.getElementById('form-entrega');
    const formData = new FormData(formEntrega);
    const nombre = formData.get('nombre') || '';
    const correo = formData.get('correo') || ''; // Obteniendo el correo
    const direccion = formData.get('direccion') || '';
    const ciudad = formData.get('ciudad') || '';
    const telefono = formData.get('telefono') || '';
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;
    const productos = carrito.map(item => {
        total += item.precio * item.cantidad;
        return {
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        };
    });
    return { nombre, correo, direccion, ciudad, telefono, productos, total }; // Incluyendo correo en los datos de compra
}

function enviarYDescargarTicket(datosCompra) {
    const form = document.getElementById('form-entrega');
    const nombre = form.elements['nombre'].value;
    const correo = form.elements['correo'].value; // <-- toma el correo digitado
    const direccion = form.elements['direccion'].value;
    const ciudad = form.elements['ciudad'].value;
    const telefono = form.elements['telefono'].value;

    const pedido = {
        nombre,
        correo,
        direccion,
        ciudad,
        telefono,
        productos: datosCompra.productos,
        total: datosCompra.total
    };

    fetch('http://127.0.0.1:5000/generar_ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmar = document.getElementById('btn-confirmar');
    if (!btnConfirmar) return;
    btnConfirmar.addEventListener('click', function(e) {
        e.preventDefault();
        const formEntrega = document.getElementById('form-entrega');
        const formBanco = document.getElementById('form-banco');
        let valid = true;
        if (!formEntrega.reportValidity()) valid = false;
        if (!formBanco.reportValidity()) valid = false;
        if (valid) {
            if (typeof lanzarConfeti === 'function') lanzarConfeti();
            if (typeof mostrarMensajeConfirmacion === 'function') mostrarMensajeConfirmacion();
            const datosCompra = getDatosCompra();
            enviarYDescargarTicket(datosCompra);
        }
    });
});
