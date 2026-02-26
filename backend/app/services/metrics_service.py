from app.config.db import get_connection


def create_metric(post_id, likes, comments, shares):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO metrics (post_id, likes, comments, shares)
            VALUES (%s, %s, %s, %s)
            """,
            (post_id, likes, comments, shares)
        )
        conn.commit()
    conn.close()


def get_metrics_by_post(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT id_metrics, post_id, likes, comments, shares, recorded_at
            FROM metrics
            WHERE post_id = %s
            ORDER BY recorded_at ASC
            """,
            (post_id,)
        )
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

    conn.close()

    return [dict(zip(columns, row)) for row in rows]

def get_all_metrics():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM metrics")
        rows = cursor.fetchall()
    conn.close()
    return rows

def get_post_analysis(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:

        # Obtener post
        cursor.execute("SELECT * FROM posts WHERE id_posts = %s", (post_id,))
        post = cursor.fetchone()

        if not post:
            conn.close()
            return None

        # Obtener métricas
        cursor.execute("SELECT * FROM metrics WHERE post_id = %s", (post_id,))
        metrics = cursor.fetchall()

    conn.close()

    # Si no hay métricas
    if not metrics:
        return {
            "post": post,
            "metrics_summary": {
                "total_likes": 0,
                "total_comments": 0,
                "total_shares": 0,
                "score": 0
            }
        }

    # Sumar métricas
    total_likes = sum(m["likes"] for m in metrics)
    total_comments = sum(m["comments"] for m in metrics)
    total_shares = sum(m["shares"] for m in metrics)

    score = total_likes + (total_comments * 2) + (total_shares * 3)

    return {
        "post": post,
        "metrics_summary": {
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "score": score
        }
    }