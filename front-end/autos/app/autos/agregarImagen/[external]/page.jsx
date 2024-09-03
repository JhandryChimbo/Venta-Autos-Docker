"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { obtenerAutos, subirImagen } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function EditarAuto() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();

  const [autoData, setAutoData] = useState({});

  useEffect(() => {
    const obtenerUnAuto = async () => {
      const response = await obtenerAutos("/autos/get/" + external, token);

      if (response.msg === "OK") {
        const autoData = response.datos;

        setAutoData(autoData);

        reset({
          marca: autoData.marca,
          modelo: autoData.modelo,
          archivo: autoData.archivo,
        });
      } else {
        console.error("Error fetching auto data:", response);
      }
    };

    obtenerUnAuto();
  }, [external, reset, token]);

  // Validaciones
  const validationSchema = Yup.object().shape({
    nameImage: Yup.string().required("Ingrese el nombre de la imagen"),
    archivo: Yup.string().required("Seleccione un archivo"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset} =
    useForm(formOptions);
  let { errors } = formState;

  const sendData = (formData) => {
    var dato = {
      archivo: formData.archivo,
      nameImage: formData.nameImagen,
    };

    subirImagen("admin/auto/file/save/" + external, dato, token)
      .then(() => {
        mensajes("Imagen agregada correctamente", "OK", "success");
        router.push("/autos");
      })
      .catch((error) => {
        console.error("Error al subir la imagen:", error);
        mensajes(
          "Error al subir la imagen. Por favor, inténtalo de nuevo.",
          "Error",
          "error"
        );
      });
  };

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
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

          <div style={{ flex: 1 }}>
            <div
              style={{
                maxWidth: "600px",
                border: "2px solid black",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <form
                onSubmit={handleSubmit(sendData)}
                encType="multipart/form-data"
              >
                <div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Auto</label>
                    <input
                      readOnly // Campo no editable
                      value={`${autoData.marca} ${autoData.modelo}`}
                      className="form-control"
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Nombre Imagen</label>
                    <input
                      {...register("nameImage")}
                      name="nameImage"
                      id="nameImage"
                      className={`form-control ${
                        errors.nameImagen ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.nameImage?.message}
                    </div>
                  </div>

                  {/* Campo para cargar archivo */}
                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Archivo</label>
                    <input
                      type="file"
                      {...register("archivo")}
                      id="archivo"
                      className={`form-control ${
                        errors.archivo ? "is-invalid" : ""
                      }`}
                    />
                    <div className="alert alert-danger invalid-feedback">
                      {errors.archivo?.message}
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
