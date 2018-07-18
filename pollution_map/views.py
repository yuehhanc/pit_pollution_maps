# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, Http404
from pollution_map.forms import FileForm
from pollution_map.models import File
from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from django.core.urlresolvers import reverse
import os, shutil

# Create your views here.
def home(request):
    context = {}
    # currFileName = "Interpolated_Map"
    # try:
    #     # AWS
    #     for file in os.listdir("/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/data/"):
    #         fileName = file.split("/")[-1]
    #         if fileName[:-4] > currFileName[:-4]:
    #             currFileName = fileName
    #     shutil.copyfile("/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/data/" + currFileName, "/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/Interpolated_Map.csv")
    # except:
    #     # Local
    #     for file in os.listdir("pollution_map/static/pollution_map/data/"):
    #         fileName = file.split("/")[-1]
    #         if fileName[:-4] > currFileName[:-4]:
    #             currFileName = fileName
    #     shutil.copyfile("pollution_map/static/pollution_map/data/" + currFileName, "pollution_map/static/pollution_map/Interpolated_Map.csv")
    
    return render(request, 'pollution_map/home.html', context)

def map(request):
    context = {}
    return redirect(reverse('home'), context)

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

def data(request):
    context = {}
    return render(request, 'pollution_map/data.html', context)

def snapshot(request):
    context = {}
    return render(request, 'pollution_map/snapshot.html', context)

def contact(request):
    context = {}
    return render(request, 'pollution_map/contact.html', context)

def about(request):
    context = {}
    return render(request, 'pollution_map/about.html', context)

def upload(request):
    context = {}
    context['success'] = False
    if request.method == 'GET':
        context['form'] = FileForm()
        return render(request, 'pollution_map/upload.html', context)
    new_file = File(add_time = timezone.now())
    # new_file.add_time = timezone.now()
    form = FileForm(request.POST, request.FILES, instance = new_file)
    if not form.is_valid():
        context['form'] = FileForm()
        return render(request, 'pollution_map/upload.html', context)
    context['success'] = True
    form.save()
    return render(request, 'pollution_map/upload.html', context)

def test1(request):
    context = {}
    return render(request, 'pollution_map/test1.html', context)

def test2(request):
    context = {}
    return render(request, 'pollution_map/test2.html', context)

def test3(request):
    context = {}
    return render(request, 'pollution_map/test3.html', context)

def test4(request):
    context = {}
    return render(request, 'pollution_map/test4.html', context)

def test5(request):
    context = {}
    return render(request, 'pollution_map/test5.html', context)

def test6(request):
    context = {}
    return render(request, 'pollution_map/test6.html', context)

def test_menu(request):
    context = {}
    return render(request, 'pollution_map/test_menu.html', context)



