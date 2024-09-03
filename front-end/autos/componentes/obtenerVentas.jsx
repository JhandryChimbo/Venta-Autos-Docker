"use client";

import { useEffect, useState } from "react";
import { obtenerVentas } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";
import { Carousel } from "react-bootstrap";

const ObtenerVentas = () => {
  const [respuesta, setRespuesta] = useState([]);
  const [mesBuscado, setMesBuscado] = useState("");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerVentas("venta", token);
      setRespuesta(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!respuesta || respuesta.length === 0) {
    return <p>No hay ventas disponibles.</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filtrarPorMes = () => {
    if (mesBuscado.trim() === "") {
      return respuesta;
    }

    const mesIndex = meses.findIndex(
      (mes) => mes.toLowerCase() === mesBuscado.toLowerCase()
    );
    if (mesIndex === -1) {
      return [];
    }

    return respuesta.filter((venta) => {
      const mesVenta = new Date(venta.fecha).getMonth();
      return mesVenta === mesIndex;
    });
  };

  const ventasFiltradas = filtrarPorMes();

  return (
    <div>
      <h2>Ventas Disponibles</h2>
      <p>Lista de ventas registradas en el sistema.</p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {(rol === "gerente" || rol === "vendedor") && (
          <div
            style={{
              position: "relative",
            }}
          >
            <Link href={"/ventas/registrarVenta"} className="btn btn-warning">
              Registrar Venta
            </Link>
          </div>
        )}

        <div
          style={{
            position: "relative",
            marginRight: "50px",
          }}
        >
          <label>
            Buscar por mes:
            <select
              style={{
                marginLeft: "10px",
              }}
              value={mesBuscado}
              onChange={(e) => setMesBuscado(e.target.value)}
            >
              <option value="">Todos los meses</option>
              {meses.map((mes, index) => (
                <option key={index} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <ul className="list-group">
            {ventasFiltradas.map((venta, index) => (
              <li key={index} className="list-group-item">
                <div className="content">
                  <div className="venta-info">
                    <h4>
                      {venta.auto.marca} - {venta.auto.modelo}
                    </h4>
                    <p>
                      <strong>Comprador:</strong> {venta.comprador.nombres}{" "}
                      {venta.comprador.apellidos}
                    </p>
                    <p>
                      <strong>Vendedor:</strong> {venta.personal.nombres}{" "}
                      {venta.personal.apellidos}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formatDate(venta.fecha)}
                    </p>
                    <p>
                      {venta.recargo ? (
                        <span className="activo">Recargo</span>
                      ) : (
                        <span className="desactivo">Sin Recargo</span>
                      )}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${venta.precioTotal}
                    </p>
                    <p>
                      <strong>Color:</strong> {venta.auto.color}
                    </p>

                    {(rol === "gerente" || rol === "vendedor") && (
                      <div className="button-container">
                        <Link
                          href={"ventas/actualizarVenta/" + venta.id}
                          className="btn btn-primary btn-sm"
                        >
                          Modificar
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <ul className="list-group">
            {ventasFiltradas.map((venta, index) => (
              <div key={index} className="list-group-item">
                <div className="venta-carousel">
                  <Carousel interval={2000} className="custom-carousel">
                    {venta.auto.archivo
                      .split(",")
                      .map((nombreArchivo, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100 custom-carousel-image"
                            src={`http://localhost:3000/images/${nombreArchivo}`}
                            alt={nombreArchivo}
                          />
                        </Carousel.Item>
                      ))}
                  </Carousel>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        h2 {
          color: #333;
        }

        p {
          color: #555;
          margin-bottom: 15px;
        }

        .list-group {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
        }

        .list-group-item {
          flex: 0 0 calc(48% - 20px);
          margin: 1%;
          list-style: none;
          border: 1px solid #ddd;
          padding: 15px;
        }

        .content {
          padding-right: 20px;
        }

        .button-container {
          display: flex;
          gap: 5px;
          margin-top: 10px;
        }

        .activo {
          color: green;
          font-weight: bold;
        }

        .desactivo {
          color: red;
          font-weight: bold;
        }

        .custom-carousel {
          max-height: 300px;
        }

        .custom-carousel-image {
          max-height: 300px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default ObtenerVentas;
