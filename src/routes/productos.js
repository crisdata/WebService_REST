// src/routes/productos.js
// ========================================================================
// RUTAS DE PRODUCTOS
// ========================================================================
// Este archivo define todas las rutas (endpoints) relacionadas con productos
//
// ¿Qué es una ruta?
// Es la definición de una URL y qué función se ejecuta cuando alguien
// accede a esa URL
//
// Estructura: MÉTODO + RUTA → CONTROLADOR
// Ejemplo: GET /productos → obtenerTodos()
// ========================================================================

const express = require('express');
const router = express.Router();

// Importar el controlador con todas las funciones
const productosController = require('../controllers/productosController');

// ========================================================================
// DEFINICIÓN DE RUTAS
// ========================================================================

// ========================================================================
// POST /api/productos - Crear un nuevo producto
// ========================================================================
// Body (JSON):
// {
//   "nombre": "Laptop HP",
//   "descripcion": "Laptop con Intel Core i5",
//   "precio": 799.99,
//   "stock": 15,
//   "id_categoria": 1,
//   "id_estado": 1
// }
router.post('/', productosController.crear);

// ========================================================================
// GET /api/productos - Obtener todos los productos
// ========================================================================
// Query params opcionales:
// - ?limite=10 (cuántos productos por página)
// - &pagina=2 (qué página mostrar)
// 
// Ejemplos:
// GET /api/productos → Todos los productos
// GET /api/productos?limite=5 → Primeros 5 productos
// GET /api/productos?limite=10&pagina=2 → Productos 11-20
router.get('/', productosController.obtenerTodos);

// ========================================================================
// GET /api/productos/:id - Obtener un producto específico
// ========================================================================
// Params:
// - :id → ID del producto (número)
//
// Ejemplo:
// GET /api/productos/5 → Producto con id_producto = 5
router.get('/:id', productosController.obtenerPorId);

// ========================================================================
// PUT /api/productos/:id - Actualizar un producto
// ========================================================================
// Params:
// - :id → ID del producto a actualizar
//
// Body (JSON) - solo los campos que quieres actualizar:
// {
//   "precio": 850.00,
//   "stock": 20
// }
router.put('/:id', productosController.actualizar);

// ========================================================================
// DELETE /api/productos/:id - Eliminar un producto
// ========================================================================
// Params:
// - :id → ID del producto a eliminar
//
// Ejemplo:
// DELETE /api/productos/5 → Elimina el producto con id 5
router.delete('/:id', productosController.eliminar);

// ========================================================================
// EXPORTAR EL ROUTER
// ========================================================================
// Este router se importará en server.js y se montará en /api/productos
module.exports = router;