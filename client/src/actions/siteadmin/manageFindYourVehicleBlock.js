import {
    UPDATE_CAR_BLOCK_START,
    UPDATE_CAR_BLOCK_SUCCESS,
    UPDATE_CAR_BLOCK_ERROR,
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { updateFindYourBlock as mutation, getFindYourVehicleBlockQuery } from '../../lib/graphql';

export const manageFindYourVehicleBlock = (values) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({ type: UPDATE_CAR_BLOCK_START });

            const { data } = await client.mutate({
                mutation,
                variables: values,
                refetchQueries: [{ query: getFindYourVehicleBlockQuery }]
            });

            if (data?.updateFindYourBlock?.status === 200) {
                showToaster({ messageId: 'updateFindYourBlock', toasterType: 'success' })
                dispatch({ type: UPDATE_CAR_BLOCK_SUCCESS });
            } else {
                dispatch({
                    type: UPDATE_CAR_BLOCK_ERROR,
                    payload: {
                        status: data?.updateFindYourBlock?.status
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: UPDATE_CAR_BLOCK_ERROR,
                payload: {
                    error
                }
            });
        }
    };
}

