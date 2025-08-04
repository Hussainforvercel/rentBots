import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// import { Listing, WishList, Reservation } from '../../../data/models';
import Listing from '../../models/Listing.js';
import WishList from '../../models/WishList.js';
import Reservation from '../../models/Reservation.js';
import ListType from '../../types/ListType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const managePublish = {
    type: ListType,
    args: {
        listId: { type: new NonNull(IntType) },
        action: { type: new NonNull(StringType) },
    },
    async resolve({ request }, { listId, action }) {

        try {
            // Check whether user is logged in
            if (request.user || request.user.admin) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let where = { id: listId, isReady: true };
                if (!request.user.admin) {
                    where = {
                        id: listId,
                        isReady: true,
                        userId: request.user.id
                    }
                };

                var published;
                // Publish
                if (action === 'publish') {
                    const publish = await Listing.update({
                        isPublished: true
                    }, {
                        where
                    }).spread(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            published = true;
                        }
                    });

                    let updateListingStatus = await WishList.update({
                        isListActive: true
                    }, {
                        where: {
                            listId
                        }
                    });
                }

                // UnPublish
                if (action === 'unPublish') {
                    const getReservationCount = await Reservation.count({
                        where: {
                            listId,
                            paymentState: 'completed',
                            $or: [
                                {

                                    reservationState: 'approved'
                                },
                                {
                                    reservationState: 'pending'
                                }
                            ],
                        },
                    });

                    if (getReservationCount > 0) {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'unpublishListing' })
                        }
                    } else {
                        const unPublish = await Listing.update({
                            isPublished: false
                        }, {
                            where
                        }).spread(function (instance) {
                            // Check if any rows are affected
                            if (instance > 0) {
                                published = true;
                            }
                        });

                        let updateListingStatus = await WishList.update({
                            isListActive: false
                        }, {
                            where: {
                                listId
                            }
                        });
                    }
                }

                return {
                    status: published ? 200 : 400,
                    errorMessage: published ? null : await showErrorMessage({ errorCode: 'invalidError' })
                };
            }

            else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'checkLoggedUser' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default managePublish;
