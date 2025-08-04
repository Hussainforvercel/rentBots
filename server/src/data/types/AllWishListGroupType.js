import {
    GraphQLList as List,
    GraphQLObjectType as ObjectType,
    GraphQLInt as IntType,
    GraphQLString as StringType,
} from 'graphql';

import WishListGroupType from './WishListGroupType.js';

const AllWishListGroupType = new ObjectType({
    name: 'AllWishListGroup',
    fields: {
        results: { type: new List(WishListGroupType) },
        count: { type: IntType },
        status: { type: IntType },
        errorMessage: { type: StringType }
    }
});

export default AllWishListGroupType;
