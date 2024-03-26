from django.contrib.auth import login, logout, get_user_model
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, FoodSerializer
from .validations import custom_validation, profile_validation
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Food
import requests


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()
                login(request, user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_message = ', '.join(e.messages) if hasattr(e, 'messages') else str(e)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

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
            serializer.save()
            return Response(serializer.data)
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

