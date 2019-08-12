FROM python:3.7-alpine


RUN apk add --no-cache --update \
    python \
    python-dev \
    py-pip \
    build-base

RUN apk add --virtual build-deps gcc python-dev musl-dev && \
    apk add --no-cache --update postgresql-dev && \
    pip install psycopg2==2.8.3


RUN mkdir /scripts

COPY ./*.py /scripts/
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
