from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import MascotaViewset


router = SimpleRouter()
router.register(r'api',MascotaViewset) 

urlpatterns=[
    path('', include(router.urls)),
]
