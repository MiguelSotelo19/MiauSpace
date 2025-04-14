from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer
from .models import Posts, Imagenes
from .serializers import PostsSerializer, ImagenesSerializer, PostImagenSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class PostsViewset(viewsets.ModelViewSet):
    queryset = Posts.objects.all().prefetch_related('imagenes')
    serializer_class = PostsSerializer
    
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['POST','PUT', 'DELETE']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []

    def get_queryset(self):
        """
        Optimización: Pre-carga las imágenes relacionadas y permite filtrado opcional
        """
        queryset = super().get_queryset()
    
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Maneja la creación de posts con imágenes en una sola solicitud
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
     
        post = serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "mensaje": "Publicación y imágenes creadas correctamente",
                "post": serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    @action(detail=True, methods=['get'])
    def imagenes(self, request, pk=None):
        """
        Endpoint adicional para obtener solo las imágenes de un post
        """
        post = self.get_object()
        imagenes = post.imagenes.all()
        serializer = ImagenesSerializer(imagenes, many=True)
        return Response(serializer.data)


    @action(detail=False, methods=['post'])
    def create_post_with_images(self, request):
        """
        Versión alternativa del create que mantiene compatibilidad con el frontend existente
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        
        return Response({
            "mensaje": "Publicación y imágenes creadas correctamente",
            "post_id": post.id
        }, status=status.HTTP_201_CREATED)
    
    
class PostsImgViewset(viewsets.ModelViewSet):
    queryset = Imagenes.objects.all()
    serializer_class = PostImagenSerializer
    renderer_classes = [JSONRenderer]