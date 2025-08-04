import { WhyHost } from '../../models';
import WhyHostCommonType from '../../types/WhyHostCommonType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getWhyHostData = {
    type: WhyHostCommonType,

    async resolve({ request }) {
        try {
            let dataList = [];
            if (!request?.user || !request?.user?.admin) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'errorLogin' })
                };
            }

            dataList = await WhyHost.findAll({
                attributes: [
                    'id',
                    'title',
                    'imageName',
                    'buttonLabel'
                ],
            });

            return {
                dataList,
                status: 200
            };

        } catch (error) {
            return {
                status: 500
            };
        }
    }
};

export default getWhyHostData;