from django import forms
from django.contrib.auth.models import User
from pollution_map.models import *


MAX_UPLOAD_SIZE=50000000
class FileForm(forms.ModelForm):
    class Meta:
        model = File
        fields ={'file'}

        widgets = {
            'file': forms.FileInput(attrs={'accept': ".csv", 'border':"solid"}),
        }

        def clean_file(self):
            file = self.cleaned_data['file']
            try:
                if not file:
                    raise forms.ValidationError('You must upload a csv file.')
                if file.size > MAX_UPLOAD_SIZE:
                    raise forms.ValidationError('File too big (max size is {0} bytes)'.format(MAX_UPLOAD_SIZE))
            except AttributeError:
                pass
            return file

class EntryForm(forms.ModelForm):
    class Meta:
        model = Entry
        exclude = {'add_time',}