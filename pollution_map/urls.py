from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^map$', views.map, name='map'),
    url(r'^data$', views.data, name='data'),
    url(r'^snapshot$', views.snapshot, name='snapshot'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^about$', views.about, name='about'),
    url(r'^upload$', views.upload, name='upload'),
    url(r'^get_cursor_json$', views.get_cursor_json, name='get_cursor_json'),
    url(r'^test1$', views.test1, name='test1'),
    url(r'^test2$', views.test2, name='test2'),
    url(r'^test3$', views.test3, name='test3'),
    url(r'^test4$', views.test4, name='test4'),
    url(r'^test5$', views.test5, name='test5'),
    url(r'^test6$', views.test6, name='test6'),
    url(r'^test_menu$', views.test_menu, name='test_menu'),
]