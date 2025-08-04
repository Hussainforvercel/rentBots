import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';
import { Reviews, Listing } from '../../../models';
import ReviewsType from '../../../types/ReviewsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';
import updateReviewsCount from '../../../../helpers/updateReviewsCount';

const writeUserReview = {
    type: ReviewsType,
    args: {
        id: { type: IntType },
        listId: { type: new NonNull(IntType) },
        reviewContent: { type: new NonNull(StringType) },
        rating: { type: new NonNull(FloatType) }
    },
    async resolve({ request, response }, {
        id,
        listId,
        reviewContent,
        rating
    }) {
        try {
            if (request?.user?.admin) {
                let userId, reservationId = 0, parentId = 0, automated = 0, isAdmin = 1;
                const authorId = request?.user?.id;
                const listDetails = await Listing.findById(listId);
                if (listDetails) {
                    userId = listDetails?.userId;
                } else {
                    return {
                        status: '404'
                    }
                }
                if (id) {
                    const updateReview = await Reviews.update(
                        {
                            listId,
                            reviewContent,
                            rating,
                            userId
                        },
                        {
                            where: {
                                id
                            }
                        }
                    );

                    updateReview && updateReviewsCount({ userId, listId })
                    return {
                        status: updateReview ? '200' : '400'
                    }
                } else {
                    const createReview = await Reviews.create({
                        reservationId,
                        listId,
                        authorId,
                        userId,
                        reviewContent,
                        rating,
                        parentId,
                        automated,
                        isAdmin
                    });

                    createReview && await updateReviewsCount({ userId, listId })
                    return {
                        status: createReview ? '200' : '400'
                    }
                }
            } else {
                return {
                    status: 'notLoggedIn'
                }
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
}

export default writeUserReview;