import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import Listing  from '../../models/Listing.js';
import EditListingResponseType from '../../types/EditListingType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const updateListingStep2 = {
    type: EditListingResponseType,
    args: {
        id: { type: IntType },
        title: { type: StringType },
        description: { type: StringType },
        coverPhoto: { type: IntType },
    },
    async resolve({ request, response }, {
        id,
        title,
        description,
        coverPhoto
    }) {

        try {
            let isListUpdated = false;

            if (request.user || request.user.admin) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let where = { id };
                if (!request.user.admin) {
                    where = {
                        id,
                        userId: request.user.id
                    }
                };

                const doUpdateListing = await Listing.update({
                    title,
                    description,
                    coverPhoto,
                    lastUpdatedAt: new Date()
                },
                    {
                        where
                    })
                    .then(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            isListUpdated = true;
                        }
                    });

                if (isListUpdated) {
                    const listData = await Listing.findOne({
                        where: {
                            id: id
                        },
                        raw: true
                    });

                    return {
                        status: 200,
                        results: listData
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage:await  showErrorMessage({ errorCode: 'updateFailed' })
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage:await  showErrorMessage({ errorCode: 'checkLoggedUser' })
                }
            }
        } catch (error) {
            return {
                errorMessage:await  showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default updateListingStep2;
