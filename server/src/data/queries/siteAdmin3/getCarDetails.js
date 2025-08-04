import { ListSettingsTypes } from '../../../data/models';
import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getCarDetails = {

    type: ListSettingsType,

    async resolve({ request }) {
        try {
            if (request.user && request.user.admin == true) {
                const getResults = await ListSettingsTypes.find({
                    where: {
                        id: 20
                    }
                });

                if (!getResults) {
                    return {
                        status: "failed"
                    };
                }

                return getResults;

            } else {
                return {
                    status: "failed"
                }
            }
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default getCarDetails;
