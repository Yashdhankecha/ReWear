import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge

# Load dataset
df = pd.read_csv("clothes_with_resale_price.csv")

# Define features and target
X = df[["Brand", "Category", "Color", "Size", "Material", "Original_Price", "Usage_Level"]]
y = df["Resale_Price"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing: encode categorical and scale numeric
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["Brand", "Category", "Color", "Size", "Material"]),
    ("num", StandardScaler(), ["Original_Price", "Usage_Level"])
])

# Pipeline
model = Pipeline([
    ("preprocess", preprocessor),
    ("ridge", Ridge())
])

# Train
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "ridge_model.pkl")
print("✅ Ridge model saved as ridge_model.pkl")
