# WebService_REST

## 📊 **DIAGRAMA DE RELACIONES**
┌─────────────────┐
│  t_categorias   │
│─────────────────│
│ id_categoria PK │◄────┐
│ nombre          │     │
│ descripcion     │     │
│ fecha_creacion  │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │
│   t_estados     │     │
│─────────────────│     │
│ id_estado PK    │◄─┐  │
│ nombre          │  │  │
│ descripcion     │  │  │
└─────────────────┘  │  │
                     │  │
┌────────────────────┐│  │
│    t_productos     ││  │
│────────────────────││  │
│ id_producto PK     ││  │
│ nombre             ││  │
│ descripcion        ││  │
│ precio             ││  │
│ stock              ││  │
│ id_categoria FK    │├──┘
│ id_estado FK       │┘
│ fecha_creacion     │
│ fecha_actualizacion│
└────────────────────┘

PK = Primary Key (Llave Primaria)
FK = Foreign Key (Llave Foránea)
