from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import *


router = SimpleRouter()
router.register(r'api',MascotaViewset) 

urlpatterns=[
    path('', include(router.urls)),
    path("login/", login_mascota, name="login_mascota"),
    path("logout/", logout_mascota, name="logout_mascota"),
]
