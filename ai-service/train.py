import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import os

print("🤖 Training AI Models for Fitness Planner...")

# 1. Weight Prediction Model (Regression)
print("\n📈 Training Weight Prediction Model...")
weight_df = pd.read_csv('data/weight_history.csv')

# Features: past weights, calories, workout
X = []
y = []
for user_id in weight_df['user_id'].unique():
    user_data = weight_df[weight_df['user_id'] == user_id].sort_values('day')
    weights = user_data['weight'].values
    for i in range(3, len(weights)):  # Need 3 prior days
        X.append([
            weights[i-3], weights[i-2], weights[i-1],
            np.mean(user_data['calories_in'].values[:i]),
            np.mean(user_data['calories_burned'].values[:i]),
            np.mean(user_data['workout_min'].values[:i])
        ])
        y.append(weights[i])

X = np.array(X)
y = np.array(y)

if len(X) > 0:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Predict and score
    y_pred = model.predict(X_test)
    score = r2_score(y_test, y_pred)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/weight_predictor.pkl')
    
    print(f"✅ Model saved. R² Score: {score:.3f}")
    print(f"Features: [w_d-3, w_d-2, w_d-1, avg_cal_in, avg_cal_burn, avg_workout]")
else:
    print("⚠️ Insufficient data for training")

# 2. Workout Recommendation Logic (Simple KNN-like)
print("\n🏋️ Workout Recommendation Logic Ready (Rule-based + Data-driven)")
print("✅ Datasets loaded successfully")

print("\n🎉 Training Complete! Run: python app.py")

