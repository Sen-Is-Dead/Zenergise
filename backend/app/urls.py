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
    path('delete_food/<int:food_id>/', views.delete_food, name='delete_food'),
    path('user_foods/', views.user_foods, name='user_foods'),
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
    path('workout_plans/', views.WorkoutPlanListView.as_view(), name='workout_plans'),
    path('check_user_profile/', views.CheckUserProfile.as_view(), name='check_user_profile'),
    path('generate_daily_workout/', views.GenerateDailyWorkout.as_view(), name='generate_daily_workout'),
    path('today_workout_details/', views.TodayWorkoutDetails.as_view(), name='today_workout_details'),
    path('user_workout_history/', views.UserWorkoutHistory.as_view(), name='user_workout_history'),

]