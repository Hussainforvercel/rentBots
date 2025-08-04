import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
} from 'graphql';

const ResponseType = new ObjectType({
  name: 'Response',
  fields: {
    status: { type: IntType },
    errorMessage: { type: StringType },
  },
});

export default ResponseType; 