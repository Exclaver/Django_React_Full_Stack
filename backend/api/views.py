from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from .serializers import UserSerializer,Noteserializer,UserDetailSerializer,VehicleRegistrationSerializer
from .models import Note,Vehicle
from api.models import CustomUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = Noteserializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            note = serializer.save(author=self.request.user)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "notes",
                {
                    "type": "send_note",
                    "note": Noteserializer(note).data
                }
            )
        else:
            print(serializer.errors)



class AdminNoteList(generics.ListAPIView):
    queryset = Note.objects.all()
    serializer_class=Noteserializer
    permission_classes=[IsAdminUser]
    
    def get_queryset(self):
        return Note.objects.all().order_by('-created_at')

class NoteDelete(generics.DestroyAPIView):
    serializer_class = Noteserializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset=CustomUser.objects.all()
    serializer_class=UserSerializer
    permission_classes=[AllowAny]

    def perform_create(self, serializer):
        user=serializer.save()
        plate_number = self.request.data.get('plate_number',None)
        if plate_number:
            Vehicle.objects.create(license_plate=plate_number,owner=user)
    
class UserDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        serializer=UserDetailSerializer(user)
        return Response(serializer.data)

class VehicleRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VehicleRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            license_plate = serializer.validated_data["license_plate"]

            if not request.user.is_superuser:
                if request.user != user:
                    raise PermissionDenied("You do not have permission to register a vehicle for another user.")

            Vehicle.objects.create(owner=user, license_plate=license_plate)
            return Response({"message": "Vehicle registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)