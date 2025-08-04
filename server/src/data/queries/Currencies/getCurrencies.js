import Currencies  from '../../../data/models/Currencies.js';
import AllCurrenciesType from '../../types/AllCurrenciesType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getCurrencies = {
    type: AllCurrenciesType,
    async resolve({ request }) {

        try {
            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            const getAllCurrencies = await Currencies.findAll({
                where: {
                    isEnable: true
                }
            });

            return {
                status: getAllCurrencies && getAllCurrencies.length > 0 ? 200 : 400,
                errorMessage: getAllCurrencies && getAllCurrencies.length > 0 ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                results: getAllCurrencies && getAllCurrencies.length > 0 ? getAllCurrencies : []
            }

        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 500
            };
        }
    },
};

export default getCurrencies;
