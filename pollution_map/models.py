# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.files import File
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
# Create your models here.

class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name

class File(models.Model):
    file = models.FileField(storage=OverwriteStorage())
    add_time = models.DateTimeField()

class Entry(models.Model):
    entry_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length = 20, blank=False)
    numClicks = models.IntegerField()
    add_time = models.DateTimeField()

    def __unicode__(self):
        return 'Entry(id=' + str(self.entry_id) + ', # of clicks=' + str(self.numClicks) + ')'