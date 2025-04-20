from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import PostsViewset, PostsImgViewset

router = SimpleRouter()
router.register(r'api', PostsViewset, basename='posts')  
router.register(r'api-img', PostsImgViewset, basename='posts-img')  

urlpatterns = [
    path('', include(router.urls)),
]
