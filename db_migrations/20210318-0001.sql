--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Debian 12.5-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accelerometer_data; Type: TABLE; Schema: honeycomb; Owner: honeycomb_user
--

delete from partman.part_config where parent_table = 'honeycomb.positions';
delete from partman.part_config where parent_table = 'honeycomb.gyroscope_data';
delete from partman.part_config where parent_table = 'honeycomb.accelerometer_data';
delete from partman.part_config where parent_table = 'honeycomb.magnetometer_data';

DROP TABLE IF EXISTS honeycomb.accelerometer_data;
DROP TABLE IF EXISTS honeycomb.gyroscope_data;
DROP TABLE IF EXISTS honeycomb.positions;
DROP TABLE IF EXISTS honeycomb.magnetometer_data;

CREATE TABLE honeycomb.accelerometer_data (
    accelerometer_data_id uuid NOT NULL,
                                   data jsonb,
                                        created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                                                                                    last_modified timestamp without time zone,
                                                                                                                         type_name character varying(128),
                                                                                                                                             "timestamp" timestamp without time zone,
                                                                                                                                                                                device uuid
) PARTITION BY RANGE (timestamp);



ALTER TABLE honeycomb.accelerometer_data OWNER TO honeycomb_user;

--
-- Name: gyroscope_data; Type: TABLE; Schema: honeycomb; Owner: honeycomb_user
--

CREATE TABLE honeycomb.gyroscope_data (
    gyroscope_data_id uuid NOT NULL,
                               data jsonb,
                                    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                                                                                last_modified timestamp without time zone,
                                                                                                                     type_name character varying(128),
                                                                                                                                         "timestamp" timestamp without time zone,
                                                                                                                                                                            device uuid
)  PARTITION BY RANGE (timestamp);


ALTER TABLE honeycomb.gyroscope_data OWNER TO honeycomb_user;

--
-- Name: magnetometer_data; Type: TABLE; Schema: honeycomb; Owner: honeycomb_user
--

CREATE TABLE honeycomb.magnetometer_data (
    magnetometer_data_id uuid NOT NULL,
                                  data jsonb,
                                       created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                                                                                   last_modified timestamp without time zone,
                                                                                                                        type_name character varying(128),
                                                                                                                                            "timestamp" timestamp without time zone,
                                                                                                                                                                               device uuid
) PARTITION BY RANGE (timestamp);

ALTER TABLE honeycomb.magnetometer_data OWNER TO honeycomb_user;

--
-- Name: positions; Type: TABLE; Schema: honeycomb; Owner: honeycomb_user
--

CREATE TABLE honeycomb.positions (
    position_id uuid NOT NULL,
                         data jsonb,
                              created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                                                                          last_modified timestamp without time zone,
                                                                                                               type_name character varying(128),
                                                                                                                                   "timestamp" timestamp without time zone,
                                                                                                                                                                      coordinate_space uuid,
                                                                                                                                                                                       object uuid,
                                                                                                                                                                                              source uuid,
                                                                                                                                                                                                     source_type character varying(256),
                                                                                                                                                                                                                           tags character varying(256)[]
) PARTITION BY RANGE (timestamp);

ALTER TABLE honeycomb.positions OWNER TO honeycomb_user;

--
-- Name: accelerometer_data accelerometer_data_pkey; Type: CONSTRAINT; Schema: honeycomb; Owner: honeycomb_user
--

ALTER TABLE ONLY honeycomb.accelerometer_data
ADD CONSTRAINT accelerometer_data_pkey PRIMARY KEY (accelerometer_data_id, timestamp);


--
-- Name: gyroscope_data gyroscope_data_pkey; Type: CONSTRAINT; Schema: honeycomb; Owner: honeycomb_user
--

ALTER TABLE ONLY honeycomb.gyroscope_data
ADD CONSTRAINT gyroscope_data_pkey PRIMARY KEY (gyroscope_data_id, timestamp);


