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
    file: S3File @s3file(keyPrefix: "datapoints", bucketName: "wildfower-honeycomb-datapoints-us-east-2", region: "us-east-2")
    # Timestamp that the data was observed, measured, or inferred.
    timestamp: Datetime!
    # Which objects are associated with this data
    associations: [Association!] @beehiveUnionResolver(target_types: ["Device", "Person", "Environment"])
    # duration of the data included in this observation. time should be expressed in milliseconds. If not set then assumed to be a snapshot observation without a duration
    duration: Int
    # where did the data originate
    source: DataSource!
}


type DatapointList{
    data: [Datapoint!]!
    page_info: PageInfo!
}

type InferenceExecution @beehiveTable(table_name: "inferences", pk_column: "inference_id") {
    inference_id: ID!
    name: String
    notes: String
    model: String
    version: String
    data_sources: [Datapoint!] @beehiveRelation(target_type_name: "Datapoint")
    data_results: [Datapoint!] @beehiveRelationFilter(target_type_name: "Datapoint", target_field_name: "observer")
    execution_start: Datetime!
}

type InferenceExecutionList {
    data: [InferenceExecution!]!
    page_info: PageInfo!
}

input InferenceExecutionInput {
    name: String
    notes: String
    model: String
    version: String
    data_sources: [ID!]
    data_results: [ID!]
    execution_start: Datetime!
}

enum DataSourceType {
    GROUND_TRUTH
    GENERATED_TEST
    MEASURED
    INFERRED
}

type DataSource {
    type: DataSourceType!
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution"])
}


union Association @beehiveUnion = Device | Environment | Person | Material
union SourceObject @beehiveUnion = Assignment | InferenceExecution | Person

input DataSourceInput {
    type: DataSourceType!
    source: ID
}

input DatapointInput {
    # format of the data
    format: String
    file: S3FileInput
    timestamp: Datetime!
    associations: [ID!]
    parents: [ID!]
    duration: Int
    source: DataSourceInput
}

extend type Query {
    # Gets the list of datapoints
    datapoints(page: PaginationInput): DatapointList! @beehiveList(target_type_name: "Datapoint")
    getDatapoint(data_id: ID!): Datapoint! @beehiveGet(target_type_name: "Datapoint")
    findDatapoints(query: QueryExpression!, page: PaginationInput): DatapointList! @beehiveQuery(target_type_name: "Datapoint")
    inferences(page: PaginationInput): InferenceExecutionList! @beehiveSimpleQuery(target_type_name: "InferenceExecution")
    getInferenceExecution(inference_id: ID!): InferenceExecution! @beehiveGet(target_type_name: "InferenceExecution")
    findInferences(query: QueryExpression!, page: PaginationInput): InferenceExecutionList! @beehiveQuery(target_type_name: "InferenceExecution")
}

extend type Mutation {
    # adds a new datapoint to the graph
    createDatapoint(datapoint: DatapointInput): Datapoint @beehiveCreate(target_type_name: "Datapoint", s3_file_fields: ["file"])
    deleteDatapoint(data_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Datapoint")

    # Inference Executions
    createInferenceExecution(inference: InferenceExecutionInput): InferenceExecution @beehiveCreate(target_type_name: "InferenceExecution")
}


`;
