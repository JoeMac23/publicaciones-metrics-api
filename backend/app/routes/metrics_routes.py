from flask import Blueprint, request, jsonify
from app.services.metrics_service import (
    create_metric,
    get_metrics_by_post,
    get_all_metrics
)

metrics_bp = Blueprint("metrics", __name__)

# CREATE metrics
@metrics_bp.route("/metrics", methods=["POST"])
def create():
    data = request.get_json()

    post_id = data.get("post_id")
    likes = data.get("likes")
    comments = data.get("comments")
    shares = data.get("shares")

    if not all([post_id, likes, comments, shares]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        create_metric(post_id, likes, comments, shares)
        return jsonify({"message": "Métricas creadas correctamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET all metrics
@metrics_bp.route("/metrics", methods=["GET"])
def get_all():
    try:
        metrics = get_all_metrics()
        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET metrics by post_id
@metrics_bp.route("/metrics/<int:post_id>", methods=["GET"])
def get_by_post(post_id):
    try:
        metrics = get_metrics_by_post(post_id)

        if not metrics:
            return jsonify({"error": "No hay métricas para este post"}), 404

        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500