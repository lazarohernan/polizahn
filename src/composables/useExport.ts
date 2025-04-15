/**
 * useExport.ts
 * 
 * Composable para manejar la exportación de datos a diferentes formatos.
 * Soporta exportación a CSV y PDF.
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

interface ExportOptions {
  filename?: string
  columns?: string[]
}

interface ExportData {
  [key: string]: string | number | boolean
}

export function useExport() {
  /**
   * Exporta datos a formato CSV
   */
  const exportToCSV = (data: ExportData[], options: ExportOptions = {}) => {
    const filename = options.filename || 'export.csv'
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Exporta datos a formato PDF
   */
  const exportToPDF = (data: ExportData[], options: ExportOptions = {}) => {
    const filename = options.filename || 'export.pdf'
    const doc = new jsPDF({
      orientation: 'landscape'
    })

    // Configurar fuente para soporte de caracteres especiales
    doc.setFont('helvetica')

    // Obtener columnas del primer objeto si no se especifican
    const columns = options.columns || Object.keys(data[0])
    
    // Preparar datos para la tabla
    const rows = data.map(item => columns.map(col => String(item[col])))

    // Agregar la tabla al PDF
    autoTable(doc, {
      head: [columns.map(col => col.charAt(0).toUpperCase() + col.slice(1))],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [140, 191, 207], // Color primario de la aplicación
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },
      margin: { top: 20 }
    })

    // Guardar el PDF
    doc.save(filename)
  }

  return {
    exportToCSV,
    exportToPDF
  }
}
