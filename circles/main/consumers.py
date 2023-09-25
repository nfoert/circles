import json
import asyncio
from asgiref.sync import sync_to_async
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer, StopConsumer
from main.models import User, Circle, Conversation, Message, Server
from django.contrib.auth.hashers import check_password
from channels.db import database_sync_to_async
from django.db.models import Q

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

            recent_messages = await self.get_initial_messages()
            recent_messages_packet = await self.generate_recent_messages_packet(recent_messages)

            await self.send(json.dumps(recent_messages_packet))

            self.update_loop_task = asyncio.ensure_future(self.update_loop())

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

        elif text_data["type"] == "get_users_conversations":
            
            conversations = await self.get_users_conversations()
            number_of_online_users = await self.get_total_online_users()
            number_of_online_users_in_circle = await self.get_total_online_users_in_circle()

            packet = {
                "type": "user_conversations",
                "conversations": conversations,
                "total_online": number_of_online_users,
                "total_online_in_circle": number_of_online_users_in_circle,
            }

            await self.send(json.dumps(packet))

        elif text_data["type"] == "switch_conversation":
            result = await self.switch_conversation(text_data["name"], text_data["conversation_type"])

        elif text_data["type"] == "send_message":
            result = await self.send_message(text_data["message"])

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
        messages_before = await self.get_initial_messages_json() # Now is the list of first 100 messages
        
        
        while True:
            users_in_circle = await self.get_users_in_circle() 
            messages = await self.get_initial_messages_json() # TODO: Make this not limited

            if users_in_circle_before != users_in_circle: # New changes
                users_in_circle_before = users_in_circle

                json_to_send =  users_in_circle.copy()
                json_to_send["type"] = "users_update"

                await self.send(json.dumps(json_to_send))

            else: # No new changes
                pass

            if messages != messages_before: # New changes
                new_messages = [item for item in messages if item not in messages_before]

                messages_before = messages

                recent_messages_packet = {
                    "type": "new_messages",
                    "messages": [],
                }

                for message in new_messages:
                    message_json = {
                        "text": message["text"],
                        "user": message["user"],
                        "date_time_created": message["date_time_created"],
                    }

                    recent_messages_packet["messages"].append(message_json)

                await self.send(json.dumps(recent_messages_packet))

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

    @database_sync_to_async
    def get_users_conversations(self):
        me = User.objects.filter(username=self.username)[0]
        conversations = Conversation.objects.filter(users=me)
        
        list = []

        for conversation in conversations:
            convo = {
                "name": conversation.name,
                "number_of_users": conversation.users.count()
            }
            list.append(convo)

        return list
    
    @database_sync_to_async
    def get_total_online_users(self):
        users = User.objects.filter(online=True)
        
        return len(users)
    
    @database_sync_to_async
    def get_total_online_users_in_circle(self):
        me = User.objects.filter(username=self.username)

        online_users_in_circle = User.objects.filter(online=True, location_circle=me[0].location_circle)

        return len(online_users_in_circle)
    
    @database_sync_to_async
    def switch_conversation(self, name, conversation_type):
        me = User.objects.filter(username=self.username)[0]

        print(name, conversation_type)

        if conversation_type == "server":
            me.current_conversation_type = "server"
            me.save()

            return True


        elif conversation_type == "circle":
            me.current_conversation_type = "circle"
            me.save()

            return True

        elif conversation_type == "normal":
            conversation = Conversation.objects.filter(users=me,name=name)[0]

            me.current_conversation = conversation
            me.current_conversation_type = "normal"
            me.save()

            return True

        else:
            print("That conversation type is not recognized.")
            self.disconnect()

            return False
        
    @database_sync_to_async
    def send_message(self, message):
        me = User.objects.filter(username=self.username)[0]
        message = Message(text=message, user=me)
        message.save()

        if me.current_conversation_type == "normal":
            message.conversation = me.current_conversation
            message.current_conversation_type = "normal"

        elif me.current_conversation_type == "circle":
            message.circle = me.location_circle
            message.current_conversation_type = "circle"

        elif me.current_conversation_type == "server":
            message.current_conversation_type = "server"

        else:
            print("That conversation type is not known!")
            return False

        message.save()

        return True
    
    @database_sync_to_async
    def get_initial_messages(self):
        '''Returns a QuerySet of initial messages'''
        # Thanks to various people here https://stackoverflow.com/questions/6574003/django-limiting-query-results
        me = User.objects.filter(username=self.username)[0]

        if me.current_conversation_type == "normal":
            messages = Message.objects.filter(conversation=me.current_conversation)[:100]
            return messages

        elif me.current_conversation_type == "circle":
            messages = Message.objects.filter(circle=me.location_circle)[:100]
            return messages


        elif me.current_conversation_type == "server":
            messages = Message.objects.filter(conversation__isnull=True)[:100]
            return messages


        else:
            print("That conversation type is not known!")
            return False
        
    @database_sync_to_async
    def get_initial_messages_json(self):
        '''Returns json of initial messages'''
        # Thanks to various people here https://stackoverflow.com/questions/6574003/django-limiting-query-results
        me = User.objects.filter(username=self.username)[0]

        if me.current_conversation_type == "normal":
            messages = Message.objects.filter(conversation=me.current_conversation)[:100]

        elif me.current_conversation_type == "circle":
            messages = Message.objects.filter(circle=me.location_circle)[:100]


        elif me.current_conversation_type == "server":
            messages = Message.objects.filter(conversation__isnull=True)[:100]


        else:
            print("That conversation type is not known!")
            return False
        

        recent_messages = []

        for message in messages:
            message_json = {
                "text": message.text,
                "user": message.user.username,
                "date_time_created": message.date_time_created.strftime("%s"),
            }

            recent_messages.append(message_json)


        return recent_messages

    @database_sync_to_async
    def generate_recent_messages_packet(self, recent_messages):
        
        recent_messages_packet = {
            "type": "recent_messages",
            "messages": [],
        }

        for message in recent_messages:
            message_json = {
                "text": message.text,
                "user": message.user.username,
                "date_time_created": message.date_time_created.strftime("%s"),
            }

            recent_messages_packet["messages"].append(message_json)

        return recent_messages_packet
        