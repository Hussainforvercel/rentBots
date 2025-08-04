import { inboxQuery as query } from "../../lib/graphql";

export const getAllThread = ({ threadType, threadId }) => {
    return async (dispatch, getState, { client }) => {
        try {
            const { data } = await client.query({
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