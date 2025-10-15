'use strict';

// ========================================================================
// MIGRACIÓN: Crear Tabla t_productos
// ========================================================================
// Propósito: Esta es la TABLA PRINCIPAL que almacena los productos
//
// ¿Por qué es la última migración?
// - Tiene FOREIGN KEYS (llaves foráneas) que apuntan a otras tablas
// - Necesita que t_categorias y t_estados existan PRIMERO
// - Si intentamos crearla antes, PostgreSQL dará error
//
// Relaciones:
// - Cada producto pertenece a UNA categoría (relación Many-to-One)
// - Cada producto tiene UN estado (relación Many-to-One)
// ========================================================================

module.exports = {
  
  // ========================================================================
  // FUNCIÓN UP: Crea la tabla t_productos
  // ========================================================================
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('t_productos', {
      
      // ====================================================================
      // COLUMNA: id_producto (Llave Primaria)
      // ====================================================================
      // Identificador único de cada producto
      // ====================================================================
      id_producto: {
        
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      
      // ====================================================================
      // COLUMNA: nombre
      // ====================================================================
      // Nombre del producto (ej: "Laptop HP 15-dy2021la")
      // ====================================================================
      nombre: {
        
        // STRING(200): Hasta 200 caracteres
        // ¿Por qué 200? Nombres de productos pueden ser largos
        // "Samsung Galaxy S21 Ultra 5G 256GB Negro" = ~45 caracteres
        type: Sequelize.STRING(200),
        
        // Obligatorio: todo producto debe tener nombre
        allowNull: false
        
        // Nota: NO es unique
        // ¿Por qué? Puedes tener dos productos con el mismo nombre
        // pero diferentes características (color, tamaño, etc.)
      },
      
      // ====================================================================
      // COLUMNA: descripcion
      // ====================================================================
      // Descripción detallada del producto (opcional)
      // Ej: "Laptop con procesador Intel Core i5, 8GB RAM, SSD 256GB"
      // ====================================================================
      descripcion: {
        
        // TEXT: Para descripciones largas y detalladas
        type: Sequelize.TEXT
        
        // Campo opcional (puede ser NULL)
      },
      
      // ====================================================================
      // COLUMNA: precio
      // ====================================================================
      // Precio del producto en tu moneda local
      // ====================================================================
      precio: {
        
        // DECIMAL(10, 2):
        // - 10 = Total de dígitos (incluyendo decimales)
        // - 2 = Cantidad de decimales
        // 
        // Ejemplos válidos:
        // - 99.99          (4 dígitos, 2 decimales) ✅
        // - 12345.67       (7 dígitos, 2 decimales) ✅
        // - 12345678.90    (10 dígitos, 2 decimales) ✅
        // 
        // Ejemplos inválidos:
        // - 123456789.00   (11 dígitos) ❌
        // - 99.999         (3 decimales) ❌
        // 
        // ¿Por qué DECIMAL y no FLOAT?
        // - DECIMAL es exacto: 99.99 siempre es 99.99
        // - FLOAT puede tener errores de redondeo: 99.99 puede ser 99.989999...
        // - Para dinero SIEMPRE usa DECIMAL
        type: Sequelize.DECIMAL(10, 2),
        
        // Obligatorio: todo producto debe tener precio
        allowNull: false
        
        // Nota: Sequelize no valida aquí que sea positivo
        // Esa validación la haremos en el modelo o en el controlador
      },
      
      // ====================================================================
      // COLUMNA: stock
      // ====================================================================
      // Cantidad disponible en inventario
      // ====================================================================
      stock: {
        
        // INTEGER: Número entero (no puedes tener 5.5 productos)
        type: Sequelize.INTEGER,
        
        // Obligatorio: siempre debe tener un valor de stock
        allowNull: false,
        
        // defaultValue: 0
        // Si no especificas el stock al crear un producto, se asume 0
        // Esto significa "sin inventario" o "agotado"
        defaultValue: 0
        
        // Nota: La validación de que sea >= 0 se hará en el modelo
      },
      
      // ====================================================================
      // COLUMNA: id_categoria (FOREIGN KEY - Llave Foránea)
      // ====================================================================
      // Esta columna establece la RELACIÓN con la tabla t_categorias
      // 
      // ¿Qué es una Foreign Key?
      // - Es una columna que "apunta" a la llave primaria de otra tabla
      // - Crea una relación entre dos tablas
      // - Garantiza integridad referencial (no puedes tener IDs que no existen)
      // 
      // Ejemplo:
      // Si el producto "Laptop HP" tiene id_categoria = 3
      // Significa que pertenece a la categoría con id_categoria = 3 en t_categorias
      // (que podría ser "Electrónica")
      // ====================================================================
      id_categoria: {
        
        // INTEGER: Debe coincidir con el tipo de id_categoria en t_categorias
        type: Sequelize.INTEGER,
        
        // Obligatorio: todo producto DEBE tener una categoría
        allowNull: false,
        
        // references: Define la relación (Foreign Key)
        references: {
          
          // model: Nombre de la tabla a la que apunta
          // Esta columna "mira" hacia la tabla t_categorias
          model: 't_categorias',
          
          // key: Columna específica en la tabla referenciada
          // Apunta a la columna id_categoria de t_categorias
          key: 'id_categoria'
        },
        
        // onUpdate: CASCADE
        // ¿Qué significa CASCADE?
        // Si cambias el id_categoria en t_categorias (poco común),
        // PostgreSQL AUTOMÁTICAMENTE actualiza todos los productos
        // que tengan ese id_categoria
        // 
        // Ejemplo:
        // Si cambias id_categoria de 3 a 30 en t_categorias
        // Todos los productos con id_categoria = 3 se actualizan a 30
        onUpdate: 'CASCADE',
        
        // onDelete: RESTRICT
        // ¿Qué significa RESTRICT?
        // NO puedes eliminar una categoría si tiene productos asociados
        // PostgreSQL rechazará la operación y dará un error
        // 
        // Ejemplo:
        // Si intentas eliminar la categoría "Electrónica" (id=3)
        // pero hay 50 productos con id_categoria = 3
        // PostgreSQL dirá: "No puedo eliminarlo, tiene productos"
        // 
        // ¿Por qué RESTRICT y no CASCADE?
        // CASCADE eliminaría TODOS los productos de esa categoría (peligroso)
        // RESTRICT te obliga a mover los productos primero (más seguro)
        onDelete: 'RESTRICT'
      },
      
      // ====================================================================
      // COLUMNA: id_estado (FOREIGN KEY - Llave Foránea)
      // ====================================================================
      // Relación con t_estados
      // Indica si el producto está "Activo", "Inactivo", etc.
      // ====================================================================
      id_estado: {
        
        type: Sequelize.INTEGER,
        allowNull: false,
        
        // Apunta a la tabla t_estados
        references: {
          model: 't_estados',
          key: 'id_estado'
        },
        
        // Mismo comportamiento que id_categoria
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      
      // ====================================================================
      // COLUMNA: fecha_creacion
      // ====================================================================
      // Timestamp de cuándo se creó el producto en la base de datos
      // Útil para auditoría y reportes
      // ====================================================================
      fecha_creacion: {
        
        type: Sequelize.DATE,
        
        // CURRENT_TIMESTAMP: PostgreSQL automáticamente inserta
        // la fecha y hora actual cuando creas el producto
        // No necesitas proporcionar este valor manualmente
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      // ====================================================================
      // COLUMNA: fecha_actualizacion
      // ====================================================================
      // Timestamp de cuándo se actualizó el producto por última vez
      // 
      // Nota: En esta migración solo se establece al crear
      // Para que se actualice automáticamente necesitarás:
      // - Un trigger en PostgreSQL, O
      // - Actualizarlo manualmente en tu código (más común)
      // ====================================================================
      fecha_actualizacion: {
        
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        
        // En los controladores, cuando actualices un producto,
        // deberás actualizar esta columna manualmente
      }
    });
    
    console.log('✅ Tabla t_productos creada exitosamente');
  },

  // ========================================================================
  // FUNCIÓN DOWN: Elimina la tabla t_productos
  // ========================================================================
  // Nota: Como esta tabla tiene Foreign Keys, debe eliminarse ANTES
  // que t_categorias y t_estados (en orden inverso a la creación)
  // ========================================================================
  async down(queryInterface, Sequelize) {
    
    await queryInterface.dropTable('t_productos');
    console.log('❌ Tabla t_productos eliminadas');
  }
};