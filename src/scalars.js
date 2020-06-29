const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');




exports.Keypoint2D = new GraphQLScalarType({
    name: 'Keypoint2D',
    description: 'Represents x, y, and quality of a point Keypoint in 2D space',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value // ast value is always in string format
      }
      return null;
    },
 })


exports.Keypoint3D = new GraphQLScalarType({
    name: 'Keypoint3D',
    description: 'Represents x, y, z, and quality of a point Keypoint in 3D space',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return value // ast value is always in string format
      }
      return null;
    },
 })
