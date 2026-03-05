from flask import Blueprint, jsonify
from app.services.analysis_service import (
    analyze_post_with_regression,
    save_analysis_result,
    get_analysis_history
)
from app.config.logger import logger

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/posts/<int:post_id>/analysis/regression", methods=["GET"])
def analyze(post_id):
    
    logger.info(f"Regression executed for post_id={post_id}")
    
    result = analyze_post_with_regression(post_id)

    if not result:
        return jsonify({
            "success": False,
            "data": None,
            "error": "No hay suficientes métricas"
        }), 400

    save_analysis_result(
        post_id=post_id,
        score=result["predicted_score"]
    )

    return jsonify({
        "success": True,
        "data": result,
        "error": None
    }), 200

@analysis_bp.route("/posts/<int:post_id>/analysis/history", methods=["GET"])
def analysis_history(post_id):
    history = get_analysis_history(post_id)

    if not history:
        return jsonify({"error": "No hay análisis para este post"}), 404

    return jsonify(history), 200