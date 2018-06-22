# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, Http404

# Create your views here.
def home(request):
    context = {}
    return render(request, 'pollution_map/home.html', context)

def map(request):
    context = {}
    return render(request, 'pollution_map/map.html', context)

def get_cursor_json(request):
    lat = 0
    lon = 0
    try:
        if 'lat' in request.GET:
            lat = float(request.GET['lat'])
        if 'lon' in request.GET:
            lon = float(request.GET['lon'])
    except:
        pass
    coord = [lat, lon]
    return HttpResponse(coord, content_type='application/json')

def past_data(request):
    context = {}
    return render(request, 'pollution_map/home.html', context)

def download(request):
    context = {}
    return render(request, 'pollution_map/home.html', context)

def contact(request):
    context = {}
    return render(request, 'pollution_map/home.html', context)

def about(request):
    context = {}
    return render(request, 'pollution_map/home.html', context)