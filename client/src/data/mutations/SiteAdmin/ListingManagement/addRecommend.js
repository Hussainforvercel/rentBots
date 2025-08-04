import {
  GraphQLInt as IntType,
} from 'graphql';
import { Recommend, Listing } from '../../../models';
import RecommendType from '../../../types/RecommendType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const addRecommend = {
  type: RecommendType,
  args: {
    listId: { type: IntType }
  },
  async resolve({ request }, { listId }) {

    try {
      if (request?.user?.admin == true) {

        const list = await Listing.findOne({
          where: {
            id: listId,
            isPublished: true
          }
        });

        if (!list) {
          return {
            status: '400',
            errorMessage: await showErrorMessage({ errorCode: 'isPublished' })
          }
        }

        const insertRecommend = await Recommend.create({
          listId
        });

        return {
          status: insertRecommend ? 'success' : 'failed'
        }
      } else {
        return {
          status: 'not logged in'
        }
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default addRecommend;
