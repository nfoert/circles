import json
import asyncio
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer, StopConsumer
from main.models import User, Circle, Conversation, Message, Server
from django.contrib.auth.hashers import check_password
from channels.db import database_sync_to_async

# Thanks to BAZA's answer here https://stackoverflow.com/questions/66936893/django-channels-sleep-between-group-sends
class MainConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        await self.accept()

        if await self.check_user():

            location = await self.get_location()
            position = await self.get_position()

            initial_message = {
                "type": "initial_message",
                "username": self.username,
                "location_server": location[0],
                "location_circle": location[1],
                "x": position[0],
                "y": position[1],
            }

            await self.send(json.dumps(initial_message))

            

            self.update_loop_task = asyncio.create_task(self.update_loop())
                


        else:
            self.close()

    async def disconnect(self, close_code):
        print("disconnected")
        await self.go_offline()
        pass

    async def receive(self, text_data):
        text_data = json.loads(text_data)
        if text_data["type"] == "position_update":
            await self.set_position(text_data["x"], text_data["y"])

        elif text_data["type"] == "create_conversation":
            await self.create_conversation(text_data["name"], text_data["users"])

        elif text_data["type"] == "username_search":
            usernames = await self.search_for_usernames(text_data["string"])

            packet = {
                "type": "username_search_results",
                "users": usernames,
            }

            await self.send(json.dumps(packet))

        else:
            print("Not known packet")


    @database_sync_to_async
    def check_user(self):

        username = self.scope["session"]["username"]
        password = self.scope["session"]["password"]

        self.username = username
        self.password = password

        user = User.objects.filter(username=username)

        if len(user) == 1:
            if check_password(password, user[0].password):
                print("Logged in")
                user[0].online = True
                user[0].save()
                return True

            else:
                return False

        elif len(user) > 1:
            return False

        elif len(user) == 0:
            return False
        
    @database_sync_to_async
    def get_position(self):

        user = User.objects.filter(username=self.username)[0]
        return [user.x, user.y]
    
    @database_sync_to_async
    def get_location(self):
        
        user = User.objects.filter(username=self.username)[0]

        if not user.location_server:
            server = False

        else:
            server = user.location_server.name

        if not user.location_circle:
            circle = False

        else:
            circle = str(user.location_circle)

        
        if not user.location_server and not user.location_circle:
            print("KLAFJKAHFJKASHF AJKHFKJAHFJKHAKDJHFJKAHFJK USER IS NOT IN SERVER OR CIRCLE")
            self.disconnect(1011)

        try:
            circles = circle.split(" / ")
            return [server, circles]
        except:
            print("AHFJKHAKJHFJKAHDFJKHKJAH")
            pass

    @database_sync_to_async
    def get_users_in_circle(self):

        me = User.objects.filter(username=self.username)[0]
        users = User.objects.filter(location_circle=me.location_circle, online=True)

        users_json = {
            "users": []
        }

        for user in users:
            if user.username == me.username:
                pass

            else:
                user_snippet = {
                    "username": user.username,
                    "x": user.x,
                    "y": user.y,
                }
                users_json["users"].append(user_snippet)

        return users_json
    
    async def update_loop(self):
        users_in_circle_before = None
        
        while True:
            users_in_circle = await self.get_users_in_circle()

            if users_in_circle_before != users_in_circle: # New changes
                users_in_circle_before = users_in_circle

                json_to_send =  users_in_circle.copy()
                json_to_send["type"] = "users_update"

                await self.send(json.dumps(json_to_send))

            else: # No new changes
                pass

            await asyncio.sleep(0.5)

    @database_sync_to_async
    def go_offline(self):
        me = User.objects.filter(username=self.username)[0]
        me.online = False
        me.save()
        print("User marked as offline.")

    @database_sync_to_async
    def get_initial_messages(self):

        me = User.objects.filter(username=self.username)[0]

    @database_sync_to_async
    def search_for_usernames(self, string):
        users = User.objects.filter(username__contains=string)
        users_list = []

        if users:
            for user in users:
                users_list.append(user.username)

            return users_list
        
    @database_sync_to_async
    def set_position(self, x, y):
        user = User.objects.filter(username=self.username)[0]
        user.x = x
        user.y = y
        user.save()

    @database_sync_to_async
    def create_conversation(self, name, users):
        conversation = Conversation(name=name)
        conversation.save()

        for user in users:
            selected_user = User.objects.filter(username=user)
            print(selected_user[0])
            conversation.users.add(selected_user[0])

        conversation.save()

        
        
        
        
        