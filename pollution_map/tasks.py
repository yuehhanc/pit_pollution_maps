from __future__ import absolute_import, unicode_literals

import os
import shutil

from celery import task


@task(name='task_number_one')
def task_number_one():
    print("It works")
    currFileName = "Interpolated_Map"
    try:
        # AWS
        for file in os.listdir("/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/data/"):
            fileName = file.split("/")[-1]
            if fileName[:-4] > currFileName[:-4]:
                currFileName = fileName
        print(currFileName)
        shutil.copyfile("/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/data/" + currFileName, "/home/ubuntu/pit_pollution_maps/pollution_map/static/pollution_map/Interpolated_Map.csv")
    except:
        # Local
        for file in os.listdir("pollution_map/static/pollution_map/data/"):
            fileName = file.split("/")[-1]
            if fileName[:-4] > currFileName[:-4]:
                currFileName = fileName
        print(currFileName)
        shutil.copyfile("pollution_map/static/pollution_map/data/" + currFileName, "pollution_map/static/pollution_map/Interpolated_Map.csv")
