from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('update_profile/', views.UserProfileUpdate.as_view(), name='update_profile'),
    path('nutritionix_instant/', views.nutritionix_instant, name='nutritionix_instant'),
    path('nutritionix_nutrients/', views.nutritionix_nutrients, name='nutritionix_nutrients'),
    path('nutritionix_search_item/', views.nutritionix_search_item, name='nutritionix_search_item'),
    path('add_food/', views.add_food, name='add_food'),
    path('user_foods/', views.user_foods, name='user_foods'),
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
]