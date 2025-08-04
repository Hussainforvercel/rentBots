import sequelize from '../../sequelize.js';
import PopularLocation  from '../../models/siteAdmin/PopularLocation.js';
import PopularLocationCommonType from '../../types/siteadmin/PopularLocationCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getPopularLocations = {
    type: PopularLocationCommonType,
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

            const results = await PopularLocation.findAll({
                attributes: ['id', 'location', 'locationAddress', 'image'],
                where: {
                    isEnable: true
                },
                order: [[sequelize.literal('RAND()')]],
            });

            return {
                results,
                status: results ? 200 : 400,
                errorMessage: results ? null : await showErrorMessage({ errorCode: 'fetchRecords' })
            }

        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getPopularLocations;