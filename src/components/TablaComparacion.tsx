import type { ResultadoComparacion } from "./ComparadorCupones";

type Props = {
  resultados: ResultadoComparacion[];
};

export default function TablaComparacion({ resultados }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-sm align-middle">
        <thead className="table-secondary">
          <tr>
            <th>Comprobante</th>
            <th>Cupón</th>
            <th>Fecha</th>
            <th>Importe Físico</th>
            <th>Importe Sistema</th>
            <th>Coincide</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((r, i) => (
            <tr key={i}>
              <td>{r.comprobante}</td>
              <td>{r.cupon}</td>
              <td>{r.fecha}</td>
              <td>{r.importeFisico?.toFixed(2)}</td>
              <td>{r.importeSistema?.toFixed(2) ?? "—"}</td>
              <td className={r.coincide ? "text-success" : "text-danger"}>
                {r.coincide ? "✔" : "✘"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
