CREATE EXTENSION pgcrypto;

-- POSITIONS
ALTER TABLE positions RENAME TO positions_tmp;
ALTER TABLE positions_tmp DROP CONSTRAINT positions_pkey;
ALTER TABLE positions_tmp ADD CONSTRAINT positions_pkey PRIMARY KEY (position_id, timestamp);
CREATE INDEX CONCURRENTLY beehive_positions__position_id ON positions_tmp (position_id);

CREATE TABLE positions
(LIKE positions_tmp INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES)
PARTITION BY RANGE (timestamp);

CREATE TABLE positions_default PARTITION OF positions DEFAULT;
REINDEX TABLE positions_default;

-- INSERT INTO positions(created, timestamp, position_id, data, source_type, coordinate_space, quality, type_name)
-- SELECT created::TIMESTAMP, created::TIMESTAMP, gen_random_uuid(), '{"object": "7fb13183-8f7b-4236-ad58-ddb37c571967", "quality": 8237, "timestamp": "2021-03-23T02:30:24.901177Z", "coordinates": [0.105, 4.241, 3.0], "position_id": "02e359fe-f59a-4342-98b2-873daf1d6938", "source_type": "MEASURED", "coordinate_space": "8e8cd083-bda9-43d9-9008-640b2f411ba6"}'::JSONB, 'MEASURED', '8e8cd083-bda9-43d9-9008-640b2f411ba6'::uuid, 8237, 'Position'
-- FROM generate_series(TIMESTAMP '2021-04-21', '2021-04-24', '100 millisecond') created ORDER BY created::TIMESTAMP;

INSERT INTO positions select * from positions_tmp;


-- ACCELEROMETER_DATA
ALTER TABLE accelerometer_data RENAME TO accelerometer_data_tmp;
ALTER TABLE accelerometer_data_tmp DROP CONSTRAINT accelerometer_data_pkey;
ALTER TABLE accelerometer_data_tmp ADD CONSTRAINT accelerometer_data_pkey PRIMARY KEY (accelerometer_data_id, timestamp);
CREATE INDEX CONCURRENTLY beehive_accelerometer_data__accelerometer_data_id ON accelerometer_data_tmp (accelerometer_data_id);

CREATE TABLE accelerometer_data
(LIKE accelerometer_data_tmp INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES)
    PARTITION BY RANGE (timestamp);

CREATE TABLE accelerometer_data_default PARTITION OF accelerometer_data DEFAULT;
REINDEX TABLE accelerometer_data;

-- INSERT INTO accelerometer_data(created, timestamp, accelerometer_data_id, data, device, type_name)
-- SELECT created::TIMESTAMP, created::TIMESTAMP, gen_random_uuid(), '{"device": "7fb13183-8f7b-4236-ad58-ddb37c571967", "data": [-0.009582519535712208, 0.0798339844121756, -1.0046997074990998], "timestamp": "2021-03-23T02:30:24.901177Z", "accelerometer_data_id": "02e359fe-f59a-4342-98b2-873daf1d6938"}'::JSONB, '8e8cd083-bda9-43d9-9008-640b2f411ba6'::uuid, 'AccelerometerData'
-- FROM generate_series(TIMESTAMP '2021-04-13', '2021-04-15', '200 millisecond') created ORDER BY created::TIMESTAMP;

INSERT INTO accelerometer_data select * from accelerometer_data_tmp;


-- GYROSCOPE_DATA
ALTER TABLE gyroscope_data RENAME TO gyroscope_data_tmp;
ALTER TABLE gyroscope_data_tmp DROP CONSTRAINT gyroscope_data_pkey;
ALTER TABLE gyroscope_data_tmp ADD CONSTRAINT gyroscope_data_pkey PRIMARY KEY (gyroscope_data_id, timestamp);
CREATE INDEX CONCURRENTLY beehive_gyroscope_data__gyroscope_data_id ON gyroscope_data_tmp (gyroscope_data_id);

CREATE TABLE gyroscope_data
(LIKE gyroscope_data_tmp INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES)
    PARTITION BY RANGE (timestamp);

