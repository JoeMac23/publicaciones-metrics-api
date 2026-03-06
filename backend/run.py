from flask import Flask
from flasgger import Swagger

from app.routes.post_routes import post_bp
from app.routes.metrics_routes import metrics_bp
from app.routes.analysis_routes import analysis_bp
from app.routes.health_routes import health_bp

from app.utils.error_handlers import register_error_handlers
from app.config.logger import logger

app = Flask(__name__)

swagger = Swagger(app)

register_error_handlers(app)

app.register_blueprint(post_bp)
app.register_blueprint(metrics_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(health_bp)

logger.info(" API iniciada correctamente")

if __name__ == "__main__":
    app.run(debug=True)