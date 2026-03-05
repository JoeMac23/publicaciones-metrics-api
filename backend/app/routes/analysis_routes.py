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
    """
    Ejecutar análisis de regresión sobre un post
    ---
    tags:
      - Analysis

    parameters:
      - name: post_id
        in: path
        type: integer
        required: true
        description: ID del post a analizar
        example: 3

    responses:
      200:
        description: Resultado del análisis de regresión
        examples:
          application/json:
            success: true
            data:
              predicted_score: 46.0
              coefficients:
                likes: 1.70
                comments: 0.34
                shares: 0.22
            error: null

      400:
        description: No hay suficientes métricas para entrenar el modelo

      404:
        description: Post no encontrado

      500:
        description: Error interno del servidor
    """
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