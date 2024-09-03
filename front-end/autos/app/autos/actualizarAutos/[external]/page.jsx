"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { obtenerAutos, actualizarAuto } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function EditarAuto() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();
  const [colores, setColores] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [autoData, setAutoData] = useState({});

  useEffect(() => {
    const obtenerColores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/colores");

        if (!response.ok) {
          throw new Error(
            `Error al obtener colores: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setColores(data.colores);
        setSelectedColor(data.colores[0] || "");
      } catch (error) {
        console.error(error.message);
      }
    };

    const obtenerUnAuto = async () => {
      const response = await obtenerAutos("/autos/get/" + external, token);

      if (response.msg === "OK") {
        const autoData = response.datos;

        setAutoData(autoData);

        reset({
          marca: autoData.marca,
          modelo: autoData.modelo,
          precio: autoData.precio,
          anio: autoData.anio,
          color: autoData.color,
          estado: autoData.estado ? "Disponible" : "No Disponible",
        });
        setSelectedColor(autoData.color || "");
      } else {
        console.error("Error fetching auto data:", response);
      }
    };

    obtenerColores();
    obtenerUnAuto();
  }, []);

  // Validaciones
  const validationSchema = Yup.object().shape({
    marca: Yup.string().required("Ingrese la marca del auto"),
    modelo: Yup.string().required("Ingrese el modelo del auto"),
    precio: Yup.string().required("Ingrese el valor del auto"),
    anio: Yup.string().required("Ingrese el año del auto"),
    color: Yup.string().required("Seleccione un color"),
    estado: Yup.string().required("Seleccione un estado"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm(formOptions);
  let { errors } = formState;

  const estadoValue = watch("estado");

  const sendData = (formData) => {
    var dato = {
      marca: formData.marca,
      modelo: formData.modelo,
      precio: formData.precio,
      anio: formData.anio,
      estado: formData.estado === "Disponible", // Convertir a booleano
      color: selectedColor,
    };

    actualizarAuto("admin/auto/modificar/" + external, dato, token).then(
      () => {
        mensajes("Auto modificado correctamente", "OK", "success");
        router.push("/autos");
      }
    );
  };

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row", // Cambiado a fila para que estén uno al lado del otro
          }}
        >
          {/* Carrusel de fotos en la primera columna */}
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <div className="list-group">
              <div className="list-group-item">
                <Carousel interval={2000} className="custom-carousel">
                  {autoData.archivo &&
                    autoData.archivo.split(",").map((nombreArchivo, index) => (
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
          </div>

          {/* Formulario en la segunda columna */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                maxWidth: "600px",
                border: "2px solid black",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <form onSubmit={handleSubmit(sendData)}>
                <div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Marca</label>
                    <input
                      {...register("marca")}
                      name="marca"
                      id="marca"
                      className={`form-control ${
                        errors.marca ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.marca?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Modelo</label>
                    <input
                      {...register("modelo")}
                      name="modelo"
                      id="modelo"
                      className={`form-control ${
                        errors.modelo ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.modelo?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Precio</label>
                    <input
                      {...register("precio")}
                      name="precio"
                      id="precio"
                      className={`form-control ${
                        errors.precio ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.precio?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Año</label>
                    <input
                      {...register("anio")}
                      name="anio"
                      id="anio"
                      className={`form-control ${
                        errors.anio ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.anio?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Color</label>
                    <select
                      {...register("color")}
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className={`form-control ${
                        errors.color ? "is-invalid" : ""
                      }`}
                    >
                      <option value="" disabled>
                        Selecciona un color
                      </option>
                      {colores.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <div className="alert alert-danger invalid-feedback">
                      {errors.color?.message}
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Estado</label>

                    <select
                      {...register("estado")}
                      value={estadoValue ? "Disponible" : "No Disponible"}
                      onChange={(e) => {
                        const newState = e.target.value === "Disponible";
                        setValue("estado", newState);
                      }}
                      className={`form-control ${
                        errors.estado ? "is-invalid" : ""
                      }`}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="No Disponible">No Disponible</option>
                    </select>

                    <div className="alert alert-danger invalid-feedback">
                      {errors.estado?.message}
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="btn btn-success">
                      Guardar cambios
                    </button>
                    <Link href="/autos" className="btn btn-danger">
                      Volver
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
