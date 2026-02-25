from flask import Blueprint, jsonify
from services.posts_service import get_post_by_id
from config.db import get_db_connection

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    db = get_db_connection()
    post = get_post_by_id(post_id, db)
    db.close()

    if not post:
        return jsonify({"error": "Post not found"}), 404

    return jsonify(post), 200