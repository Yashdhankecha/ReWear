import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
import joblib

# Load updated dataset
df = pd.read_csv("clothes_data_with_usage.csv")

# Define features and target
X = df[["Brand", "Category", "Color", "Size", "Material", "Original_Price", "Usage_Level"]]
y = df["Price"]

# Split into train and test (not needed for saving, but good practice)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define categorical and numerical columns
categorical_features = ["Brand", "Category", "Color", "Size", "Material"]
numerical_features = ["Original_Price", "Usage_Level"]

# Preprocessing
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ("num", StandardScaler(), numerical_features)
])

# Build pipeline with Ridge Regression
pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("model", Ridge())
])

# Train the model
pipeline.fit(X_train, y_train)

# Save the model as ridge_model.pkl
joblib.dump(pipeline, "ridge_model.pkl")
print("✅ Ridge model saved as 'ridge_model.pkl'")
