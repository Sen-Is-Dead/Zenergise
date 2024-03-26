from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import AppUser, Food

class AppUserAdmin(UserAdmin):
    model = AppUser
    list_display = ('email', 'height', 'weight', 'body_fat', 'target', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'height', 'weight', 'body_fat', 'target')}),
        (_('Permissions'), {'fields': ('is_staff', 'is_superuser')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'height', 'weight', 'body_fat', 'target', 'is_staff', 'is_superuser'),
        }),
    )

class FoodAdmin(admin.ModelAdmin):
    list_display = ('food_name', 'thumbnail', 'calories', 'protein', 'serving_size', 'quantity', 'user', 'date_added')
    list_filter = ('date_added', 'user')
    search_fields = ('food_name',)
    ordering = ('date_added', 'food_name')

admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Food, FoodAdmin)