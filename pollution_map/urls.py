from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^map$', views.map, name='map'),
    url(r'^get_cursor_json$', views.get_cursor_json, name='get_cursor_json')
]