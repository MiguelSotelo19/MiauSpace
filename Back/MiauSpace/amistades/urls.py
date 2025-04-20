from rest_framework.routers import SimpleRouter
from .views import AmistadesViewset
from django.urls import path, include

router = SimpleRouter()
router.register(r'api', AmistadesViewset)
urlpatterns = [
    path('', include(router.urls))  
]