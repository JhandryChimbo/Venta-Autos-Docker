"use strict";

var models = require("../models");
var personal = models.personal;
var comprador = models.comprador;
var auto = models.auto;
var venta = models.venta;

class VentaControl {
  async listar(req, res) {
    var lista = await venta.findAll({
      include: [
        {
          model: models.comprador,
          as: "comprador",
          attributes: ["apellidos", "nombres", "identificacion"],
        },
        {
          model: models.personal,
          as: "personal",
          attributes: ["apellidos", "nombres"],
        },
        {
          model: models.auto,
          as: "auto",
          attributes: ["marca", "modelo", "color", "precio", "archivo", "external_id"],
        },
      ],
      attributes: ["recargo", "fecha", ["external_id", "id"], "precioTotal"],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async obtener(req, res) {
    const external = req.params.external;
    var lista = await venta.findOne({
      where: { external_id: external },

      include: [
        {
          model: models.comprador,
          as: "comprador",
          attributes: ["apellidos", "nombres", "identificacion", "external_id"],
        },
        {
          model: models.personal,
          as: "personal",
          attributes: ["apellidos", "external_id", "nombres"],
        },
        {
          model: models.auto,
          as: "auto",
          attributes: [
            "marca",
            "external_id",
            "modelo",
            "color",
            "precio",
            "archivo",
          ],
        },
      ],

      attributes: ["recargo", ["external_id", "id"], "precioTotal"],
    });
    if (lista === undefined || lista == null) {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: {} });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: lista });
    }
  }

  //GUARDAR VENTA
  async guardar(req, res) {
    if (
      req.body.hasOwnProperty("auto") &&
      req.body.hasOwnProperty("comprador") &&
      req.body.hasOwnProperty("personal")
    ) {
      var uuid = require("uuid");
      var perA = await personal.findOne({
        where: { external_id: req.body.personal },
        include: [{ model: models.rol, as: "rol", attributes: ["nombre"] }],
      });

      var autoA = await auto.findOne({
        where: { external_id: req.body.auto },
      });

      var compradorA = await comprador.findOne({
        where: { external_id: req.body.comprador },
      });

      if (perA == undefined || perA == null) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "El personal a buscar no existe",
          code: 401,
        });
      } else {
        if (autoA.estado === true) {
          if (autoA.color === "BLANCO" || autoA.color === "PLATA") {
            var data = {
              recargo: false,
              precioTotal: autoA.precio,
              external_id: uuid.v4(),
              id_auto: autoA.id,
              id_comprador: compradorA.id,
              id_personal: perA.id,
            };
          } else {
            var valorRecargo = autoA.precio * 0.05;
            var data = {
              recargo: true,
              precioTotal: autoA.precio + valorRecargo,
              external_id: uuid.v4(),
              id_auto: autoA.id,
              id_comprador: compradorA.id,
              id_personal: perA.id,
            };
          }

          if (perA.rol.nombre == "gerente" || perA.rol.nombre == "vendedor") {
            var result = await venta.create(data);
            autoA.estado = false;
            if (result === null) {
              res.status(401);
              res.json({ msg: "Error", tag: "No se puede crear", code: 401 });
            } else {
              perA.external_id = uuid.v4();
              await perA.save();
              await autoA.save();
              res.status(200);
              res.json({ msg: "OK", code: 200 });
            }
          } else {
            res.status(400);
            res.json({
              msg: "ERROR",
              tag: "Solo el personal puede registrar una venta",
              code: 400,
            });
          }
        } else {
          res.status(400);
          res.json({
            msg: "ERROR",
            tag: "El auto no esta disponible",
            code: 400,
          });
        }
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }

  // MODIFICAR VENTA
  async modificar(req, res) {
    const external = req.params.external;

    if (!external) {
      res.status(400).json({
        msg: "ERROR",
        tag: "Falta la venta a modificar, por favor ingresar su id",
        code: 400,
      });
      return;
    }

    let transaction;
    try {
      // Iniciar transacción
      transaction = await models.sequelize.transaction();

      // Buscar la venta a modificar
      let ventaModificar = await venta.findOne({
        where: { external_id: external },
        include: [
          { model: auto, as: "auto" }, // Incluir información del auto
        ],
        transaction,
      });

      // Verificar si la venta existe
      if (!ventaModificar) {
        res
          .status(404)
          .json({ msg: "ERROR", tag: "Venta no encontrada", code: 404 });
        return;
      }

      var perA = await personal.findOne({
        where: { external_id: req.body.personal },
        include: [{ model: models.rol, as: "rol", attributes: ["nombre"] }],
      });

      var autoA = await auto.findOne({
        where: { external_id: req.body.auto },
      });

      var compradorA = await comprador.findOne({
        where: { external_id: req.body.comprador },
      });

      if (
        req.body.hasOwnProperty("auto") &&
        req.body.hasOwnProperty("comprador") &&
        req.body.hasOwnProperty("personal")
      ) {
        const idAutoAnterior = ventaModificar.auto.id;

        ventaModificar.recargo = calcularRecargo(autoA);
        ventaModificar.precioTotal = req.body.precioTotal;
        ventaModificar.id_auto = autoA.id;
        ventaModificar.id_comprador = compradorA.id;
        ventaModificar.id_personal = perA.id;

        await actualizarEstadoAuto(idAutoAnterior, true, transaction);

        await actualizarEstadoAuto(autoA.id, false, transaction);
      } else {
        res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        return;
      }

      // Guardar los cambios y confirmar la transacción
      await ventaModificar.save({ transaction });
      await transaction.commit();

      res.status(200).json({ msg: "OK", code: 200 });
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      res
        .status(500)
        .json({ msg: "ERROR", code: 500, error_msg: error.message });
    }
  }
}

function calcularRecargo(auto) {
  
  if (auto.color === "BLANCO" || auto.color === "PLATA") {
    return false;
  } else {
    var valorRecargo = auto.precio * 0.05;
    return true;
  }
}

async function actualizarEstadoAuto(idAuto, estado, transaction) {
  const autoActualizado = await auto.findByPk(idAuto, { transaction });
  if (autoActualizado) {
    autoActualizado.estado = estado;
    await autoActualizado.save({ transaction });
  } else {
    throw new Error(`Auto con ID ${idAuto} no encontrado`);
  }
}


module.exports = VentaControl;
