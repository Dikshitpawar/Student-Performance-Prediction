import sys
import joblib
import numpy as np
import os
import json

model_path = os.path.join(os.path.dirname(__file__), "student_model.pkl")
model = joblib.load(model_path)

attendance = float(sys.argv[1])
internalMarks = float(sys.argv[2])
assignmentMarks = float(sys.argv[3])
studyHours = float(sys.argv[4])

input_data = np.array([[attendance, internalMarks, assignmentMarks, studyHours]])

# 🔥 Probability nikal
prob = model.predict_proba(input_data)

riskScore = prob[0][0]   # Fail hone ka chance
safeScore = prob[0][1]

prediction = "At Risk" if riskScore > 0.5 else "Good Performance"

# 🔥 Weak Areas
weakAreas = []
suggestions = []

if attendance < 75:
    weakAreas.append("Low Attendance")
    suggestions.append("Increase attendance above 75%")

if internalMarks < 12:
    weakAreas.append("Very Low Internal Marks")
    suggestions.append("Score at least 20+ out of 40")

if assignmentMarks < 20:
    weakAreas.append("Poor Assignment Performance")
    suggestions.append("Score at least 30+ out of 50")

if studyHours < 3:
    weakAreas.append("Low Study Hours")
    suggestions.append("Study at least 5 hours/week")

result = {
    "prediction": prediction,
    "riskScore": round(riskScore * 100,2),
    "weakAreas": weakAreas,
    "suggestions": suggestions
}

print(json.dumps(result))
