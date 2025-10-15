// src/controllers/productosController.js
// ========================================================================
// CONTROLADOR DE PRODUCTOS
// ========================================================================
// Un controlador es un conjunto de funciones que manejan la lógica de negocio
// Cada función corresponde a un endpoint de la API
// Los controladores son el "cerebro" que procesa las peticiones
// ========================================================================

// ========================================================================
// IMPORTACIÓN DE MODELOS
// ========================================================================
// Importamos los modelos que representan las tablas de la base de datos
// Estos modelos nos permiten interactuar con PostgreSQL sin escribir SQL
const { Producto, Categoria, Estado } = require('../models');

// Usamos destructuring para extraer solo los modelos que necesitamos:
// - Producto: Representa la tabla t_productos
// - Categoria: Representa la tabla t_categorias
// - Estado: Representa la tabla t_estados

// ========================================================================
// FUNCIÓN 1: CREAR UN NUEVO PRODUCTO
// ========================================================================
// Esta función maneja las peticiones POST a /api/productos
// Recibe datos del cliente y crea un nuevo producto en la base de datos
// ========================================================================
const crear = async (req, res) => {
  // async: Marca la función como asíncrona
  // Esto nos permite usar 'await' para esperar operaciones de base de datos
  
  // req (request): Objeto que contiene la información de la petición
  // - req.body: Los datos enviados en el cuerpo de la petición (JSON)
  // - req.params: Parámetros de la URL (ej: /productos/:id)
  // - req.query: Query strings (ej: /productos?limite=10)
  
  // res (response): Objeto que usamos para enviar la respuesta al cliente
  // - res.status(200): Código de estado HTTP
  // - res.json(): Enviar respuesta en formato JSON
  
  try {
    // try-catch: Bloque para manejar errores
    // Si algo falla dentro del try, salta al catch
    
    // ====================================================================
    // EXTRAER DATOS DEL CUERPO DE LA PETICIÓN
    // ====================================================================
    // Usamos destructuring para extraer los campos del req.body
    // Si el cliente envía: { "nombre": "Laptop", "precio": 799 }
    // Entonces: nombre = "Laptop", precio = 799
    const { nombre, descripcion, precio, stock, id_categoria, id_estado } = req.body;
    
    // ====================================================================
    // VALIDACIÓN 1: Verificar que se enviaron todos los campos obligatorios
    // ====================================================================
    // El operador ! convierte un valor a booleano y lo niega
    // !nombre es true si nombre es: undefined, null, "", 0, false
    if (!nombre || !precio || !id_categoria || !id_estado) {
      // Si falta algún campo obligatorio, respondemos con error
      
      // return: Detiene la ejecución de la función aquí
      // No continúa con el código de abajo
      return res.status(400).json({
        // status(400): Código HTTP "Bad Request" (petición incorrecta)
        
        // json(): Envía la respuesta en formato JSON
        error: 'Faltan campos obligatorios',
        campos_requeridos: ['nombre', 'precio', 'id_categoria', 'id_estado']
      });
      // Después del return, la función termina aquí
    }
    
    // ====================================================================
    // VALIDACIÓN 2: Verificar que la categoría existe en la BD
    // ====================================================================
    // findByPk: "Find By Primary Key" (buscar por llave primaria)
    // await: Espera a que la consulta a la BD termine antes de continuar
    const categoriaExiste = await Categoria.findByPk(id_categoria);
    
    // Si no encuentra la categoría, categoriaExiste será null
    if (!categoriaExiste) {
      // Respondemos con código 404: "Not Found" (no encontrado)
      return res.status(404).json({
        error: 'Categoría no encontrada',
        mensaje: `No existe una categoría con id: ${id_categoria}`
        // Template literals (${}) permiten insertar variables en strings
      });
    }
    
    // ====================================================================
    // VALIDACIÓN 3: Verificar que el estado existe en la BD
    // ====================================================================
    const estadoExiste = await Estado.findByPk(id_estado);
    
    if (!estadoExiste) {
      return res.status(404).json({
        error: 'Estado no encontrado',
        mensaje: `No existe un estado con id: ${id_estado}`
      });
    }
    
    // ====================================================================
    // CREAR EL PRODUCTO EN LA BASE DE DATOS
    // ====================================================================
    // Si llegamos aquí, todas las validaciones pasaron
    
    // Producto.create(): Método de Sequelize que inserta un registro
    // Equivale en SQL a: INSERT INTO t_productos (nombre, precio, ...) VALUES (...)
    const nuevoProducto = await Producto.create({
      // Creamos un objeto con los datos del nuevo producto
      
      nombre,  // Equivale a: nombre: nombre (ES6 shorthand)
      descripcion,
      precio,
      
      // stock || 0: Operador OR lógico
      // Si stock es undefined/null/0/"", usa 0 como valor predeterminado
      stock: stock || 0,
      
      id_categoria,
      id_estado
      
      // No necesitamos poner id_producto porque es autoincrement
      // No necesitamos poner fecha_creacion porque tiene DEFAULT
    });
    
    // await hace que esperemos a que se guarde en la BD
    // nuevoProducto contendrá el objeto con todos los datos, incluyendo el ID generado
    
    // ====================================================================
    // ENVIAR RESPUESTA EXITOSA AL CLIENTE
    // ====================================================================
    // status(201): Código HTTP "Created" (recurso creado exitosamente)
    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto  // Incluimos el producto creado en la respuesta
    });
    
  } catch (error) {
    // ====================================================================
    // BLOQUE CATCH: Se ejecuta si ocurre cualquier error en el try
    // ====================================================================
    
    // Imprimimos el error en la consola del servidor (para depuración)
    console.error('Error al crear producto:', error);
    
    // ====================================================================
    // MANEJO ESPECÍFICO DE ERRORES DE VALIDACIÓN DE SEQUELIZE
    // ====================================================================
    // error.name: Sequelize asigna nombres específicos a sus errores
    if (error.name === 'SequelizeValidationError') {
      // Este error ocurre si las validaciones del modelo fallan
      // Ejemplo: precio negativo, nombre muy corto, etc.
      
      return res.status(400).json({
        error: 'Error de validación',
        
        // error.errors es un array con todos los errores de validación
        // Usamos .map() para extraer solo los mensajes
        detalles: error.errors.map(e => e.message)
        // map(): Transforma cada elemento del array
        // (e => e.message): Arrow function que retorna el mensaje de cada error
      });
    }
    
    // ====================================================================
    // ERROR GENÉRICO (si no es de validación)
    // ====================================================================
    // status(500): "Internal Server Error" (error del servidor)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al crear el producto'
    });
  }
};

