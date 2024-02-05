FROM tiangolo/uwsgi-nginx-flask 

ADD basic-app /opt/app/

CMD python /opt/app//main.py