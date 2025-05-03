from django.db import models
from django.conf import settings  # This will automatically reference the custom user model
from user.models import CustomUser  


class BudgetCategory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='budget_categories', null=True)  # Allow null temporarily
    category = models.CharField(max_length=100)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)

    def __str__(self):
        return self.category
