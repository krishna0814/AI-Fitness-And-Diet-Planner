from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import json
import joblib

class FitnessAI:
    def __init__(self):
        self.workout_data = pd.read_csv('data/workout_dataset.csv')
        self.vectorizer = TfidfVectorizer()
        self.workout_vectors = None
        
    def generate_diet_plan(self, calories, veg=True, goal='loss'):
        base_cal = calories / 4
        veg_prefix = 'Veg' if veg else 'Non-Veg'
        
        plan = {
            "breakfast": f"{veg_prefix} oats or eggs ({int(base_cal)}kcal)",
            "lunch": f"{veg_prefix} curry + rice ({int(base_cal)}kcal)",
            "dinner": f"{veg_prefix} protein + veggies ({int(base_cal)}kcal)",
            "snacks": f"Nuts/fruits ({int(calories - base_cal*3)}kcal)",
            "reasoning": f"Balanced {goal} plan for {calories}kcal/day"
        }
        return plan
    
    def recommend_workouts(self, goal, bmi, workout_type):
        # Filter dataset
        similar = self.workout_data[
            (self.workout_data['goal'] == goal) & 
            (self.workout_data['gym_home'] == workout_type)
        ].head(3).to_dict('records')
        return similar or [{"exercise": "Pushups", "sets": 3, "reps": 12}]
    
    def predict_progress(self, history, avg_cal_in=2200, avg_cal_burn=400, avg_workout=45):
        try:
            model = joblib.load('models/weight_predictor.pkl')
            recent = history[-3:]
            features = [[recent[0], recent[1], recent[2], avg_cal_in, avg_cal_burn, avg_workout]]
            pred = model.predict(features)[0]
            return {
                "predicted_7days": pred,
                "predicted_30days": pred - 2.0,
                "reasoning": f"ML prediction based on trend + calories/workout"
            }
        except:
            return {"predicted_7days": history[-1] - 0.5, "reasoning": "Fallback calculation"}

# Global instance
fitness_ai = FitnessAI()
