#!/bin/bash

cat scripts/partition-management.sql | PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -h ${PGHOST}
exec $@
