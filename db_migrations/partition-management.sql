SET search_path TO honeycomb;

CALL imu_tables_balance();
CALL imu_tables_add_partitions();

