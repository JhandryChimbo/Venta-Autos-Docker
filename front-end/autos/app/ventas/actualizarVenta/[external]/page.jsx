"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import {
  obtenerVentas,
  actualizarVenta,
  obtenerAutos,
  obtenerComprador,
} from "@/hooks/Conexion";
import { getToken, getId } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function EditarVenta() {
  const router = useRouter();
  const token = getToken();
  const idPersonal = getId();

  const { external } = useParams();
  const [venta, setVenta] = useState({});

  const [autos, setAutos] = useState([]);
  const [compradores, setCompradores] = useState([]);

  useEffect(() => {
    const obtenerUnaVenta = async () => {
      const response = await obtenerVentas("venta/get/" + external, token);

      if (response.msg === "OK") {
        const venta = response.datos;
        const { comprador, personal, auto } = venta;

        setVenta(venta);

        console.log("ESTA ES LA VENTA =>", venta.personal);
        console.log("ESTA ES LA VENTA =>", venta.auto);
        console.log("ESTA ES LA VENTA =>", venta.comprador);
        reset({
          personal: personal.external_id,
          comprador: comprador.external_id,
          auto: auto.external_id,
        });
      } else {
        console.error("Error fetching auto data:", response);
      }
    };

    const fetchData = async () => {
      const autosResponse = await obtenerAutos("autos", token);
      const autosConEstadoTrue = autosResponse.datos.filter((auto) => auto.estado === true);
      const compradoresResponse = await obtenerComprador(
        "admin/comprador",
        token
      );

      setAutos(autosConEstadoTrue);
      setCompradores(compradoresResponse.datos);
    };

    fetchData();

    obtenerUnaVenta();
  }, []);

  // Validaciones
  const validationSchema = Yup.object().shape({
    personal: Yup.string().required("Ingrese la personal del auto"),
    comprador: Yup.string().required("Ingrese el comprador del auto"),
    auto: Yup.string().required("Ingrese el valor del auto"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm(formOptions);
  let { errors } = formState;

  const estadoValue = watch("estado");

  const sendData = (formData) => {
    const { auto } = venta.auto;
    const { comprador } = venta.comprador;
    const { personal } = venta.personal;
    const dato = {
      personal: idPersonal,
      comprador: formData.comprador,
      auto: formData.auto,
    };

    console.log("Esto esta enviado", dato)

    actualizarVenta("admin/venta/modificar/" + external, dato, token).then(
      () => {
        mensajes("Venta modificada correctamente", "OK", "success");
        router.push("/ventas");
      }
    );
  };

  return (
    <div className="row">
      <Menu />
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div style={{ flex: 1, maxWidth: "600px" }}>
            <div
              style={{
                border: "2px solid black",
                padding: "20px",
                borderRadius: "5px",
              }}
            >
              <form onSubmit={handleSubmit(sendData)}>
                <div>
                  <h3>
                    {venta.personal &&
                      `${venta.personal.nombres} ${venta.personal.apellidos}`}
                  </h3>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Comprador</label>
                    <select
                      {...register("comprador")}
                      id="comprador"
                      className={`form-select ${
                        errors.comprador ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setValue("comprador", e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un comprador
                      </option>
                      {compradores.map((comprador) => (
                        <option key={comprador.id} value={comprador.id}>
                          {comprador.nombres} {comprador.apellidos}
                        </option>
                      ))}
                    </select>
                    {errors.comprador && (
                      <div className="alert alert-danger mt-2">
                        {errors.comprador.message}
                      </div>
                    )}
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label">Auto</label>
                    <select
                      {...register("auto")}
                      id="auto"
                      className={`form-select ${
                        errors.auto ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setValue("auto", e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione un auto
                      </option>
                      {autos.map((auto) => (
                        <option key={auto.id} value={auto.id}>
                          {auto.marca} - {auto.modelo}
                        </option>
                      ))}
                    </select>
                    {errors.auto && (
                      <div className="alert alert-danger mt-2">
                        {errors.auto.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <button type="submit" className="btn btn-success">
                      Guardar cambios
                    </button>
                    <Link href="/ventas" className="btn btn-danger">
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
