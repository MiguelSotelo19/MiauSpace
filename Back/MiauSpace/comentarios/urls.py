from rest_framework.routers import SimpleRouter
from .views import ComentariosViewset
from django.urls import path, include

router = SimpleRouter()

router.register(r'api', ComentariosViewset)

urlpatterns=[
    path('', include(router.urls))
]