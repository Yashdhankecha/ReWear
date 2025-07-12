from flask import Flask, render_template, request
import pandas as pd
import joblib

# Load trained Ridge model pipeline
model = joblib.load("ridge_model.pkl")

app = Flask(__name__)

# Dropdown options based on dataset values
brand_options = ['Zara', 'H&M', 'Gucci', 'Uniqlo', 'Levi\'s']
category_options = ['Shirt', 'Jeans', 'Jacket', 'T-shirt', 'Sweater']
color_options = ['Black', 'White', 'Blue', 'Red', 'Green']
size_options = ['XS', 'S', 'M', 'L', 'XL']
material_options = ['Cotton', 'Denim', 'Wool', 'Polyester', 'Linen']
usage_options = list(range(0, 6))  # 0 to 5

@app.route("/", methods=["GET", "POST"])
def index():
    predicted_price = None

    if request.method == "POST":
        data = pd.DataFrame([{
            "Brand": request.form["brand"],
            "Category": request.form["category"],
            "Color": request.form["color"],
            "Size": request.form["size"],
            "Material": request.form["material"],
            "Original_Price": float(request.form["original_price"]),
            "Usage_Level": int(request.form["usage_level"])
        }])

        predicted_price = round(model.predict(data)[0], 2)

    return render_template("form.html",
                           predicted_price=predicted_price,
                           brands=brand_options,
                           categories=category_options,
                           colors=color_options,
                           sizes=size_options,
                           materials=material_options,
                           usages=usage_options)

if __name__ == "__main__":
    app.run(debug=True)
