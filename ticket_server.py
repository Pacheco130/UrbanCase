from flask import Flask, request, send_file, make_response
from flask_cors import CORS
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from io import BytesIO
import datetime
import os

app = Flask(__name__)
CORS(app)

LOGO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'Img', 'Logo2.png'))
PEDIDO_ID_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'pedido_id.txt'))
MEDIA_CARTA = (396, 612)  # 5.5 x 8.5 pulgadas en puntos (vertical)

# Función para obtener y actualizar el número de pedido
def get_next_pedido_id():
    if not os.path.exists(PEDIDO_ID_PATH):
        with open(PEDIDO_ID_PATH, 'w') as f:
            f.write('1')
        return 1
    with open(PEDIDO_ID_PATH, 'r+') as f:
        try:
            last_id = int(f.read().strip())
        except ValueError:
            last_id = 1
        next_id = last_id + 1
        f.seek(0)
        f.write(str(next_id))
        f.truncate()
    return next_id

@app.route('/generar_ticket', methods=['POST'])
def generar_ticket():
    data = request.json
    nombre = data.get('nombre', 'Cliente')
    correo = data.get('correo', '')  # Nuevo campo
    direccion = data.get('direccion', '')
    ciudad = data.get('ciudad', '')
    telefono = data.get('telefono', '')
    productos = data.get('productos', [])  # lista de dicts: {nombre, cantidad, precio}
    total = data.get('total', 0)
    fecha = datetime.datetime.now().strftime('%d/%m/%Y %H:%M')
    pedido_id = get_next_pedido_id()
    pedido_id_str = f"{pedido_id:06d}"

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=MEDIA_CARTA)
    width, height = MEDIA_CARTA

    # --- Marca de agua (logo grande y visible, tono suave) ---
    if os.path.exists(LOGO_PATH):
        logo = ImageReader(LOGO_PATH)
        c.saveState()
        c.translate(width/2, height/2)
        c.rotate(15)
        c.setFillAlpha(0.10)
        c.drawImage(logo, -210, -140, width=420, height=260, mask='auto', preserveAspectRatio=True)
        c.setFillAlpha(1)
        c.restoreState()

    # --- Encabezado elegante con gradiente y sombra ---
    encabezado_top = height - 36
    encabezado_height = 74
    c.saveState()
    c.setFillColor(colors.HexColor('#6A5ACD'))
    c.roundRect(18, encabezado_top - encabezado_height, width-36, encabezado_height, 22, fill=1, stroke=0)    # Se baja el bloque morado 18px más abajo
    c.roundRect(18, encabezado_top - encabezado_height + 18, width-36, 24, 22, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor('#BA55D3'))
    c.setLineWidth(2)
    c.line(18, encabezado_top - encabezado_height, width-18, encabezado_top - encabezado_height)
    c.restoreState()
    c.setFont('Helvetica-Bold', 14)
    c.setFillColor(colors.white)
    c.drawRightString(width-32, encabezado_top-16, f"Pedido #{pedido_id_str}")
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(width/2, encabezado_top-40, 'UrbanCase - Ticket de Compra')

    # --- Datos del cliente alineados y con iconos ---
    datos_top = encabezado_top - encabezado_height - 32  # +10px de espacio extra
    c.setFont('Helvetica', 11)
    c.setFillColor(colors.HexColor('#22223B'))
    c.drawString(36, datos_top, f' Fecha: {fecha}')
    c.drawString(36, datos_top-16, f' Cliente: {nombre}')
    c.drawString(36, datos_top-32, f' Correo: {correo}')
    c.drawString(36, datos_top-48, f' Dirección: {direccion}, {ciudad}')
    c.drawString(36, datos_top-64, f' Teléfono: {telefono}')
    # Línea separadora suave
    c.setStrokeColor(colors.HexColor('#ececff'))
    c.setLineWidth(1)
    c.line(28, datos_top-82, width-28, datos_top-82)  # +8px de espacio extra

    # --- Tabla de productos elegante y bien distribuida ---
    y = datos_top-105  # +18px de espacio extra
    c.setFont('Helvetica-Bold', 12)
    c.setFillColor(colors.HexColor('#BA55D3'))
    c.roundRect(28, y-8, width-56, 26, 12, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(36, y+8, 'Producto')
    c.drawString(180, y+8, 'Cantidad')
    c.drawString(260, y+8, 'Precio')
    c.setFillColor(colors.HexColor('#22223B'))
    y -= 20
    c.setFont('Helvetica', 11)
    for idx, prod in enumerate(productos):
        # Fondo alternado y línea inferior
        if idx % 2 == 0:
            c.setFillColor(colors.HexColor('#ececff'))
        else:
            c.setFillColor(colors.HexColor('#f7f7fa'))
        c.roundRect(28, y-4, width-56, 18, 8, fill=1, stroke=0)
        c.setFillColor(colors.HexColor('#22223B'))
        c.drawString(36, y+6, prod.get('nombre', ''))
        c.drawString(180, y+6, str(prod.get('cantidad', 1)))
        c.drawString(260, y+6, f"${prod.get('precio', 0):.2f}")
        # Línea inferior suave
        c.setStrokeColor(colors.HexColor('#ececff'))
        c.setLineWidth(0.5)
        c.line(32, y-2, width-32, y-2)
        y -= 16

    # --- Total destacado con gradiente y sombra ---
    y_total = y - 44  # +12px de espacio extra
    box_width = 190
    box_height = 40
    box_x = width - box_width - 28
    c.saveState()
    c.setFillColor(colors.HexColor('#6A5ACD'))
    c.roundRect(box_x, y_total, box_width, box_height, 14, fill=1, stroke=0)
    c.setFillColor(colors.HexColor('#8A2BE2'))
    c.roundRect(box_x, y_total, box_width, 18, 14, fill=1, stroke=0)
    c.restoreState()
    c.setFont('Helvetica-Bold', 14)
    c.setFillColor(colors.white)
    c.drawString(box_x + 22, y_total + 26, 'Total:')
    c.setFont('Helvetica-Bold', 18)
    c.drawRightString(box_x + box_width - 22, y_total + 26, f"${total:.2f} MXN")

    # --- Pie de página con gradiente y mensaje claro ---
    c.saveState()
    c.setFillColor(colors.HexColor('#BA55D3'))
    c.roundRect(0, 18, width, 32, 0, fill=1, stroke=0)
    c.setFillColor(colors.HexColor('#6A5ACD'))
    c.roundRect(0, 18, width, 16, 0, fill=1, stroke=0)
    c.restoreState()
    c.setFont('Helvetica-BoldOblique', 11)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, 34, '¡Gracias por tu compra en UrbanCase!')
    c.setFont('Helvetica-Oblique', 8)
    c.drawCentredString(width/2, 24, 'Este ticket es tu comprobante de compra. UrbanCase® 2025')

    c.showPage()
    c.save()
    buffer.seek(0)

    response = make_response(send_file(buffer, as_attachment=True, download_name=f'ticket_urbancase_{pedido_id_str}.pdf', mimetype='application/pdf'))
    response.headers['Content-Disposition'] = f'inline; filename=ticket_urbancase_{pedido_id_str}.pdf'
    return response

if __name__ == '__main__':
    app.run(debug=True)
