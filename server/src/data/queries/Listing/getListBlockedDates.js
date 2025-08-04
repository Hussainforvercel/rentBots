import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import Listing from '../../models/Listing.js'
import ListingType from '../../types/ListingType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getListBlockedDates = {
    type: ListingType,
    args: {
        listId: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { listId }) {

        try {
            let where;
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                if (!request.user.admin) {
                    const userId = request.user.id;
                    where = {
                        id: listId,
                        userId
                    };
                } else {
                    where = {
                        id: listId
                    };
                }
            } else {
                where = {
                    id: listId,
                    //isPublished: true,
                };
            }

            const listingData = await Listing.findOne({
                where
            });

            return {
                results: listingData,
                status: listingData ? 200 : 400,
                errorMessage: listingData ? null : await showErrorMessage({ errorCode: 'invalidError' })
            }

        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default getListBlockedDates;