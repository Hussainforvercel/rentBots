import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
// import { UserLogin, UserProfile, Reservation } from '../../models';
import UserLogin from '../../models/UserLogin.js'
import UserProfile from '../../models/UserProfile.js'
import Reservation from '../../models/Reservation.js'
import UserCommonType from '../../types/UserCommonType.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { getConfigurationData } from '../../../libs/getConfigurationData.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const contactSupport = {
    type: UserCommonType,
    args: {
        message: { type: StringType },
        listId: { type: IntType },
        reservationId: { type: IntType },
        userType: { type: StringType },
    },
    async resolve({ request, response }, {
        message,
        listId,
        reservationId,
        userType
    }) {

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                // Check if the user is already exists
                let currentToken, where;
                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                const checkUser = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                const getUserData = await UserProfile.findOne({
                    attributes: ['firstName'],
                    where: {
                        userId: request.user.id,
                    },
                    raw: true
                });

                let confirmationCode;
                if (checkUser && getUserData) {
                    const getReservationData = await Reservation.findOne({
                        where: {
                            id: reservationId,
                        },
                        raw: true
                    });
                    if (getReservationData) {
                        confirmationCode = getReservationData.confirmationCode
                    }
                    let content = {
                        ContactMessage: message,
                        email: request.user.email,
                        name: getUserData.firstName,
                        confirmationCode,
                        userType,
                        listId,
                    };
                    const configData = await getConfigurationData({ name: ['email'] });
                    const { status, errorMessage } = await sendEmail(configData.email, 'contactSupport', content);

                    return {
                        result: {
                            email: request.user.email,
                            userId: request.user.id,
                            firstName: getUserData.firstName
                        },
                        status: 200,
                    };
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
};

export default contactSupport;