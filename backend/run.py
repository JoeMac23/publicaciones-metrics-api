from flask import Flask

app = Flask(__name__)

# IMPORTAR blueprints
from app.routes.post_routes import post_bp

# REGISTRAR blueprints
app.register_blueprint(post_bp)

if __name__ == "__main__":
    app.run(debug=True)