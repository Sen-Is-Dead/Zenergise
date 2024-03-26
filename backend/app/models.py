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

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)
    height = models.FloatField(default=0, null=True, blank=True)
    weight = models.FloatField(default=0, null=True, blank=True)
    body_fat = models.FloatField(default=0, null=True, blank=True)
    target = models.FloatField(default=0, null=True, blank=True)

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
