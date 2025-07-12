from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)
model = joblib.load("ridge_model.pkl")

# Dropdown options
categories = ['Shirt', 'Jeans', 'Jacket', 'T-shirt', 'Sweater']
colors = ['Black', 'White', 'Blue', 'Red', 'Green']
sizes = ['XS', 'S', 'M', 'L', 'XL']
materials = ['Cotton', 'Denim', 'Wool', 'Polyester', 'Linen']
usage_levels = list(range(6))

@app.route("/")
def index():
    return render_template("form.html",
                           categories=categories,
                           colors=colors,
                           sizes=sizes,
                           materials=materials,
                           usage_levels=usage_levels)

INR_TO_USD = 83.0  # INR to USD conversion

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Original price in INR
        original_price_inr = float(data.get("original_price", 0))
        original_price_usd = original_price_inr / INR_TO_USD

        # Prepare data for model
        df = pd.DataFrame([{
            "Brand": data.get("brand", ""),
            "Category": data.get("category", ""),
            "Color": data.get("color", ""),
            "Size": data.get("size", ""),
            "Material": data.get("material", ""),
            "Original_Price": original_price_usd,
            "Usage_Level": int(data.get("usage_level", 0))
        }])

        # Predict in USD
        predicted_usd = model.predict(df)[0]
        predicted_inr = predicted_usd * INR_TO_USD

        # Final logic: resale price checks
        if predicted_inr <= 0:
            return jsonify({"predicted_price": "❌ Item not in condition to sell"})
        elif predicted_inr > original_price_inr:
            predicted_inr = original_price_inr

        return jsonify({"predicted_price": f"₹{round(predicted_inr, 2)}"})

    except Exception as e:
        return jsonify({"predicted_price": f"Error: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)