// Aviso de cookies/localStorage para cumplimiento básico
(function() {
  if (localStorage.getItem('cookies_aceptadas')) return;
  var aviso = document.createElement('div');
  aviso.id = 'aviso-cookies';
  aviso.innerHTML = `
    <div class="aviso-cookies-contenido">
      Este sitio utiliza cookies y almacenamiento local para mejorar tu experiencia. <button id="btn-aceptar-cookies">Aceptar</button>
    </div>
  `;
  document.body.appendChild(aviso);
  document.getElementById('btn-aceptar-cookies').onclick = function() {
    localStorage.setItem('cookies_aceptadas', '1');
    aviso.remove();
  };
})();

// Estilos del aviso
var style = document.createElement('style');
style.textContent = `
#aviso-cookies {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: rgba(60,40,90,0.98);
  color: #fff;
  z-index: 99999;
  padding: 0;
  display: flex;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 -2px 12px #6A5ACD33;
}
.aviso-cookies-contenido {
  display: flex;
  align-items: center;
  gap: 1.2em;
  padding: 1em 1.5em;
}
#btn-aceptar-cookies {
  background: linear-gradient(90deg, #6A5ACD 60%, #BA55D3 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5em 1.2em;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
#btn-aceptar-cookies:hover {
  background: linear-gradient(90deg, #483D8B 60%, #8A2BE2 100%);
}
`;
document.head.appendChild(style);
