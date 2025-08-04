import {
    GraphQLBoolean as BooleanType,
    GraphQLInt as IntType,
    GraphQLString as StringType
} from 'graphql';
import { AdminReviews } from '../../../models';
import WhyHostReviewType from '../../../types/siteadmin/WhyHostReviewType';
import sequelize from '../../../sequelize';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getWhyHostAllReviews = {

    type: WhyHostReviewType,
    args: {
        currentPage: { type: IntType },
        searchList: { type: StringType },
    },

    async resolve({ request }, { currentPage, searchList }) {
        try {

            if (!request.user) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userLoggedIn' })
                }
            }

            let where = {}, keywordFilter = {};
            const limit = 10;
            let offset = 0;
            // Offset from Current Page
            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            if (searchList && searchList.length > 0 && searchList.toString().trim() != '') {
                keywordFilter = {
                    id: {
                        $in: [sequelize.literal(`SELECT id FROM AdminReviews WHERE userName LIKE "%${searchList}%" OR id LIKE "%${searchList}%" OR reviewContent LIKE "%${searchList}%"`)]
                    }
                };
                where = keywordFilter;
            }


            const count = await AdminReviews.count({ where });

            let results = await AdminReviews.findAll({
                where,
                limit,
                offset,
            });

            return {
                count,
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

export default getWhyHostAllReviews;
