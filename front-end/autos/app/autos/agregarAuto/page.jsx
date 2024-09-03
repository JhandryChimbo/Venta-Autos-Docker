"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { guardarAuto } from "@/hooks/Autenticacion";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function AgregarAuto() {
  const router = useRouter();

  // Validaciones
  const validationSchema = Yup.object().shape({
    marca: Yup.string().required("Ingrese la marca del auto"),
    modelo: Yup.string().required("Ingrese el modelo del auto"),
    precio: Yup.string().required("Ingrese el valor del auto"),
    anio: Yup.string().required("Ingrese el anio del auto"),
    color: Yup.string().required("Seleccione un color"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  let { errors } = formState;

  const [colores, setColores] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

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

  useEffect(() => {
    obtenerColores();
  }, []);

  const sendData = async (data) => {
    console.log(data);
    var dato = {
      marca: data.marca,
      modelo: data.modelo,
      precio: data.precio,
      anio: data.anio,
      color: selectedColor,
    };

    console.log(dato);
    guardarAuto(dato).then((info) => {
      console.log(info);

      mensajes("Auto agregado correctamente", "OK", "success");

      router.push("/autos");
    });
  };

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
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
                  className={`form-control ${errors.marca ? "is-invalid" : ""}`}
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
                  className={`form-control ${errors.anio ? "is-invalid" : ""}`}
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
                  className={`form-control ${errors.color ? "is-invalid" : ""}`}
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

              <div>
                <button type="submit" className="btn btn-success">
                  Agregar
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
  );
}
