from flask import Blueprint, jsonify
from app.services.analysis_service import analyze_post_with_regression

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analysis/<int:post_id>/regression", methods=["GET"])
def regression(post_id):
    try:
        result = analyze_post_with_regression(post_id)

        if not result:
            return jsonify({"error": "No hay suficientes métricas"}), 400

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500