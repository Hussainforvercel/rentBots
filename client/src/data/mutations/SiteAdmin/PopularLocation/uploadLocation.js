import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { PopularLocation } from '../../../models';
import PoularLocationType from '../../../types/siteadmin/PopularLocationType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const uploadLocation = {
  type: PoularLocationType,
  args: {
    image: { type: StringType },
    id: { type: IntType },
  },
  async resolve({ request }, { image, id }) {

    try {
      if (request?.user?.admin == true) {
        let updateLocation = await PopularLocation.update({
          image: image
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

export default uploadLocation;
