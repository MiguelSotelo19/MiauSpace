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
    
    # Acción personalizada para enviar solicitud
    @action(detail=True, methods=['post'])
    def enviar_solicitud(self, request, pk=None):
        try:
            mascota_solicitante = Mascota.objects.get(id=pk)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota solicitante no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        mascota_receptora_id = request.data.get('mascota_receptora')

        if not mascota_receptora_id:
            return Response({'error': 'Debe proporcionar una mascota receptora'}, status=status.HTTP_400_BAD_REQUEST)
        
        if int(mascota_receptora_id) == mascota_solicitante.id:
            return Response({'error': 'No puedes enviarte una solicitud de amistad a ti mismo'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            mascota_receptora = Mascota.objects.get(id=mascota_receptora_id)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota receptora no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        solicitud_existente = Amistades.objects.filter(
            Q(mascota_solicitante=mascota_solicitante, mascota_receptora=mascota_receptora) |
            Q(mascota_solicitante=mascota_receptora, mascota_receptora=mascota_solicitante),
            estado='pendiente'
        ).exists()

        if solicitud_existente:
            return Response({'error': 'Ya existe una solicitud pendiente entre estas dos mascotas'}, status=status.HTTP_400_BAD_REQUEST)

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
            "mascota_receptora_id": solicitud.mascota_receptora.id,
            "mascota_solicitante_nombre": solicitud.mascota_solicitante.nombre_usuario,
            "mascota_solicitante_foto": solicitud.mascota_solicitante.foto_perfil
            
        } for solicitud in solicitudes_pendientes]

        return Response(solicitudes_data, status=status.HTTP_200_OK)
    
    # Acción personalizada para obtener sugerencias de amigos
    @action(detail=True, methods=['get'])
    def sugerencias_amigos(self, request, pk=None):
        try:
            mascota = Mascota.objects.get(id=pk)
        except Mascota.DoesNotExist:
            return Response({'error': 'Mascota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener IDs de mascotas que ya son amigos o tienen solicitud pendiente
        amistades = Amistades.objects.filter(
            Q(mascota_solicitante=mascota) | Q(mascota_receptora=mascota)
        )
        mascotas_excluidas = {mascota.id}
        for amistad in amistades:
            mascotas_excluidas.add(amistad.mascota_solicitante.id)
            mascotas_excluidas.add(amistad.mascota_receptora.id)

        # Obtener mascotas aleatorias que no estén en la lista de excluidas
        sugerencias = Mascota.objects.exclude(id__in=mascotas_excluidas).order_by('?')[:6]
        sugerencias_data = [{"id": sug.id, "nombre": sug.nombre_usuario, "foto_perfil": sug.foto_perfil} for sug in sugerencias]

        return Response(sugerencias_data, status=status.HTTP_200_OK)
    