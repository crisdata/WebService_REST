// src/models/index.js
// ========================================================================
// ÍNDICE DE MODELOS Y ASOCIACIONES
// ========================================================================
// Este archivo:
// 1. Importa todos los modelos
// 2. Define las relaciones entre ellos (hasMany, belongsTo)
// 3. Exporta todo junto para usar en la aplicación
//
// ¿Por qué un archivo index.js?
// - Centraliza todos los modelos en un solo lugar
// - Define las relaciones (asociaciones) entre tablas
// - Facilita importar todos los modelos: require('./models')
// ========================================================================

const sequelize = require('../config/database');

// Importar los modelos
const Categoria = require('./Categoria');
const Estado = require('./Estado');
const Producto = require('./Producto');

// ========================================================================
// DEFINIR ASOCIACIONES (RELACIONES)
// ========================================================================

// ========================================================================
// RELACIÓN: Categoria - Producto (One-to-Many)
// ========================================================================
// UNA categoría TIENE MUCHOS productos
// UN producto PERTENECE A una categoría
//
// Ejemplo:
// - Categoría "Electrónica" tiene: [Laptop, Mouse, Teclado]
// - Producto "Laptop" pertenece a: "Electrónica"
// ========================================================================

// hasMany: "tiene muchos"
// Una categoría puede tener múltiples productos
Categoria.hasMany(Producto, {
  foreignKey: 'id_categoria',  // La columna en t_productos que hace la relación
  as: 'productos'               // Alias para acceder: categoria.productos
});

// belongsTo: "pertenece a"
// Un producto pertenece a una sola categoría
Producto.belongsTo(Categoria, {
  foreignKey: 'id_categoria',  // La misma columna
  as: 'categoria'               // Alias para acceder: producto.categoria
});

// ========================================================================
// RELACIÓN: Estado - Producto (One-to-Many)
// ========================================================================
// UN estado TIENE MUCHOS productos
// UN producto PERTENECE A un estado
//
// Ejemplo:
// - Estado "Activo" tiene: [Laptop, Mouse, Camiseta]
// - Producto "Laptop" tiene estado: "Activo"
// ========================================================================

Estado.hasMany(Producto, {
  foreignKey: 'id_estado',
  as: 'productos'
});

Producto.belongsTo(Estado, {
  foreignKey: 'id_estado',
  as: 'estado'
});

// ========================================================================
// ¿QUÉ PERMITEN ESTAS ASOCIACIONES?
// ========================================================================
// Ahora puedes hacer consultas como:
//
// 1. Obtener un producto CON su categoría y estado:
//    Producto.findByPk(1, { include: ['categoria', 'estado'] })
//
// 2. Obtener una categoría CON todos sus productos:
//    Categoria.findByPk(1, { include: ['productos'] })
//
// 3. Filtrar productos por categoría:
//    Producto.findAll({ where: { id_categoria: 1 } })
//
// Sin las asociaciones, tendrías que hacer múltiples consultas manualmente
// ========================================================================

// ========================================================================
// EXPORTAR TODO
// ========================================================================
module.exports = {
  sequelize,    // La instancia de conexión
  Categoria,    // El modelo Categoria
  Estado,       // El modelo Estado
  Producto      // El modelo Producto
};