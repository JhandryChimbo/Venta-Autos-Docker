"use strict";

module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define(
    "rol",
    {
      nombre: { type: DataTypes.STRING(100) },
      external_id: { type: DataTypes.UUID(), defaultValue: DataTypes.UUIDV4 },
    },
    { timestamps: false, freezeTableName: true }
  );
  rol.associate = function (models) {
    rol.hasMany(models.personal, { foreignKey: "id_rol", as: "personal" });
  };
  return rol;
};
