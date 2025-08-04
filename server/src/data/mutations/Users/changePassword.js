import { GraphQLString as StringType } from 'graphql';
import bcrypt from 'bcrypt';
import  User  from '../../models/User.js';
import UserType from '../../types/UserType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const changePassword = {
    type: UserType,
    args: {
        oldPassword: { type: StringType },
        newPassword: { type: StringType },
        confirmPassword: { type: StringType }
    },
    async resolve({ request, response }, {
        oldPassword,
        newPassword,
        confirmPassword
    }) {

        try {
            if (!request.user) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' }),
                    status: 500
                };
            }

            //Collect from Logged-in User
            const id = request.user && request.user.id;
            const email = request.user && request.user.email;

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            // Check old password is correct
            const userLogin = await User.findOne({
                attributes: ['password'],
                where: {
                    email,
                    userDeletedAt: {
                        $eq: null
                    }
                },
            });

            // For Email Registered Users
            if (!bcrypt.compareSync(oldPassword, userLogin.password)) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'invalidCurrentPassword' }),
                    status: 400,
                }
            }

            // Check new password and confirm password
            if (newPassword != confirmPassword) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'invalidConfirmPassword' }),
                    status: 400,
                }
            }

            // Update new password
            await User.update(
                {
                    password: User.prototype.generateHash(newPassword)
                },
                {
                    where: {
                        id
                    }
                }
            );

            return { status: 200 };
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400,
            }
        }
    }
};

export default changePassword;

