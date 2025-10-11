// src/lib/db.ts
import mysql from 'mysql2/promise';

// Oculta tus credenciales en variables de entorno en un proyecto real
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario
    password: '', // Cambia esto por tu contraseña
    database: 'control_plus_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
