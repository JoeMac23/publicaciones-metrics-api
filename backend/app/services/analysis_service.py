from app.services.metrics_service import get_metrics_history_by_post
from app.ml.regression import train_regression, predict_score

def analyze_post_with_regression(post_id):
    metrics = get_metrics_history_by_post(post_id)

    if len(metrics) < 2:
        return None

    model = train_regression(metrics)

    last = metrics[-1]

    predicted_score = predict_score(
        model,
        last["likes"],
        last["comments"],
        last["shares"]
    )

    return {
        "predicted_score": round(predicted_score, 2),
        "coefficients": {
            "likes": model.coef_[0],
            "comments": model.coef_[1],
            "shares": model.coef_[2]
        }
    }