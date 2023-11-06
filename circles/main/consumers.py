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
        server = await self.get_server_information()

        if await self.check_user():
            if server["websocket_accept"] == True:
                await self.accept()

            elif self.username in server["admins"]:
                await self.accept()

            else:
                print("Websocket connection is disabled")
                await self.close()


            location = await self.get_location()
            position = await self.get_position()
            conversation = await self.get_current_conversation()
            circles = await self.get_circles_in_users_circle()
            user_data = await self.get_userdetails(self.username)

            initial_message = {
                "type": "initial_message",

                "username": self.username,
                "display_name": user_data["display_name"],
                "bio": user_data["bio"],
                "primary_color": user_data["primary_color"],
                "secondary_color": user_data["secondary_color"],

                "location_server": location[0],
                "location_circle": location[1],
                "x": position[0],
                "y": position[1],
            }
            
            initial_message["current_conversation"] = conversation
            initial_message["circles"] = circles

            await self.send(json.dumps(initial_message))

            recent_messages = await self.get_initial_messages()
            recent_messages_packet = await self.generate_recent_messages_packet(recent_messages)

            await self.send(json.dumps(recent_messages_packet))

            user_counts = await self.get_user_counts()
            user_counts_packet = {
                "type": "user_counts",
                "online": user_counts[0],
                "offline": user_counts[1]
            }

            await self.send(json.dumps(user_counts_packet))

            self.update_loop_task = asyncio.ensure_future(self.update_loop())

        else:
            self.close()

    async def disconnect(self, close_code):
        print("Disconnected")
        await self.go_offline()
        pass

    async def receive(self, text_data):
        text_data = json.loads(text_data)

        if text_data["type"] == "position_update":
            await self.set_position(text_data["x"], text_data["y"])

        elif text_data["type"] == "create_conversation":
            await self.create_conversation(text_data["name"], text_data["users"])
            await self.send_notification("Created Conversation", f"Created new Conversation {text_data['name']}", "normal")

        elif text_data["type"] == "username_search":
            usernames = await self.search_for_usernames(text_data["string"])

            packet = {
                "type": "username_search_results",
                "users": usernames,
            }

            await self.send(json.dumps(packet))

        elif text_data["type"] == "get_users_conversations":
            
            conversations = await self.get_users_conversations()
            number_of_online_users = await self.get_user_counts()
            number_of_online_users_in_circle = await self.get_total_online_users_in_circle()

            packet = {
                "type": "user_conversations",
                "conversations": conversations,
                "total_online": number_of_online_users[0],
                "total_online_in_circle": number_of_online_users_in_circle,
            }

            await self.send(json.dumps(packet))

        elif text_data["type"] == "switch_conversation":
            result = await self.switch_conversation(text_data["name"], text_data["conversation_type"])

        elif text_data["type"] == "send_message":
            result = await self.send_message(text_data["message"])

        elif text_data["type"] == "change_circle":
            result = await self.change_circle(text_data["direction"], text_data["name"])

            circles_in_current_circle = await self.get_circles_in_users_circle()

            switch_circle_packet = {
                "type": "circles_in_circle",
            }

            switch_circle_packet["circles"] = circles_in_current_circle
            await self.send(json.dumps(switch_circle_packet))

            location = await self.get_location()
            current_location_packet = {
                "type": "current_location",
                "server": location[0],
                "circle": location[1]
            }

            await self.send(json.dumps(current_location_packet))

        elif text_data["type"] == "create_circle":
            await self.create_circle(text_data["name"], text_data["x"], text_data["y"])
            await self.send_notification("Circle Created", f"Created new Circle {text_data['name']}", "normal")

        elif text_data["type"] == "get_userdetails":
            userdetails = await self.get_userdetails(text_data["username"])

            userdetails["type"] = "userdetails"

            await self.send(json.dumps(userdetails))

        elif text_data["type"] == "dm_user":
            # Create conversation
            create_dm = await self.dm_user(text_data["username"])

            # Fetch all conversations
            conversations = await self.get_users_conversations()
            number_of_online_users = await self.get_user_counts()
            number_of_online_users_in_circle = await self.get_total_online_users_in_circle()

            packet = {
                "type": "user_conversations",
                "conversations": conversations,
                "total_online": number_of_online_users[0],
                "total_online_in_circle": number_of_online_users_in_circle,
            }

            await self.send(json.dumps(packet))

            # Switch to new conversation
            result = await self.switch_conversation(create_dm[1], "normal")

            # Send recent messages in Conversation
            recent_messages = await self.get_initial_messages()
            recent_messages_packet = await self.generate_recent_messages_packet(recent_messages)

            await self.send(json.dumps(recent_messages_packet))

            if create_dm[0] == True:
                await self.send_notification("DM Created", f"Created a conversation with {create_dm[1]}", "normal")

            else:
                await self.send_notification("Switched to DM", f"Switched to conversation with {create_dm[1]}", "normal")

        elif text_data["type"] == "get_profile_details":
            userdetails = await self.get_userdetails(self.username)

            userdetails["type"] = "profile_details"
            await self.send(json.dumps(userdetails))

        elif text_data["type"] == "save_profile_details":
            result = await self.save_profile_details(text_data)

        elif text_data["type"] == "sign_out":
            await self.sign_out()
            
            await self.close()


        else:
            print("Not known packet")

    @sync_to_async
    def sign_out(self):
        self.scope["session"].flush()
        self.scope["session"].save()


    @database_sync_to_async
    def check_user(self):

        username = self.scope["session"]["username"]
        password = self.scope["session"]["password"]

        self.username = username
        self.password = password

        user = User.objects.filter(username=username)

        if len(user) == 1:
            if check_password(password, user[0].password):
                print(f"{self.username} logged in")
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
            print("User is not in a Server or Circle!")
            self.disconnect(1011)

        if circle != False:
            try:
                circles = circle.split(" / ")
                return [server, circles]
            except:
                print("There was a problem when splitting the user's Circle location.")
                pass

        else:
            return [server, False]

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
                    "display_name": user.display_name,
                    "primary_color": user.primary_color,
                    "secondary_color": user.secondary_color,
                    "x": user.x,
                    "y": user.y,
                }
                users_json["users"].append(user_snippet)

        return users_json
    
    async def update_loop(self):
        users_in_circle_before = None
        messages_before = await self.get_initial_messages_json() # Now is the list of first 100 messages
        user_counts_before = await self.get_user_counts()
        conversations_before = await self.get_users_conversations()
        
        
        while True:
            users_in_circle = await self.get_users_in_circle() 
            messages = await self.get_initial_messages_json() # TODO: Make this not limited
            user_counts = await self.get_user_counts()
            conversations = await self.get_users_conversations()

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
                        "id": message["id"]
                    }

                    recent_messages_packet["messages"].append(message_json)

                await self.send(json.dumps(recent_messages_packet))

            else: # No new changes
                pass


            if user_counts != user_counts_before: # New changes
                user_counts_before = user_counts

                user_counts_packet = {
                    "type": "user_counts",
                    "online": user_counts[0],
                    "offline": user_counts[1]
                }

                await self.send(json.dumps(user_counts_packet))

            else: # No new changes
                pass

            if conversations_before != conversations: # New changes
                new_conversations = [item for item in conversations if item not in conversations_before]

                conversations_before = conversations

                new_conversations_packet = {
                    "type": "new_conversations",
                    "conversations": new_conversations
                }

                await self.send(json.dumps(new_conversations_packet))

            await asyncio.sleep(0.5)

    @database_sync_to_async
    def go_offline(self):
        me = User.objects.filter(username=self.username)[0]
        me.online = False
        me.save()
        print(f"{self.username} went offline")

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
    def get_total_online_users_in_circle(self):
        me = User.objects.filter(username=self.username)

        online_users_in_circle = User.objects.filter(online=True, location_circle=me[0].location_circle)

        return len(online_users_in_circle)
    
    @database_sync_to_async
    def switch_conversation(self, name, conversation_type):
        me = User.objects.filter(username=self.username)[0]

        if conversation_type == "server":
            me.current_conversation_type = "server"
            me.save()

            return True


        elif conversation_type == "circle":
            me.current_conversation_type = "circle"
            me.save()

            return True

        elif conversation_type == "normal": # TODO: Detect if conversation does not exist
            conversation = Conversation.objects.filter(name=name, users=me)[0]

            me.current_conversation = conversation
            me.current_conversation_type = "normal"
            me.save()

            return True

        else:
            print("That conversation type is not recognized.")
            self.close()

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
            messages = Message.objects.filter(circle=me.location_circle, conversation__isnull=True)[:100]
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
                "id": message.id
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
                "id": message.id
            }

            recent_messages_packet["messages"].append(message_json)

        return recent_messages_packet
    
    @database_sync_to_async
    def get_current_conversation(self):
        '''
        Gets the current conversation that a user is selected on
        '''
        me = User.objects.filter(username=self.username)[0]
        server = Server.objects.all()[0]
        total_users_in_server = User.objects.all().count()
        total_users_in_circle = User.objects.filter(location_circle=me.location_circle).count()
        
    
        if me.current_conversation_type == "normal":
            if me.current_conversation:
                response = {
                    "type": "normal",
                    "name": me.current_conversation.name,
                    "number_of_users": me.current_conversation.users.count()
                }

            else: # User is not in a Conversation, so put them in the global server chat
                response = {
                    "type": "server",
                    "name": server.name,
                    "number_of_users": total_users_in_server
                }

        elif me.current_conversation_type == "circle":
            response = {
                "type": "circle",
                "name": me.location_circle.name,
                "number_of_users": total_users_in_circle
            }


        elif me.current_conversation_type == "server":
            response = {
                "type": "server",
                "name": server.name,
                "number_of_users": total_users_in_server
            }

        return response
    
    @database_sync_to_async
    def get_circles_in_users_circle(self): # TODO: User may not be in a Circle
        '''
        Returns a list of the Circles on the floor of the user's current Circle
        '''
        me = User.objects.filter(username=self.username)[0]
        circles = Circle.objects.filter(parent_circle=me.location_circle)

        circles_list = []

        for circle in circles:
            circle_json = {
                "name": circle.name,
                "x": circle.x,
                "y": circle.y
            }

            circles_list.append(circle_json)

        return circles_list
    
    @database_sync_to_async
    def change_circle(self, direction, name):
        '''
        Switches the users current Circle
        If direction = "forwards", expects a string of the name of the Circle you're entering
        If direction = "backwards", moves to the parent Circle, name is not required
        If direction = "absolute", expects the full path of the Circle to go to
        '''
        me = User.objects.filter(username=self.username)[0]
        server = Server.objects.all()[0]

        if direction == "forwards":
            circles = Circle.objects.all()

            if me.location_circle != None:
                for circle in circles: # Messy but does the job
                    if str(circle) == (str(me.location_circle) + " / " + name):
                        me.location_circle = circle
                        me.location_server = None
                        break

            else:
                for circle in circles: # Messy but does the job
                    if str(circle) == (str(server.name) + " / " + name):
                        me.location_circle = circle
                        me.location_server = None
                        break


        elif direction == "backwards":
            me.location_circle = me.location_circle.parent
            # TODO: I don't know if this works, this has not been tested

        elif direction == "absolute":
            circles = Circle.objects.all()

            string = ""
            for item in name:
                string = string + item + ' / '


            string = string[:-3] # Remove last three characters from the string " / "
    
            for circle in circles:
                if str(server.name) == string:
                    me.location_circle = None
                    me.location_server = server
                    break

                elif str(circle) == string:
                    me.location_server = None
                    me.location_circle = circle
                    break

        # Now, set the user's position to the center
        me.x = 0
        me.y = 0
        me.save()

    @database_sync_to_async
    def get_user_counts(self):
        '''
        Returns a list. The first value is the number of users online. The second value is the number of users that are offline.
        '''

        users_online = User.objects.filter(online=True).count()
        users_offline = User.objects.filter(online=False).count()

        return [users_online, users_offline]
    
    @database_sync_to_async
    def create_circle(self, name, x, y):
        '''
        Creates a current circle with name of 'name'.
        Creator of the circle is the current user
        '''
        me = User.objects.filter(username=self.username)[0]

        circle = Circle(name=name, creator=me, parent_circle=me.location_circle, parent_server=me.location_server, x=x, y=y)
        circle.save()

    @database_sync_to_async
    def get_userdetails(self, username):
        user = User.objects.filter(username=username)

        if len(user) == 1:
            userdetails = { # TODO: Include color and other information soon
                "username": user[0].username,
                "display_name": user[0].display_name,
                "bio": user[0].bio,
                "primary_color": user[0].primary_color,
                "secondary_color": user[0].secondary_color
            }

            return userdetails

        elif len(user) == 0:
            print("Couldn't find that user!") # TODO: Create send_notification packet so that the client knows

        else:
            print("There is more than one user with that username!")

    async def send_notification(self, title, text, style="normal"):
        send_notification_json = {
            "type": "notification",
            "title": title,
            "text": text,
            "style": style
        }

        await self.send(json.dumps(send_notification_json))

    @database_sync_to_async
    def dm_user(self, username):
        '''
        When you DM a user, creates a conversation with you as the owner.
        TODO: Check if that user does not exist

        Returns False if the Conversation already exists
        Returns True if a new Conversation was created
        '''
        me = User.objects.filter(username=self.username)[0]
        print(username)
        them = User.objects.filter(username=username)[0]

        name = f"{me.username}, {username}"
        other_name = f"{username}, {me.username}"

        conversation_exists = Conversation.objects.filter(name=name) | Conversation.objects.filter(name=other_name)
        conversation_exists = conversation_exists.filter(creator=me) | conversation_exists.filter(creator=them)

        if len(conversation_exists) >= 1:
            return [False, conversation_exists[0].name] # Conversation already exists

        elif len(conversation_exists) == 0:
        
            conversation = Conversation(name=name, creator=me)
            conversation.save()

            conversation.users.add(me)
            conversation.users.add(them)

            conversation.save()

            return [True, name] # Return the name of the Conversation
        
    @database_sync_to_async
    def save_profile_details(self, json):
        '''
        Saves profile details from the packet recieved
        TODO: Send notification from here instead of the client in case there is an error
        '''
        me = User.objects.filter(username=self.username)[0] # TODO: Detect if there's multiple or no users

        me.display_name = json["display_name"]
        me.bio = json["bio"]
        me.primary_color = json["primary_color"]
        me.secondary_color = json["secondary_color"]

        me.save()

    @database_sync_to_async
    def get_server_information(self):
        server = Server.objects.all()[0]

        admins = []

        for admin in server.admins.all():
            admins.append(admin.username)

        server_info = {
            "name": server.name,
            "ip": server.ip,
            "admins": admins,
            "production": server.production,
            "account_creation": server.account_creation,
            "websocket_accept": server.websocket_accept
        }

        return server_info



