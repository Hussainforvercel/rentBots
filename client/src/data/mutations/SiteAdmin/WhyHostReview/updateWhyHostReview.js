import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';
import { AdminReviews } from '../../../models';
import WhyHostReviewType from '../../../types/siteadmin/WhyHostReviewType';
import showErrorMessage from '../../../../helpers/showErrorMessage'

const updateWhyHostReview = {
    type: WhyHostReviewType,
    args: {
        id: { type: IntType },
        userName: { type: StringType },
        reviewContent: { type: StringType },
        image: { type: StringType },
        isEnable: { type: BooleanType }
    },
    async resolve({ request, response }, {
        id,
        userName,
        reviewContent,
        image,
        isEnable
    }) {
        try {
            if (!request.user) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginAccount' })
                };
            }

            let updateReview;

            if (id) {
                updateReview = await AdminReviews.update(
                    {
                        userName,
                        reviewContent,
                        image,
                        isEnable
                    },
                    {
                        where: {
                            id
                        }
                    }
                );

            } else {
                updateReview = await AdminReviews.create({
                    userName,
                    reviewContent,
                    image,
                    isEnable
                });
            }

            return {
                status: updateReview ? 200 : 400,
                errorMessage: updateReview ? null : await showErrorMessage({ errorCode: 'updateReviewError' })
            }

        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }

    }
}

export default updateWhyHostReview;