CREATE TABLE gyroscope_data_default PARTITION OF gyroscope_data DEFAULT;
REINDEX TABLE gyroscope_data;

-- INSERT INTO gyroscope_data(created, timestamp, gyroscope_data_id, data, device, type_name)
-- SELECT created::TIMESTAMP, created::TIMESTAMP, gen_random_uuid(), '{"device": "7fb13183-8f7b-4236-ad58-ddb37c571967", "data": [-0.009582519535712208, 0.0798339844121756, -1.0046997074990998], "timestamp": "2021-03-23T02:30:24.901177Z", "gyroscope_data_id": "02e359fe-f59a-4342-98b2-873daf1d6938"}'::JSONB, '8e8cd083-bda9-43d9-9008-640b2f411ba6'::uuid, 'GyroscopeData'
-- FROM generate_series(TIMESTAMP '2021-04-13', '2021-04-15', '200 millisecond') created ORDER BY created::TIMESTAMP;

INSERT INTO gyroscope_data select * from gyroscope_data_tmp;


-- MAGNETOMETER_DATA
ALTER TABLE magnetometer_data RENAME TO magnetometer_data_tmp;
ALTER TABLE magnetometer_data_tmp DROP CONSTRAINT magnetometer_data_pkey;
ALTER TABLE magnetometer_data_tmp ADD CONSTRAINT magnetometer_data_pkey PRIMARY KEY (magnetometer_data_id, timestamp);
CREATE INDEX CONCURRENTLY beehive_magnetometer_dataa__magnetometer_data_id ON magnetometer_data_tmp (magnetometer_data_id);

CREATE TABLE magnetometer_data
(LIKE magnetometer_data_tmp INCLUDING DEFAULTS INCLUDING CONSTRAINTS INCLUDING INDEXES)
    PARTITION BY RANGE (timestamp);

CREATE TABLE magnetometer_data_default PARTITION OF magnetometer_data DEFAULT;
REINDEX TABLE magnetometer_data_default;

-- INSERT INTO magnetometer_data(created, timestamp, magnetometer_data_id, data, device, type_name)
-- SELECT created::TIMESTAMP, created::TIMESTAMP, gen_random_uuid(), '{"device": "7fb13183-8f7b-4236-ad58-ddb37c571967", "data": [-0.009582519535712208, 0.0798339844121756, -1.0046997074990998], "timestamp": "2021-03-23T02:30:24.901177Z", "magnetometer_data_id": "02e359fe-f59a-4342-98b2-873daf1d6938"}'::JSONB, '8e8cd083-bda9-43d9-9008-640b2f411ba6'::uuid, 'MagnetometerData'
-- FROM generate_series(TIMESTAMP '2021-04-14', '2021-04-16', '200 millisecond') created ORDER BY created::TIMESTAMP;

INSERT INTO magnetometer_data select * from magnetometer_data_tmp;


/* Create a function to easily get the index name for a given table and columns, useful for fetching partitoned table's auto-generated index names */
CREATE OR REPLACE FUNCTION get_partition_table_index_name(tblname TEXT, indexcols TEXT[])
RETURNS TEXT AS $BODY$
DECLARE
res RECORD;
BEGIN
    WITH
    idx AS
    (SELECT pg_index.*, ARRAY(
    SELECT pg_get_indexdef(indexrelid, k + 1, true)
    FROM generate_subscripts(indkey, 1) as k
    ORDER BY k) as cols FROM pg_index)
    SELECT i.relname
    INTO   res
    FROM   idx
    JOIN   pg_class as i
    ON     i.oid = idx.indexrelid
    JOIN   pg_am as am
    ON     i.relam = am.oid
    WHERE
      idx.indrelid::regclass = tblname::regclass
      AND idx.cols = indexcols
    LIMIT 1;

    return res.relname;
END
$BODY$
LANGUAGE plpgsql;

