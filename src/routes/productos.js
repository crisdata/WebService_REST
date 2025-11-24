// src/routes/productos.js
// ========================================================================
// ARCHIVO DE RUTAS PARA PRODUCTOS
// ========================================================================
// Este archivo define los endpoints (URLs) de la API relacionados con productos
// y los conecta con las funciones del controlador
//
// ¿Qué es una ruta?
// Es la combinación de:
// - Un MÉTODO HTTP (GET, POST, PUT, DELETE)
// - Una URL o path (/productos, /productos/:id)
// - Una función del controlador que maneja esa petición
//
// Ejemplo completo:
// GET /api/productos → router.get('/', obtenerTodos)
// ========================================================================

// ========================================================================
// IMPORTACIONES
// ========================================================================

// Importar Express
// Express es el framework que usamos para crear el servidor web
const express = require('express');

// ========================================================================
// CREAR UN ROUTER
// ========================================================================
// Router es como un "mini-aplicación" de Express
// Nos permite definir rutas de forma modular
// En lugar de poner todas las rutas en server.js, las agrupamos aquí
const router = express.Router();

// router es un objeto que tiene métodos:
// - router.get()    → Para peticiones GET
// - router.post()   → Para peticiones POST
// - router.put()    → Para peticiones PUT
// - router.delete() → Para peticiones DELETE

// ========================================================================
// IMPORTAR EL CONTROLADOR
// ========================================================================
// Importamos todas las funciones del controlador de productos
const productosController = require('../controllers/productosController');

// productosController es un objeto que contiene:
// {
//   crear: [Function],
//   obtenerTodos: [Function],
//   obtenerPorId: [Function],
//   actualizar: [Function],
//   eliminar: [Function]
// }

// ========================================================================
// DEFINICIÓN DE RUTAS
// ========================================================================
// Ahora conectamos cada endpoint con su función del controlador

// ========================================================================
// RUTA 1: CREAR UN NUEVO PRODUCTO
// ========================================================================
// Método: POST
// URL completa: POST http://localhost:3000/api/productos
// 
// ¿Qué hace?
// Recibe datos en el body (JSON) y crea un nuevo producto en la BD
//
// Ejemplo de petición:
// POST /api/productos
// Body: {
//   "nombre": "Mouse Logitech",
//   "descripcion": "Mouse inalámbrico",
//   "precio": 25.99,
//   "stock": 30,
//   "id_categoria": 1,
//   "id_estado": 1
// }
// ========================================================================
router.post('/', productosController.crear);

// EXPLICACIÓN LÍNEA POR LÍNEA:
// 
// router.post()
// └─ Método del router que define una ruta POST
//
// '/'
// └─ El path relativo (ruta)
//    Como este router se monta en /api/productos (en server.js),
//    '/' se convierte en /api/productos
//    Es como un path "base" + path "relativo"
//    /api/productos + / = /api/productos
//
// productosController.crear
// └─ La función que se ejecutará cuando alguien haga POST a esta URL
//    No ponemos () al final porque NO queremos ejecutarla ahora
//    Solo pasamos la referencia a la función
//    Express la ejecutará cuando llegue una petición

// ========================================================================
// RUTA 2: OBTENER TODOS LOS PRODUCTOS
// ========================================================================
// Método: GET
// URL completa: GET http://localhost:3000/api/productos
//
// ¿Qué hace?
// Devuelve un array con todos los productos de la base de datos
//
// Acepta query parameters opcionales para paginación:
// - limite: Cuántos productos mostrar por página
// - pagina: Qué página mostrar
//
// Ejemplos de uso:
// GET /api/productos
// → Devuelve TODOS los productos
//
// GET /api/productos?limite=10
// → Devuelve los primeros 10 productos
//
// GET /api/productos?limite=10&pagina=2
// → Devuelve los productos 11-20 (segunda página)
//
// GET /api/productos?limite=5&pagina=3
// → Devuelve los productos 11-15 (tercera página)
// ========================================================================
router.get('/', productosController.obtenerTodos);

// EXPLICACIÓN:
//
// router.get()
// └─ Define una ruta que responde a peticiones GET
//
// '/'
// └─ Path relativo que se convierte en /api/productos
//
// productosController.obtenerTodos
// └─ Función que maneja esta petición
//    Está en productosController.js
//    Lee los query params (limite, pagina) desde req.query
//    Hace una consulta a la BD con paginación
//    Devuelve los productos en formato JSON

// ========================================================================
// RUTA 3: OBTENER UN PRODUCTO POR SU ID
// ========================================================================
// Método: GET
// URL completa: GET http://localhost:3000/api/productos/:id
//
// ¿Qué hace?
// Busca y devuelve UN solo producto específico
//
// :id es un parámetro dinámico
// El : indica que es un parámetro variable
// Puede ser cualquier número
//
// Ejemplos de uso:
// GET /api/productos/1   → Busca el producto con id_producto = 1
// GET /api/productos/5   → Busca el producto con id_producto = 5
// GET /api/productos/999 → Busca el producto con id_producto = 999
//
// Si el producto no existe, devuelve error 404
// ========================================================================
router.get('/:id', productosController.obtenerPorId);

// EXPLICACIÓN:
//
// router.get()
// └─ Define una ruta GET
//
// '/:id'
// └─ Path con un parámetro dinámico
//    El : indica que 'id' es un parámetro variable
//    Express captura lo que venga en esa posición
//    
//    Si la petición es: GET /api/productos/7
//    Entonces: req.params = { id: '7' }
//    
//    El controlador puede acceder a ese valor con: req.params.id
//
// productosController.obtenerPorId
// └─ Función que:
//    1. Extrae el id de req.params
//    2. Busca el producto en la BD con findByPk(id)
//    3. Si existe, lo devuelve
//    4. Si no existe, devuelve error 404

