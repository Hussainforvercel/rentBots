import {
    GraphQLObjectType as ObjectType,
    GraphQLList as List,
    GraphQLInt as IntType,
} from 'graphql';
import ReviewsType from './ReviewsType.js';

const AllReviewsType = new ObjectType({
	name: 'AllReview',
	fields: {
		results: {
			type: new List(ReviewsType)
		},
		count: {
			type: IntType
		},
		status: {
			type: IntType
		}
	}
});

export default AllReviewsType;