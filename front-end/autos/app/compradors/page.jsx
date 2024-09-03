import Menu from "@/componentes/menu";
import ObtenerCompradors from "@/componentes/obtenerComprador";
import Link from "next/link";

export default async function Ninos() {
  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerCompradors></ObtenerCompradors>
      </div>
    </div>
  );
}