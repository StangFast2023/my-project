// lib/db.js
import mysql from 'mysql2/promise';

// ตรวจสอบว่ามีคำว่า export const db อยู่หน้าการสร้าง connection
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exam_system' 
});

export default db;