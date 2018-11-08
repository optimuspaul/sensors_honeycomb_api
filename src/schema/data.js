exports.typeDefs = `
  
  enum DataFormat {
    BINARY
    CSV
    IMAGE
    JSON
    TEXT
    VIDEO
  }

  union Observer = Sensor | Device

  type Datapoint {
    data_id: ID!
    parents: [Datapoint]
    # format of the data
    format: String
    # base64 encoded string that represents the bytes
    data: String!
    # URL that can be used to get the data directly via a REST request
    url: String!
    # Timestamp that the data was created in the graph
    created: Datetime!
    # Timestamp that the data was observed. When sensors produce data this timestamp will be the moment the data was captured. If the data is derived from other data this should match the observedTime of the parent data. If the data does not corespond to an sensor observation then this should match the created timestamp.
    observed_time: Datetime!
    # Which device(s), sensor(s), etc. was the source of this data. Only applicable to origin data, not derived data.
    observer: [Observer!]
  }

`;
