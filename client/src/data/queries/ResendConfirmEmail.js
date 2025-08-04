import { EmailToken } from '../../data/models';
import EmailTokenType from '../types/EmailTokenType';

const ResendConfirmEmail = {

    type: EmailTokenType,

    async resolve({ request, response }) {

        if (request.user && request.user.admin != true) {

            const userId = request.user.id;
            const email = request.user.email;
            let token = Date.now();

            const checkEmailToken = await EmailToken.find({
                where: {
                    userId,
                    email,
                },
            });

            if (checkEmailToken) {
                return checkEmailToken;
            } else {
                const createEmailToken = await EmailToken.create({
                    userId,
                    email,
                    token
                });
                if (createEmailToken) {
                    return {
                        userId,
                        email,
                        token
                    }
                } else {
                    return {
                        status: 'error'
                    }
                }
            }

        } else {
            return {
                status: 'error'
            }
        }

    },
};

export default ResendConfirmEmail;