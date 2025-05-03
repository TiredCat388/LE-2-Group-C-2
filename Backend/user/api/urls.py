from django.urls import path
from .views import RegisterView, LoginView, UserList,current_user, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserList.as_view(), name='user-list'),
    path('current_user/', current_user, name='current_user'),
]