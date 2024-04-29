from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import Food, WorkoutPlan

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = UserModel
        fields = ('email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({'password': "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        return UserModel.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user is None:
            raise ValidationError('Incorrect credentials')
        return user

class UserSerializer(serializers.ModelSerializer):

    workout_plan = serializers.PrimaryKeyRelatedField(queryset=WorkoutPlan.objects.all(), allow_null=True)

    class Meta:
        model = UserModel
        fields = ('email', 'height', 'weight', 'body_fat', 'target_weight', 'target_body_fat', 'workout_plan', 'daily_calories_target', 'daily_protein_target', 'multiplier', 'is_staff', 'is_superuser')

    def validate_email(self, value):
        if UserModel.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("This email is already in use. Please choose another one.")
        return value

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'

class WorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = ('id', 'name', 'days_per_week')