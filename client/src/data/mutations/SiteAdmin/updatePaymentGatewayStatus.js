import {
    GraphQLBoolean as BooleanType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { PaymentMethods, Payout } from '../../models';
import PaymentMethodsType from '../../types/PaymentMethodsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const updatePaymentGatewayStatus = {
    type: PaymentMethodsType,
    args: {
        id: { type: new NonNull(IntType) },
        isEnable: { type: new NonNull(BooleanType) }
    },
    async resolve({ request }, { id, isEnable }) {

        try {
            if (request?.user?.admin) {
                let isAllow = 0, getStatus;
                getStatus = await PaymentMethods.findAll({
                    where: {
                        isEnable: 1
                    },
                    raw: true
                });

                if (getStatus?.length == 1 && isEnable == false) {
                    isAllow = 1;
                }
                if (isAllow === 0) {
                    let updateStatus = await PaymentMethods.update({
                        isEnable
                    }, {
                        where: {
                            id
                        }
                    });
                    if (!isEnable) {
                        let updatePayouts = await Payout.update({
                            default: false
                        }, {
                            where: {
                                methodId: id
                            }
                        });
                    }

                    return {
                        status: updateStatus ? '200' : '400'
                    }
                } else {
                    return {
                        status: 'Atleast one option must be active'
                    }
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
}

export default updatePaymentGatewayStatus;