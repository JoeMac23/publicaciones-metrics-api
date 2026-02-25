from app.config.db import get_connection


def create_post(user_id, content, platform):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO posts (user_id, content, platform)
            VALUES (%s, %s, %s)
            """,
            (user_id, content, platform)
        )
        conn.commit()
    conn.close()


def get_all_posts():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM posts")
        posts = cursor.fetchall()
    conn.close()
    return posts


def get_post_by_id(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM posts WHERE id_posts = %s",
            (post_id,)
        )
        post = cursor.fetchone()
    conn.close()
    return post


def update_post(post_id, content, platform):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            """
            UPDATE posts
            SET content = %s, platform = %s
            WHERE id_posts = %s
            """,
            (content, platform, post_id)
        )
        conn.commit()
    conn.close()


def delete_post(post_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "DELETE FROM posts WHERE id_posts = %s",
            (post_id,)
        )
        conn.commit()
    conn.close()