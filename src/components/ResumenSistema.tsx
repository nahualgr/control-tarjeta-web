import { useControl } from "../context/ControlContext";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ResumenSistema() {
  const { operacionesSistema } = useControl();
  const [tabla, setTabla] = useState<OperacionSistema[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lineas = text.split("\n");
      const resultados: OperacionSistema[] = [];

      for (const linea of lineas) {
        const [
          terminal,
          tarjeta,
          cuotas,
          presentacion,
          fechaStr,
          hora,
          importeStr,
          autorizacion,
          cupon,
          tipo,
          emisor,
          nro,
          numeroVendedor,
        ] = linea.split(/\s+/);

        const fecha = new Date(fechaStr.split("/").reverse().join("-"));
        const importe =
          parseFloat(importeStr.replace(".", "").replace(",", ".")) / 100;

        const obj: OperacionSistema = {
          terminal,
          tarjeta,
          cuotas,
          presentacion,
          fecha: fecha.toISOString(),
          hora,
          importe,
          cupon,
          autorizacion,
          tipoComprobante: tipo,
          emisor,
          nroComprobante: nro,
          comprobanteCompleto: `${tipo}-${emisor}-${nro}`,
          vendedor: numeroVendedor,
        };

        resultados.push(obj);
      }

      setTabla(resultados);
    };

    reader.readAsText(file);
  };

  const exportarExcel = () => {
    if (tabla.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Resumen");

    // Definir las columnas con ancho personalizado
    worksheet.columns = [
      { header: "Terminal", key: "terminal", width: 15 },
      { header: "Tarjeta", key: "tarjeta", width: 20 },
      { header: "Cuotas", key: "cuotas", width: 10 },
      { header: "Presentación", key: "presentacion", width: 15 },
      { header: "Fecha", key: "fecha", width: 12 },
      { header: "Hora", key: "hora", width: 10 },
      { header: "Importe", key: "importe", width: 12 },
      { header: "Autorización", key: "autorizacion", width: 15 },
      { header: "Cupón", key: "cupon", width: 15 },
      { header: "Comprobante", key: "comprobanteCompleto", width: 20 },
      { header: "Número de Vendedor", key: "vendedor", width: 15 },
    ];

    // Agregar filas de datos a la hoja de cálculo
    tabla.forEach((op) => {
      worksheet.addRow(op);
    });

    // Estilizar la cabecera
    worksheet.getRow(1).font = { bold: true };

    // Generar y descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "resumen_sistema.xlsx");
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="h5 mb-3">Cargar archivo del sistema (.txt)</h2>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="form-control mb-3"
      />

      {tabla.length > 0 && (
        <button onClick={exportarExcel} className="btn btn-success mb-3">
          📥 Exportar a Excel
        </button>
      )}
    </div>
  );
}
