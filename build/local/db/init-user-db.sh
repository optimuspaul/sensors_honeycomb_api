#!/bin/bash
set -e

# this isn't actually used right now
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER honeycomb_app_user;
EOSQL

