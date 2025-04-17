from rest_framework.routers import SimpleRouter
from .views import ComentariosViewset
from django.urls import path, include
from .views import ConsultaPersonalizadaAPIView
router = SimpleRouter()

router.register(r'api', ComentariosViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('accioneslog/<int:id>/', ConsultaPersonalizadaAPIView.as_view()), #IMPORTANTE NO COLOCAR DIAGONALES EN LA RUTA PQ ENTRA EN CONFLICTO CON EL VIEWSET
]
