BEGIN;

UPDATE honeycomb.datapoints SET
    data = jsonb_set(jsonb_set(data, '{type}', data->'source'->'type'), '{source}', data->'source'->'source')
where data->'source'->'type' IS NOT NULL;

COMMIT;