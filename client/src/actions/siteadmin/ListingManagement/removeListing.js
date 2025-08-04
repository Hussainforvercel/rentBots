import {
  SITE_ADMIN_REMOVE_LISTING_START,
  SITE_ADMIN_REMOVE_LISTING_SUCCESS,
  SITE_ADMIN_REMOVE_LISTING_ERROR
} from '../../../constants';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { getUpcomingBookingQuery, adminRemoveListing as mutation } from '../../../lib/graphql';

export const removeListing = (listId, userRole) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: SITE_ADMIN_REMOVE_LISTING_START,
      });

      let upcomingBookingCount;
      const bookedData = await client.query({
        query: getUpcomingBookingQuery,
        variables: {
          listId
        },
        fetchPolicy: 'network-only'
      });

      if (bookedData?.data?.getUpcomingBookings) {
        upcomingBookingCount = bookedData?.data?.getUpcomingBookings?.count;
      }

      if (upcomingBookingCount > 0) {
        showToaster({ messageId: 'checkUpcomingBooking', toasterType: 'error' });
        return {
          status : 400
        }
      }
      else {

        const { data } = await client.mutate({
          mutation,
          variables: { listId }
        });

        if (data?.adminRemoveListing) {
          dispatch({
            type: SITE_ADMIN_REMOVE_LISTING_SUCCESS,
          });
          showToaster({ messageId: 'removeListingSuccess', toasterType: 'success' });
          

          if (data?.adminRemoveListing?.length > 0) {
            const removeFiles = await fetch('/removeMultiFiles', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                files: data?.adminRemoveListing,
              }),
              credentials: 'include',
            });
          }
          return {
            status : 200
          }
        } else {
          dispatch({
            type: SITE_ADMIN_REMOVE_LISTING_ERROR,
          });
          return {
            status : 400
          }
        }
      }
    } catch (error) {
      dispatch({
        type: SITE_ADMIN_REMOVE_LISTING_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
