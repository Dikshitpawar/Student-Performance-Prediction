import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
data = pd.read_csv("dataset.csv")

X = data[['attendance', 'internalMarks', 'assignmentMarks', 'studyHours']]
y = data['result']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "student_model.pkl")

print("✅ Model trained and saved successfully!")
