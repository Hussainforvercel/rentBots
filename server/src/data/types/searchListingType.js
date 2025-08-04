import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLList as List,
} from 'graphql';
import ShowListingType from './ShowListingType.js';

const searchListingType = new ObjectType({
  name: 'SearchListing',
  fields: {
    count: { type: IntType },
    currentPage: { type: IntType },
    results: { type: new List(ShowListingType) },
    status: { type: IntType },
    errorMessage: { type: StringType }
  },
});

export default searchListingType;