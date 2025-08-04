import {
    GraphQLList as List
} from 'graphql';
import { Reviews } from '../../models';
import ReviewsType from '../../types/ReviewsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getAdminReviews = {

    type: new List(ReviewsType),

    async resolve({ request }) {
        try {
            let isAdmin = 1;

            if (!request?.user?.admin) {
                return {
                    status: "notLoggedIn",
                    errorMessage: await showErrorMessage({ errorCode: 'adminLogin' })
                };
            }

            return await Reviews.findAll({
                where: {
                    isAdmin
                },
                order: [['updatedAt', 'DESC']]
            });

        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getAdminReviews;