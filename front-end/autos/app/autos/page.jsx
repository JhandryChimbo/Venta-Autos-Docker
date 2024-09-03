import Menu from "@/componentes/menu";
import ObtenerAutos from "@/componentes/obtenerAutos";
import Link from "next/link";


export default async function Ninos() {

    return (
        <div className="row">
            <Menu></Menu>
            <div className="container-fluid" style={{ margin: "1%" }}>
                <ObtenerAutos></ObtenerAutos>
                
            </div>
        </div>
    )
}