from django.contrib import admin
from authentication.models import User, WhitelistedEmails

# Thanks to Wadzanai Mufunde's answer here https://stackoverflow.com/questions/40833324/django-attributeerror-alias-object-has-no-attribute-urls
admin.site.register(User)
admin.site.register(WhitelistedEmails)
