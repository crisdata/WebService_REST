// src/config/config.js
// ========================================================================
// ARCHIVO DE CONFIGURACIÓN UNIFICADO PARA SEQUELIZE
// ========================================================================
// Este archivo sirve para DOS propósitos:
// 1. Sequelize CLI lo usa para ejecutar migraciones
// 2. Nuestra aplicación lo usa para conectarse a la base de datos
//
// ¿Por qué usar .js en lugar de .json?
// - JSON no puede leer variables de entorno (process.env)
// - JS nos permite usar lógica dinámica
// - Es el enfoque moderno recomendado por Sequelize
//
// ========================================================================

// Cargar dotenv PRIMERO antes de leer process.env
// Esto asegura que las variables estén disponibles para Sequelize CLI
require('dotenv').config();

// ========================================================================
// ESTRUCTURA DEL ARCHIVO
// ========================================================================
// - development: Para desarrollo local
// ========================================================================

module.exports = {
  
  // ======================================================================
  // ENTORNO: DEVELOPMENT (Desarrollo Local)
  // ======================================================================
  // Este es el entorno que usaremos en este proyecto
  // Se activa cuando NODE_ENV=development o cuando NODE_ENV no está definido
  // ======================================================================
  development: {
    
    // ==================================================================
    // username: Usuario de PostgreSQL
    // ==================================================================
    // Generalmente es "postgres" (el superusuario por defecto)
    // Se lee desde la variable de entorno DB_USER en el archivo .env
    username: process.env.DB_USER,
    
    // ==================================================================
    // password: Contraseña del usuario de PostgreSQL
    // ==================================================================
    // La que configuraste durante la instalación de PostgreSQL
    // Se lee desde la variable de entorno DB_PASSWORD en el archivo .env
    // 
    // ⚠️ IMPORTANTE: Nunca pongas la contraseña directamente aquí
    // Siempre usa variables de entorno por seguridad
    password: String(process.env.DB_PASSWORD),
    
    // ==================================================================
    // database: Nombre de la base de datos
    // ==================================================================
    // En nuestro caso: "catalogo_productos"
    // Esta base de datos debe existir ANTES de ejecutar migraciones
    database: process.env.DB_NAME,
    
    // ==================================================================
    // host: Dirección del servidor de base de datos
    // ==================================================================
    // "localhost" significa que PostgreSQL está en tu misma computadora
    // En producción, esto sería una IP o dominio del servidor
    host: process.env.DB_HOST,
    
    // ==================================================================
    // port: Puerto donde PostgreSQL escucha conexiones
    // ==================================================================
    // 5432 es el puerto predeterminado de PostgreSQL
    // Si instalaste PostgreSQL con configuración estándar, es este
    // 
    // Nota: Convertimos a número con parseInt() porque las variables
    // de entorno siempre son strings ("5432") y necesitamos un número (5432)
    port: parseInt(process.env.DB_PORT, 10),
    
    // ==================================================================
    // dialect: Tipo de base de datos que estamos usando
    // ==================================================================
    // Opciones válidas: 'postgres', 'mysql', 'mariadb', 'sqlite', 'mssql'
    // 
    // ⚠️ CRÍTICO: Este valor NO viene de .env porque nunca cambia
    // Siempre será 'postgres' para este proyecto
    // No uses process.env aquí o causará el error que tuviste
    dialect: 'postgres',
    
    // ==================================================================
    // logging: Controla qué se muestra en la consola
    // ==================================================================
    // false = No muestra nada (producción)
    // console.log = Muestra todas las consultas SQL (desarrollo)
    // 
    // En desarrollo es MUY ÚTIL ver las consultas SQL porque:
    // - Aprendes cómo Sequelize traduce tu código a SQL
    // - Puedes detectar consultas lentas o problemáticas
    // - Ayuda a depurar errores
    logging: console.log,
    
    // ==================================================================
    // pool: Configuración del pool de conexiones
    // ==================================================================
    // ¿Qué es un pool?
    // En lugar de abrir/cerrar conexiones constantemente (lento),
    // Sequelize mantiene un "pool" (conjunto) de conexiones abiertas
    // y las reutiliza
    // 
    // Analogía: Es como tener 5 líneas telefónicas abiertas
    // en lugar de marcar cada vez que quieres llamar
    pool: {
      
      // max: Máximo número de conexiones simultáneas
      // 5 es suficiente para desarrollo local
      // En producción con mucho tráfico, podrías usar 20-50
      max: 5,
      
      // min: Mínimo de conexiones que siempre están abiertas
      // 0 = No mantiene conexiones si no se usan (ahorra recursos)
      min: 0,
      
      // acquire: Tiempo máximo (en milisegundos) para obtener una conexión
      // 30000ms = 30 segundos
      // Si tarda más, Sequelize lanza un error de timeout
      acquire: 30000,
      
      // idle: Tiempo máximo (en ms) que una conexión puede estar inactiva
      // 10000ms = 10 segundos
      // Después de este tiempo sin usarse, la conexión se cierra
      // Esto libera recursos en la base de datos
      idle: 10000
    },
    
    // ==================================================================
    // define: Opciones predeterminadas para todos los modelos
    // ==================================================================
    // Estas opciones se aplican a todas las tablas a menos que
    // las sobrescribas en un modelo específico
    define: {
      
      // timestamps: ¿Agregar createdAt y updatedAt automáticamente?
      // false = No (nosotros ya creamos fecha_creacion y fecha_actualizacion)
      // true = Sí (Sequelize agregaría sus propias columnas)
      // 
      // Lo ponemos en false porque preferimos nuestros nombres de columnas
      timestamps: false,
      
      // underscored: ¿Usar snake_case en lugar de camelCase?
      // true = usa nombre_columna (como en SQL tradicional)
      // false = usa nombreColumna (estilo JavaScript)
      // 
      // Lo ponemos en true porque nuestras tablas ya usan snake_case
      // (id_producto, fecha_creacion, etc.)
      underscored: true,
      
      // freezeTableName: ¿Evitar que Sequelize pluralice nombres?
      // true = Usa exactamente el nombre que defines
      // false = "Producto" se convierte en "Productos"
      // 
      // Lo ponemos en true porque ya definimos los nombres exactos
      // en las migraciones (t_productos, no queremos que cambie)
      freezeTableName: true
    }
  },
};