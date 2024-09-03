"use strict";

var models = require("../models");
var cuenta = models.cuenta;
var rol = models.rol;
let jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

class CuentaControl {
  async inicio_sesion(req, res) {
    if (req.body.hasOwnProperty("correo") && req.body.hasOwnProperty("clave")) {
      let cuentaA = await cuenta.findOne({
        where: { correo: req.body.correo },
        include: [
          {
            model: models.personal,
            as: "personal",
            attributes: ["apellidos", "external_id", "nombres", "id_rol"],
          },
        ],
      });
      if (cuentaA === null) {
        res.status(400);
        res.json({ msg: "ERROR", tag: "Cuenta no existe", code: 400 });
      } else {
        if (cuentaA.estado == true) {
          const claveCifrada = await bcrypt.compare(
            req.body.clave,
            cuentaA.clave
          );

          if (claveCifrada) {
            //TODO mandar rol
            var rolAux = await rol.findOne({
              where: { id: cuentaA.personal.id_rol },
            });
            const token_data = {
              external: cuentaA.external_id,
              rol: rolAux.nombre,
              check: true,
            };
            require("dotenv").config();
            const key = process.env.KEY_JWT;
            const token = jwt.sign(token_data, key, {
              expiresIn: "2h",
            });
            var info = {
              token: token,
              user: cuentaA.personal.apellidos + " " + cuentaA.personal.nombres,
              external_id: cuentaA.personal.external_id,
              rol: rolAux.nombre,
            };
            res.status(200);
            res.json({
              msg: "OK",
              tag: "Listo :)",
              data: info,
              code: 200,
            });
          } else {
            res.status(400);
            res.json({
              msg: "ERROR",
              tag: "La informacion ingresada es incorrecta",
              code: 400,
            });
          }
        } else {
          res.status(400);
          res.json({ msg: "ERROR", tag: "Cuenta desactivada", code: 400 });
        }
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
    }
  }
}

module.exports = CuentaControl;
