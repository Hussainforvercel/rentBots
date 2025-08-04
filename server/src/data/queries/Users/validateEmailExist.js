import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import User from '../../models/User.js';
import AdminUser from '../../models/siteAdmin/AdminUser.js'
import CommonType from '../../types/CommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const validateEmailExist = {
    type: CommonType,
    args: {
        email: {
            type: new NonNull(StringType)
        }
    },
    async resolve({ request, response }, {
        email
    }) {

        if (request && request.user) {
            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }
        }

        const checkUser = await User.findOne({
            attributes: ['id', 'email'],
            where: {
                email,
                userDeletedAt: {
                    $eq: null
                },
            },
            order: [
                [`createdAt`, `DESC`],
            ],
        });

        try {
            if (checkUser) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userExists' }),
                    status: 400
                };
            } else {
                const getAdminUserId = await AdminUser.findOne({
                    where: {
                        email
                    },
                });

                return {
                    status: getAdminUserId ? 400 : 200,
                    errorMessage: getAdminUserId ? await showErrorMessage({ errorCode: 'userExists' }) : null
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
                status: 400
            }
        }
    }

};

export default validateEmailExist;