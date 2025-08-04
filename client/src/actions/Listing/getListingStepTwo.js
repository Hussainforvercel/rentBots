import {
    GET_LISTING_DETAILS_START,
    GET_LISTING_DETAILS_SUCCESS,
    GET_LISTING_DETAILS_ERROR
} from '../../constants';
import { getStepTwo as query } from '../../lib/graphql';

export const getListingStepTwo = (listId) => {
    return async (dispatch, getState, { client }) => {

        try {

            dispatch({
                type: GET_LISTING_DETAILS_START,
                payload: {
                    isLoading: true,
                }
            });

            // Send Request to get listing data
            const { data } = await client.query({
                query,
                variables: {
                    listId
                },
                fetchPolicy: 'network-only',
            });

            if (data?.getStepTwo) {
                let isStepTwo = data?.getStepTwo;

                dispatch({
                    type: GET_LISTING_DETAILS_SUCCESS,
                    payload: {
                        stepTwoDetails: isStepTwo,
                        isLoading: false,
                    }
                });
            } else {
                dispatch({
                    type: GET_LISTING_DETAILS_ERROR,
                    payload: {
                        isLoading: false,
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: GET_LISTING_DETAILS_ERROR,
                payload: {
                    error,
                    isLoading: false,
                },
            });
            return false;
        }

        return true;
    };
}
