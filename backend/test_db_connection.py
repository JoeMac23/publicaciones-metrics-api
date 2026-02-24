from app.config.db import get_connection
import pymysql

try:
    conn = get_connection()
    print("✅ Conexión exitosa a MySQL")
    conn.close()
except pymysql.MySQLError as e:
    print("❌ Error al conectar a MySQL:", e)