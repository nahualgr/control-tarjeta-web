import type { ResultadoComparacion } from "./ComparadorCupones";

type Props = {
  resultados: ResultadoComparacion[];
};

export default function ResumenComparacion({ resultados }: Props) {
  const total = resultados.length;
  const coinciden = resultados.filter((r) => r.coincide).length;
  const noCoinciden = total - coinciden;

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <h5>Resumen de Comparación</h5>
      <p>
        Total de cupones físicos: <strong>{total}</strong>
      </p>
      <p>
        Coinciden con sistema: <strong>{coinciden}</strong>
      </p>
      <p>
        No coinciden o faltantes: <strong>{noCoinciden}</strong>
      </p>
    </div>
  );
}
