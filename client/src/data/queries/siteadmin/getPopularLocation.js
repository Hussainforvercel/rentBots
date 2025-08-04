import {
  GraphQLList as List
} from 'graphql';
import { PopularLocation } from '../../models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const getPopularLocation = {

  type: new List(PopularLocationType),

  async resolve({ request }) {
    try {
      return await PopularLocation.findAll({});
    } catch (error) {
      return {
        status: '500'
      };
    }
  }
};

export default getPopularLocation;