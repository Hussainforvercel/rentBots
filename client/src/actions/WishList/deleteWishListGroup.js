import {
    DELETE_WISH_LIST_GROUP_START,
    DELETE_WISH_LIST_GROUP_SUCCESS,
    DELETE_WISH_LIST_GROUP_ERROR
} from '../../constants';
import history from '../../core/history';
import { DeleteWishListGroup as mutation, getAllWishListGroupQuery } from '../../lib/graphql';

export const deleteWishListGroup = (id) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: DELETE_WISH_LIST_GROUP_START,
            });

            let profileId = getState().account.data.profileId;
            const { data } = await client.mutate({
                mutation,
                variables: {
                    id: id
                },
                refetchQueries: [
                    {
                        query: getAllWishListGroupQuery,
                        variables: {
                            profileId
                        }
                    }
                ]
            });

            if (data?.DeleteWishListGroup?.status == 'success') {
                history.push('/wishlists');
            }

            dispatch({
                type: DELETE_WISH_LIST_GROUP_SUCCESS,
            });
        } catch (error) {
            dispatch({
                type: DELETE_WISH_LIST_GROUP_ERROR,
                payload: {
                    error
                }
            });
            return false;
        }
        return true;
    };
}