--
-- Name: magnetometer_data magnetometer_data_pkey; Type: CONSTRAINT; Schema: honeycomb; Owner: honeycomb_user
--

ALTER TABLE ONLY honeycomb.magnetometer_data
ADD CONSTRAINT magnetometer_data_pkey PRIMARY KEY (magnetometer_data_id, timestamp);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: honeycomb; Owner: honeycomb_user
--

ALTER TABLE ONLY honeycomb.positions
ADD CONSTRAINT positions_pkey PRIMARY KEY (position_id, timestamp);


--
-- Name: beehive_accelerometer_data__created; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_accelerometer_data__created ON honeycomb.accelerometer_data USING btree (created);


--
-- Name: beehive_accelerometer_data__device_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_accelerometer_data__device_ts ON honeycomb.accelerometer_data USING btree (device, "timestamp");


--
-- Name: beehive_accelerometer_data__timestamp; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_accelerometer_data__timestamp ON honeycomb.accelerometer_data USING btree ("timestamp");


--
-- Name: beehive_gyroscope_data__created; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_gyroscope_data__created ON honeycomb.gyroscope_data USING btree (created);


--
-- Name: beehive_gyroscope_data__device_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_gyroscope_data__device_ts ON honeycomb.gyroscope_data USING btree (device, "timestamp");


--
-- Name: beehive_gyroscope_data__timestamp; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_gyroscope_data__timestamp ON honeycomb.gyroscope_data USING btree ("timestamp");


--
-- Name: beehive_magnetometer_data__created; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_magnetometer_data__created ON honeycomb.magnetometer_data USING btree (created);


--
-- Name: beehive_magnetometer_data__device_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_magnetometer_data__device_ts ON honeycomb.magnetometer_data USING btree (device, "timestamp");


--
-- Name: beehive_magnetometer_data__timestamp; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_magnetometer_data__timestamp ON honeycomb.magnetometer_data USING btree ("timestamp");


--
-- Name: beehive_positions__created; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__created ON honeycomb.positions USING btree (created);


--
-- Name: beehive_positions__object_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__object_ts ON honeycomb.positions USING btree (object, "timestamp");


--
-- Name: beehive_positions__source_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__source_ts ON honeycomb.positions USING btree (source, "timestamp");


--
-- Name: beehive_positions__source_ts_tags; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__source_ts_tags ON honeycomb.positions USING btree (source, "timestamp", tags);


--
-- Name: beehive_positions__tags_ts; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__tags_ts ON honeycomb.positions USING btree (tags, "timestamp");


--
-- Name: beehive_positions__timestamp; Type: INDEX; Schema: honeycomb; Owner: honeycomb_user
--

CREATE INDEX beehive_positions__timestamp ON honeycomb.positions USING btree ("timestamp");


SELECT partman.create_parent( p_parent_table => 'honeycomb.gyroscope_data',
       p_control => 'timestamp',
                    p_type => 'native',
                              p_interval=> 'daily',
                                           p_premake => 2);


SELECT partman.create_parent( p_parent_table => 'honeycomb.magnetometer_data',
       p_control => 'timestamp',
                    p_type => 'native',
                              p_interval=> 'daily',
                                           p_premake => 30);


SELECT partman.create_parent( p_parent_table => 'honeycomb.positions',
       p_control => 'timestamp',
                    p_type => 'native',
                              p_interval=> 'daily',
                                           p_premake => 30);

SELECT partman.create_parent( p_parent_table => 'honeycomb.accelerometer_data',
       p_control => 'timestamp',
                    p_type => 'native',
                              p_interval=> 'daily',
                                           p_premake => 30);

UPDATE partman.part_config
SET infinite_time_partitions = true
WHERE
parent_table = 'honeycomb.positions' OR
parent_table = 'honeycomb.gyroscope_data' OR
parent_table = 'honeycomb.magnetometer_data' OR
parent_table = 'honeycomb.accelerometer_data';
SELECT cron.schedule('@hourly', $$CALL partman.run_maintenance_proc()$$);

--
-- PostgreSQL database dump complete
--

