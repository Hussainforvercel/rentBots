import {
    GraphQLList as List
} from 'graphql';
import { PaymentMethods } from '../../models';
import PaymentMethodsType from '../../types/PaymentMethodsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getAllPaymentMethods = {
    type: new List(PaymentMethodsType),

    async resolve({ request }) {
        try {
            if (request?.user && request?.user?.admin) {
                return await PaymentMethods.findAll();
            } else {
                return {
                    status: "notLoggedIn",
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
}

export default getAllPaymentMethods;