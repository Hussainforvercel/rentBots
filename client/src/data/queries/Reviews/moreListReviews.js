import {
    GraphQLList as List,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { Reviews, Listing } from '../../models';
import ReviewsType from '../../types/ReviewsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const moreListReviews = {

    type: new List(ReviewsType),

    args: {
        listId: { type: new NonNull(IntType) },
        offset: { type: IntType },
        loadCount: { type: IntType },
    },

    async resolve({ request, response }, { listId, hostId, offset, loadCount }) {
        try {
            let limit = 3;

            if (loadCount) {
                limit = loadCount;
            }
            const getListData = await Listing.findOne({
                where: {
                    id: listId
                }
            });

            if (getListData) {
                return await Reviews.findAll({
                    where: {
                        listId,
                        userId: getListData.userId,
                        isAdminEnable: true
                    },
                    limit,
                    offset
                });
            }
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default moreListReviews;