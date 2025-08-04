import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { Payout } from '../../models';
import PayoutType from '../../types/PayoutType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const setDefaultPayout = {
  type: PayoutType,
  args: {
    id: { type: new NonNull(IntType) },
  },
  async resolve({ request, response }, { id }) {

    try {
      // Check if user already logged in
      if (request?.user && !request?.user?.admin) {

        const userId = request?.user?.id;
        let changeEverything = await Payout.update({
          default: false
        },
          {
            where: {
              userId
            }
          });

        let payoutupdated = await Payout.update({
          default: true
        },
          {
            where: {
              id,
              userId
            }
          });

        return {
          status: payoutupdated ? 'success' : 'error in deleting a record'
        }

      } else {
        return {
          status: "notLoggedIn",
        };
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default setDefaultPayout;

/**
mutation setDefaultPayout(
  $id: Int!, 
){
    setDefaultPayout(
      id: $id
    ) {
        status
    }
}
**/
