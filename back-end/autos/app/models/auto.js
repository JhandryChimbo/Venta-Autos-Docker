"use strict";

module.exports = (sequelize, DataTypes) => {
  const auto = sequelize.define(
    "auto",
    {
      marca: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      modelo: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      archivo: { type: DataTypes.STRING(150), defaultValue: "NONE.jpg" },
      anio: { type: DataTypes.INTEGER(4), defaultValue: 0 },
      color: {
        type: DataTypes.ENUM([
          "NEGRO",
          "BLANCO",
          "PLATA",
          "AMARILLO",
          "AZUL",
          "ROJO",
        ]),
        defaultValue: "NEGRO",
      },
      precio: { type: DataTypes.DOUBLE, defaultValue: "0" },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  );
  auto.associate = function (models) {
    auto.hasMany(models.venta, {
      foreignKey: "id_auto",
      as: "venta",
    });
  };

  auto.getColoresDisponibles = function () {
    return auto.rawAttributes.color.values;
  };
  return auto;
};
