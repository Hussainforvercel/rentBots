import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
} from 'graphql';

const SearchSettingsType = new ObjectType({
  name: 'SearchSettingsType',
  fields: {
    id: { type: IntType },
    minPrice: { type: FloatType },
    maxPrice: { type: FloatType },
    priceRangeCurrency: { type: StringType },
  },
});


const AllSearchSettingsType = new ObjectType({
  name: 'AllSearchSettingsType',
  fields: {
    results: {
      type: SearchSettingsType
    },
    status: {
      type: IntType
    },
    errorMessage: {
      type: StringType
    }
  },
});

export default AllSearchSettingsType;