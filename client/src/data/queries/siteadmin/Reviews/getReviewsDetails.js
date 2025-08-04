import {
    GraphQLString as StringType,
    GraphQLInt as IntType
} from 'graphql';
import { Reviews } from '../../../models';
import ReviewsWholeType from '../../../types/siteadmin/ReviewsWholeType';
import sequelize from '../../../sequelize';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getReviewsDetails = {

    type: ReviewsWholeType,
    args: {
        currentPage: { type: IntType },
        searchList: { type: StringType },
    },

    async resolve({ request }, { currentPage, searchList }) {
        try {
            let reviewsData, userCountLength, where, offset = 0;
            const limit = 10;

            if (!request?.user || !request?.user?.admin) {
                return {
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }

            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }

            if (searchList) {
                where = {
                    isAdmin: false,
                    $or: [
                        {
                            id: {
                                $or: [
                                    {
                                        $in: [
                                            sequelize.literal(
                                                `SELECT id FROM Reviews WHERE listId IN(SELECT id FROM Listing WHERE title LIKE "%${searchList}%")`
                                            )]
                                    },
                                ]
                            },
                        },
                        {
                            reviewContent: {
                                $like: '%' + searchList + '%'
                            }
                        },
                        {
                            rating: {
                                $like: '%' + searchList + '%'
                            }
                        },
                        {
                            listId: {
                                $like: '%' + searchList + '%'
                            }
                        }
                    ],
                }
                userCountLength = await Reviews.count({
                    where
                });
                reviewsData = await Reviews.findAll({
                    where,
                    order: [['updatedAt', 'DESC']],
                    limit,
                    offset,
                });
            } else {
                userCountLength = await Reviews.count({
                    where: {
                        isAdmin: false,
                    },
                });
                reviewsData = await Reviews.findAll({
                    where: {
                        isAdmin: false,
                    },
                    limit,
                    offset,
                    order: [
                        ['updatedAt', 'DESC']
                    ],
                });
            }
            return {
                reviewsData,
                count: userCountLength
            };
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getReviewsDetails;