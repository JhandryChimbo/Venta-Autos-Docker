"use strict";

module.exports = (sequelize, DataTypes) => {
  const venta = sequelize.define(
    "venta",
    {
      recargo: { type: DataTypes.BOOLEAN, defaultValue: false },
      precioTotal: { type: DataTypes.DOUBLE, defaultValue: 0 },
      fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  );
  venta.associate = function (models) {
    venta.belongsTo(models.auto, { foreignKey: "id_auto" });
    venta.belongsTo(models.comprador, { foreignKey: "id_comprador" });
    venta.belongsTo(models.personal, { foreignKey: "id_personal" });
  };
  return venta;
};
