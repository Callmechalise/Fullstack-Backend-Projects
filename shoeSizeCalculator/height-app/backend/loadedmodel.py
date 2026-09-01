import pickle

def predict(user_height):

    with open("scaler.pkl", "rb") as f:
        scaler = pickle.load(f)

    with open("linear_regression_model.pkl", "rb") as f:
        model = pickle.load(f)

    array = [[user_height]]

    scaled_data = scaler.transform(array)

    prediction = model.predict(scaled_data)

    return prediction.item()