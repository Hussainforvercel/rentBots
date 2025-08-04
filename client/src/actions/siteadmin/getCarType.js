import {
    CAR_LOAD_LIST_SETTINGS_START,
    CAR_LOAD_LIST_SETTINGS_SUCCESS,
    CAR_LOAD_LIST_SETTINGS_ERROR
} from '../../constants';
import { getCarDetails as query } from '../../lib/graphql';

export const getCarType = () => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: CAR_LOAD_LIST_SETTINGS_START,
            });

            const { data } = await client.query({
                query,
                fetchPolicy: 'network-only'
            });

            if (!data && !data.getCarDetails) {
                dispatch({
                    type: CAR_LOAD_LIST_SETTINGS_ERROR,
                });
            } else {
                dispatch({
                    type: CAR_LOAD_LIST_SETTINGS_SUCCESS,
                    isCarDetails: data && data.getCarDetails,
                });
            }

        } catch (error) {
            dispatch({
                type: CAR_LOAD_LIST_SETTINGS_ERROR,
                payload: {
                    error
                }
            });
            return false;
        }
        return true;
    };
}
