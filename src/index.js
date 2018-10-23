const { ApolloServer, gql } = require('apollo-server');
const { schema } = require("./schema");

const server = new ApolloServer({
    schema,
    formatError: error => {
        // console.log(error);
        return error;
    },
    formatResponse: response => {
        // console.log(response);
        return response;
    },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
