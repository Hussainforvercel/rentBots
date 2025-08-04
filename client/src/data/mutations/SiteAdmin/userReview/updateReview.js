import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import { Reviews } from '../../../models';
import ReviewsType from '../../../types/ReviewsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const updateReview = {
    type: ReviewsType,
    args: {
        id: { type: IntType },
        type: { type: StringType },
    },
    async resolve({ request }, { id, type }) {

        try {
            let isAdminEnable = true ? type === 'enable' : false;

            if (request?.user?.admin == true) {

                const insertReviews = await Reviews.findOne({
                    id
                });

                if (insertReviews) {
                    const updateAdminReview = await Reviews.update(
                        {
                            isAdminEnable
                        },
                        {
                            where: {
                                id
                            }
                        }
                    );
                    return {
                        status: 'success'
                    };
                } else {
                    return {
                        status: 'failed'
                    }
                }
            } else {
                return {
                    status: 'not logged in'
                }
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default updateReview;
