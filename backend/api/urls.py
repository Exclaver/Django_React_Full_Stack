from django.urls import path
from . import views
from .views import AdminNoteList,UserDetailView,VehicleRegistrationView,ParkingRecordListCreate,AdminParkingRecordList

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('admin/notes/',AdminNoteList.as_view(),name='admin-notes'),
    path('admin/parking_records/', AdminParkingRecordList.as_view(), name='admin-parking-records'),
    path('user/details/', UserDetailView.as_view(), name='user-details'),
    path('user/vregister/', VehicleRegistrationView.as_view(), name='vehicle-registration'),
    path('user/createprecord/',ParkingRecordListCreate.as_view(),name='create-parking-record'),
    path('parkingrecords/', ParkingRecordListCreate.as_view(), name='parking-records'),

]