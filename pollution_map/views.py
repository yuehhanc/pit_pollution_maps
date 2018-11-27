# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, Http404
from pollution_map.forms import FileForm, EntryForm
from pollution_map.models import File, Entry
from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
# from django.core.urlresolvers import reverse
import os, shutil, sys

### Third Adjustment
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
def home(request):
    context = {}
    context['pop_up'] = True
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
    return render(request, 'pollution_map/home.html', context)

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

def test7(request):
    context = {}
    return render(request, 'pollution_map/test7.html', context)

def test8(request):
    context = {}
    return render(request, 'pollution_map/test8.html', context)

def test_menu(request):
    context = {}
    return render(request, 'pollution_map/test_menu.html', context)

def recordNumClicks(request):
    if request.method != 'POST':
        raise Http404

    try:
        new_entry = Entry(numClicks=request.POST.get('numClicks'), category=request.POST['category'], add_time=timezone.now())
        new_entry_form = EntryForm(request.POST,instance=new_entry)
        if not new_entry_form.is_valid():
            response_text = serializers.serialize('json', [])
            return HttpResponse(response_text, content_type='application/json')
        new_entry_form.save()
    except:
        print('Fail to add the new entry!')
        print(sys.exc_info())
    response_text = serializers.serialize('json', Entry.objects.all())
    return HttpResponse(response_text, content_type='application/json')

def showResult(request):
    context = {}
    try:
        context['color_dial'] = Entry.objects.filter(category="Color Dial")
        count = 0
        summ = 0
        for item in context['color_dial']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['color_dial_average'] = summ/count
    except:
        pass

    try:
        context['color_table'] = Entry.objects.filter(category="Color Table")
        count = 0
        summ = 0
        for item in context['color_table']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['color_table_average'] = summ/count
    except:
        pass

    try:
        context['gray_dial'] = Entry.objects.filter(category="Gray Dial")
        count = 0
        summ = 0
        for item in context['gray_dial']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['gray_dial_average'] = summ/count
    except:
        pass

    try:
        context['gray_table'] = Entry.objects.filter(category="Gray Table")
        count = 0
        summ = 0
        for item in context['gray_table']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['gray_table_average'] = summ/count
    except:
        pass

    try:
        context['no_color_dial'] = Entry.objects.filter(category="No Color Dial")
        count = 0
        summ = 0
        for item in context['no_color_dial']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['no_color_dial_average'] = summ/count
    except:
        pass

    try:
        context['no_color_table'] = Entry.objects.filter(category="No Color Table")
        count = 0
        summ = 0
        for item in context['no_color_table']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['no_color_table_average'] = summ/count
    except:
        pass

    try:
        context['traffic_light'] = Entry.objects.filter(category="traffic_light")
        count = 0
        summ = 0
        for item in context['traffic_light']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['traffic_light_average'] = summ/count
    except:
        pass

    try:
        context['clear_below_avg'] = Entry.objects.filter(category="clear_below_avg")
        count = 0
        summ = 0
        for item in context['clear_below_avg']:
            summ += item.numClicks
            count+=1
        if count == 0:
            count = 1
        context['clear_below_avg_average'] = summ/count
    except:
        pass

    return render(request, 'pollution_map/result.html', context)


def deleteRecord(request, record_id):
    try:
        record = Entry.objects.get(entry_id=record_id)
        record.delete()
    except:
        pass
    return showResult(request)

def clear(request):
    try:
        Entry.objects.all().delete()
    except:
        pass
    return showResult(request)

