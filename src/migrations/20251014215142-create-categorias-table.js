'use strict';

// ========================================================================
// MIGRACIÓN: Crear Tabla t_categorias
// ========================================================================
// Propósito: Esta migración crea la tabla que almacenará las categorías
//            de productos (ej: Electrónica, Ropa, Alimentos, etc.)
//
// ¿Qué es una migración?
// - Es un archivo que describe CÓMO cambiar la estructura de la BD
// - Tiene dos funciones: 'up' (aplicar cambio) y 'down' (revertir cambio)
// - Se ejecuta una sola vez y queda registrado en la tabla SequelizeMeta
// ========================================================================

module.exports = {
  
  // ========================================================================
  // FUNCIÓN UP: Aplica la migración (crea la tabla)
  // ========================================================================
  // Esta función se ejecuta cuando corremos: npx sequelize-cli db:migrate
  // 
  // Parámetros:
  // - queryInterface: Objeto que nos permite ejecutar comandos SQL
  //                   Es como nuestro "traductor" para hablar con PostgreSQL
  // - Sequelize: Librería que contiene los tipos de datos (INTEGER, STRING, etc.)
  // ========================================================================
  async up(queryInterface, Sequelize) {
    
    // queryInterface.createTable() crea una nueva tabla en la base de datos
    // Parámetro 1: Nombre de la tabla ('t_categorias')
    // Parámetro 2: Objeto con la definición de todas las columnas
    await queryInterface.createTable('t_categorias', {
      
      // ====================================================================
      // COLUMNA: id_categoria
      // ====================================================================
      // Esta será la LLAVE PRIMARIA (Primary Key)
      // 
      // ¿Qué es una llave primaria?
      // - Es el identificador ÚNICO de cada registro en la tabla
      // - No puede repetirse (cada categoría tiene su propio ID)
      // - No puede ser NULL (siempre debe tener un valor)
      // 
      // Analogía: Es como tu cédula o DNI - te identifica de forma única
      // ====================================================================
      id_categoria: {
        
        // type: Define el tipo de dato que se guardará
        // INTEGER = Número entero (1, 2, 3, 4, 5...)
        // ¿Por qué INTEGER? Porque los IDs son números secuenciales
        type: Sequelize.INTEGER,
        
        // primaryKey: Marca esta columna como la llave primaria
        // La base de datos creará un índice automático para búsquedas rápidas
        primaryKey: true,
        
        // autoIncrement: La base de datos aumenta el valor automáticamente
        // Si insertas una categoría, no necesitas darle ID, PostgreSQL lo asigna
        // Primera categoría = 1, segunda = 2, tercera = 3, etc.
        autoIncrement: true
      },
      
      // ====================================================================
      // COLUMNA: nombre
      // ====================================================================
      // Almacena el nombre de la categoría (ej: "Electrónica", "Ropa")
      // ====================================================================
      nombre: {
        
        // STRING(100) = Texto de máximo 100 caracteres
        // ¿Por qué 100? Es suficiente para nombres de categorías
        // Si alguien intenta guardar 101 caracteres, PostgreSQL dará error
        type: Sequelize.STRING(100),
        
        // allowNull: false = Este campo es OBLIGATORIO
        // No puedes crear una categoría sin nombre
        // Si intentas insertar sin nombre, PostgreSQL rechaza la operación
        allowNull: false,
        
        // unique: true = No pueden existir dos categorías con el mismo nombre
        // PostgreSQL crea un índice único para verificar esto automáticamente
        // Si intentas crear "Electrónica" dos veces, dará error
        unique: true
      },
      
      // ====================================================================
      // COLUMNA: descripcion
      // ====================================================================
      // Almacena una descripción detallada de la categoría (opcional)
      // Ej: "Productos electrónicos como computadoras, celulares, tablets"
      // ====================================================================
      descripcion: {
        
        // TEXT = Texto largo sin límite definido
        // ¿Diferencia con STRING? STRING tiene límite, TEXT no
        // Usa TEXT cuando no sabes qué tan largo será el contenido
        type: Sequelize.TEXT
        
        // Nota: No tiene allowNull: false, por lo tanto es OPCIONAL
        // Puedes crear una categoría sin descripción y no habrá problema
      },
      
      // ====================================================================
      // COLUMNA: fecha_creacion
      // ====================================================================
      // Registra automáticamente cuándo se creó esta categoría
      // Útil para auditoría: "¿Cuándo se agregó la categoría Juguetes?"
      // ====================================================================
      fecha_creacion: {
        
        // DATE = Fecha y hora completa
        // Formato: '2025-10-14 15:30:45'
        // Incluye año, mes, día, hora, minutos, segundos
        type: Sequelize.DATE,
        
        // defaultValue: Valor que se asigna automáticamente si no lo proporcionas
        // CURRENT_TIMESTAMP = Fecha y hora actual del servidor
        // 
        // ¿Cómo funciona?
        // Cuando insertas una categoría, PostgreSQL automáticamente
        // guarda la fecha/hora exacta de ese momento
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        
        // Sequelize.literal() le dice a Sequelize:
        // "Esto es SQL puro, pásalo directamente a PostgreSQL"
      }
    });
    
    // Mensaje opcional en consola para confirmar que la tabla se creó
    // Solo se muestra cuando ejecutas la migración
    console.log('✅ Tabla t_categorias creada exitosamente');
  },

  // ========================================================================
  // FUNCIÓN DOWN: Revierte la migración (elimina la tabla)
  // ========================================================================
  // Esta función se ejecuta cuando corremos: npx sequelize-cli db:migrate:undo
  // 
  // ¿Cuándo usar esto?
  // - Cometiste un error en la migración y quieres revertirla
  // - Estás haciendo pruebas y quieres "limpiar" la base de datos
  // 
  // ⚠️ PELIGRO: Esto ELIMINA la tabla y TODOS sus datos
  // Solo úsalo en desarrollo, NUNCA en producción con datos reales
  // ========================================================================
  async down(queryInterface, Sequelize) {
    
    // dropTable() elimina completamente la tabla de la base de datos
    // Es como "Ctrl+Z" (deshacer) para la migración
    await queryInterface.dropTable('t_categorias');
    
    // Mensaje de confirmación
    console.log('❌ Tabla t_categorias eliminada');
  }
};