// ========================================================================
// RUTA 4: ACTUALIZAR UN PRODUCTO
// ========================================================================
// Método: PUT
// URL completa: PUT http://localhost:3000/api/productos/:id
//
// ¿Qué hace?
// Actualiza uno o más campos de un producto existente
//
// PUT vs PATCH:
// - PUT: Se espera enviar TODOS los campos (actualización completa)
// - PATCH: Se envían solo los campos a cambiar (actualización parcial)
// 
// En este caso usamos PUT pero lo manejamos como PATCH
// (solo actualizamos los campos enviados)
//
// Ejemplo de petición:
// PUT /api/productos/5
// Body: {
//   "precio": 850.00,
//   "stock": 25
// }
// → Actualiza solo el precio y stock del producto 5
//   Los demás campos quedan sin cambios
// ========================================================================
router.put('/:id', productosController.actualizar);

// EXPLICACIÓN:
//
// router.put()
// └─ Define una ruta que responde a peticiones PUT
//    PUT se usa tradicionalmente para actualizaciones
//
// '/:id'
// └─ El ID del producto a actualizar
//    Ejemplo: PUT /api/productos/3
//    req.params = { id: '3' }
//
// productosController.actualizar
// └─ Función que:
//    1. Obtiene el id de req.params
//    2. Obtiene los nuevos valores de req.body
//    3. Busca el producto en la BD
//    4. Valida que exista
//    5. Si se envió nueva categoría/estado, valida que existan
//    6. Actualiza solo los campos enviados
//    7. Devuelve el producto actualizado con sus relaciones

// ========================================================================
// RUTA 5: ELIMINAR UN PRODUCTO
// ========================================================================
// Método: DELETE
// URL completa: DELETE http://localhost:3000/api/productos/:id
//
// ¿Qué hace?
// Elimina permanentemente un producto de la base de datos
//
// ⚠️ IMPORTANTE: Esta es una eliminación FÍSICA (hard delete)
// El producto se borra completamente de la tabla
// No se puede recuperar (a menos que tengas backups)
//
// Si quisieras eliminación lógica (soft delete):
// - No borrarías el registro
// - Agregarías un campo "activo" o "eliminado_en"
// - Solo lo marcarías como inactivo
//
// Ejemplo de petición:
// DELETE /api/productos/8
// → Elimina el producto con id_producto = 8
// ========================================================================
router.delete('/:id', productosController.eliminar);

// EXPLICACIÓN:
//
// router.delete()
// └─ Define una ruta que responde a peticiones DELETE
//    DELETE se usa para eliminar recursos
//
// '/:id'
// └─ El ID del producto a eliminar
//    Ejemplo: DELETE /api/productos/10
//    req.params = { id: '10' }
//
// productosController.eliminar
// └─ Función que:
//    1. Obtiene el id de req.params
//    2. Busca el producto en la BD
//    3. Valida que exista (si no, error 404)
//    4. Llama a producto.destroy() para eliminarlo
//    5. Devuelve confirmación de eliminación

// ========================================================================
// ORDEN DE LAS RUTAS: ¿IMPORTA?
// ========================================================================
// ¡SÍ! Express evalúa las rutas en el orden que las defines
//
// ❌ INCORRECTO:
// router.get('/:id', ...)   → Definida primero
// router.get('/activos', ...) → Definida después
//
// Problema: Si haces GET /api/productos/activos
// Express matchea con '/:id' primero
// Piensa que "activos" es un ID
//
// ✅ CORRECTO:
// router.get('/activos', ...) → Rutas específicas primero
// router.get('/:id', ...)     → Rutas dinámicas después
//
// En nuestro caso el orden actual está bien porque todas las rutas
// con parámetros dinámicos (:id) están al final

// ========================================================================
// RESUMEN DE RUTAS DEFINIDAS
// ========================================================================
// POST   /api/productos         → Crear producto
// GET    /api/productos         → Obtener todos los productos
// GET    /api/productos/:id     → Obtener un producto específico
// PUT    /api/productos/:id     → Actualizar un producto
// DELETE /api/productos/:id     → Eliminar un producto

// ========================================================================
// EXPORTAR EL ROUTER
// ========================================================================
// module.exports hace que este router esté disponible para otros archivos
// En server.js lo importamos y lo "montamos" en un path base
module.exports = router;

// ========================================================================
// ¿CÓMO SE CONECTA TODO?
// ========================================================================
// 
// 1. En server.js:
//    const productosRoutes = require('./routes/productos');
//    app.use('/api/productos', productosRoutes);
//
// 2. Esto "monta" todas las rutas de este archivo bajo /api/productos
//
// 3. Ejemplo completo del flujo:
//
//    Cliente hace: POST http://localhost:3000/api/productos
//    
//    ↓
//    
//    Express recibe la petición
//    
//    ↓
//    
//    Busca en las rutas montadas en app.use()
//    Encuentra: app.use('/api/productos', productosRoutes)
//    
//    ↓
//    
//    Entra al router de productos (este archivo)
//    Busca: router.post('/', ...)
//    
//    ↓
//    
//    Ejecuta: productosController.crear(req, res)
//    
//    ↓
//    
//    El controlador procesa la petición
//    
//    ↓
//    
//    Devuelve respuesta JSON al cliente