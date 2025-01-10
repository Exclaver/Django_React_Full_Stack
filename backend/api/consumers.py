import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NoteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("notes", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notes", self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_note(self, event):
        note = event["note"]
        await self.send(text_data=json.dumps({
            'note':note
        }))

class ParkingRecordConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("parking_records", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("parking_records", self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_parking_record(self, event):
        parking_record = event["parking_record"]
        await self.send(text_data=json.dumps({
            'parking_record': parking_record
        }))