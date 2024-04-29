import requests
from random import sample
from joblib import load

from django.db.models import Q
from django.utils import timezone
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, login, logout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .validations import custom_validation, profile_validation
from .models import DailyWorkout, Exercise, Food, MuscleWorkout, Workout, WorkoutPlan
from .serializers import FoodSerializer, UserLoginSerializer, UserRegisterSerializer, UserSerializer, WorkoutPlanSerializer

model = load('./app/exercise_weight_predictor.joblib')

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                login(request, user)  # Log the user in to create the session
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_message = ', '.join(e.messages) if hasattr(e, 'messages') else str(e)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                user = serializer.validated_data
                login(request, user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_message = ', '.join(e.messages) if hasattr(e, 'messages') else str(e)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)
     
class UserProfileUpdate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        try:
            validated_data = profile_validation(request.data, user)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, data=validated_data, partial=True)
        if serializer.is_valid():
            user = serializer.save()

            # Adjust BMR based on target weight
            adjusted_weight = user.target_weight - (user.target_weight * (user.target_body_fat / 100))
            user_bmr = 10 * adjusted_weight + 6.25 * user.height - 5 * 30 + 5  # Male formula
            user.daily_calories_target = round(user_bmr * 1.55, -2)  # Adjust for activity level, round to nearest 100

            # Protein target based on lean body mass
            lean_body_mass = user.target_weight * (1 - (user.target_body_fat / 100))
            user.daily_protein_target = round(lean_body_mass * 2.2, -1)  # Protein per kg of lean mass
            user.daily_protein_target = round(user.daily_protein_target / 5) * 5  # Ensures rounding to nearest 5

            print("daily calories target", user.daily_calories_target)
            print("daily protein target", user.daily_protein_target)

            # Update workout plan if provided
            workout_plan_id = validated_data.get('workout_plan')
            if workout_plan_id:
                workout_plan = get_object_or_404(WorkoutPlan, pk=workout_plan_id)
                user.workout_plan = workout_plan

            # Multiplier based on model prediction
            standard_lift = model.predict([[185, 80, 16]])
            user_lift = model.predict([[user.height, user.weight, user.body_fat]]) 

            if standard_lift > 0:
                user.multiplier = user_lift / standard_lift
            else:
                user.multiplier = 1.0

            user.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     
@api_view(['GET'])
@permission_classes([AllowAny])
def nutritionix_instant(request):
    search_term = request.GET.get('query')
    if not search_term:
        return Response({'error': 'No search query provided.'}, status=400)
    
    url = "https://trackapi.nutritionix.com/v2/search/instant"
    headers = {
        'x-app-id': 'b2fd1047',
        'x-app-key': 'b609e720ffb6e93df97239adc5c9564c',
    }
    params = {'query': search_term}
    response = requests.get(url, headers=headers, params=params)
    return Response(response.json())

@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def nutritionix_nutrients(request):
    food_name = request.data.get('query')
    if not food_name:
        return Response({'error': 'No food name provided.'}, status=400)

    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        'Content-Type': 'application/json',
        'x-app-id': 'b2fd1047',
        'x-app-key': 'b609e720ffb6e93df97239adc5c9564c',
    }
    data = {'query': food_name}
    response = requests.post(url, headers=headers, json=data)
    return Response(response.json())

@api_view(['GET'])
@permission_classes([AllowAny])
def nutritionix_search_item(request):
    nix_item_id = request.GET.get('nix_item_id')
    if not nix_item_id:
        return Response({'error': 'No nix_item_id provided.'}, status=400)

    url = f"https://trackapi.nutritionix.com/v2/search/item?nix_item_id={nix_item_id}"
    headers = {
        'x-app-id': 'b2fd1047',
        'x-app-key': 'b609e720ffb6e93df97239adc5c9564c',
    }
    response = requests.get(url, headers=headers)
    return Response(response.json())

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def add_food(request):
    user = request.user
    data = request.data

    try:
        food = Food.objects.create(
            food_name=data.get('food_name'),
            thumbnail=data.get('thumbnail'),
            calories=data.get('calories'),
            protein=data.get('protein'),
            serving_size=data.get('serving_size'),
            quantity=data.get('quantity'),
            user=user
        )
        return Response({'message': 'Food added successfully', 'food_id': food.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_food(request, food_id):
    try:
        food = Food.objects.get(id=food_id, user=request.user)
        food.delete()
        return Response({'message': 'Food deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Food.DoesNotExist:
        return Response({'error': 'Food not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_foods(request):
    user = request.user
    foods = Food.objects.filter(user=user).order_by('-date_added')
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):

    csrf_token = get_token(request)

    return Response({'csrfToken': csrf_token})


class WorkoutPlanListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        plans = WorkoutPlan.objects.all()
        serializer = WorkoutPlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CheckUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile_complete = all([
            user.height > 0, user.weight > 0, user.body_fat > 0, 
            user.target_weight > 0, user.target_body_fat > 0,
            user.workout_plan is not None
        ])
        return Response({'profile_complete': profile_complete})

class GenerateDailyWorkout(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()

        if DailyWorkout.objects.filter(user=user, date=today).exists():
            return Response({'message': 'Workout already scheduled for today.'}, status=status.HTTP_409_CONFLICT)

        if not user.workout_plan:
            return Response({'error': 'No workout plan selected.'}, status=status.HTTP_400_BAD_REQUEST)

        day_of_week = today.strftime('%A')
        workout = Workout.objects.filter(plan=user.workout_plan, day_of_week=day_of_week).first()

        if not workout:
            return Response({'error': 'No workout found for today.'}, status=status.HTTP_404_NOT_FOUND)

        # Create a new daily workout with the current multiplier
        daily_workout = DailyWorkout.objects.create(
            user=user,
            date=today,
            workout=workout,
            multiplier=user.multiplier  
        )
        print("multiplier", user.multiplier)

        muscle_workouts = MuscleWorkout.objects.filter(workout=workout)
        for mw in muscle_workouts:
            exercises = Exercise.objects.filter(muscle_group=mw.muscle_group)
            selected_exercises = sample(list(exercises), min(len(exercises), mw.num_exercises))
            daily_workout.exercises.add(*selected_exercises)

        return Response({'message': 'Daily workout created successfully.'}, status=status.HTTP_201_CREATED)
    
class TodayWorkoutDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()
        
        workout_exists = DailyWorkout.objects.filter(user=user, date=today).exists()

        if workout_exists:
            return Response({'workout_exists': True, 'message': 'Workout is scheduled for today.'})
        else:
            return Response({'workout_exists': False, 'message': 'No workout found for today.'})
        
class UserWorkoutHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        workouts = DailyWorkout.objects.filter(user=user).order_by('-date')
        workout_details = []
        for workout in workouts:
            exercises_details = []
            workout_multiplier = workout.multiplier if workout.multiplier else 1

            for exercise in workout.exercises.all():
                adjusted_weight = exercise.weight * workout_multiplier
                rounded_weight = max(2.5, round(adjusted_weight / 2.5) * 2.5)
                exercises_details.append({
                    'name': exercise.name,
                    'description': exercise.description,
                    'sets': exercise.sets,
                    'reps': exercise.reps,
                    'weight': rounded_weight,
                    'muscle_group': exercise.muscle_group.name
                })
            workout_details.append({
                'date': workout.date,
                'workout_name': workout.workout.name,
                'exercises': exercises_details
            })
        return Response(workout_details)

