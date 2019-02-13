exports.typeDefs = `
  
enum DataFormat {
    BINARY
    CSV
    IMAGE
    JSON
    TEXT
    VIDEO
}

type Datapoint @beehiveTable(table_name: "datapoints", pk_column: "data_id") {
    data_id: ID!
    parents: [Datapoint] @beehiveRelation(target_type_name: "Datapoint")
    # format of the data
    format: String
    # Data stored on S3
    file: S3File @s3file(keyPrefix: "datapoints", bucketName: "wildfower-honeycomb-datapoints")
    # URL that can be used to get the data directly via a REST request - TODO, need an endpoint for this
    url: String!
    # Timestamp that the data was observed. When sensors produce data this timestamp will be the moment the data was captured. If the data is derived from other data this should match the observedTime of the parent data. If the data does not corespond to an sensor observation then this should match the created timestamp.
    observed_time: Datetime!
    # Which sensor, etc. was the source of this data. Only applicable to origin data, not derived data.
    observer: Observer! @beehiveUnionResolver(target_types: ["Device", "Person", "SensorInstallation"])
}

union Observer @beehiveUnion = Assignment | SensorInstallation

type DatapointList{
    data: [Datapoint!]!
}

input DatapointInput {
    # format of the data
    format: String
    file: S3FileInput
    observed_time: Datetime!
    observer: ID!
    parents: [ID!]
}

# Temporary input type until we add time series type queries to beehive
# input TimeRange {
#     from: Datetime!
#     to: Datetime!
# }



extend type Query {
    # Gets the list of datapoints
    datapoints(page: PaginationInput): DatapointList! @beehiveList(target_type_name: "Datapoint")
    getDatapoint(datapoint_id: ID!): Datapoint! @beehiveGet(target_type_name: "Datapoint")
    findDatapointsForObserver(observer: ID!): DatapointList! @beehiveSimpleQuery(target_type_name: "Datapoint")
}

extend type Mutation {
    # adds a new datapoint to the graph
    createDatapoint(datapoint: DatapointInput): Datapoint @beehiveCreate(target_type_name: "Datapoint", s3_file_fields: ["file"])
}


`;
