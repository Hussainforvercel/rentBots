import {
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';
import  Listing  from '../../models/Listing.js';
import ListingType from '../../types/ListingType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const viewListing = {
    type: ListingType,
    args: {
        listId: { type: IntType },
        preview: { type: BooleanType },
    },
    async resolve({ request }, { listId, preview }) {

        try {
            let where;

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            if (request.user && preview) {
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
                    isPublished: true,
                };
            }
            const getResults = await Listing.findOne({
                where
            });

            return {
                results: getResults,
                status: getResults ? 200 : 400,
                errorMessage: getResults ? null : await showErrorMessage({ errorCode: 'invalidError' }),
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
}

export default viewListing;