// ========================================================================
// FUNCIÓN 2: OBTENER TODOS LOS PRODUCTOS (CON PAGINACIÓN)
// ========================================================================
// Esta función maneja GET /api/productos
// Puede recibir parámetros opcionales: ?limite=10&pagina=2
// ========================================================================
const obtenerTodos = async (req, res) => {
  try {
    // ====================================================================
    // EXTRAER PARÁMETROS DE QUERY STRING
    // ====================================================================
    // req.query contiene los parámetros después del ? en la URL
    // Ejemplo: /productos?limite=10&pagina=2
    // req.query = { limite: '10', pagina: '2' }
    
    // parseInt(): Convierte un string a número entero
    // parseInt('10') → 10 (número)
    // || null: Si no existe el parámetro, usa null como valor por defecto
    const limite = parseInt(req.query.limite) || null;
    const pagina = parseInt(req.query.pagina) || 1;
    
    // Ejemplo:
    // Si la URL es: /productos (sin parámetros)
    // limite = null, pagina = 1
    
    // Si la URL es: /productos?limite=10&pagina=3
    // limite = 10, pagina = 3
    
    // ====================================================================
    // CONFIGURAR OPCIONES DE CONSULTA
    // ====================================================================
    // Creamos un objeto con las opciones que le pasaremos a Sequelize
    const opciones = {
      
      // ==================================================================
      // include: Traer datos de tablas relacionadas (JOIN)
      // ==================================================================
      // Sin include, solo obtendríamos los datos de t_productos
      // Con include, también traemos datos de t_categorias y t_estados
      include: [
        {
          // model: Qué modelo (tabla) queremos incluir
          model: Categoria,
          
          // as: El alias que definimos en models/index.js
          // Permite acceder: producto.categoria (en lugar de producto.Categoria)
          as: 'categoria',
          
          // attributes: Qué columnas queremos traer de esta tabla
          // Si no ponemos attributes, trae TODAS las columnas
          attributes: ['id_categoria', 'nombre']
          // Solo traemos id y nombre, no la descripción ni fecha_creacion
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id_estado', 'nombre']
        }
      ],
      
      // ==================================================================
      // order: Ordenar los resultados
      // ==================================================================
      // Es un array de arrays: [[campo, dirección]]
      order: [['fecha_creacion', 'DESC']],
      // DESC: Descendente (más reciente primero)
      // ASC: Ascendente (más antiguo primero)
      
      // Equivale en SQL a: ORDER BY fecha_creacion DESC
      
      // ==================================================================
      // attributes: Qué columnas traer de la tabla principal (productos)
      // ==================================================================
      attributes: { exclude: [] }
      // exclude: []: Array vacío = no excluir nada = traer todo
      // Si quisieras excluir algo: exclude: ['descripcion']
    };
    
    // ====================================================================
    // APLICAR PAGINACIÓN (si se especificó un límite)
    // ====================================================================
    if (limite) {
      // Solo aplicamos paginación si el cliente envió el parámetro 'limite'
      
      // limit: Cuántos registros traer (equivale a SQL: LIMIT)
      opciones.limit = limite;
      
      // offset: Desde qué registro empezar (equivale a SQL: OFFSET)
      // Fórmula: (página - 1) × límite
      // 
      // Ejemplos:
      // Página 1, límite 10: offset = (1-1)×10 = 0 (empieza en 0)
      // Página 2, límite 10: offset = (2-1)×10 = 10 (empieza en 10)
      // Página 3, límite 10: offset = (3-1)×10 = 20 (empieza en 20)
      opciones.offset = (pagina - 1) * limite;
    }
    
    // ====================================================================
    // EJECUTAR LA CONSULTA A LA BASE DE DATOS
    // ====================================================================
    // findAndCountAll(): Hace dos cosas:
    // 1. Cuenta cuántos registros hay en total (count)
    // 2. Trae los registros de la página actual (rows)
    const { count, rows } = await Producto.findAndCountAll(opciones);
    
    // Usamos destructuring para extraer count y rows del resultado
    // count: Número total de productos (ejemplo: 50)
    // rows: Array con los productos de esta página (ejemplo: 10 productos)
    
    // ====================================================================
    // PREPARAR LA RESPUESTA CON METADATOS DE PAGINACIÓN
    // ====================================================================
    const respuesta = {
      // Total de productos en la base de datos
      total: count,
      
      // Página actual que estamos mostrando
      pagina_actual: pagina,
      
      // Total de páginas disponibles
      // Math.ceil(): Redondea hacia arriba
      // Ejemplo: 23 productos ÷ 10 por página = 2.3 → 3 páginas
      total_paginas: limite ? Math.ceil(count / limite) : 1,
      
      // Cuántos productos hay en esta página
      productos_por_pagina: limite || count,
      
      // Array con los productos
      productos: rows
    };
    
    // ====================================================================
    // ENVIAR RESPUESTA AL CLIENTE
    // ====================================================================
    // status(200): "OK" (petición exitosa)
    res.status(200).json(respuesta);
    
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al obtener los productos'
    });
  }
};

