import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import  Reviews  from '../../../data/models/Reviews.js';
import AllReviewsType from '../../types/AllReviewsType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getReviews = {
    type: AllReviewsType,
    args: {
        listId: { type: IntType },
        currentPage: { type: IntType },
        hostId: { type: new NonNull(StringType) },
    },
    async resolve({ request }, { listId, currentPage, hostId }) {

        try {
            const limit = 10;
            let offset = 0;
            // Offset from Current Page
            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            await Reviews.findAll({
                where: {
                    listId: listId,
                    userId: hostId
                }
            });

            // Get Reviews for particular Listings
            const reviewData = await Reviews.findAll({
                where: {
                    listId: listId,
                    userId: hostId
                },
                limit,
                offset,
            });

            return {
                results: reviewData,
                status: reviewData ? 200 : 400,
                errorMessage: reviewData ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                count: reviewData.length > 0 ? reviewData.length : 0,
            }
        }
        catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default getReviews;