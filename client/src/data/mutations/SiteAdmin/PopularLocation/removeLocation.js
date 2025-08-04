import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { PopularLocation } from '../../../models';
import PopularLocationType from '../../../types/siteadmin/PopularLocationType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const removeLocation = {
  type: PopularLocationType,
  args: {
    id: { type: IntType },
    image: { type: StringType },
  },
  async resolve({ request }, { id, image }) {

    try {
      if (request?.user?.admin == true) {
        let updateLocation = await PopularLocation.update({
          image: null
        }, {
          where: {
            id: id
          }
        });

        return {
          status: updateLocation ? 'success' : 'failed'
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

export default removeLocation;
