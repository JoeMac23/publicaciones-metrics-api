from sklearn.linear_model import LinearRegression
import numpy as np

def train_regression(metrics):
    """
    metrics: lista de dicts con likes, comments, shares
    """
    X = []
    y = []

    for m in metrics:
        likes = m["likes"]
        comments = m["comments"]
        shares = m["shares"]

        X.append([likes, comments, shares])

        # score base (target)
        score = likes + 2 * comments + 3 * shares
        y.append(score)

    X = np.array(X)
    y = np.array(y)

    model = LinearRegression()
    model.fit(X, y)

    return model


def predict_score(model, likes, comments, shares):
    X = np.array([[likes, comments, shares]])
    return float(model.predict(X)[0])