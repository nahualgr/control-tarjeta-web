import { useState } from "react";
import ResumenSistema from "./ResumenSistema";
import ComparadorCupones from "./ComparadorCupones";
import FormularioCuponFisico from "./FormularioCuponFisico";

export default function AppPrincipal() {
  const [vista, setVista] = useState<"resumen" | "comparador" | "cargaManual">(
    "resumen"
  );

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button
          className={`btn me-2 ${
            vista === "resumen" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setVista("resumen")}
        >
          Resumen de Sistema
        </button>
        <button
          className={`btn me-2 ${
            vista === "comparador" ? "btn-secondary" : "btn-outline-secondary"
          }`}
          onClick={() => setVista("comparador")}
        >
          Comparador de Cupones
        </button>
        <button
          className={`btn ${
            vista === "cargaManual" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setVista("cargaManual")}
        >
          Cargar Cupón Manualmente
        </button>
      </div>

      {vista === "resumen" && <ResumenSistema />}
      {vista === "comparador" && <ComparadorCupones />}
      {vista === "cargaManual" && <FormularioCuponFisico />}
    </div>
  );
}
