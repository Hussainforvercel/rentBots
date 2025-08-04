import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
import ListBlockedDates from '../../models/ListBlockedDates.js'
import ListBlockedDatesType from '../../types/ListBlockedDatesType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const getListingSpecialPrice = {
    type: ListBlockedDatesType,
    args: {
        listId: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { listId }) {

        try {
            let where, previousDay = moment().subtract(1, 'days');

            if (request && (request.user || request.user.admin)) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                where = {
                    listId: listId
                };

                const listingData = await ListBlockedDates.findAll({
                    where: {
                        listId,
                        blockedDates: {
                            $gte: previousDay
                        },
                    },
                    order: [[`blockedDates`, `ASC`]],
                });

                return {
                    results: listingData,
                    status: listingData ? 200 : 400,
                    errorMessage: listingData ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default getListingSpecialPrice;