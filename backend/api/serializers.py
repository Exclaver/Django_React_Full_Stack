from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,CustomUser,Vehicle,ParkingRecord


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Vehicle
        fields=["license_plate","owner"]

class UserDetailSerializer(serializers.ModelSerializer):
    vehicles=VehicleSerializer(many=True)
    class Meta:
        model=CustomUser
        fields=["id","username","first_name","email","vehicles","credits","plate_number"]

class VehicleRegistrationSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    license_plate=serializers.CharField()


    def validate(self,data):
        username=data.get("username")
        password=data.get("password")
        license_plate=data.get("license_plate")
        if not username or not password or not license_plate:
            raise serializers.ValidationError("All fields are required.")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        if Vehicle.objects.filter(license_plate=license_plate).exists():
            raise serializers.ValidationError("Vehicle already exists.")

        data["user"] = user
        return data
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=["id","username","password","first_name","email"]
        extra_kwargs={"password":{"write_only":True}}
    def create(self,validated_data):
        user=CustomUser.objects.create_user(**validated_data)
        return user
    
class Noteserializer(serializers.ModelSerializer):
    class Meta:
        model=Note
        fields=["id","title","content","created_at","author"]
        extra_kwargs={"author":{"read_only":True}}


class VehicleRecordSerializer(serializers.ModelSerializer):
    Vehicle = serializers.SlugRelatedField(slug_field='license_plate', queryset=Vehicle.objects.all())
    
    class Meta:
        model = ParkingRecord
        fields = ["id", "Vehicle", "entry_time", "exit_time", "charge"]

    def validate_Vehicle(self, value):
        # `value` is already a Vehicle instance, so no need to query it again
        if not value:  # Check if vehicle instance exists
            raise serializers.ValidationError("Vehicle does not exist.")
        return value

   