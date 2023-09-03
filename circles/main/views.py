from django.shortcuts import render, HttpResponse, redirect
from django.contrib.staticfiles import finders
from authentication.views import sign_in
from main.models import Server

def index(request):

    server_info = Server.objects.all()[0]

    context = {
        "server_name": server_info.name,
        "server_ip": server_info.ip
    }

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        return sign_in(request)

    except KeyError:
        context = {
            "server_name": server_info.name,
            "server_ip": server_info.ip
        }
        print("No session!")
        return render(request, "index.html", context)
    
def main(request):

    server_name = Server.objects.all()[0].name

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        context = {
            "username": username_session,
            "server_name" : server_name
        }

        return render(request, "main.html", context)
    
    except KeyError:
        context = {
            "server_name" : server_name
        }
        print("No session!")
        return render(request, "index.html", context)