"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { guardarComprador } from "@/hooks/Autenticacion";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function AgregarAuto() {
  const router = useRouter();

  // Validaciones
  const validationSchema = Yup.object().shape({
    nombres: Yup.string().required("Ingrese los nombres del comprador"),
    apellidos: Yup.string().required("Ingrese los apellidos del comprador"),
    identificacion: Yup.string().required(
      "Ingrese la identificacion del comprador"
    ),
    celular: Yup.string().required("Ingrese el celular del comprador"),
    direccion: Yup.string().required("Ingrese la direccion del comprador"),
    fecha_nacimiento: Yup.string().required(
      "Ingrese la fecha de nacimiento del comprador"
    ),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  let { errors } = formState;

  useEffect(() => {}, []);

  const sendData = async (data) => {
    console.log(data);
    var dato = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      identificacion: data.identificacion,
      direccion: data.direccion,
      celular: data.celular,
      fecha: data.fecha_nacimiento,
    };

    console.log(dato);
    guardarComprador(dato).then((info) => {
      console.log(info);

      mensajes("Comprador agregado correctamente", "OK", "success");

      router.push("/compradors");
    });
  };

  const handleInputClick = (event) => {
    const fieldName = event.target.name;
    setValue(fieldName, "");
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
                <label className="form-label">Nombres</label>
                <input
                  {...register("nombres")}
                  name="nombres"
                  id="nombres"
                  className={`form-control ${
                    errors.nombres ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("nombres", e.target.value)} // Actualizar el valor cuando se escribe
                  onClick={handleInputClick} // Limpiar el valor al hacer clic
                  placeholder="Ingrese los nombres del comprador"
                />
                {errors.nombres && (
                  <div className="alert alert-danger mt-2">
                    {errors.nombres.message}
                  </div>
                )}
              </div>
              <div className="form-outline form-white mb-4">
                <label className="form-label">Apellidos</label>
                <input
                  {...register("apellidos")}
                  name="apellidos"
                  id="apellidos"
                  className={`form-control ${
                    errors.apellidos ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("apellidos", e.target.value)}
                  onClick={handleInputClick}
                  placeholder="Ingrese los apellidos del comprador"
                />
                {errors.apellidos && (
                  <div className="alert alert-danger mt-2">
                    {errors.apellidos.message}
                  </div>
                )}
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Identificacion</label>
                <input
                  {...register("identificacion")}
                  name="identificacion"
                  id="identificacion"
                  className={`form-control ${
                    errors.identificacion ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("identificacion", e.target.value)}
                  onClick={handleInputClick}
                  placeholder="Ingrese la identificacion del comprador"
                />
                {errors.identificacion && (
                  <div className="alert alert-danger mt-2">
                    {errors.identificacion.message}
                  </div>
                )}
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Celular</label>
                <input
                  {...register("celular")}
                  name="celular"
                  id="celular"
                  className={`form-control ${
                    errors.celular ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("celular", e.target.value)}
                  onClick={handleInputClick}
                  placeholder="Ingrese el celular del comprador"
                />
                {errors.celular && (
                  <div className="alert alert-danger mt-2">
                    {errors.celular.message}
                  </div>
                )}
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Direccion</label>
                <input
                  {...register("direccion")}
                  name="direccion"
                  id="direccion"
                  className={`form-control ${
                    errors.direccion ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("direccion", e.target.value)}
                  onClick={handleInputClick}
                  placeholder="Ingrese la direccion del comprador"
                />
                {errors.direccion && (
                  <div className="alert alert-danger mt-2">
                    {errors.direccion.message}
                  </div>
                )}
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Fecha Nacimiento</label>
                <input
                  {...register("fecha_nacimiento")}
                  name="fecha_nacimiento"
                  id="fecha_nacimiento"
                  className={`form-control ${
                    errors.fecha_nacimiento ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setValue("fecha_nacimiento", e.target.value)}
                  onClick={handleInputClick}
                  placeholder="Ingrese la fecha de nacimiento del comprador"
                />
                {errors.fecha_nacimiento && (
                  <div className="alert alert-danger mt-2">
                    {errors.fecha_nacimiento.message}
                  </div>
                )}
              </div>

              <div>
                <button type="submit" className="btn btn-success">
                  Agregar
                </button>
                <Link href="/compradors" className="btn btn-danger">
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
