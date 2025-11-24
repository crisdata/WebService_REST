// src/config/database.js
// ========================================================================
// INSTANCIA DE SEQUELIZE
// ========================================================================
// Este archivo crea y exporta la instancia de Sequelize que usarán
// todos los modelos de la aplicación
//
// ¿Por qué separado de config.js?
// - config.js: Objeto de configuración estático (para Sequelize CLI)
// - database.js: Instancia activa de Sequelize (para la aplicación)
//
// Analogía:
// - config.js es como la "receta" (ingredientes y cantidades)
// - database.js es como el "plato preparado" (listo para usar)
// ========================================================================

const { Sequelize } = require('sequelize');
const config = require('./config');

// ========================================================================
// DETERMINAR EL ENTORNO
// ========================================================================
// NODE_ENV puede ser: 'development', 'test' o 'production'
// Si no está definido, usamos 'development' por defecto
const env = process.env.NODE_ENV || 'development';

// Obtener la configuración específica del entorno actual
const dbConfig = config[env];

// ========================================================================
// CREAR LA INSTANCIA DE SEQUELIZE
// ========================================================================
// Hay dos formas de crear la instancia:
//
// Forma 1: Pasando parámetros individuales
// const sequelize = new Sequelize(database, username, password, options)
//
// Forma 2: Pasando todo el objeto de configuración (la que usaremos)
// const sequelize = new Sequelize(dbConfig)
//
// Usamos Forma 1 porque es más explícita y clara
const sequelize = new Sequelize(
  dbConfig.database,   // Nombre de la BD: 'catalogo_productos'
  dbConfig.username,   // Usuario: 'postgres'
  dbConfig.password,   // Tu contraseña
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// ========================================================================
// EXPORTAR LA INSTANCIA
// ========================================================================
// Esta instancia se importará en:
// - Los modelos (Categoria.js, Estado.js, Producto.js)
// - El archivo principal del servidor (para sincronizar)
// - Cualquier lugar donde necesitemos hacer queries directas
module.exports = sequelize;