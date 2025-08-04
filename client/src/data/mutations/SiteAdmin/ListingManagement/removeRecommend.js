import {
  GraphQLInt as IntType
} from 'graphql';
import { Recommend } from '../../../models';
import RecommendType from '../../../types/RecommendType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const removeRecommend = {
  type: RecommendType,
  args: {
    listId: { type: IntType }
  },
  async resolve({ request }, { listId }) {

    try {
      if (request?.user?.admin == true) {

        const deleteRecommend = await Recommend.destroy({
          where: {
            listId
          }
        });

        if (deleteRecommend) {
          return {
            listId,
            status: 'success'
          }
        } else {
          return {
            status: 'failed'
          }
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
    } I
  },
};

export default removeRecommend;
