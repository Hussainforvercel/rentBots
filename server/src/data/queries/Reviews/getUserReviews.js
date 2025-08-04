import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import Reviews from '../../models/Reviews.js'
import ReviewCommonType from '../../types/ReviewCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getUserReviews = {
    type: ReviewCommonType,
    args: {
        ownerType: { type: StringType },
        currentPage: { type: IntType }
    },
    async resolve({ request }, { ownerType = 'other', currentPage }) {

        try {
            let offset = 0, limit = 10, userId, where = {};
            if (!request.user) {
                return {
                    status: 500,
                    ownerType,
                    errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            userId = request.user.id;

            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }
            where = (ownerType === 'other') ? { userId } : { authorId: userId };

            const results = await Reviews.findAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            const count = await Reviews.count({ where });

            return await {
                status: count > 0 && results && results.length > 0 ? 200 : 400,
                results,
                ownerType,
                count,
                currentPage,
                errorMessage: count > 0 && results && results.length > 0 ? null : await showErrorMessage({ errorCode: 'noReviews' })
            };
        } catch (error) {
            return {
                status: 400,
                ownerType,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getUserReviews;