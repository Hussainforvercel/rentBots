import {
  GraphQLList as List
} from 'graphql';
import { Listing, Recommend } from '../../data/models';
import ShowListingType from '../types/ShowListingType';

const getRecommend = {

  type: new List(ShowListingType),

  async resolve({ request }) {

    // Get Recommended Listings
    return await Listing.findAll({
      where: {
        isPublished: true
      },
      include: [
        { model: Recommend, as: "recommend", required: true },
      ]
    });

  },
};

export default getRecommend;
