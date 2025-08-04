import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLList as List,
  } from 'graphql';
  // import {Reviews, User, UserVerifiedInfo} from '../models';
  import Reviews from '../../data/models/Reviews.js';
  import User from '../../data/models/User.js';
  import UserVerifiedInfo from '../../data/models/UserVerifiedInfo.js';
  import ReviewsType from './ReviewsType.js';
  import ProfileType from './ProfileType.js';
  import UserType from './UserType.js';
  import UserVerifiedInfoType from './UserVerifiedInfoType.js';
  
  const ShowUserProfileType = new ObjectType({
    name: 'ShowUserProfile',
    fields: {
      userId: { type: StringType },
      profileId: { type: IntType },
      firstName: { type: StringType },
      lastName: { type: StringType },
      gender: { type: StringType },
      dateOfBirth: { type: StringType },
      phoneNumber: { type: StringType },
      preferredLanguage: { type: StringType },
      preferredCurrency: { type: StringType },
      location: { type: StringType },
      info: { type: StringType },
      createdAt: { type: StringType },
      picture:  { type: StringType },
      country:  { type: StringType },
      profileBanStatus: {
        type: UserType,
        async resolve(profile) {
          return User.findOne({
            where: { 
              id: profile.userId
             }
          });
        }
      },
      userVerifiedInfo: {
        type: UserVerifiedInfoType,
        async resolve(profile) {
          return UserVerifiedInfo.findOne({
            where: { 
              userId: profile.userId
             }
          });
        }
      },
      reviewsCount: {
        type: IntType,
        async resolve(profile) {
          return await Reviews.count({
            where: {
              userId: profile.userId
            }
          });
        }
      },
      userData: {
        type: ProfileType,
        resolve(reviews) {
          return UserProfile.findOne({
            where: { profileId: reviews.profileId }
          });
        }
      },
      reviews: {
        type: new List(ReviewsType),
        async resolve(profile) {
          return await Reviews.findAll({
            where: {
              userId: profile.userId
            },
            limit: 10
          });
        }
      },
    },
  });

  const ShowUserProfileCommonType = new ObjectType({
    name: 'ShowUserProfileCommon',
    fields: {
        results: { 
            type: ShowUserProfileType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        },
    }
});
  
  export default ShowUserProfileCommonType;
  