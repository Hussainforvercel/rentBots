import { AdminReviews } from '../../../models';
import WhyHostReviewType from '../../../types/siteadmin/WhyHostReviewType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getHomeWhyHostReview = {

    type: WhyHostReviewType,

    async resolve({ request }) {
        try {

            let results = await AdminReviews.findAll({
                where: {
                    isEnable: true
                }
            });

            return {
                results,
                status: results ? 200 : 400,
                errorMessage: results ? null : await showErrorMessage({ errorCode: 'fetchRecordsError' })
            }

        } catch (e) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error: e })
            }
        }
    }
};

export default getHomeWhyHostReview;
