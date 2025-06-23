import { useState } from "react";
import { useControl } from "../context/ControlContext";

type CuponForm = {
  terminal: string;
  autorizacion: string;
  cupon: string;
  importe: string;
  cuotas: string;
};

export default function FormularioCuponFisico() {
  const { setCuponesFisicos } = useControl();

  const [form, setForm] = useState<CuponForm>({
    terminal: "",
    autorizacion: "",
    cupon: "",
    importe: "",
    cuotas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const importe = parseFloat(form.importe.replace(",", "."));
    if (isNaN(importe) || importe <= 0) {
      alert("El importe debe ser un número válido mayor a cero.");
      return;
    }

    const nuevoCupon = {
      ...form,
      fecha: new Date(),
      comprobanteCompleto: "",
      numeroVendedor: 0,
      presentacion: "Manual",
      tarjeta: "N/A",
      hora: new Date().toLocaleTimeString("es-AR", { hour12: false }),
      vendedor: "Manual",
    };

    setCuponesFisicos((prev) => [...prev, nuevoCupon]);

    setForm({
      terminal: "",
      autorizacion: "",
      cupon: "",
      importe: "",
      cuotas: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded bg-light">
      <h5>Agregar Cupón Manualmente</h5>
      <div className="row g-2 mb-2">
        {(Object.keys(form) as (keyof CuponForm)[]).map((campo) => (
          <div className="col-md-2" key={campo}>
            <input
              type="text"
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              className="form-control"
              required
            />
          </div>
        ))}
        <div className="col-md-auto">
          <button type="submit" className="btn btn-primary">
            Agregar Cupón
          </button>
        </div>
      </div>
    </form>
  );
}
