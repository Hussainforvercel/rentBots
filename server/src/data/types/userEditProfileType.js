import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
// import { UserVerifiedInfo, User } from '../models';
import UserVerifiedInfo from '../models/UserVerifiedInfo.js';
import User from '../models/User.js'
import UserVerifiedInfoType from './UserVerifiedInfoType.js';
import UserProfileType from './UserProfileType.js';

const UserEditProfile = new ObjectType({
  name: 'userEditProfile',
  fields: {
    userId: { type: ID },
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: StringType },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    status: { type: StringType },
    country: { type: IntType },
    verificationCode: { type: IntType },
    picture: {
      type: StringType,
    },
    createdAt: {
      type: StringType
    },
    verification: {
      type: UserVerifiedInfoType,
      async resolve(userProfile) {
        return await UserVerifiedInfo.findOne({ where: { userId: userProfile.userId } });
      }
    },
    userData: {
      type: UserProfileType,
      resolve(profile) {
        return User.findOne({
          where: { id: profile.userId },
        });
      },
    },
    displayName: {
      type: StringType,
    },
    countryCode: { type: StringType },
  },
});

export default UserEditProfile;
