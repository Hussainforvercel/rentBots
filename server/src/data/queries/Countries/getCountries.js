import  Country  from '../../../data/models/Country.js';
import CountryData from '../../types/getCountryType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getCountries = {
    type: CountryData,
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

            const getCountryList = await Country.findAll();

            return {
                status: getCountryList ? 200 : 400,
                errorMessage: getCountryList ? null : await showErrorMessage({ errorCode: 'invalidError' }),
                results: getCountryList ? getCountryList : []
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getCountries;