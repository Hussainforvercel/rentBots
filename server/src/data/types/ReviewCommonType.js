import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
} from 'graphql';
// Models
import ReviewsType from './ReviewsType.js';

const ReviewCommonType = new ObjectType({
    name: 'Reviewlist',
    fields: {
        results: { 
            type: new List(ReviewsType)
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
        count: {
            type: IntType
        },
        currentPage: {
            type: IntType
        },
        ownerType: {
            type: StringType
        },
    }
});

export default ReviewCommonType;
