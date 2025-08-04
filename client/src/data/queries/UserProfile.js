import {
  GraphQLList as List,
  GraphQLInt as IntType,
} from 'graphql';
import { UserProfile } from '../../data/models';
import Profile from '../types/ProfileType';

const GetProfile = {

  type: new List(Profile),

  args: {
    profileId: { type: IntType },
  },

  async resolve({ request }, { profileId }) {

    // Get All User Profile Data
    const userData = await UserProfile.findAll({
      where: {
        profileId: profileId
      }
    });

    return userData;

  },
};

export default GetProfile;
