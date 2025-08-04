// import { CurrencyRates, Currencies } from '../../../data/models';
import CurrencyRates from '../../models/CurrencyRates.js';
import Currencies from '../../models/Currencies.js';
import CurrencyType from '../../types/CurrencyType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const Currency = {
    type: CurrencyType,
    async resolve({ request, response }) {

        try {
            let ratesData = {}, rates;
            const data = await CurrencyRates.findAll();
            const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
            const allCurrencies = await Currencies.findAll();

            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            if (data) {
                data.map(async (item) => {
                    await Promise.all(allCurrencies.map((inner, innerKey) => {
                        if (item.dataValues.currencyCode == inner.dataValues.symbol) {
                            ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
                        }
                    }))
                })
            }
            rates = JSON.stringify(ratesData);

            if (rates && base) {
                return {
                    result: {
                        base: base.symbol,
                        rates,
                    },
                    status: 200
                };
            } else {
                return {
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    },
};

export default Currency;