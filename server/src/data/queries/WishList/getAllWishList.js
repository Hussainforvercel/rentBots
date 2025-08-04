// import { WishListGroup, UserLogin } from '../../models';
import WishListGroup from '../../models/WishListGroup.js';
import UserLogin from '../../models/UserLogin.js';
import AllWishListGroupType from '../../types/AllWishListGroupType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getAllWishList = {
    type: AllWishListGroupType,
    async resolve({ request, response }) {

        let where, currentToken, errorMessage, status = 200;
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
                    const count = await WishListGroup.count({
                        where: {
                            userId: request.user.id
                        }
                    });

                    const wishListGroupData = await WishListGroup.findAll({
                        where: {
                            userId: request.user.id
                        },
                    });
                    if (wishListGroupData && count) {
                        return {
                            status: 200,
                            results: wishListGroupData,
                            count,
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

export default getAllWishList;