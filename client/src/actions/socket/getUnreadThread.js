import { unreadThreadsQuery as query } from "../../lib/graphql";

export const getUnreadThread = () => {
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