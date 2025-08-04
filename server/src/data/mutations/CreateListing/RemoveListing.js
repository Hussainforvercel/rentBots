import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
// import { Listing, ListPhotos, Reviews, Reservation } from '../../models';
import Listing from '../../models/Listing.js';
import ListPhotos from '../../models/ListPhotos.js';
import Review from '../../models/Reviews.js';
import Reservation from '../../models/Reservation.js';
import ListPhotosCommonType from '../../types/ListPhotosType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const RemoveListing = {
  type: ListPhotosCommonType,
  args: {
    listId: { type: new NonNull(IntType) },
  },
  async resolve({ request }, { listId }) {

    try {
      // Check whether user is logged in
      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        const getReservationCount = await Reservation.count({
          where: {
            listId,
            paymentState: 'completed',
            $or: [
              {
                reservationState: 'approved'
              },
              {
                reservationState: 'pending'
              }
            ],
          },
        });

        if (getReservationCount > 0) {
          return {
            status: 400,
            errorMessage: await showErrorMessage({ errorCode: 'unableToDeleteListing' })
          }
        } else {
          const getPhotos = await ListPhotos.findAll({
            where: { listId }
          });

          const removelisting = await Listing.destroy({
            where: {
              id: listId
            }
          });
          await Reviews.destroy({
            where: {
              listId
            }
          });

          if (removelisting > 0) {
            return {
              results: getPhotos,
              status: 200
            }
          } else {
            return {
              status: 400,
              errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
            }
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default RemoveListing;