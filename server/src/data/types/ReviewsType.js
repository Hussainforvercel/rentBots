import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';
// import { Reviews, UserProfile, Listing } from '../models';
import Reviews from '../../data/models/Reviews.js';
import UserProfile from '../../data/models/UserProfile.js';
import Listing from '../../data/models/Listing.js'
import ProfileType from './ProfileType.js';
import AdminListingType from './siteadmin/AdminListingType.js';

const ReviewResponseType = new ObjectType({
    name: 'ReviewResponse',
    fields: {
        id: {
            type: IntType
        },
        reservationId: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        authorId: {
            type: StringType
        },
        authorData: {
            type: ProfileType,
            resolve(reviews){
               return UserProfile.findOne({
                    where: { userId: reviews.authorId }
                });
            }
        },
        userId: {
            type: StringType
        },
        userData: {
            type: ProfileType,
            resolve(reviews){
               return UserProfile.findOne({
                    where: { userId: reviews.userId }
                });
            }
        },
        reviewContent: {
            type: StringType
        },
        rating: {
            type: FloatType
        },
        privateFeedback: {
            type: StringType
        },
        parentId: {
            type: IntType
        },
        automated: {
            type: BooleanType
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        },
        status: {
            type: StringType
        },
        isAdmin: {
            type: BooleanType
        }
    }
});

const ReviewsType = new ObjectType({
    name: 'Reviews',
    fields: {
        id: {
            type: IntType
        },
        reservationId: {
            type: IntType
        },
        loadCount: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        listData: {
            type: AdminListingType,
            resolve(reviews) {
                return Listing.findOne({
                    where: { id: reviews.listId }
                })
            }
        },
        authorId: {
            type: StringType
        },
        authorData: {
            type: ProfileType,
            resolve(reviews){
               return UserProfile.findOne({
                    where: { userId: reviews.authorId }
                });
            }
        },
        userId: {
            type: StringType
        },
        userData: {
            type: ProfileType,
            resolve(reviews){
               return UserProfile.findOne({
                    where: { userId: reviews.userId }
                });
            }
        },
        reviewContent: {
            type: StringType
        },
        rating: {
            type: FloatType
        },
        privateFeedback: {
            type: StringType
        },
        parentId: {
            type: IntType
        },
        automated: {
            type: BooleanType
        },
        response: {
            type: ReviewResponseType,
            async resolve(reviews) {
                return await Reviews.findOne({
                    where: {
                        reservationId: reviews.reservationId,
                        authorId: reviews.userId
                    }
                });
            }
        },
        yourReviewsCount: {
            type: IntType,
            async resolve(reviews) {
                return await Reviews.count({
                    where: {
                        userId: reviews.userId
                    }
                });
            }
        },
        reviewsCount: {
            type: IntType,
            async resolve(reviews) {
                return await Reviews.count({
                    where: {
                        authorId: reviews.authorId
                    }
                });
            }
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        },
        status: {
            type: StringType
        },
        isAdmin: {
            type: BooleanType
        }
    }
});



export default ReviewsType;