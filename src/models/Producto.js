// src/models/Producto.js
// ========================================================================
// MODELO: Producto
// ========================================================================
// Representa la tabla t_productos (la tabla principal)
// Tiene relaciones (Foreign Keys) con Categoria y Estado
// ========================================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  
  // ======================================================================
  // COLUMNA: id_producto (Primary Key)
  // ======================================================================
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // ======================================================================
  // COLUMNA: nombre
  // ======================================================================
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto no puede estar vacío'
      },
      len: {
        args: [3, 200],
        msg: 'El nombre debe tener entre 3 y 200 caracteres'
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: descripcion
  // ======================================================================
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  },
  
  // ======================================================================
  // COLUMNA: precio
  // ======================================================================
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    
    // validate: Validaciones personalizadas
    validate: {
      isDecimal: {
        msg: 'El precio debe ser un número decimal'
      },
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      },
      
      // Validación personalizada: máximo 2 decimales
      esFormatoValido(value) {
        // Convertir a string y verificar decimales
        const regex = /^\d+(\.\d{1,2})?$/;
        if (!regex.test(value)) {
          throw new Error('El precio debe tener máximo 2 decimales');
        }
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: stock
  // ======================================================================
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'El stock debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El stock no puede ser negativo'
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: id_categoria (Foreign Key)
  // ======================================================================
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
    // references: Define la relación con otra tabla
    references: {
      model: 't_categorias',
      key: 'id_categoria'
    },
    
    validate: {
      notNull: {
        msg: 'Debes especificar una categoría'
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: id_estado (Foreign Key)
  // ======================================================================
  id_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
    references: {
      model: 't_estados',
      key: 'id_estado'
    },
    
    validate: {
      notNull: {
        msg: 'Debes especificar un estado'
      }
    }
  },
  
  // ======================================================================
  // COLUMNA: fecha_creacion
  // ======================================================================
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  // ======================================================================
  // COLUMNA: fecha_actualizacion
  // ======================================================================
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
  
}, {
  tableName: 't_productos',
  timestamps: false,
  underscored: true,
  freezeTableName: true
});

module.exports = Producto;