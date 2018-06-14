from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^map$', views.map, name='map'),
    url(r'^past_data$', views.past_data, name='past_data'),
    url(r'^download$', views.download, name='download'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^get_cursor_json$', views.get_cursor_json, name='get_cursor_json')
]