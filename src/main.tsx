import React from "react";
import ReactDOM from "react-dom/client";
import { ControlProvider } from "./context/ControlContext";
import AppPrincipal from "./components/AppPrincipal"; // nuevo contenedor
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ControlProvider>
      <AppPrincipal />
    </ControlProvider>
  </React.StrictMode>
);
