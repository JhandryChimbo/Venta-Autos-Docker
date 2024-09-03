"use strict";
var models = require("../models");
var personal = models.personal;
var rol = models.rol;

var bcrypt = require("bcrypt");

class PersonaControl {
  async listar(req, res) {
    var lista = await personal.findAll({
      include: [
        { model: models.cuenta, as: "cuenta", attributes: ["correo"] },
        { model: models.rol, as: "rol", attributes: ["nombre"] },
      ],
      attributes: [
        "apellidos",
        ["external_id", "id"],
        "nombres",
        "direccion",
        "celular",
        "fecha_nacimiento",
      ],
    });
    res.status(200);
    res.json({ msg: "OK", code: 200, datos: lista });
  }

  async obtener(req, res) {
    const external = req.params.external;
    var lista = await personal.findOne({
      where: { external_id: external },
      include: [
        { model: models.cuenta, as: "cuenta", attributes: ["correo"] },
        { model: models.rol, as: "rol", attributes: ["nombre"] },
      ],
      attributes: [
        "apellidos",
        ["external_id", "id"],
        "nombres",
        "direccion",
        "celular",
        "fecha_nacimiento",
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
      req.body.hasOwnProperty("correo") &&
      req.body.hasOwnProperty("clave") &&
      req.body.hasOwnProperty("fecha") &&
      req.body.hasOwnProperty("rol")
    ) {
      var uuid = require("uuid");
      var rolA = await rol.findOne({ where: { external_id: req.body.rol } });

      // Validar correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.correo)) {
        res.status(400);
        res.json({
          msg: "ERROR",
          tag: "El correo ingresado no tiene un formato válido",
          code: 400,
        });
        return;
      }

      
      if (rolA != undefined) {

        //Encriptar
        const claveEncriptada = await bcrypt.hash(req.body.clave, 10);

        var data = {
          nombres: req.body.nombres,
          external_id: uuid.v4(),
          apellidos: req.body.apellidos,
          celular: req.body.celular,
          fecha_nacimiento: req.body.fecha,
          id_rol: rolA.id,
          direccion: req.body.direccion,
          cuenta: {
            correo: req.body.correo,
            clave: claveEncriptada,
          },
        };
        let transaction = await models.sequelize.transaction();
        try {
          var result = await personal.create(data, {
            include: [{ model: models.cuenta, as: "cuenta" }],
            transaction,
          });
          await transaction.commit();
          if (result === null) {
            res.status(401);
            res.json({ msg: "ERROR", tag: "no se puede crear", code: 401 });
          } else {
            rolA.external_id = uuid.v4();
            await rolA.save();
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
        res.json({
          msg: "ERROR",
          tag: "El dato a buscar no existe",
          code: 400,
        });
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }

  async modificar(req, res) {
    // Obtener la persona a modificar
    const external = req.params.external;

    if (!external) {
      res.status(400);
      res.json({
        msg: "ERROR",
        tag: "Falta la persona a modificar, por favor ingresar su id",
        code: 400,
      });
      return;
    }

    let transaction;
    try {
      // Iniciar transacción
      transaction = await models.sequelize.transaction();

      // Buscar la persona a modificar
      let personaModificar = await personal.findOne({
        where: { external_id: external },
        include: [{ model: models.rol, as: "rol" }],
        transaction,
      });

      // Verificar si la persona existe
      if (!personaModificar) {
        res.status(404);
        res.json({ msg: "ERROR", tag: "Persona no encontrada", code: 404 });
        return;
      }

      var uuid = require("uuid");
      var rolA = await rol.findOne({ where: { external_id: req.body.rol } });
      //var rolA = await rol.findOne({ where: { nombre: req.body.rol } });

      if (rolA != undefined || rolA != null) {
        // Actualizar los campos si se proporcionan en la solicitud
        if (
          req.body.hasOwnProperty("nombres") &&
          req.body.hasOwnProperty("apellidos") &&
          req.body.hasOwnProperty("direccion") &&
          req.body.hasOwnProperty("celular") &&
          req.body.hasOwnProperty("fecha") &&
          req.body.hasOwnProperty("rol")
        ) {
          personaModificar.nombres = req.body.nombres;
          personaModificar.apellidos = req.body.apellidos;
          personaModificar.direccion = req.body.direccion;
          personaModificar.celular = req.body.celular;
          personaModificar.fecha_nacimiento = req.body.fecha;
          (personaModificar.external_id = uuid.v4()),
            (personaModificar.id_rol = rolA.id);
        } else {
          res.status(400);
          res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
          return;
        }

        // Guardar los cambios y confirmar la transacción
        await personaModificar.save({ transaction });
        await transaction.commit();

        res.status(200);
        res.json({ msg: "OK", code: 200 });
      } else {
        res.status(400);
        res.json({
          msg: "ERROR",
          tag: "El rol a buscar no existe",
          code: 400,
        });
      }
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      res.status(500);
      res.json({ msg: "ERROR", code: 500, error_msg: error.message });
    }
  }
}

module.exports = PersonaControl;
