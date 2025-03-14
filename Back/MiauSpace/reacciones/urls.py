from rest_framework.routers import SimpleRouter
from .views import ReaccionViewset
from django.urls import path, include

router = SimpleRouter()
router.register(r'api', ReaccionViewset)
urlpatterns = [
    path('', include(router.urls))
]