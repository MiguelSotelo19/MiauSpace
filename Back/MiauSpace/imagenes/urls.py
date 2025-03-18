from rest_framework.routers import SimpleRouter
from .views import ImagenesViewset
from django.urls import path, include

router = SimpleRouter()
router.register(r'api', ImagenesViewset)
urlpatterns = [
    path('', include(router.urls))
]