'use strict';

// ========================================================================
// MIGRACIÓN: Crear Tabla t_estados
// ========================================================================
// Propósito: Esta migración crea la tabla que almacenará los posibles
//            estados de un producto (ej: Activo, Inactivo, Agotado)
//
// ¿Por qué una tabla separada para estados?
// - Normalización de base de datos: evita repetir texto
// - En lugar de guardar "Activo" 1000 veces, guardamos el ID: 1
// - Facilita cambiar el nombre del estado en un solo lugar
// - Permite agregar nuevos estados sin modificar la tabla de productos
// ========================================================================

module.exports = {
  
  // ========================================================================
  // FUNCIÓN UP: Crea la tabla t_estados
  // ========================================================================
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('t_estados', {
      
      // ====================================================================
      // COLUMNA: id_estado (Llave Primaria)
      // ====================================================================
      // Identificador único de cada estado
      // Estado "Activo" = 1, "Inactivo" = 2, "Agotado" = 3, etc.
      // ====================================================================
      id_estado: {
        
        // INTEGER: Número entero para el ID
        type: Sequelize.INTEGER,
        
        // Es la llave primaria de esta tabla
        // Cada estado tiene un ID único que no se repite
        primaryKey: true,
        
        // Se incrementa automáticamente: 1, 2, 3, 4...
        // No necesitas especificar el ID al crear un estado
        autoIncrement: true
      },
      
      // ====================================================================
      // COLUMNA: nombre
      // ====================================================================
      // El nombre del estado (ej: "Activo", "Inactivo", "Agotado")
      // ====================================================================
      nombre: {
        
        // STRING(50): Texto de máximo 50 caracteres
        // ¿Por qué 50? Los nombres de estados son cortos
        // "Activo" = 6 caracteres, suficiente espacio
        type: Sequelize.STRING(50),
        
        // Campo obligatorio: no puede ser NULL
        // Todo estado debe tener un nombre
        allowNull: false,
        
        // Debe ser único: no pueden existir dos estados llamados "Activo"
        // PostgreSQL lo verifica automáticamente
        unique: true
      },
      
      // ====================================================================
      // COLUMNA: descripcion
      // ====================================================================
      // Explicación detallada del estado (opcional)
      // Ej: "Productos que están disponibles para la venta"
      // ====================================================================
      descripcion: {
        
        // TEXT: Texto largo sin límite específico
        type: Sequelize.TEXT
        
        // Este campo es OPCIONAL (no tiene allowNull: false)
        // Puedes crear un estado sin descripción
      }
    });
    
    console.log('✅ Tabla t_estados creada exitosamente');
  },

  // ========================================================================
  // FUNCIÓN DOWN: Elimina la tabla t_estados
  // ========================================================================
  async down(queryInterface, Sequelize) {
    
    await queryInterface.dropTable('t_estados');
    console.log('❌ Tabla t_estados eliminada');
  }
};