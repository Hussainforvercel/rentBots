import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import UserLogin  from '../../models/UserLogin.js';
import UserType from '../../types/UserType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userLogout = {
    type: UserType,
    args: {
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, {
        deviceType,
        deviceId
    }) {
        let where;

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const userId = request.user.id;
                where = {
                    userId,
                    deviceType,
                    deviceId
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin) {
                    await UserLogin.destroy({
                        where
                    });

                    return {
                        status: 200
                    };
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'loggedInError' }),
                        status: 500
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'loggedOutError' }),
                    status: 400
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};

export default userLogout;