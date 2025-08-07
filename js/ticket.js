function getDatosCompra() {
    const formEntrega = document.getElementById('form-entrega');
    const formData = new FormData(formEntrega);
    const nombre = formData.get('nombre') || '';
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
    return { nombre, direccion, ciudad, telefono, productos, total };
}

function enviarYDescargarTicket(datosCompra) {
    fetch('http://127.0.0.1:5000/generar_ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompra)
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
