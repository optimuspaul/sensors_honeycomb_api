exports.typeDefs = `
enum BulkImportStateType {
  RUNNING
  FAILED
  FINISHED
}

type BulkImportRequest @beehiveTable(
  table_name: "bulk_imports",
  pk_column: "bulk_import_id",
  table_type: native,
  native_exclude: ["file"],
  native_indexes: [
    {name: "created", type: btree, columns: ["created"]},
    {name: "tags", type: btree, columns: ["tags"]}
  ]
) {
  bulk_import_id: ID!
  name: String!
  # Import file data
  file: S3File! @s3file(keyPrefix: "bulk-imports", bucketName: "wildflower-honeycomb-bulk-imports-us-east-2", region: "us-east-2")
  # Error file
  error_file: S3File @s3file(keyPrefix: "bulk-import-errors", bucketName: "wildflower-honeycomb-bulk-imports-us-east-2", region: "us-east-2")
  # State/status of import
  state: BulkImportStateType
  # Optional environment the bulk import is related to
  environment: Environment @beehiveRelation(target_type_name: "Environment")
  # tags used to identify bulk imports
  tags: [String!]
}

type BulkImportRequestList {
  data: [BulkImportRequest!]
  page_info: PageInfo!
}

input BulkImportRequestInput {
  name: String!
  file: S3FileInput!
  environment: ID 
  tags: [String!]
}

extend type Query {
  # Get the list of bulk imports
  bulk_import_requests(page: PaginationInput): BulkImportRequestList @beehiveList(target_type_name: "BulkImportRequest")
  # Get a BulkImportRequest
  getBulkImportRequest(bulk_import_request: ID!): BulkImportRequest @beehiveGet(target_type_name: "BulkImportRequest")
  # Find BulkImportRequests based on one or more of their properties
  findBulkImportRequests(name: String, environment: ID, state: BulkImportStateType, page: PaginationInput): BulkImportRequestList @beehiveSimpleQuery(target_type_name: "BulkImportRequest")
  # Find BulkImportRequests using a complex query
  searchBulkImportRequests(query: QueryExpression!, page: PaginationInput): BulkImportRequestList @beehiveQuery(target_type_name: "BulkImportRequest")
}

extend type Mutation {
  # Create a new device
  createBulkImportRequest(bulkImportRequest: BulkImportRequestInput): BulkImportRequest @beehiveCreate(target_type_name: "BulkImportRequest", s3_file_fields: ["file"]) @honeycombBackgroundTask(background_task: "BulkImportHandle")  
}
`