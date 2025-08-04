import {
    GraphQLList as List,
} from 'graphql';
import { PaymentMethods } from '../../models';
import PaymentMethodsType from '../../types/PaymentMethodsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getPaymentMethods = {

    type: new List(PaymentMethodsType),

    async resolve({ request }, { listId }) {
        try {
            if (!request?.user || request?.user?.admin) {
                return {
                    status: "notLoggedIn",
                };
            }

            return await PaymentMethods.findAll({
                where: {
                    isEnable: 1
                }
            });

        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getPaymentMethods;