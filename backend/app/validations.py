from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from django.contrib.auth import get_user_model
UserModel = get_user_model()

def custom_validation(data):
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email:
        raise ValidationError('Please provide an email address.')
    try:
        django_validate_email(email)
    except ValidationError:
        raise ValidationError('Please enter a valid email address.')
    if UserModel.objects.filter(email=email).exists():
        raise ValidationError('This email is already in use. Please choose another one.')

    if not password:
        raise ValidationError('Please provide a password.')
    if len(password) < 8:
        raise ValidationError('Your password must be at least 8 characters long.')
    return data

def validate_email(data):
    email = data.get('email', '').strip()
    if not email:
        raise ValidationError('An email address is required.')
    try:
        django_validate_email(email)
    except ValidationError:
        raise ValidationError('Please enter a valid email address.')
    return True

def validate_password(data):
    password = data.get('password', '').strip()
    if not password:
        raise ValidationError('A password is required.')
    if len(password) < 8:
        raise ValidationError('Your password must be at least 8 characters long.')
    return True
