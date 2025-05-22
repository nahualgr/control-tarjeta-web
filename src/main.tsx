import React from "react";
import ReactDOM from "react-dom/client";
import { ControlProvider } from "./context/ControlContext";
import ResumenSistema from "./components/ResumenSistema";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ControlProvider>
      <ResumenSistema />
    </ControlProvider>
  </React.StrictMode>
);
