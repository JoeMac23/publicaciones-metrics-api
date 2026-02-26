from flask import Flask
from app.routes.post_routes import post_bp
from app.routes.metrics_routes import metrics_bp
from app.routes.analysis_routes import analysis_bp

app = Flask(__name__)

app.register_blueprint(post_bp)
app.register_blueprint(metrics_bp)
app.register_blueprint(analysis_bp)

if __name__ == "__main__":
    app.run(debug=True)