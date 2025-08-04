import {
    MANANGE_LISTING_PUBLISH_STATUS_START,
    MANANGE_LISTING_PUBLISH_STATUS_SUCCESS,
    MANANGE_LISTING_PUBLISH_STATUS_ERROR,
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import {
    ManageListingQuery, ListingStepsQuery, getUpcomingBookingQuery,
    ManagePublish as mutation, WishListStatus
} from '../../lib/graphql';

export const ManagePublishStatus = (listId, action) => {
    return async (dispatch, getState, { client }) => {

        try {

            if (!navigator.onLine) {
                showToaster({ messageId: 'networkFailed', toasterType: 'error' })
                return;
            }

            dispatch({
                type: MANANGE_LISTING_PUBLISH_STATUS_START,
                payload: {
                    publishListLoading: true
                }
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

            let publishStatus = 'Publish Listing';
            if (action === 'unPublish') {
                publishStatus = 'UnPublish Listing'
            }

            let type = action === 'unPublish' ? ' Your listings has been unpublished successfully!' : ' Your listings has been published successfully!';

            if (upcomingBookingCount > 0 && action === 'unPublish') {
                showToaster({ messageId: 'unpublishListing', toasterType: 'error' })
                dispatch({
                    type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                    payload: {
                        publishListLoading: false
                    }
                });
            } else {

                const { data } = await client.mutate({
                    mutation,
                    variables: {
                        listId,
                        action
                    },
                    refetchQueries: [
                        { query: ManageListingQuery },
                    ]
                });

                if (data?.managePublish?.status === '200') {

                    const { dataList } = await client.mutate({
                        mutation: WishListStatus,
                        variables: {
                            listId,
                            action
                        },
                    });

                    // Reload Existing Steps Page
                    const { data } = await client.query({
                        query: ListingStepsQuery,
                        variables: { listId },
                        fetchPolicy: 'network-only',
                    });
                    showToaster({ messageId: 'commonSuccess', toasterType: 'success', requestMessage: type })

                    dispatch({
                        type: MANANGE_LISTING_PUBLISH_STATUS_SUCCESS,
                        payload: {
                            listingSteps: data.showListingSteps,
                            publishListLoading: false
                        }
                    });
                } else {

                    showToaster({ messageId: 'listingFailed', toasterType: 'error', requestMessage: publishStatus })
                    dispatch({
                        type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                        payload: {
                            status: data.managePublish.status,
                            publishListLoading: false
                        }
                    });
                }
            }
        } catch (error) {
            dispatch({
                type: MANANGE_LISTING_PUBLISH_STATUS_ERROR,
                payload: {
                    error,
                    publishListLoading: false
                }
            });
        }
    };
}
