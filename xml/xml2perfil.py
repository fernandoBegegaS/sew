
"""
Programa que convierte las coordenadas de un archivo XML de circuitos
en un archivo SVG que representa la altimetría del circuito.

@version 1.0 10/Diciembre/2024
"""

import xml.etree.ElementTree as ET

def obtenerAltimetria(archivoXML, expresionXPath, namespaces):
    altimetria = []
    distancia_acumulada = 0

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print(f"No se encuentra el archivo: {archivoXML}")
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo XML: {archivoXML}")
        exit()

    raiz = arbol.getroot()

   
    for tramo in raiz.findall(expresionXPath, namespaces):
        distancia = tramo.find('ns:Distancia', namespaces)
        altitud = tramo.find('ns:CoordenadasFinales/ns:Altitud', namespaces)

        if distancia is not None and altitud is not None:
            distancia_acumulada += float(distancia.text)
            altimetria.append((distancia_acumulada, float(altitud.text)))

    return altimetria

def crearArchivoSVG(altimetria, archivoSVG):
    """Crea un archivo SVG que representa la altimetría del circuito."""
    if not altimetria:
        print("No hay datos de altimetría para generar el archivo SVG.")
        return

    ancho = 800  
    alto = 200   
    margen = 20 
    max_distancia = max(p[0] for p in altimetria)
    max_altitud = max(p[1] for p in altimetria)
    min_altitud = min(p[1] for p in altimetria)

    escala_x = (ancho - 2 * margen) / max_distancia
    escala_y = (alto - 2 * margen) / (max_altitud - min_altitud)

    puntos_svg = [
        (margen + distancia * escala_x, 
         alto - margen - (altitud - min_altitud) * escala_y)
        for distancia, altitud in altimetria
    ]

    
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ancho} {alto}" width="{ancho}" height="{alto}">
  <rect width="100%" height="100%" fill="white" />
  <polyline points="{' '.join(f'{x},{y}' for x, y in puntos_svg)}" 
            fill="none" stroke="blue" stroke-width="2" />
  <text x="{margen}" y="{margen}" font-size="10" fill="black">
    Altimetría del circuito
  </text>
</svg>'''

    
    with open(archivoSVG, 'w', encoding='utf-8') as file:
        file.write(svg_content)

    print(f"Archivo SVG generado con éxito: {archivoSVG}")

def main():
    """Función principal que genera un archivo SVG con la altimetría del circuito."""

    print("Generando archivo SVG de altimetría a partir de las coordenadas del XML...")

    miArchivoXML = 'circuitoEsquema.xml'
    miExpresionXPath = './/ns:Tramo'  
    namespaces = {'ns': 'http://www.uniovi.es'} 
    altimetria = obtenerAltimetria(miArchivoXML, miExpresionXPath, namespaces)

    
    miArchivoSVG = 'altimetria.svg'
    crearArchivoSVG(altimetria, miArchivoSVG)

if __name__ == "__main__":
    main()
