from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import AppUser, Food, WorkoutPlan, Workout, Exercise, DailyWorkout, MuscleGroup, MuscleWorkout

class AppUserAdmin(UserAdmin):
    model = AppUser
    list_display = ('email', 'height', 'weight', 'body_fat', 'target_weight', 'target_body_fat', 'workout_plan', 'multiplier', 'is_staff', 'is_superuser', )
    list_filter = ('is_staff', 'is_superuser', 'workout_plan')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'height', 'weight', 'body_fat', 'target_weight', 'target_body_fat', 'workout_plan', 'multiplier')}),
        (_('Permissions'), {'fields': ('is_staff', 'is_superuser')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'height', 'weight', 'body_fat', 'target_weight', 'target_body_fat', 'workout_plan', 'multiplier','is_staff', 'is_superuser'),
        }),
    )

class FoodAdmin(admin.ModelAdmin):
    list_display = ('food_name', 'thumbnail', 'calories', 'protein', 'serving_size', 'quantity', 'user', 'date_added')
    list_filter = ('date_added', 'user')
    search_fields = ('food_name',)
    ordering = ('date_added', 'food_name')


class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'days_per_week')
    search_fields = ('name',)
    ordering = ('name',)

class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'plan', 'day_of_week')
    list_filter = ('plan', 'day_of_week')
    search_fields = ('name', 'day_of_week')
    ordering = ('name',)

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'sets', 'reps', 'weight', 'muscle_group')
    search_fields = ('name',)

class DailyWorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'workout', 'multiplier')
    list_filter = ('user', 'date')
    search_fields = ('workout__name', 'user__email')
    ordering = ('date',)

class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class MuscleWorkoutAdmin(admin.ModelAdmin):
    list_display = ('workout', 'muscle_group', 'num_exercises')
    list_filter = ('workout', 'muscle_group')
    search_fields = ('workout__name', 'muscle_group__name')

admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Food, FoodAdmin)
admin.site.register(WorkoutPlan, WorkoutPlanAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(DailyWorkout, DailyWorkoutAdmin)
admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(MuscleWorkout, MuscleWorkoutAdmin)