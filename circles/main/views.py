from django.shortcuts import render, HttpResponse, redirect
from django.contrib.staticfiles import finders
from authentication.views import sign_in
from main.models import ServerInfo

def index(request):

    server_info = ServerInfo.objects.all()[0].name

    context = {
        "server_name": server_info
    }

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        print(username_session)
        print(password_session)

        return sign_in(request)

    except KeyError:
        context = {}
        print("No session!")
        return render(request, "index.html", context)
    
def main(request):

    server_info = ServerInfo.objects.all()[0].name

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        context = {
            "username": username_session,
            "server_info" : server_info
        }

        return render(request, "main.html", context)
    
    except KeyError:
        context = {}
        print("No session!")
        return render(request, "index.html", context)