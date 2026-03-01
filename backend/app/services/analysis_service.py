from app.services.metrics_service import get_metrics_history_by_post
from app.ml.regression import train_regression, predict_score
from app.config.db import get_connection

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
    
def save_analysis_result(post_id, score, model_version="linear_v1"):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO post_analysis (post_id, score, model_version)
            VALUES (%s, %s, %s)
            """,
            (post_id, score, model_version)
        )
        conn.commit()
    conn.close()


def get_analysis_by_post(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT *
            FROM post_analysis
            WHERE post_id = %s
            ORDER BY created_at DESC
            """,
            (post_id,)
        )
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

    conn.close()
    return [dict(zip(columns, row)) for row in rows]

def get_analysis_history(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT score, model_version, created_at
            FROM post_analysis
            WHERE post_id = %s
            ORDER BY created_at ASC
            """,
            (post_id,)
        )
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

    conn.close()

    return [dict(zip(columns, row)) for row in rows]