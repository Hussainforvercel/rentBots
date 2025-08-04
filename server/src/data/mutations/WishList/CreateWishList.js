import {
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';
// import { WishListGroup, UserLogin, WishList, Listing } from '../../models';
import WishListGroup from '../../models/WishListGroup.js'
import UserLogin from '../../models/UserLogin.js'
import WishListType from '../../types/WishListType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const CreateWishList = {
    type: WishListType,
    args: {
        listId: { type: IntType },
        wishListGroupId: { type: IntType },
        eventKey: { type: BooleanType }
    },
    async resolve({ request, response }, { listId, wishListGroupId, eventKey }) {

        let where, status = 200, errorMessage, convertedName, currentToken, resultsData, eventkeyValue;
        listId = listId ? listId : '';
        wishListGroupId = wishListGroupId ? wishListGroupId : '';
        resultsData = {
            listId,
            eventkeyValue: eventKey,
            wishListGroupId
        }
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });
                if (checkLogin) {
                    const userId = request.user.id;
                    let updateWishList;
                    const isListOwner = await Listing.count({
                        where: {
                            userId,
                            id: listId
                        }
                    });
                    const isListExist = await Listing.count({
                        where: {
                            id: listId
                        }
                    });
                    if (isListExist) {
                        if (isListOwner) {
                            return {
                                status: 400,
                                errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                            };
                        } else {
                            let checkWishListGroupId = await WishListGroup.findOne({
                                where: {
                                    userId,
                                    id: wishListGroupId
                                }
                            });
                            if (checkWishListGroupId) {
                                // Wish Lists
                                if (eventKey === true) {
                                    let checkWishListIdExist = await WishList.findOne({
                                        where: {
                                            userId,
                                            wishListGroupId,
                                            listId
                                        }
                                    });
                                    if (!checkWishListIdExist) {
                                        updateWishList = await WishList.create({
                                            listId,
                                            userId,
                                            wishListGroupId,
                                            isListActive: true
                                        });
                                    } else {
                                        return {
                                            status: 200,
                                            results: resultsData
                                        }
                                    }
                                } else {
                                    updateWishList = await WishList.destroy({
                                        where: {
                                            listId,
                                            userId,
                                            wishListGroupId
                                        }
                                    });
                                }
                                return {
                                    status: 200,
                                    results: resultsData
                                }
                            } else {
                                return {
                                    status: 400,
                                    errorMessage: await showErrorMessage({ errorCode: 'invalidGroupId' })
                                }
                            }
                        }
                    } else {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'listNotExist' }),
                            status: 400
                        };
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' }),
                        status: 500
                    };
                }

            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' }),
                    status: 500
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default CreateWishList;