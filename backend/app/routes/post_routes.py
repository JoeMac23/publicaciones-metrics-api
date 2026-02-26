from flask import Blueprint, request, jsonify
from app.services.metrics_service import get_post_analysis
from app.services.metrics_service import get_metrics_history_by_post
from app.services.post_service import (
    create_post,
    get_all_posts,
    get_post_by_id,
    update_post,
    delete_post
)

post_bp = Blueprint("posts", __name__)


# ======================
# CREATE
# ======================
@post_bp.route("/posts", methods=["POST"])
def create():
    data = request.get_json()

    user_id = data.get("user_id")
    content = data.get("content")
    platform = data.get("platform")

    if not all([user_id, content, platform]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    create_post(user_id, content, platform)
    return jsonify({"message": "Post creado correctamente"}), 201


# ======================
# READ ALL
# ======================
@post_bp.route("/posts", methods=["GET"])
def get_all():
    posts = get_all_posts()
    return jsonify(posts), 200


# ======================
# READ ONE
# ======================
@post_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_one(post_id):
    post = get_post_by_id(post_id)

    if not post:
        return jsonify({"error": "Post no encontrado"}), 404

    return jsonify(post), 200


# ======================
# UPDATE
# ======================
@post_bp.route("/posts/<int:post_id>", methods=["PUT"])
def update(post_id):
    data = request.get_json()
    content = data.get("content")
    platform = data.get("platform")

    if not all([content, platform]):
        return jsonify({"error": "Faltan campos"}), 400

    post = get_post_by_id(post_id)
    if not post:
        return jsonify({"error": "Post no encontrado"}), 404

    update_post(post_id, content, platform)
    return jsonify({"message": "Post actualizado correctamente"}), 200


# ======================
# DELETE
# ======================
@post_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def delete(post_id):
    post = get_post_by_id(post_id)
    if not post:
        return jsonify({"error": "Post no encontrado"}), 404

    delete_post(post_id)
    return jsonify({"message": "Post eliminado correctamente"}), 200

@post_bp.route("/posts/<int:post_id>/analysis", methods=["GET"])
def analysis(post_id):
    try:
        result = get_post_analysis(post_id)

        if not result:
            return jsonify({"error": "Post no encontrado"}), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@post_bp.route("/posts/<int:post_id>/metrics/history", methods=["GET"])
def metrics_history(post_id):
    try:
        post = get_post_by_id(post_id)
        if not post:
            return jsonify({"error": "Post no encontrado"}), 404

        history = get_metrics_history_by_post(post_id)

        return jsonify({
            "post_id": post_id,
            "history": history
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500