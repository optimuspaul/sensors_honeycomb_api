exports.typeDefs = `

type Datapoint @beehiveTable(
                table_name: "datapoints",
                pk_column: "data_id",
                table_type: native,
                native_exclude: ["file"],
                native_indexes: [
                    {name: "created", type: btree, columns: ["created"]},
                    {name: "timestamp", type: btree, columns: ["timestamp"]},
                    {name: "format_ts", type: btree, columns: ["format", "timestamp"]},
                    {name: "associations_ts", type: btree, columns: ["associations", "timestamp"]},
                    {name: "source_ts", type: btree, columns: ["source", "timestamp"]},
                    {name: "source_ts_tags", type: btree, columns: ["source", "timestamp", "tags"]},
                    {name: "tags_ts", type: btree, columns: ["tags", "timestamp"]}
                ]) {
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
    source: SourceObject @beehiveUnionResolver(target_types: ["Assignment", "Person", "InferenceExecution"])
    source_type: DataSourceType
    # tags used to identify datapoints for classification
    tags: [String!]
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


union Association @beehiveUnion = Device | Environment | Person | Material
union SourceObject @beehiveUnion = Assignment | InferenceExecution | Person

input DatapointInput {
    # format of the data
    format: String
    file: S3FileInput
    timestamp: Datetime!
    associations: [ID!]
    parents: [ID!]
    duration: Int
    source: ID
    source_type: DataSourceType!
    tags: [String!]
}

extend type Query {
    # Gets the list of datapoints
    datapoints(page: PaginationInput): DatapointList! @beehiveList(target_type_name: "Datapoint")
    # get a single datapoint using it's ID
    getDatapoint(data_id: ID!): Datapoint @beehiveGet(target_type_name: "Datapoint")
    # find datapoints using a complex query
    searchDatapoints(query: QueryExpression!, page: PaginationInput): DatapointList! @beehiveQuery(target_type_name: "Datapoint")

    # List of all InferenceExecutions
    inferenceExecutions(page: PaginationInput): InferenceExecutionList! @beehiveList(target_type_name: "InferenceExecution")
    getInferenceExecution(inference_id: ID!): InferenceExecution! @beehiveGet(target_type_name: "InferenceExecution")
    findInferenceExecutions(model: String, version: String, name: String, page: PaginationInput): InferenceExecutionList! @beehiveSimpleQuery(target_type_name: "InferenceExecution")
    searchInferenceExecutions(query: QueryExpression!, page: PaginationInput): InferenceExecutionList! @beehiveQuery(target_type_name: "InferenceExecution")
}

extend type Mutation {
    # adds a new datapoint to the graph
    createDatapoint(datapoint: DatapointInput): Datapoint @beehiveCreate(target_type_name: "Datapoint", s3_file_fields: ["file"])
    deleteDatapoint(data_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Datapoint")
    tagDatapoint(data_id: ID!, tags: [String!]!): Datapoint! @beehiveListFieldAppend(target_type_name: "Datapoint", field_name: "tags", input_field_name: "tags")
    untagDatapoint(data_id: ID!, tags: [String!]!): Datapoint! @beehiveListFieldDelete(target_type_name: "Datapoint", field_name: "tags", input_field_name: "tags")

    # Inference Executions
    createInferenceExecution(inferenceExecution: InferenceExecutionInput): InferenceExecution @beehiveCreate(target_type_name: "InferenceExecution")
    updateInferenceExecution(inference_id: ID!): InferenceExecution @beehiveUpdate(target_type_name: "InferenceExecution")
    deleteInferenceExecution(inference_id: ID!): DeleteStatusResponse @beehiveDelete(target_type_name: "InferenceExecution")
}


`;
