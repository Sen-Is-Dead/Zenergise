from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from .validations import custom_validation


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