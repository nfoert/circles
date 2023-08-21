from django.shortcuts import render, HttpResponse
from django.contrib.staticfiles import finders


def index(request):
    context = {}

    result = finders.find("fonts/Archiform.otf")
    searched_locations = finders.searched_locations

    print(result)
    print(searched_locations)

    return render(request, "index.html", context)