import { countQuery as query } from "../../lib/graphql";

export const getUnreadCount = () => {
    return async (dispatch, getState, { client }) => {
        try {
            await client.query({
                query,
                fetchPolicy: 'network-only'
            });
        } catch (error) {
            console.log("Error", error);
        }
    };
}