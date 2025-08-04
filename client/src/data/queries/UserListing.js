import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';
import {
  Listing
} from '../../data/models';

import ShowListingType from '../types/ShowListingType';

const UserListing = {

  type: ShowListingType,

  args: {
    listId: { type: new NonNull(StringType) },
    preview: { type: BooleanType },
  },

  async resolve({ request }, { listId, preview }) {
    let where;
    if (request.user && request.user.admin) {
      where = {
        id: listId
      };
    } else if (request.user && preview) {
      where = {
        id: listId
      };
    } else {
      where = {
        id: listId,
        isPublished: true,
      };
    }

    const listingData = await Listing.find({
      where
    });

    return listingData;

  },
};

export default UserListing;
