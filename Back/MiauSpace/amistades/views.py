from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.db.models import Q
from .models import Amistades
from .serializers import AmistadesSerializer
from usuario_mascota.models import Mascota

class AmistadesViewset(viewsets.ModelViewSet):
    queryset = Amistades.objects.all()
    serializer_class = AmistadesSerializer
    renderer_classes = [JSONRenderer]
    
    # Acción personalizada para enviar solicitud de amistad
    @action(detail=True, methods=['post'])
    def enviar_solicitud(self, request, pk=None):
        try:
            mascota_solicitante = Mascota.objects.get(id=pk)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota solicitante no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtener el ID de la mascota receptora desde el cuerpo de la solicitud
        mascota_receptora_id = request.data.get('mascota_receptora')
        try:
            mascota_receptora = Mascota.objects.get(id=mascota_receptora_id)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota receptora no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si ya existe una solicitud pendiente entre estas dos mascotas
        solicitud_existente = Amistades.objects.filter(
            Q(mascota_solicitante=mascota_solicitante, mascota_receptora=mascota_receptora) |
            Q(mascota_solicitante=mascota_receptora, mascota_receptora=mascota_solicitante),
            estado='pendiente'
        ).exists()

        if solicitud_existente:
            return Response({'error': 'Ya existe una solicitud pendiente entre estas dos mascotas'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la nueva solicitud de amistad
        nueva_solicitud = Amistades.objects.create(
            mascota_solicitante=mascota_solicitante,
            mascota_receptora=mascota_receptora,
            estado='pendiente'
        )

        return Response({'mensaje': 'Solicitud de amistad enviada con éxito'}, status=status.HTTP_201_CREATED)
    
    # Acción personalizada para aceptar solicitud
    @action(detail=True, methods=['post'])
    def aceptar_solicitud(self, request, pk=None):
        try:
            solicitud = Amistades.objects.get(id=pk)
        except Amistades.DoesNotExist:
            return Response({'error': 'Solicitud no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        if solicitud.estado == 'pendiente':
            solicitud.aceptar()
            return Response({'mensaje': 'Solicitud aceptada con éxito.'}, status=status.HTTP_200_OK)
        return Response({'error': 'La solicitud ya está en otro estado.'}, status=status.HTTP_400_BAD_REQUEST)

    # Acción personalizada para rechazar solicitud
    @action(detail=True, methods=['post'])
    def rechazar_solicitud(self, request, pk=None):
        try:
            solicitud = Amistades.objects.get(id=pk)
        except Amistades.DoesNotExist:
            return Response({'error': 'Solicitud no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        if solicitud.estado == 'pendiente':
            solicitud.rechazar()
            return Response({'mensaje': 'Solicitud rechazada con éxito.'}, status=status.HTTP_200_OK)
        return Response({'error': 'La solicitud ya está en otro estado.'}, status=status.HTTP_400_BAD_REQUEST)

    # Acción personalizada para obtener los amigos de una mascota
    @action(detail=True, methods=['get'])
    def obtener_amigos(self, request, pk=None):
        try:
            mascota = Mascota.objects.get(id=pk)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Filtra las amistades donde la mascota esté involucrada
        amistades = Amistades.objects.filter(
            Q(mascota_solicitante=mascota, estado='aceptado') |
            Q(mascota_receptora=mascota, estado='aceptado')
        )

        # Recopila las mascotas relacionadas con las amistades aceptadas
        amigos = []
        for amistad in amistades:
            if amistad.mascota_solicitante != mascota:
                amigos.append(amistad.mascota_solicitante)
            if amistad.mascota_receptora != mascota:
                amigos.append(amistad.mascota_receptora)

        # Devuelve los amigos como un formato adecuado
        amigos_data = [{"id": amigo.id, "nombre": amigo.nombre_usuario, "foto_perfil": amigo.foto_perfil} for amigo in amigos]

        return Response(amigos_data, status=status.HTTP_200_OK)
    
    # Acción personalizada para obtener solicitudes de amistad pendientes
    @action(detail=True, methods=['get'])
    def obtener_solicitudes_pendientes(self, request, pk=None):
        try:
            mascota = Mascota.objects.get(id=pk)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        solicitudes_pendientes = Amistades.objects.filter(
            mascota_receptora=mascota,
            estado='pendiente'
        )

        solicitudes_data = [{
            "id": solicitud.id,
            "mascota_solicitante_id": solicitud.mascota_solicitante.id,
            "mascota_solicitante_nombre": solicitud.mascota_solicitante.nombre_usuario,
            "mascota_solicitante_foto": solicitud.mascota_solicitante.foto_perfil
        } for solicitud in solicitudes_pendientes]

        return Response(solicitudes_data, status=status.HTTP_200_OK)
