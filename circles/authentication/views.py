from django.shortcuts import render, HttpResponse
from authentication.models import User, WhitelistedEmails
from django.contrib.auth.hashers import make_password, check_password
import datetime
from main.models import Server

def index(request):
    return HttpResponse("index")

def sign_in(request):
    server_info = Server.objects.all()[0]

    

    if request.method == "GET" or request.method == "POST":
        if "Username" in request.headers and "Password" in request.headers:
            username = request.headers["Username"]
            password = request.headers["Password"]

            log_in = True
        
        else:
            try:
                username = request.session["username"]
                password = request.session["password"]

                log_in = True

            except KeyError:
                print("Missing headers and no session!")
                return HttpResponse("missing headers and no session")
            
        if log_in:
            users = User.objects.filter(username=username)

            if len(users) == 1:

                password_check = check_password(password, users[0].password)
                
                if password_check:
                    request.session["username"] = username
                    request.session["password"] = password
                    print("signed in")

                    context = {
                        "server_name": server_info.name,
                        "server_ip": server_info.ip,
                        "production": server_info.production,
                        "username": username,
                    }
                    
                    return render(request, "main.html", context)
                
                else:
                    print("Password wrong")
                    return HttpResponse("incorrect password")
            
            elif len(users) == 0:
                print("No accounts exist")
                return HttpResponse("no accounts exist")
            
            elif len(users) > 1:
                print("Multiple accounts exist")
                return HttpResponse("multiple accounts exist")
        
    else:
        print("Request is not a GET or POST request")
        return HttpResponse("request is not a get or post request")

def create_account(request):
    
    if request.method == "GET":
        if "Username" in request.headers and "Password" in request.headers and "Email" in request.headers:
            username = request.headers["Username"]
            password = request.headers["Password"]
            email = request.headers["Email"]

            hashed_password = make_password(password)
            
            user = User(username=username, password=hashed_password, email=email, date_created=datetime.datetime.now()).save()

            request.session["username"] = username
            request.session["password"] = password

            print("account created!")
            return sign_in(request)
            
        
        else:
            return HttpResponse("Missing headers")
        
    else:
        return HttpResponse("Request is not a GET request.")



