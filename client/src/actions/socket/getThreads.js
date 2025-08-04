import { threadItemsQuery as query } from "../../lib/graphql";

export const getThreads = ({ threadType, threadId }) => {
    return async (dispatch, getState, { client }) => {
        try {

            await client.query({
                query,
                variables: {
                    threadType,
                    threadId
                },
                fetchPolicy: 'network-only'
            });
        } catch (error) {
            console.log("Error", error)
        }
    };
}
