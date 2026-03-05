from flask import Blueprint, request, jsonify
from app.services.metrics_service import (
    create_metric,
    get_metrics_by_post,
    get_all_metrics
)

metrics_bp = Blueprint("metrics", __name__)

# ======================
# CREATE metrics
# ======================
@metrics_bp.route("/metrics", methods=["POST"])
def create():
    data = request.get_json()

    post_id = data.get("post_id")
    likes = data.get("likes")
    comments = data.get("comments")
    shares = data.get("shares")

    if not all([post_id, likes, comments, shares]):
        return jsonify({
            "success": False,
            "error": "Faltan campos obligatorios",
            "data": None
        }), 400

    # VALIDACIÓN DE TIPOS
    if not isinstance(post_id, int):
        return jsonify({
            "success": False,
            "error": "post_id debe ser un entero",
            "data": None
        }), 400

    for field_name, value in {
        "likes": likes,
        "comments": comments,
        "shares": shares
    }.items():

        if not isinstance(value, int):
            return jsonify({
                "success": False,
                "error": f"{field_name} debe ser un entero",
                "data": None
            }), 400

        if value < 0:
            return jsonify({
                "success": False,
                "error": f"{field_name} no puede ser negativo",
                "data": None
            }), 400

    try:
        create_metric(post_id, likes, comments, shares)

        return jsonify({
            "success": True,
            "error": None,
            "data": "Métricas creadas correctamente"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "data": None
        }), 500

# ======================
# GET all metrics
# ======================
@metrics_bp.route("/metrics", methods=["GET"])
def get_all():
    try:
        metrics = get_all_metrics()

        return jsonify({
            "success": True,
            "data": metrics,
            "error": None
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "data": None,
            "error": str(e)
        }), 500


# ======================
# GET metrics by post_id
# ======================
@metrics_bp.route("/metrics/<int:post_id>", methods=["GET"])
def get_by_post(post_id):
    try:
        metrics = get_metrics_by_post(post_id)

        if not metrics:
            return jsonify({
                "success": False,
                "data": None,
                "error": "No hay métricas para este post"
            }), 404

        return jsonify({
            "success": True,
            "data": metrics,
            "error": None
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "data": None,
            "error": str(e)
        }), 500