from rest_framework import serializers
from ..models import BudgetCategory

class BudgetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCategory
        fields = ['id', 'category', 'limit', 'image', 'user']
        read_only_fields = ['user']  