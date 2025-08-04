
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { UserListingSteps } from '../../data/models';
import ShowListingStepsType from '../types/ShowListingStepsType';

const showListingSteps = {

  type: ShowListingStepsType,

  args: {
    listId: { type: new NonNull(StringType) },
  },

  async resolve({ request }, { listId }) {

    // Get All Listing Data
    const listingSteps = await UserListingSteps.find({
      attributes: [
        'id',
        'listId',
        'step1',
        'step2',
        'step3'
      ],
      where: {
        listId: listId
      }
    });

    return listingSteps;

  },
};

export default showListingSteps;
