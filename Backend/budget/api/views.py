from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from ..models import BudgetCategory
from .serializers import BudgetCategorySerializer
from rest_framework.permissions import AllowAny
from user.models import CustomUser  

class BudgetCategoryViewSet(viewsets.ModelViewSet):
    queryset = BudgetCategory.objects.all()
    serializer_class = BudgetCategorySerializer
    permission_classes = [AllowAny]  # <-- Add this line


    def perform_create(self, serializer):
        username = self.request.headers.get('username') or self.request.META.get('HTTP_USERNAME')
        print(f"Received username: {username}")
        user = CustomUser.objects.filter(username__iexact=username).first()
        if not user:
            raise ValidationError("User does not exist.")
        serializer.save(user=user)
