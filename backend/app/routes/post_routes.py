from flask import Blueprint, request, jsonify
from app.config.db import get_connection

post_bp = Blueprint("posts", __name__)

@post_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.get_json()

    user_id = data.get("user_id")
    content = data.get("content")
    platform = data.get("platform")

    if not all([user_id, content, platform]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO posts (user_id, content, platform)
                VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (user_id, content, platform))
            conn.commit()

        conn.close()
        return jsonify({"message": "Post creado correctamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@post_bp.route("/posts", methods=["GET"])
def get_posts():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = "SELECT * FROM posts"
            cursor.execute(sql)
            posts = cursor.fetchall()

        conn.close()
        return jsonify(posts), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500