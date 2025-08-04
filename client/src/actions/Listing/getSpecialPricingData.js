import moment from 'moment';
import {
    GET_LISTING_SPECIAL_PRICING_START,
    GET_LISTING_SPECIAL_PRICING_SUCCESS,
    GET_LISTING_SPECIAL_PRICING_ERROR
} from '../../constants';
import { getSpecialPricing as query } from '../../lib/graphql';

export const getSpecialPricingData = (listId, startDate, endDate) => {
    return async (dispatch, getState, { client }) => {

        try {

            dispatch({
                type: GET_LISTING_SPECIAL_PRICING_START,
                payload: {
                    isLoading: true,
                    specialPricing: []
                }
            });

            // Send Request to get listing data
            const { data } = await client.query({
                query,
                variables: {
                    listId,
                    startDate,
                    endDate
                },
                fetchPolicy: 'network-only',
            });

            if (data?.getSpecialPricing?.length > 0) {
                let convertedResponse = [];
                await Promise.all(data.getSpecialPricing.map(async (item) => {
                    if (item.calendarStatus == 'available') {
                        convertedResponse.push({
                            "listId": item.listId,
                            "blockedDates": moment(item.blockedDates).utc().format('MM/DD/YYYY'),
                            "isSpecialPrice": item.isSpecialPrice
                        });
                    }
                }));

                dispatch({
                    type: GET_LISTING_SPECIAL_PRICING_SUCCESS,
                    payload: {
                        // specialPricing: data.getSpecialPricing,
                        specialPricing: convertedResponse ? convertedResponse : [],
                        isLoading: false,
                    }
                });
            } else {
                dispatch({
                    type: GET_LISTING_SPECIAL_PRICING_ERROR,
                    payload: {
                        specialPricing: [],
                        isLoading: false,
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: GET_LISTING_SPECIAL_PRICING_ERROR,
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
