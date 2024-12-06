# -*- coding: utf-8 -*-
"""
Programa que convierte coordenadas de un archivo XML de circuitos a un archivo KML

@version 2.0 22/Octubre/2024
@author: Modificado para incluir la primera coordenada desde <CoordenadasLineaSalida>.
"""

import xml.etree.ElementTree as ET

def obtenerCoordenadas(archivoXML, expresionXPath, namespaces):
    """Función obtenerCoordenadas(archivoXML, expresionXPath, namespaces)
    Retorna una lista con las coordenadas de los tramos de un archivo XML.
    """
    coordenadas = []

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print(f"No se encuentra el archivo: {archivoXML}")
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo XML: {archivoXML}")
        exit()

    raiz = arbol.getroot()

    # Obtener la primera coordenada desde <CoordenadasLineaSalida>
    linea_salida = raiz.find('.//ns:CoordenadasLineaSalida', namespaces)
    if linea_salida is not None:
        latitud = linea_salida.find('ns:Latitud', namespaces)
        longitud = linea_salida.find('ns:Longitud', namespaces)
        altitud = linea_salida.find('ns:Altitud', namespaces)

        if latitud is not None and longitud is not None and altitud is not None:
            coordenadas.append(f"{longitud.text},{latitud.text},{altitud.text}")

    # Recorrer los elementos del árbol para obtener las demás coordenadas
    for tramo in raiz.findall(expresionXPath, namespaces):
        latitud = tramo.find('ns:CoordenadasFinales/ns:Latitud', namespaces)
        longitud = tramo.find('ns:CoordenadasFinales/ns:Longitud', namespaces)
        altitud = tramo.find('ns:CoordenadasFinales/ns:Altitud', namespaces)

        if latitud is not None and longitud is not None and altitud is not None:
            coordenadas.append(f"{longitud.text},{latitud.text},{altitud.text}")

    return coordenadas

def crearArchivoKML(coordenadas, archivoKML):
    """Función que crea un archivo KML a partir de una lista de coordenadas."""
    if not coordenadas:
        print("No hay coordenadas para generar el archivo KML.")
        return

    kmlContent = f'''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Circuito</name>
    <Style id="lineaRojaGruesa">
      <LineStyle>
        <color>ff0000ff</color> <!-- Color rojo (AABBGGRR) -->
        <width>5</width> <!-- Grosor de la línea -->
      </LineStyle>
    </Style>
    <Placemark>
      <name>Tramo del circuito</name>
      <styleUrl>#lineaRojaGruesa</styleUrl>
      <LineString>
        <tessellate>1</tessellate> <!-- Permite ajustar la línea al terreno -->
        <coordinates>
          {' '.join(coordenadas)}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>'''

    # Escribir el contenido en el archivo KML
    with open(archivoKML, 'w', encoding='utf-8') as file:
        file.write(kmlContent)

    print(f"Archivo KML generado con éxito: {archivoKML}")

def main():
    """Función principal que genera un archivo KML con las coordenadas de un circuito."""
    
    print("Generando archivo KML a partir de las coordenadas del XML...")

    miArchivoXML = 'xml/circuitoEsquema.xml'
    miExpresionXPath = './/ns:Tramo'  # Expresión XPath con prefijo 'ns'
    namespaces = {'ns': 'http://www.uniovi.es'}  # Asignación manual del prefijo

    # Obtener las coordenadas de los tramos
    coordenadas = obtenerCoordenadas(miArchivoXML, miExpresionXPath, namespaces)
    
    # Crear el archivo KML
    miArchivoKML = 'circuito.kml'
    crearArchivoKML(coordenadas, miArchivoKML)

if __name__ == "__main__":
    main()