// ========================================================================
// FUNCIÓN 3: OBTENER UN PRODUCTO POR ID
// ========================================================================
// Esta función maneja GET /api/productos/:id
// El :id es un parámetro dinámico en la URL
// ========================================================================
const obtenerPorId = async (req, res) => {
  try {
    // ====================================================================
    // EXTRAER EL ID DE LOS PARÁMETROS DE LA URL
    // ====================================================================
    // req.params contiene los parámetros de la ruta
    // Si la URL es: /api/productos/5
    // Entonces: req.params = { id: '5' }
    const { id } = req.params;
    // Usamos destructuring para extraer el id
    
    // ====================================================================
    // BUSCAR EL PRODUCTO EN LA BASE DE DATOS
    // ====================================================================
    // findByPk(): "Find By Primary Key" (buscar por llave primaria)
    const producto = await Producto.findByPk(id, {
      // Segundo parámetro: opciones de la consulta
      
      // Incluir datos relacionados (categoría y estado)
      include: [
        {
          model: Categoria,
          as: 'categoria',
          
          // En este caso traemos más campos que en obtenerTodos
          // porque es solo 1 producto, no hay problema de rendimiento
          attributes: ['id_categoria', 'nombre', 'descripcion']
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id_estado', 'nombre', 'descripcion']
        }
      ]
    });
    
    // Si no encuentra el producto, findByPk retorna null
    
    // ====================================================================
    // VALIDAR SI EL PRODUCTO EXISTE
    // ====================================================================
    if (!producto) {
      // Si producto es null, significa que no existe en la BD
      
      // status(404): "Not Found" (recurso no encontrado)
      return res.status(404).json({
        error: 'Producto no encontrado',
        mensaje: `No existe un producto con id: ${id}`
      });
    }
    
    // ====================================================================
    // RESPUESTA EXITOSA
    // ====================================================================
    res.status(200).json({
      producto  // Shorthand de: producto: producto
    });
    
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al obtener el producto'
    });
  }
};

