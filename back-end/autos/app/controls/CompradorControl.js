"use strict";
var models = require("../models");
var comprador = models.comprador;

class CompradorControl {
  async listar(req, res) {
    var lista = await comprador.findAll({
      attributes: [
        "apellidos",
        ["external_id", "id"],
        "nombres",
        "direccion",
        "celular",
        "fecha_nacimiento",
        "identificacion",
      ],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async obtener(req, res) {
    const external = req.params.external;
    var lista = await comprador.findOne({
      where: { external_id: external },
      attributes: [
        "apellidos",
        ["external_id", "id"],
        "nombres",
        "direccion",
        "celular",
        "fecha_nacimiento",
        "identificacion",
      ],
    });
    if (lista === undefined || lista == null) {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: {} });
    } else {
      res.status(200);
      res.json({ msg: "OK", code: 200, datos: lista });
    }
  }

  async guardar(req, res) {
    if (
      req.body.hasOwnProperty("nombres") &&
      req.body.hasOwnProperty("apellidos") &&
      req.body.hasOwnProperty("direccion") &&
      req.body.hasOwnProperty("celular") &&
      req.body.hasOwnProperty("fecha") &&
      req.body.hasOwnProperty("identificacion")
    ) {
      var uuid = require("uuid");

      var data = {
        nombres: req.body.nombres,
        external_id: uuid.v4(),
        apellidos: req.body.apellidos,
        celular: req.body.celular,
        fecha_nacimiento: req.body.fecha,
        direccion: req.body.direccion,
        identificacion: req.body.identificacion,
      };
      let transaction = await models.sequelize.transaction();
      try {
        var result = await comprador.create(data, transaction);
        await transaction.commit();
        if (result === null) {
          res.status(401);
          res.json({ msg: "ERROR", tag: "no se puede crear", code: 401 });
        } else {
          res.status(200);
          res.json({ msg: "OK", code: 200 });
        }
      } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(203);
        res.json({ msg: "ERROR", code: 200, error_msg: error });
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }

  async modificar(req, res) {
    // Obtener el comprador a modificar
    const external = req.params.external;

    if (!external) {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "Falta el comprador a modificar, por favor ingresar su id",
        code: 400,
      });
      return;
    }

    let transaction;
    try {
      // Iniciar transacción
      transaction = await models.sequelize.transaction();

      // Buscar la persona a modificar
      let compradorModificar = await comprador.findOne({
        where: { external_id: external },
        transaction,
      });

      // Verificar si el comprador existe
      if (!compradorModificar) {
        res.status(404);
        res.json({ msg: "ERROR", tag: "Comprador no encontrado", code: 404 });
        return;
      }

      var uuid = require("uuid");

      // Actualizar los campos si se proporcionan en la solicitud
      if (
        req.body.hasOwnProperty("nombres") &&
        req.body.hasOwnProperty("apellidos") &&
        req.body.hasOwnProperty("direccion") &&
        req.body.hasOwnProperty("celular") &&
        req.body.hasOwnProperty("fecha") &&
        req.body.hasOwnProperty("identificacion")
      ) {
        compradorModificar.nombres = req.body.nombres;
        compradorModificar.apellidos = req.body.apellidos;
        compradorModificar.direccion = req.body.direccion;
        compradorModificar.celular = req.body.celular;
        compradorModificar.fecha_nacimiento = req.body.fecha;
        compradorModificar.identificacion = req.body.identificacion;
        (compradorModificar.external_id = uuid.v4());
      } else {
        res.status(400);
        res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
        return;
      }

      // Guardar los cambios y confirmar la transacción
      await compradorModificar.save({ transaction });
      await transaction.commit();

      res.status(200);
      res.json({ msg: "OK", code: 200 });

    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      res.status(500);
      res.json({ msg: "ERROR", code: 500, error_msg: error.message });
    }
  }
}

module.exports = CompradorControl;
