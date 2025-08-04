import {
  GraphQLList as List,
} from 'graphql';
import { Cancellation } from '../../models';
import CancellationType from '../../types/CancellationType';

const getAllCancellation = {

  type: new List(CancellationType),

  async resolve({ request }) {
    try {
      return await Cancellation.findAll({
        where: {
          isEnable: true
        }
      });
    } catch (error) {
      return {
        status: '400'
      };
    }
  }
};

export default getAllCancellation;