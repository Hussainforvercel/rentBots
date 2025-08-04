import {
  REMOVE_LISTING_START,
  REMOVE_LISTING_SUCCESS,
  REMOVE_LISTING_ERROR
} from '../constants';
import history from '../core/history';
import showToaster from '../helpers/toasterMessages/showToaster';
import {
  getUpcomingBookingQuery, manageListings as query,
  removeListing as mutation
} from '../lib/graphql';

export const removeListing = (listId, userRole) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: REMOVE_LISTING_START,
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
        showToaster({ messageId: 'checkUpcomingBooking', toasterType: 'error' })
      }
      else {

        // Send Request to get listing data
        const { data } = await client.mutate({
          mutation,
          variables: { listId },
          refetchQueries: [{ query }]
        });

        if (data?.RemoveListing) {
          dispatch({
            type: REMOVE_LISTING_SUCCESS,
          });
          if (userRole != undefined && userRole === "admin") {
            history.push('/siteadmin/listings/');
          } else {
            history.push('/cars');
          }

          if (data?.RemoveListing?.length > 0) {
            const removeFiles = await fetch('/removeMultiFiles', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                files: data?.RemoveListing,
              }),
              credentials: 'include',
            });
          }
        } else {
          dispatch({
            type: REMOVE_LISTING_ERROR,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: REMOVE_LISTING_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
