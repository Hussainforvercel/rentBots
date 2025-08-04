import {
  GraphQLList as List,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { Listing, ListPhotos } from '../../../models';
import ListPhotosType from '../../../types/ListPhotosType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const adminRemoveListing = {
  type: new List(ListPhotosType),
  args: {
    listId: { type: new NonNull(IntType) },
  },
  async resolve({ request }, { listId }) {

    try {
      // Check whether user is logged in
      if (request?.user?.admin) {

        const getPhotos = await ListPhotos.findAll({
          where: { listId }
        });

        const removelisting = await Listing.destroy({
          where: {
            id: listId
          }
        });

        if (removelisting > 0) {
          return getPhotos;
        } else {
          return {
            status: 'failed'
          }
        }

      } else {
        return {
          status: "Not loggedIn"
        };
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    } I
  },
};

export default adminRemoveListing;