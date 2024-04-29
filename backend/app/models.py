from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('An email is required.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class WorkoutPlan(models.Model):
    name = models.CharField(max_length=100)
    days_per_week = models.IntegerField()

    def __str__(self):
        return self.name

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)
    height = models.FloatField(default=0, null=True, blank=True)
    weight = models.FloatField(default=0, null=True, blank=True)
    body_fat = models.FloatField(default=0, null=True, blank=True)
    target_weight = models.FloatField(default=0, null=True, blank=True)
    target_body_fat = models.FloatField(default=0, null=True, blank=True)
    multiplier = models.FloatField(default=1.0, null=True, blank=True)
    daily_calories_target = models.FloatField(default=0, null=True, blank=True)
    daily_protein_target = models.FloatField(default=0, null=True, blank=True)

    workout_plan = models.ForeignKey(WorkoutPlan, default=None, on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = 'email'
    objects = AppUserManager()

    def __str__(self):
        return self.email
    
class Food(models.Model):
    food_name = models.CharField(max_length=100)
    thumbnail = models.URLField(max_length=200)
    calories = models.DecimalField(max_digits=6, decimal_places=2)
    protein = models.DecimalField(max_digits=6, decimal_places=2)
    serving_size = models.CharField(max_length=50)
    quantity = models.DecimalField(max_digits=6, decimal_places=2)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.food_name
    
class MuscleGroup(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name    

class Workout(models.Model):
    plan = models.ForeignKey(WorkoutPlan, related_name='workouts', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    day_of_week = models.CharField(max_length=10)
    muscle_workouts = models.ManyToManyField(MuscleGroup, through='MuscleWorkout')
    
    def __str__(self):
        return f"{self.name} ({self.day_of_week})"
    
class MuscleWorkout(models.Model):
    workout = models.ForeignKey(Workout, related_name='muscle_workout_details', on_delete=models.CASCADE)
    muscle_group = models.ForeignKey(MuscleGroup, on_delete=models.CASCADE)
    num_exercises = models.IntegerField()
    def __str__(self):
        return f"{self.workout.name} - {self.muscle_group.name} ({self.num_exercises} exercises)"


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    sets = models.IntegerField()
    reps = models.IntegerField()
    weight = models.FloatField()
    muscle_group = models.ForeignKey(MuscleGroup, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class DailyWorkout(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercises = models.ManyToManyField(Exercise, related_name='daily_workouts')
    multiplier = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.user.email} - {self.date} - {self.workout.name}"
    