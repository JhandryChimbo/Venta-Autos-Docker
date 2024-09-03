import Menu from "@/componentes/menu";
import ObtenerVentas from "@/componentes/obtenerVentas";
import Link from "next/link";

export default async function Ninos() {
  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerVentas></ObtenerVentas>
      </div>
    </div>
  );
}
