// src/models/Categoria.js
// ========================================================================
// MODELO: Categoria
// ========================================================================
// Este modelo representa la tabla t_categorias en la base de datos
// Permite hacer operaciones CRUD sin escribir SQL directamente
//
// Analogía: Es como una "plantilla" o "molde" para trabajar con categorías
// ========================================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ========================================================================
// DEFINICIÓN DEL MODELO
// ========================================================================
// sequelize.define() crea el modelo
// Parámetro 1: Nombre del modelo (en singular y PascalCase)
// Parámetro 2: Definición de las columnas
// Parámetro 3: Opciones adicionales
// ========================================================================
const Categoria = sequelize.define('Categoria', {
  
  // ======================================================================
  // COLUMNA: id_categoria (Primary Key)
  // ======================================================================
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    
    // allowNull: false está implícito en primaryKey
  },
  
  // ======================================================================
  // COLUMNA: nombre
  // ======================================================================
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    
    // validate: Validaciones que Sequelize ejecuta ANTES de guardar
    validate: {
      notEmpty: {
        msg: 'El nombre de la categoría no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: descripcion
  // ======================================================================
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    
    // defaultValue: null significa que si no se proporciona, será NULL
    defaultValue: null
  },
  
  // ======================================================================
  // COLUMNA: fecha_creacion
  // ======================================================================
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    
    // defaultValue: Sequelize.NOW usa la fecha/hora actual del servidor
    defaultValue: DataTypes.NOW
  }
  
}, {
  // ======================================================================
  // OPCIONES DEL MODELO
  // ======================================================================
  
  // tableName: Nombre EXACTO de la tabla en la base de datos
  // Si no lo pones, Sequelize intentará pluralizar "Categoria" → "Categorias"
  tableName: 't_categorias',
  
  // timestamps: false porque YA tenemos fecha_creacion manualmente
  // Si fuera true, Sequelize agregaría createdAt y updatedAt automáticamente
  timestamps: false,
  
  // underscored: true para usar snake_case en lugar de camelCase
  underscored: true,
  
  // freezeTableName: true para que NO pluralice el nombre
  freezeTableName: true
});

// ========================================================================
// EXPORTAR EL MODELO
// ========================================================================
// Ahora puedes importar este modelo en otros archivos:
// const Categoria = require('./models/Categoria');
// ========================================================================
module.exports = Categoria;