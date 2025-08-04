import {
    GraphQLInt as IntType,
} from 'graphql';
import WishListGroup from '../../models/WishListGroup.js'
import UserLogin from '../../models/UserLogin.js'
import WishList from '../../models/WishList.js'
import WishListGroupType from '../../types/WishListGroupType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const DeleteWishListGroup = {
    type: WishListGroupType,
    args: {
        id: { type: IntType }
    },
    async resolve({ request, response }, { id }) {

        let where, status = 200, errorMessage, convertedName, currentToken;
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

                const userId = request.user.id;
                let isWishGroupDeleted = false, isWishListsDeleted = false;
                const isListAvailable = await WishListGroup.count({
                    where: {
                        userId,
                        id
                    }
                });

                if (isListAvailable && isListAvailable > 0) {
                    // Delete Wish List Group
                    await WishListGroup.destroy({
                        where: {
                            userId,
                            id
                        }
                    })
                        .then(function (instance) {
                            // Check if any rows are affected
                            if (instance > 0) {
                                isWishGroupDeleted = true;
                            }
                        });

                    // Delete Wish Lists
                    await WishList.destroy({
                        where: {
                            userId,
                            wishListGroupId: id
                        }
                    })
                        .then(function (instance) {
                            isWishListsDeleted = true;
                        });

                    if (isWishGroupDeleted === true && isWishListsDeleted === true && checkLogin) {
                        return {
                            status: 200
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'unableToDelete' })
                        }
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

export default DeleteWishListGroup;
