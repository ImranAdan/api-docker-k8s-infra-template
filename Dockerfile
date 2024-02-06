FROM tiangolo/uwsgi-nginx-flask 

ADD app /opt/app/

CMD python /opt/app/main.py