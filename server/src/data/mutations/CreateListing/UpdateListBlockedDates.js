import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// import { Listing, ListBlockedDates } from '../../../data/models';
import Listing from '../../models/Listing.js';
import ListBlockedDates from '../../models/ListBlockedDates.js'
import ListBlockedDatesResponseType from '../../types/ListBlockedDatesType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const updateListBlockedDates = {
    type: ListBlockedDatesResponseType,
    args: {
        listId: { type: new NonNull(IntType) },
        blockedDates: { type: new List(StringType) },
    },
    async resolve({ request, response }, {
        listId,
        blockedDates
    }) {

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

                let where = { listId };
                if (!request.user.admin) {
                    where = {
                        listId,
                        userId: request.user.id
                    }
                };

                // Confirm whether the Listing Id is available
                const isListingAvailable = await Listing.findById(listId);
                let isValue = false;
                if (isListingAvailable) {
                    if (blockedDates) {
                        const blockedDatesData = await ListBlockedDates.findAll({
                            where: {
                                listId,
                                reservationId: {
                                    $eq: null
                                }
                            }
                        });

                        // Remove all the blocked dates except reservation dates
                        const removeBlockedDates = await ListBlockedDates.destroy({
                            where: {
                                listId,
                                reservationId: {
                                    $eq: null
                                }
                            }
                        });

                        if (blockedDatesData.length > 0) {
                            let blockedDatesItems = [];
                            blockedDatesData.map((item, key) => {
                                blockedDatesItems[key] = new Date(item.blockedDates);
                            });

                            blockedDates.map(async (item, key) => {
                                let day = new Date(item);
                                let blockedItem = blockedDatesItems.map(Number).indexOf(+day);
                                if (blockedItem > -1) {
                                    let createRecord = await ListBlockedDates.findOrCreate({
                                        where: {
                                            listId,
                                            blockedDates: item
                                        },
                                        defaults: {
                                            //properties you want on create
                                            listId,
                                            blockedDates: new Date(item)
                                        }
                                    });
                                } else {
                                    let createRecord = await ListBlockedDates.findOrCreate({
                                        where: {
                                            listId,
                                            blockedDates: item
                                        },
                                        defaults: {
                                            //properties you want on create
                                            listId,
                                            blockedDates: new Date(item),
                                        }
                                    });
                                }
                            });
                            isValue = true;
                        } else {
                            blockedDates.map(async (item, key) => {
                                let updateBlockedDates = await ListBlockedDates.findOrCreate({
                                    where: {
                                        listId,
                                        blockedDates: item
                                    },
                                    defaults: {
                                        //properties you want on create
                                        listId,
                                        blockedDates: new Date(item)
                                    }
                                });
                            });
                            isValue = true;
                        }
                        if (isValue) {
                            const listBlockedData = await ListBlockedDates.findAll({
                                where: {
                                    listId
                                },
                                raw: true
                            });
                            return {
                                results: listBlockedData,
                                status: 200
                            }
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'selectDates' })
                        }
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'sendCorrectListId' })
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'checkLoggedUser' })
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },

};

export default updateListBlockedDates;