import { useMemo, useState } from "react";
import { useControl } from "../context/ControlContext";
// Make sure the file exists at the specified path, or update the path if necessary
import ResumenComparacion from "./ResumenComparacion";
// Make sure TablaComparacion.tsx exists in the same folder, or update the path if necessary
import TablaComparacion from "./TablaComparacion";

export type ResultadoComparacion = {
  cupon: string;
  comprobante: string;
  coincide: boolean;
  importeFisico?: number;
  importeSistema?: number;
  fecha?: string;
};

export default function ComparadorCupones() {
  const { cuponesFisicos, operacionesSistema } = useControl();
  const [filtro, setFiltro] = useState<"todos" | "coinciden" | "noCoinciden">(
    "todos"
  );

  const opImporte = (importe: number) => Number(importe.toFixed(2));

  const resultados = useMemo(() => {
    return cuponesFisicos.map((fisico) => {
      const match = operacionesSistema.find(
        (op) =>
          op.terminal === fisico.terminal &&
          op.autorizacion === fisico.autorizacion &&
          op.cupon === fisico.cupon
      );

      return {
        cupon: fisico.cupon,
        comprobante: `${fisico.terminal}-${fisico.cupon}`,
        coincide:
          !!match &&
          Math.abs(opImporte(match.importe) - parseFloat(fisico.importe)) <
            0.01,
        importeFisico: parseFloat(fisico.importe),
        importeSistema: match?.importe ?? undefined,
        fecha: fisico.fecha?.toISOString().split("T")[0],
      };
    });
  }, [cuponesFisicos, operacionesSistema]);

  const resultadosFiltrados = useMemo(() => {
    if (filtro === "coinciden") return resultados.filter((r) => r.coincide);
    if (filtro === "noCoinciden") return resultados.filter((r) => !r.coincide);
    return resultados;
  }, [filtro, resultados]);

  return (
    <div>
      <ResumenComparacion resultados={resultados} />

      <div className="mb-3">
        <label htmlFor="filtro" className="form-label">
          Filtrar resultados:
        </label>
        <select
          id="filtro"
          className="form-select w-auto d-inline-block ms-2"
          value={filtro}
          onChange={(e) =>
            setFiltro(e.target.value as "todos" | "coinciden" | "noCoinciden")
          }
        >
          <option value="todos">Todos</option>
          <option value="coinciden">Solo coinciden</option>
          <option value="noCoinciden">Solo no coinciden</option>
        </select>
      </div>

      <TablaComparacion resultados={resultadosFiltrados} />
    </div>
  );
}
