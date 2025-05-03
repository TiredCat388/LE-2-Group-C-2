from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetCategoryViewSet  # Import the correct viewset

router = DefaultRouter()
router.register(r'categories', BudgetCategoryViewSet, basename='category')  # Register viewset instead of list view

urlpatterns = [
    path('', include(router.urls)),
]
