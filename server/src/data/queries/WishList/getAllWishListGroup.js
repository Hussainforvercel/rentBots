import {
    GraphQLInt as IntType,
} from 'graphql';
import WishListGroup from '../../models/WishListGroup.js'
import UserLogin from '../../models/UserLogin.js'
import User from '../../models/User.js'
import AllWishListGroupType from '../../types/AllWishListGroupType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getAllWishListGroup = {
    type: AllWishListGroupType,
    args: {
        currentPage: { type: IntType },
    },
    async resolve({ request }, { currentPage }) {
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
                const userData = await User.findOne({
                    attributes: [
                        'userBanStatus'
                    ],
                    where: { id: request.user.id },
                    raw: true
                })

                if (userData) {
                    if (userData.userBanStatus == 1) {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'contactSupport' }),
                            status: 500
                        }
                    }
                }

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });
                let limit = 10, offset = 0;
                // Offset from Current Page
                if (currentPage) {
                    offset = (currentPage - 1) * limit;
                } else {
                    offset = 0;
                    limit = 1000;
                }
                if (checkLogin) {
                    const count = await WishListGroup.count({
                        where: {
                            userId: request.user.id
                        }
                    });

                    const wishListGroupData = await WishListGroup.findAll({
                        where: {
                            userId: request.user.id
                        },
                        limit,
                        offset
                    });
                    if (wishListGroupData && count) {

                        if (wishListGroupData && wishListGroupData.length > 0) {
                            return {
                                status: 200,
                                results: wishListGroupData,
                                count,
                            }
                        } else {
                            return {
                                status: 400,
                                errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
                                results: wishListGroupData,
                                count,
                            }
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
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
    }
}

export default getAllWishListGroup;