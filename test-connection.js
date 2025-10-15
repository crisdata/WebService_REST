// test-connection.js
// Archivo temporal para probar la conexión a la base de datos

// Importamos sequelize desde nuestro archivo de configuración
const sequelize = require('./src/config/config');

// Función asíncrona para probar la conexión
async function testConnection() {
  try {
    // Intentamos autenticar (conectar) con la base de datos
    await sequelize.authenticate();
    
    // Si llegamos aquí, la conexión fue exitosa
    console.log('✅ Conexión a la base de datos exitosa!');
    console.log('📊 Base de datos:', process.env.DB_NAME);
    console.log('🖥️  Host:', process.env.DB_HOST);
    console.log('🔌 Puerto:', process.env.DB_PORT);
    
  } catch (error) {
    // Si hay un error, lo mostramos
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error.message);
  } finally {
    // Cerramos la conexión
    await sequelize.close();
  }
}

// Ejecutamos la función
testConnection();