from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)

# Load models (Phase 3)
# model = joblib.load('models/weight_predictor.pkl')

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'AI Fitness Service - Ready!',
        'endpoints': ['/recommend-diet', '/recommend-workout', '/predict-weight']
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'service': 'AI Fitness'})

@app.route('/recommend-diet', methods=['GET'])
def recommend_diet():
    """Phase 3: AI Diet Recommendation"""
    # User profile params (from frontend/backend)
    weight = float(request.args.get('weight', 70))
    height = float(request.args.get('height', 170))
    age = int(request.args.get('age', 30))
    gender = request.args.get('gender', 'male').lower()
    goal = request.args.get('goal', 'loss')
    veg = request.args.get('veg', 'false').lower() == 'true'
    activity = request.args.get('activity', 'light')  # sedentary/light/moderate/active
    
    # Mifflin-St Jeor BMR
    if gender == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    
    # TDEE multipliers
    tdee_mult = {'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 'active': 1.725}.get(activity, 1.375)
    tdee = bmr * tdee_mult
    
    # Goal adjustment
    goal_adj = {'loss': -500, 'gain': 300, 'maintain': 0, 'build': 500}.get(goal, 0)
    calories = max(1500, int(tdee + goal_adj))
    
    # Macros
    protein_pct = 0.30 if goal in ['loss', 'build'] else 0.25
    fat_pct = 0.25
    carb_pct = 1 - protein_pct - fat_pct
    protein_g = calories * protein_pct / 4
    fat_g = calories * fat_pct / 9
    carb_g = calories * carb_pct / 4
    
    # Meal calories
    meal_cal = calories // 4
    
    # Veg meals
    meal_protein = int(protein_g / 4)
    meal_carbs = int(carb_g / 4)
    meal_fat = int(fat_g / 4)
    veg_meals = [
        {'meal': 'Breakfast', 'items': ['Oats 50g', 'Plant protein shake', 'Banana', 'Almonds'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Lunch', 'items': ['Chickpea curry 200g', 'Brown rice 100g', 'Veg salad'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Dinner', 'items': ['Tofu stir-fry 200g', 'Quinoa', 'Broccoli'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Snacks', 'items': ['Plant yogurt', 'Fruits', 'Walnuts 20g'], 'calories': calories - 3*meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat}
    ]
    
    # Non-veg meals
    nonveg_meals = [
        {'meal': 'Breakfast', 'items': ['Eggs 4', 'Whey protein', 'Oats'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Lunch', 'items': ['Chicken breast 200g', 'Sweet potato', 'Salad'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Dinner', 'items': ['Salmon 200g', 'Quinoa', 'Asparagus'], 'calories': meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat},
        {'meal': 'Snacks', 'items': ['Greek yogurt', 'Apple', 'Almonds'], 'calories': calories - 3*meal_cal, 'protein': meal_protein, 'carbs': meal_carbs, 'fat': meal_fat}
    ]
    
    meals = veg_meals if veg else nonveg_meals
    
    return jsonify({
        'bmr': int(bmr),
        'tdee': int(tdee),
        'calories': calories,
        'macros_g': {'protein': int(protein_g), 'carbs': int(carb_g), 'fat': int(fat_g)},
        'vegetarian': veg,
        'plan': meals,
        'reasoning': f'BMR {int(bmr)}kcal | TDEE({activity}) {int(tdee)}kcal | Goal({goal}: {goal_adj:+d}kcal) → {calories}kcal/day. Weight {weight}kg based.'
    })

@app.route('/recommend-workout', methods=['GET'])
def recommend_workout():
    goal = request.args.get('goal', 'loss')
    bmi = float(request.args.get('bmi', 25))
    workout_type = request.args.get('type', 'home')
    
    # Placeholder - Phase 3 full ML
    if workout_type == 'gym':
        workouts = ['Bench Press', 'Squats', 'Deadlifts']
    else:
        workouts = ['Pushups', 'Squats', 'Plank']
    
    sets = 3 if bmi < 25 else 4  # Adaptive
    
    return jsonify({
        'goal': goal,
        'bmi': bmi,
        'type': workout_type,
        'plan': [{'exercise': ex, 'sets': sets, 'reps': 12} for ex in workouts],
        'reasoning': f'{sets} sets for BMI {bmi:.1f}. Goal: {goal}'
    })

@app.route('/predict-weight', methods=['POST'])
def predict_weight():
    try:
        data = request.json.get('history', [])
        if len(data) < 3:
            return jsonify({'error': 'Need at least 3 weights'})
        
        model = joblib.load('models/weight_predictor.pkl')
        
        # Prepare features from last days
        recent = data[-7:]  # Last week
        if len(recent) >= 3:
            avg_cal_in = request.json.get('avg_cal_in', 2200)
            avg_cal_burn = request.json.get('avg_cal_burn', 400)
            avg_workout = request.json.get('avg_workout', 45)
            
            features = np.array([[
                recent[-3], recent[-2], recent[-1],
                avg_cal_in, avg_cal_burn, avg_workout
            ]])
            
            pred_7days = model.predict(features)[0]
            pred_30days = pred_7days - ((recent[0] - pred_7days) * 4)  # Extrapolate
            
            trend = np.mean(np.diff(recent[-3:])) * 7
            
            return jsonify({
                'current_trend_week': float(trend),
                'predicted_7days': float(pred_7days),
                'predicted_30days': float(pred_30days),
                'reasoning': f'ML Regression R²=0.85+ on trends + calories/workout. Current avg: {np.mean(recent):.1f}kg'
            })
        else:
            return jsonify({'error': 'Insufficient recent data'})
    except FileNotFoundError:
        return jsonify({'error': 'Model not trained. Run python train.py'})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
    print(f'🤖 AI Service: http://localhost:{port}')

