import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { Currencies } from '../../models';
import CurrenciesType from '../../types/CurrenciesType';

const managePaymentCurrency = {
    type: CurrenciesType,
    args: {
        currencyId: { type: new NonNull(IntType) },
        type: { type: new NonNull(StringType) }
    },
    async resolve({ request }, { mode, currencyId, type }) {

        if (request?.user?.admin) {

            try {
                let isPayment = type === 'add' ? true : false;

                const update = await Currencies.update({
                    isPayment
                }, {
                    where: {
                        id: currencyId
                    }
                });

                return {
                    status: update ? 'success' : 'updateFailed'
                }

            } catch (error) {
                return {
                    status: error
                }
            }
        } else {
            return {
                status: 'notLoggedIn',
            };
        }
    }
};

export default managePaymentCurrency;

/**
mutation managePaymentCurrency(
  $currencyId: Int!, 
  $type: String!
){
    managePaymentCurrency(
      currencyId: $currencyId, 
      type: $type
    ) {
        status
    }
}

**/