import {
    GraphQLInt as IntType,
} from 'graphql';
// import { WishListGroup, UserLogin } from '../../models';
import WishListGroup from '../../models/WishListGroup.js'
import UserLogin from '../../models/UserLogin.js'
import WishListGroupType from '../../types/WishListGroupType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const UpdateWishListGroup = {
    type: WishListGroupType,
    args: {
        isPublic: { type: IntType },
        id: { type: IntType }
    },
    async resolve({ request, response }, { isPublic, id }) {

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
                if (checkLogin) {
                    const userId = request.user.id;
                    const updateWishListGroup = await WishListGroup.update({
                        isPublic
                    }, {
                        where: {
                            id,
                            userId
                        }
                    });
                    if (updateWishListGroup && updateWishListGroup != 0) {
                        return {
                            status: 200
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'unableToUpdateId' })
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

export default UpdateWishListGroup;
