from flask import jsonify
from app.config.logger import logger


def register_error_handlers(app):

    @app.errorhandler(404)
    def not_found(error):
        logger.warning("Endpoint no encontrado")
        return jsonify({
            "success": False,
            "data": None,
            "error": "Endpoint no encontrado"
        }), 404


    @app.errorhandler(400)
    def bad_request(error):
        logger.warning("Bad request")
        return jsonify({
            "success": False,
            "data": None,
            "error": "Solicitud inválida"
        }), 400


    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Error interno: {str(error)}")
        return jsonify({
            "success": False,
            "data": None,
            "error": "Error interno del servidor"
        }), 500