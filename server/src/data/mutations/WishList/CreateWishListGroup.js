import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
// import { WishListGroup, UserLogin } from '../../models';
import WishListGroup from '../../models/WishListGroup.js'
import UserLogin from '../../models/UserLogin.js'
import GetWishListType from '../../types/GetWishListType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const CreateWishListGroup = {
    type: GetWishListType,
    args: {
        name: { type: StringType },
        isPublic: { type: StringType },
        id: { type: IntType }
    },
    async resolve({ request, response }, { name, isPublic, id }) {

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let where, currentToken;
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
                    let createWishListGroup;
                    if (id) {
                        createWishListGroup = await WishListGroup.update({
                            name,
                            isPublic
                        }, {
                            where: {
                                id
                            }
                        });
                    } else {
                        createWishListGroup = await WishListGroup.create({
                            userId: request.user.id,
                            name,
                            isPublic
                        });
                    }
                    let results = {};
                    if (createWishListGroup) {
                        results = {
                            id: id ? id : createWishListGroup.id,
                            name,
                            isPublic
                        };
                        return {
                            status: 200,
                            results
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'unableToCreate' })
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

export default CreateWishListGroup;
