from django.shortcuts import render, HttpResponse, redirect
from django.contrib.staticfiles import finders
from authentication.views import sign_in
from main.models import Server
import os

def index(request):
    commit_hash = os.popen("git rev-parse --short HEAD").read()
    server_info = Server.objects.all()[0]
    
    context = {
        "server_name": server_info.name,
        "server_ip": server_info.ip,
        "production": server_info.production,
        "commit": commit_hash
    }

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        return sign_in(request)

    except KeyError:
        context = {
            "server_name": server_info.name,
            "server_ip": server_info.ip,
            "production": server_info.production,
            "commit": commit_hash
        }
        print("No session!")
        return render(request, "index.html", context)
    
def main(request):
    commit_hash = os.popen("git rev-parse --short HEAD").read()

    server_info = Server.objects.all()[0]

    try:
        username_session = request.session["username"]
        password_session = request.session["password"]

        context = {
            "username": username_session,
            "server_name": server_info.name,
            "server_ip": server_info.ip,
            "production": server_info.production,
            "commit": commit_hash
        }

        return render(request, "main.html", context)
    
    except KeyError:
        context = {
            "server_name" : server_info.name,
            "server_ip": server_info.ip,
            "production": server_info.production,
            "commit": commit_hash
        }
        print("No session!")
        return render(request, "index.html", context)
    
def privacypolicy(request):
    return render(request, "privacypolicy.html")