"use client";

import { useEffect, useState } from "react";
import { obtenerComprador } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";

const ObtenerCompradores = () => {
  const [respuesta, setRespuesta] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerComprador("/admin/comprador", token);
      setRespuesta(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!respuesta || respuesta.length === 0) {
    return <p>No hay compradores disponibles.</p>;
  }

  return (
    <div>
      <h2>Lista de Compradores</h2>
      <p>Información detallada de los compradores registrados en el sistema.</p>

      {(rol === "gerente" || rol === "vendedor") && (
        <div
          style={{
            position: "relative",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Link
            href={"/compradors/registrarComprador"}
            className="btn btn-warning"
          >
            Registrar Comprador
          </Link>
        </div>
      )}

      <div className="card-container">
        {respuesta.map((comprador, index) => (
          <div key={index} className="card">
            <div className="card-body">
              <h4 className="card-title">
                {comprador.nombres} {comprador.apellidos}
              </h4>
              <p className="card-text">
                <strong>Identificación:</strong> {comprador.identificacion}
              </p>
              <p className="card-text">
                <strong>Dirección:</strong> {comprador.direccion}
              </p>
              <p className="card-text">
                <strong>Celular:</strong> {comprador.celular}
              </p>
              <p className="card-text">
                <strong>Edad:</strong>{" "}
                {calcularEdad(comprador.fecha_nacimiento)} años
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        h2 {
          color: #333;
        }

        p {
          color: #555;
          margin-bottom: 15px;
        }

        .card-container {
          display: flex;
          flex-wrap: wrap;
        }

        .card {
          flex: 0 0 calc(48% - 20px);
          margin: 1%;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .card:hover {
          transform: scale(1.05);
        }

        .card-body {
          padding: 20px;
        }

        .card-title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .card-text {
          margin: 0;
        }

        .button-container {
          display: flex;
          gap: 5px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

const calcularEdad = (fechaNacimiento) => {
  const today = new Date();
  const birthdate = new Date(fechaNacimiento);
  const age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    return age - 1;
  } else {
    return age;
  }
};

export default ObtenerCompradores;
