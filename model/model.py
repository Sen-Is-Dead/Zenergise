import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from joblib import dump

# Load data
data = pd.read_csv('exercise_data_20000.csv')

# Select features and target
X = data[['Height', 'Weight', 'BodyFat']]
y = data['ExerciseWeight']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f"Mean Squared Error on Test Set: {mse}")

# Save the model to disk
dump(model, 'exercise_weight_predictor.joblib')