/* Create a function for daily, dynamic rebalancing of data */
CREATE OR REPLACE FUNCTION imu_tables_balance()
RETURNS VOID AS $BODY$
DECLARE
  imu_tables text[] := array['positions', 'accelerometer_data', 'gyroscope_data', 'magnetometer_data'];
  imu_table TEXT;
  imu_table_default TEXT;
  partition_date_from TEXT;
  partition_date_to TEXT;
  partition TEXT;
  partition_tmp TEXT;
  dates RECORD;
BEGIN
FOREACH imu_table IN ARRAY imu_tables
LOOP
    imu_table_default := imu_table || '_default';
    RAISE NOTICE 'Re-balancing %...', imu_table;
    FOR dates IN
    EXECUTE format('SELECT DISTINCT date(timestamp) AS day FROM %I', imu_table_default)
        LOOP
            partition_date_from := to_char(dates.day, 'YYYY_MM_DD');
            partition_date_to := to_char(dates.day + INTERVAL '1 day', 'YYYY_MM_DD');
            partition := imu_table || '_' || partition_date_from;

            IF NOT EXISTS(SELECT relname FROM pg_class WHERE relname=partition) THEN
                RAISE NOTICE 'A partition is being created: %', partition;

                EXECUTE 'CREATE TABLE ' || partition || ' PARTITION OF ' || imu_table || ' FOR VALUES FROM (''' || partition_date_from || ''') TO (''' || partition_date_to ||  ''');';

                RAISE NOTICE 'Partition created.';
            END IF;

            RAISE NOTICE 'Moving data to partition...';
            partition_tmp := partition || '_tmp';

            EXECUTE 'CREATE TABLE ' || partition_tmp || '  AS (SELECT * FROM ' || imu_table_default || ' WHERE timestamp >= (''' || partition_date_from || ''') AND timestamp < (''' || partition_date_to ||  '''));';
            EXECUTE 'DELETE FROM ' || imu_table || ' WHERE timestamp >= (''' || partition_date_from || ''') AND timestamp < (''' || partition_date_to ||  ''');';
            EXECUTE 'INSERT INTO ' || partition || ' SELECT * FROM ' || partition_tmp;
            EXECUTE 'DROP TABLE ' || partition_tmp;
            RAISE NOTICE 'Clustering...';
            EXECUTE 'CLUSTER ' || partition || ' USING ' || get_partition_table_index_name(partition, '{\"timestamp\"}');
            RAISE NOTICE 'Analyzing...';
            EXECUTE 'ANALYZE ' || partition;
            RAISE NOTICE 'Warming up table...';
            EXECUTE 'EXPLAIN ANALYZE SELECT * FROM ' || partition;
            RAISE NOTICE 'Done.';
        END LOOP;
END LOOP;
END;
$BODY$
LANGUAGE plpgsql;

/* Add 7 days of partitioned IMU tables */
CREATE OR REPLACE FUNCTION imu_tables_add_partitions()
RETURNS VOID AS $BODY$
DECLARE
    imu_tables text[] := array['positions', 'accelerometer_data', 'gyroscope_data', 'magnetometer_data'];
    imu_table TEXT;
    partition_date_from TEXT;
    partition_date_to TEXT;
    partition TEXT;
    dates RECORD;
BEGIN
    FOREACH imu_table IN ARRAY imu_tables
    LOOP
        FOR dates in
        SELECT generate_series(now(), now() + INTERVAL '6 day', '1 day'::INTERVAL) AS day
        LOOP
            partition_date_from := to_char(dates.day, 'YYYY_MM_DD');
            partition_date_to := to_char(dates.day + INTERVAL '1 day', 'YYYY_MM_DD');
            partition := imu_table || '_' || partition_date_from;

            RAISE NOTICE 'A partition is being created if not exists: %', partition;
            EXECUTE 'CREATE TABLE IF NOT EXISTS ' || partition || ' PARTITION OF ' || imu_table || ' FOR VALUES FROM (''' || partition_date_from || ''') TO (''' || partition_date_to ||  ''');';
        END LOOP;
    END LOOP;
END;
$BODY$
LANGUAGE plpgsql;
