"use strict";

module.exports = (sequelize, DataTypes) => {
  const comprador = sequelize.define(
    "comprador",
    {
      apellidos: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      direccion: { type: DataTypes.STRING, defaultValue: "NONE" },
      celular: { type: DataTypes.STRING(20), defaultValue: "NONE" },
      fecha_nacimiento: { type: DataTypes.DATEONLY },
      identificacion: { type: DataTypes.STRING(20), defaultValue: "NONE" },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  ); //para que la tabla tome el nombre que nosotros le damos
  comprador.associate = function (models) {
    comprador.hasMany(models.venta, {
      foreignKey: "id_comprador",
      as: "venta",
    }); 
  };
  return comprador;
};
