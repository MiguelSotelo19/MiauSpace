from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import PostsViewset

router = SimpleRouter()
router.register(r'api', PostsViewset)

urlpatterns = [
    path('', include(router.urls))
]