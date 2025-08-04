import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
// import { User, UserVerifiedInfo, Reviews } from '../models';
import User from '../../data/models/User.js';
import UserVerifiedInfo from '../../data/models/UserVerifiedInfo.js';
import Reviews from '../../data/models/Reviews.js';
import UserType from './UserType.js';
import UserVerifiedInfoType from './UserVerifiedInfoType.js';

const Profile = new ObjectType({
  name: 'userProfile',
  fields: {
    userId: {
      type: StringType,
    },
    userData: {
      type: UserType,
      resolve(profile) {
        return User.findOne({
          where: { id: profile.userId },
        });
      },
    },
    userVerification: {
      type: UserVerifiedInfoType,
      resolve(profile) {
        return UserVerifiedInfo.findOne({
          where: { userId: profile.userId },
        });
      },
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
    profileId: {
      type: IntType,
    },
    firstName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    displayName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    picture: {
      type: StringType,
    },
    location: {
      type: StringType,
    },
    phoneNumber: {
      type: StringType
    },
    fullPhoneNumber: {
      type: StringType,
      async resolve(profile) {
        return await profile.phoneNumber ? (profile.countryCode + ' ' + profile.phoneNumber) : null;
      }
    },
    info: {
      type: StringType,
    },
    createdAt: {
      type: StringType,
    },
  },
});

export default Profile;
