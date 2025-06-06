import { useControl } from "../context/ControlContext";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { OperacionSistema } from "../context/ControlContext";

export default function ResumenSistema() {
  const { setOperacionesSistema } = useControl();
  const [tabla, setTabla] = useState<OperacionSistema[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Error: No se seleccionó ningún archivo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      if (!text) {
        console.error("El archivo está vacío o no se pudo leer.");
        alert("Error: El archivo no contiene datos válidos.");
        return;
      }

      const lineas = text.split("\n").filter((line) => line.trim() !== "");
      console.log("Archivo cargado correctamente:", lineas);

      const resultados: OperacionSistema[] = [];

      for (const linea of lineas) {
        let tipoOperacion = "Normal";
        if (linea.startsWith("An ")) tipoOperacion = "Anulado";
        if (linea.startsWith("Di ")) tipoOperacion = "Dividido";

        const datos = linea.match(
          /(\d+)\s+([A-Z]+)\s+(\d+)\s+(\S+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([\d.,]+)\s+([\d]*)\s+([\d]*)\s+([A-Z]+)\s+(\d+)\s+(\d+)\s+(\d+)/
        );
        if (!datos) {
          console.error("Línea inválida:", linea);
          continue;
        }

        const presentacion = datos[4] === "******" ? "Sin número" : datos[4];

        const obj: OperacionSistema = {
          tipoOperacion,
          terminal: datos[1],
          tarjeta: datos[2],
          cuotas: datos[3],
          presentacion,
          fecha: datos[5].split("/").reverse().join("-"),
          hora: datos[6],
          importe: parseFloat(datos[7].replace(",", ".")),
          autorizacion: datos[8],
          cupon: datos[9],
          tipoComprobante: datos[10],
          emisor: datos[11],
          nroComprobante: datos[12],
          comprobanteCompleto: `${datos[10]}-${datos[11]}-${datos[12]}`,
          vendedor: datos[13],
        };

        resultados.push(obj);
      }

      setTabla(resultados);
      setOperacionesSistema(resultados);
    };

    reader.readAsText(file);
  };

  const exportarExcel = () => {
    if (tabla.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    // Hoja 1: Resumen
    const worksheet = workbook.addWorksheet("Resumen");
    worksheet.columns = [
      { header: "Tipo de Operación", key: "tipoOperacion", width: 20 },
      { header: "Terminal", key: "terminal", width: 15 },
      { header: "Tarjeta", key: "tarjeta", width: 20 },
      { header: "Cuotas", key: "cuotas", width: 10 },
      { header: "Presentación", key: "presentacion", width: 15 },
      { header: "Fecha", key: "fecha", width: 12 },
      { header: "Hora", key: "hora", width: 10 },
      {
        header: "Importe",
        key: "importe",
        width: 12,
        style: { numFmt: "#,##0.00" },
      },
      { header: "Autorización", key: "autorizacion", width: 15 },
      { header: "Cupón", key: "cupon", width: 15 },
      { header: "Comprobante", key: "comprobanteCompleto", width: 20 },
      { header: "Número de Vendedor", key: "vendedor", width: 15 },
    ];

    tabla.forEach((op) => worksheet.addRow(op));

    // Hoja 2: Resumen Agrupado
    const hojaResumen = workbook.addWorksheet("Resumen Agrupado");
    const agrupadas = new Map<
      string,
      { importeTotal: number; cantidad: number }
    >();

    tabla
      .filter((op) => op.tipoOperacion !== "Anulado")
      .forEach((op) => {
        const clave = `${op.terminal}-${op.tarjeta}-${op.autorizacion}`;
        if (agrupadas.has(clave)) {
          const item = agrupadas.get(clave)!;
          item.importeTotal += op.importe;
          item.cantidad += 1;
        } else {
          agrupadas.set(clave, { importeTotal: op.importe, cantidad: 1 });
        }
      });

    hojaResumen.columns = [
      { header: "Terminal", key: "terminal", width: 15 },
      { header: "Tarjeta", key: "tarjeta", width: 20 },
      { header: "Autorización", key: "autorizacion", width: 15 },
      {
        header: "Importe Total",
        key: "importeTotal",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Cantidad de Operaciones",
        key: "cantidadOperaciones",
        width: 20,
      },
    ];

    Array.from(agrupadas.entries()).forEach(([clave, data]) => {
      const [terminal, tarjeta, autorizacion] = clave.split("-");
      hojaResumen.addRow({
        terminal,
        tarjeta,
        autorizacion,
        importeTotal: data.importeTotal,
        cantidadOperaciones: data.cantidad,
      });
    });

    // Hoja 3: Resumen por Cupón
    const hojaPorCupon = workbook.addWorksheet("Resumen por Cupón");
    const agrupadasPorCupon = new Map<
      string,
      { importeTotal: number; cantidad: number }
    >();

    tabla
      .filter((op) => op.tipoOperacion !== "Anulado")
      .forEach((op) => {
        const clave = `${op.terminal}-${op.tarjeta}-${op.cupon}`;
        if (agrupadasPorCupon.has(clave)) {
          const item = agrupadasPorCupon.get(clave)!;
          item.importeTotal += op.importe;
          item.cantidad += 1;
        } else {
          agrupadasPorCupon.set(clave, {
            importeTotal: op.importe,
            cantidad: 1,
          });
        }
      });

    hojaPorCupon.columns = [
      { header: "Terminal", key: "terminal", width: 15 },
      { header: "Tarjeta", key: "tarjeta", width: 20 },
      { header: "Cupón", key: "cupon", width: 15 },
      {
        header: "Importe Total",
        key: "importeTotal",
        width: 15,
        style: { numFmt: "#,##0.00" },
      },
      {
        header: "Cantidad de Operaciones",
        key: "cantidadOperaciones",
        width: 20,
      },
    ];

    Array.from(agrupadasPorCupon.entries()).forEach(([clave, data]) => {
      const [terminal, tarjeta, cupon] = clave.split("-");
      hojaPorCupon.addRow({
        terminal,
        tarjeta,
        cupon,
        importeTotal: data.importeTotal,
        cantidadOperaciones: data.cantidad,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        "resumen_sistema.xlsx"
      );
    });
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={exportarExcel}>Exportar a Excel</button>
    </div>
  );
}