// ========================================================================
// FUNCIÓN 4: ACTUALIZAR UN PRODUCTO
// ========================================================================
// Esta función maneja PUT /api/productos/:id
// Actualiza uno o más campos de un producto existente
// ========================================================================
const actualizar = async (req, res) => {
  try {
    // ====================================================================
    // EXTRAER ID Y DATOS A ACTUALIZAR
    // ====================================================================
    // ID desde los parámetros de la URL
    const { id } = req.params;
    
    // Nuevos datos desde el body de la petición
    const { nombre, descripcion, precio, stock, id_categoria, id_estado } = req.body;
    
    // ====================================================================
    // BUSCAR EL PRODUCTO QUE VAMOS A ACTUALIZAR
    // ====================================================================
    const producto = await Producto.findByPk(id);
    
    // ====================================================================
    // VALIDAR QUE EL PRODUCTO EXISTE
    // ====================================================================
    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        mensaje: `No existe un producto con id: ${id}`
      });
    }
    
    // ====================================================================
    // VALIDAR NUEVA CATEGORÍA (si se envió)
    // ====================================================================
    // Solo validamos si el cliente envió una nueva categoría
    if (id_categoria) {
      const categoriaExiste = await Categoria.findByPk(id_categoria);
      if (!categoriaExiste) {
        return res.status(404).json({
          error: 'Categoría no encontrada',
          mensaje: `No existe una categoría con id: ${id_categoria}`
        });
      }
    }
    
    // ====================================================================
    // VALIDAR NUEVO ESTADO (si se envió)
    // ====================================================================
    if (id_estado) {
      const estadoExiste = await Estado.findByPk(id_estado);
      if (!estadoExiste) {
        return res.status(404).json({
          error: 'Estado no encontrado',
          mensaje: `No existe un estado con id: ${id_estado}`
        });
      }
    }
    
    // ====================================================================
    // ACTUALIZAR EL PRODUCTO
    // ====================================================================
    // producto.update(): Método que actualiza el producto en la BD
    await producto.update({
      // Solo actualizamos los campos que el cliente envió
      
      // Operador ||: Si nombre fue enviado, úsalo; si no, mantén el actual
      nombre: nombre || producto.nombre,
      
      // !== undefined: Verificamos si se envió (incluso si es null o "")
      // Esto permite borrar la descripción enviando ""
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      // Operador ternario: condición ? valor_si_true : valor_si_false
      
      precio: precio || producto.precio,
      
      // Para stock usamos !== undefined porque 0 es un valor válido
      // Si usáramos ||, stock = 0 se interpretaría como falso
      stock: stock !== undefined ? stock : producto.stock,
      
      id_categoria: id_categoria || producto.id_categoria,
      id_estado: id_estado || producto.id_estado,
      
      // Actualizamos manualmente el timestamp
      fecha_actualizacion: new Date()
      // new Date(): Crea un objeto con la fecha/hora actual
    });
    
    // ====================================================================
    // OBTENER EL PRODUCTO ACTUALIZADO CON SUS RELACIONES
    // ====================================================================
    // Volvemos a buscar el producto para incluir categoria y estado
    const productoActualizado = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    // ====================================================================
    // RESPUESTA EXITOSA
    // ====================================================================
    res.status(200).json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
    
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    
    // Manejo de errores de validación
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        detalles: error.errors.map(e => e.message)
      });
    }
    
    // Error genérico
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al actualizar el producto'
    });
  }
};

// ========================================================================
// FUNCIÓN 5: ELIMINAR UN PRODUCTO
// ========================================================================
// Esta función maneja DELETE /api/productos/:id
// Elimina permanentemente un producto de la base de datos
// ========================================================================
const eliminar = async (req, res) => {
  try {
    // ====================================================================
    // EXTRAER EL ID DEL PRODUCTO A ELIMINAR
    // ====================================================================
    const { id } = req.params;
    
    // ====================================================================
    // BUSCAR EL PRODUCTO
    // ====================================================================
    const producto = await Producto.findByPk(id);
    
    // ====================================================================
    // VALIDAR QUE EXISTE
    // ====================================================================
    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        mensaje: `No existe un producto con id: ${id}`
      });
    }
    
    // ====================================================================
    // ELIMINAR EL PRODUCTO DE LA BASE DE DATOS
    // ====================================================================
    // producto.destroy(): Elimina el registro
    // Equivale en SQL a: DELETE FROM t_productos WHERE id_producto = id
    await producto.destroy();
    
    // NOTA: Esta eliminación es PERMANENTE
    // Si quisieras eliminación lógica (soft delete), usarías paranoid: true
    
    // ====================================================================
    // RESPUESTA EXITOSA
    // ====================================================================
    res.status(200).json({
      mensaje: 'Producto eliminado exitosamente',
      
      // Incluimos info del producto eliminado (útil para confirmación)
      producto_eliminado: {
        id: producto.id_producto,
        nombre: producto.nombre
      }
    });
    
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al eliminar el producto'
    });
  }
};

// ========================================================================
// EXPORTAR TODAS LAS FUNCIONES DEL CONTROLADOR
// ========================================================================
// module.exports: Hace que estas funciones estén disponibles para otros archivos
// Usamos un objeto para exportar múltiples funciones a la vez
module.exports = {
  crear,           // función para POST
  obtenerTodos,    // función para GET todos
  obtenerPorId,    // función para GET uno
  actualizar,      // función para PUT
  eliminar         // función para DELETE
};
