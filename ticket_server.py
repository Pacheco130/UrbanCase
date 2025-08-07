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

    # --- Marca de agua (logo mucho más grande y visible) ---
    if os.path.exists(LOGO_PATH):
        logo = ImageReader(LOGO_PATH)
        c.saveState()
        c.translate(width/2, height/2)
        c.rotate(20)
        c.setFillAlpha(0.28)
        # Logo aún más grande y centrado
        c.drawImage(logo, -210, -140, width=420, height=260, mask='auto', preserveAspectRatio=True)
        c.setFillAlpha(1)
        c.restoreState()

    # --- Encabezado con fondo ---
    encabezado_top = height - 30
    encabezado_height = 70
    c.setFillColor(colors.HexColor('#6A5ACD'))
    c.roundRect(20, encabezado_top - encabezado_height, width-40, encabezado_height, 14, fill=1, stroke=0)
    # Número de pedido arriba a la derecha
    c.setFont('Helvetica-Bold', 11)
    c.setFillColor(colors.white)
    c.drawRightString(width-35, encabezado_top-10, f"Pedido #{pedido_id_str}")
    # Título centrado debajo del encabezado
    c.setFont('Helvetica-Bold', 15)
    c.drawCentredString(width/2, encabezado_top-38, 'UrbanCase - Ticket de Compra')

    # Datos del cliente (más espacio)
    datos_top = encabezado_top - encabezado_height - 10
    c.setFont('Helvetica', 10)
    c.setFillColor(colors.black)
    c.drawString(30, datos_top, f'Fecha: {fecha}')
    c.drawString(30, datos_top-14, f'Cliente: {nombre}')
    c.drawString(30, datos_top-28, f'Dirección: {direccion}, {ciudad}')
    c.drawString(30, datos_top-42, f'Teléfono: {telefono}')

    # --- Tabla de productos ---
    y = datos_top-65
    c.setFont('Helvetica-Bold', 11)
    c.setFillColor(colors.HexColor('#BA55D3'))
    c.roundRect(24, y-7, width-48, 22, 7, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.drawString(32, y+6, 'Producto')
    c.drawString(200, y+6, 'Cantidad')
    c.drawString(270, y+6, 'Precio')
    c.setFillColor(colors.black)
    y -= 18
    c.setFont('Helvetica', 9)
    for idx, prod in enumerate(productos):
        # Fondo alternado
        if idx % 2 == 0:
            c.setFillColor(colors.HexColor('#f3eaff'))
            c.roundRect(24, y-3, width-48, 16, 5, fill=1, stroke=0)
        c.setFillColor(colors.black)
        c.drawString(32, y+6, prod.get('nombre', ''))
        c.drawString(200, y+6, str(prod.get('cantidad', 1)))
        c.drawString(270, y+6, f"${prod.get('precio', 0):.2f}")
        y -= 15
    # Línea final
    c.setStrokeColor(colors.HexColor('#BA55D3'))
    c.setLineWidth(1)
    c.line(24, y+12, width-24, y+12)

    # --- Total destacado (más espacio y a la derecha, bien dimensionado y alineado) ---
    y_total = y - 30
    box_width = 180
    box_height = 36
    box_x = width - box_width - 24
    c.setFillColor(colors.HexColor('#6A5ACD'))
    c.roundRect(box_x, y_total, box_width, box_height, 10, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 12)
    c.setFillColor(colors.white)
    # Alinear "Total:" y el monto en la misma línea, separados
    c.drawString(box_x + 18, y_total + 22, 'Total:')
    c.setFont('Helvetica-Bold', 15)
    c.drawRightString(box_x + box_width - 18, y_total + 22, f"${total:.2f} MXN")

    # --- Pie de página con fondo ---
    c.setFillColor(colors.HexColor('#BA55D3'))
    c.roundRect(0, 18, width, 28, 0, fill=1, stroke=0)
    c.setFont('Helvetica-BoldOblique', 10)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, 32, '¡Gracias por tu compra en UrbanCase!')
    c.setFont('Helvetica-Oblique', 8)
    c.drawCentredString(width/2, 22, 'Este ticket es tu comprobante de compra.')

    c.showPage()
    c.save()
    buffer.seek(0)

    response = make_response(send_file(buffer, as_attachment=True, download_name=f'ticket_urbancase_{pedido_id_str}.pdf', mimetype='application/pdf'))
    response.headers['Content-Disposition'] = f'inline; filename=ticket_urbancase_{pedido_id_str}.pdf'
    return response

if __name__ == '__main__':
    app.run(debug=True)
