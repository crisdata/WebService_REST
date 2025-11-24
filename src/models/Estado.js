// src/models/Estado.js
// ========================================================================
// MODELO: Estado
// ========================================================================
// Representa la tabla t_estados
// Almacena los posibles estados de un producto (Activo, Inactivo, Agotado)
// ========================================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estado = sequelize.define('Estado', {
  
  id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre del estado no puede estar vacío'
      },
      isIn: {
        args: [['Activo', 'Inactivo', 'Agotado']],
        msg: 'El estado debe ser: Activo, Inactivo o Agotado'
      }
    }
  },
  
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  }
  
}, {
  tableName: 't_estados',
  timestamps: false,
  underscored: true,
  freezeTableName: true
});

module.exports = Estado;