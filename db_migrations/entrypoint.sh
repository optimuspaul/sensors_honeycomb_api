#!/bin/bash

# python /scripts/20190812-0001.py
# python /scripts/20191129-0001.py
cat scripts/20210318-0001.sql | PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -h ${PGHOST}
exec $@
