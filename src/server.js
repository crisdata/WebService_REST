// src/index.js
// ========================================================================
// SERVIDOR PRINCIPAL DE LA APLICACIÓN
// ========================================================================
// Este es el archivo principal que:
// 1. Configura Express (el servidor web)
// 2. Conecta con la base de datos
// 3. Define las rutas (endpoints)
// 4. Inicia el servidor
//
// Analogía: Es como el "cerebro" que coordina todo
// ========================================================================

// ========================================================================
// IMPORTAR DEPENDENCIAS
// ========================================================================
const express = require('express');
const sequelize = require('./config/database');

// Importar los modelos (esto establece las asociaciones)
const { Categoria, Estado, Producto } = require('./models');

// ========================================================================
// CREAR LA APLICACIÓN EXPRESS
// ========================================================================
// express() crea una instancia de la aplicación
// Es como crear un "restaurante" que recibirá órdenes (peticiones HTTP)
const app = express();

// ========================================================================
// CONFIGURAR EL PUERTO
// ========================================================================
// El puerto es el "número de puerta" donde el servidor escucha peticiones
// process.env.PORT lee la variable de entorno (del archivo .env)
// Si no existe, usa 3000 por defecto
const PORT = process.env.PORT || 3000;

// ========================================================================
// MIDDLEWARES GLOBALES
// ========================================================================
// Los middlewares son funciones que se ejecutan ANTES de llegar a las rutas
// Procesan la petición para que llegue en el formato correcto

// express.json(): Permite que el servidor entienda JSON
// Sin esto, no podrías enviar { "nombre": "Laptop" } en el body
// Convierte el JSON en un objeto JavaScript que puedes usar
app.use(express.json());

// express.urlencoded(): Permite enviar datos en formato de formulario
// Ejemplo: nombre=Laptop&precio=800
// extended: true permite objetos y arrays anidados
app.use(express.urlencoded({ extended: true }));

// ========================================================================
// RUTA DE PRUEBA (HEALTH CHECK)
// ========================================================================
// Endpoint simple para verificar que el servidor está funcionando
// GET http://localhost:3000/
app.get('/', (req, res) => {
  res.json({
    mensaje: '✅ Servidor REST funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ========================================================================
// IMPORTAR Y USAR LAS RUTAS
// ========================================================================
// Importar el router de productos
// Este router contiene todas las definiciones de rutas (GET, POST, PUT, DELETE)
const productosRoutes = require('./routes/productos');

// productosRoutes es el router que exportamos desde productos.js
// Contiene 5 rutas:
// - POST   /
// - GET    /
// - GET    /:id
// - PUT    /:id
// - DELETE /:id

// ========================================================================
// MONTAR EL ROUTER EN UN PATH BASE
// ========================================================================
// app.use() es un método de Express para registrar middlewares y routers
app.use('/api/productos', productosRoutes);

// ========================================================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ========================================================================
// Si alguien intenta acceder a una ruta que no existe
// Ejemplo: GET http://localhost:3000/ruta-que-no-existe
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `No se encontró la ruta: ${req.method} ${req.url}`,
    rutas_disponibles: [
      'GET /',
      'GET /api/productos',
      'POST /api/productos'
      // ... más rutas cuando las creemos
    ]
  });
});

// ========================================================================
// FUNCIÓN PARA INICIAR EL SERVIDOR
// ========================================================================
async function iniciarServidor() {
  try {
    // ====================================================================
    // PASO 1: Verificar conexión con la base de datos
    // ====================================================================
    console.log('🔄 Verificando conexión con la base de datos...');
    
    // authenticate() verifica que podemos conectarnos a PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    
    // ====================================================================
    // PASO 2: Sincronizar modelos (OPCIONAL - Solo en desarrollo)
    // ====================================================================
    // sequelize.sync() verifica que las tablas existan
    // alter: true actualiza las tablas si hay cambios en los modelos
    // 
    // ⚠️ NOTA: En producción NO uses sync(), solo migraciones
    // Lo usamos aquí solo para asegurar que todo está sincronizado
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos');
    
    // ====================================================================
    // PASO 3: Iniciar el servidor HTTP
    // ====================================================================
    // app.listen() inicia el servidor en el puerto especificado
    // Es como "abrir el restaurante" para recibir clientes
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('🚀 SERVIDOR INICIADO CORRECTAMENTE');
      console.log('========================================');
      console.log(`📡 Escuchando en: http://localhost:${PORT}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
      console.log(`⏰ Fecha/Hora: ${new Date().toLocaleString()}`);
      console.log('========================================');
      console.log('');
      console.log('💡 Presiona Ctrl+C para detener el servidor');
      console.log('');
    });
    
  } catch (error) {
    // ====================================================================
    // MANEJO DE ERRORES
    // ====================================================================
    // Si algo falla (conexión a BD, puerto ocupado, etc.)
    console.error('❌ ERROR al iniciar el servidor:');
    console.error(error.message);
    
    // Salir del proceso con código de error
    process.exit(1);
  }
}

// ========================================================================
// MANEJO DE CIERRE GRACEFUL
// ========================================================================
// Cuando presionas Ctrl+C o el proceso se cierra
// Cerramos la conexión a la base de datos correctamente
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    process.exit(1);
  }
});

// ========================================================================
// INICIAR LA APLICACIÓN
// ========================================================================
iniciarServidor();