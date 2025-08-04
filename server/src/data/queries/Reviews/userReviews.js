import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
// import { Reviews, UserProfile } from '../../models';
import Reviews from '../../models/Reviews.js'
import ReviewCommonType from '../../types/ReviewCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const userReviews = {
    type: ReviewCommonType,
    args: {
        ownerType: { type: StringType },
        currentPage: { type: IntType },
        profileId: { type: IntType },
    },
    async resolve({ request, response }, { ownerType, currentPage, profileId }) {

        try {
            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            let limit = 10, offset = 0, where = {}, userId;

            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            if (profileId) {
                const getUser = await UserProfile.findOne({
                    where: {
                        profileId
                    }
                });
                userId = getUser.userId;
            } else {
                if (request.user && !request.user.admin) {
                    userId = request.user.id;
                }
            }

            if (ownerType === 'me') {
                where = {
                    authorId: userId
                };
            } else {
                where = {
                    userId
                };
            }

            const results = await Reviews.findAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                results: results.length > 0 ? results : null,
                status: results && results.length > 0 ? 200 : 400,
                errorMessage: results && results.length > 0 ? null : await showErrorMessage({ errorCode: 'noRecordsFound' })
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default userReviews;