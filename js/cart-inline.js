document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-continuar').onclick = function() {
        document.getElementById('checkout-form-container').style.display = 'block';
        this.style.display = 'none';
    };
});
document.getElementById('btn-confirmar').onclick = function(e) {
    e.preventDefault();
    const formEntrega = document.getElementById('form-entrega');
    const formBanco = document.getElementById('form-banco');
    let valid = true;
    if (!formEntrega.reportValidity()) valid = false;
    if (!formBanco.reportValidity()) valid = false;
    if (valid) {
        lanzarConfeti();
        mostrarMensajeConfirmacion();
    }
};
// Animación de confeti
function lanzarConfeti() {
    const colors = ['#6A5ACD', '#BA55D3', '#FFD700', '#FF69B4', '#00FA9A', '#FF6347'];
    const confetiContainer = document.createElement('div');
    confetiContainer.style.position = 'fixed';
    confetiContainer.style.left = 0;
    confetiContainer.style.top = 0;
    confetiContainer.style.width = '100vw';
    confetiContainer.style.height = '100vh';
    confetiContainer.style.pointerEvents = 'none';
    confetiContainer.style.zIndex = 9999;
    for (let i = 0; i < 60; i++) {
        const confeti = document.createElement('div');
        confeti.style.position = 'absolute';
        confeti.style.width = '12px';
        confeti.style.height = '18px';
        confeti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confeti.style.left = Math.random() * 100 + 'vw';
        confeti.style.top = '-30px';
        confeti.style.opacity = 0.85;
        confeti.style.transform = `rotate(${Math.random()*360}deg)`;
        confeti.style.borderRadius = '3px';
        confeti.style.transition = 'top 1.2s cubic-bezier(.4,1.4,.6,1), left 1.2s linear, transform 1.2s linear';
        confetiContainer.appendChild(confeti);
        setTimeout(() => {
            confeti.style.top = 60 + Math.random()*30 + 'vh';
            confeti.style.left = (parseFloat(confeti.style.left) + (Math.random()-0.5)*200) + 'px';
            confeti.style.transform = `rotate(${Math.random()*720}deg)`;
        }, 10);
    }
    document.body.appendChild(confetiContainer);
    setTimeout(() => {
        confetiContainer.remove();
    }, 1400);
}
// Mensaje de confirmación estilizado
function mostrarMensajeConfirmacion() {
    let msg = document.getElementById('mensaje-confirmacion');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'mensaje-confirmacion';
        msg.innerHTML = `
            <span style="display:flex;flex-direction:column;align-items:center;gap:18px;">
              <div class="dino-animalito">
                <div class="dino-cuerpo">
                  <div class="dino-cola"></div>
                  <div class="dino-panza"></div>
                  <div class="dino-pierna dino-pierna-izq"></div>
                  <div class="dino-pierna dino-pierna-der"></div>
                  <div class="dino-brazo dino-brazo-izq"></div>
                  <div class="dino-brazo dino-brazo-der"></div>
                  <div class="dino-cabeza">
                    <div class="dino-ojo"></div>
                    <div class="dino-mejilla"></div>
                    <div class="dino-boca"></div>
                    <div class="dino-cresta"></div>
                  </div>
                </div>
              </div>
              ¡Pedido confirmado! Nos pondremos en contacto para la entrega.
            </span>`;
        document.body.appendChild(msg);
    }
    msg.style.display = 'flex';
    setTimeout(() => {
        msg.classList.add('visible');
    }, 10);
    setTimeout(() => {
        msg.classList.remove('visible');
        setTimeout(() => { msg.style.display = 'none'; }, 400);
    }, 2600);
}
