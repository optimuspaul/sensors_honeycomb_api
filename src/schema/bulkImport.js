exports.typeDefs = `
enum BulkImportStateType {
  QUEUED
  RUNNING
  FAILED
  FINISHED
}

type BulkImportRequest @beehiveTable(
  table_name: "bulk_import_requests",
  pk_column: "bulk_import_request_id",
  table_type: native,
  # native_exclude: ["file"],
  native_indexes: [
    {name: "created", type: btree, columns: ["created"]},
    {name: "tags", type: btree, columns: ["tags"]}
  ]
) {
  bulk_import_request_id: ID!
  name: String!
  # Import file
  file_url: String!
  # Error file
  error_file_url: String
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

extend type Query {
  # Get the list of bulk imports
  bulk_import_requests(page: PaginationInput): BulkImportRequestList @beehiveList(target_type_name: "BulkImportRequest")
  # Get a BulkImportRequest
  getBulkImportRequest(bulk_import_request: ID!): BulkImportRequest @beehiveGet(target_type_name: "BulkImportRequest")
  # Find BulkImportRequests based on one or more of their properties
  findBulkImportRequests(name: String, environment: ID, file_url: String, state: BulkImportStateType, page: PaginationInput): BulkImportRequestList @beehiveSimpleQuery(target_type_name: "BulkImportRequest")
  # Find BulkImportRequests using a complex query
  searchBulkImportRequests(query: QueryExpression!, page: PaginationInput): BulkImportRequestList @beehiveQuery(target_type_name: "BulkImportRequest")
}
`