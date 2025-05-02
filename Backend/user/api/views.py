from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from ..models import CustomUser
from .serializers import UserSerializer

class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class RegisterView(APIView):
    def post(self, request):
        password = request.data.get('password')
        data = request.data.copy()
        if password:
            data['password'] = make_password(password)
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, email=email, password=password)
        if user:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            
        return Response({"error": "Invalid credentials", "email": email}, status=status.HTTP_401_UNAUTHORIZED)

