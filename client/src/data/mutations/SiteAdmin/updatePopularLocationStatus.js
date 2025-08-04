import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import { PopularLocation } from '../../../data/models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const updatePopularLocationStatus = {
    type: PopularLocationType,
    args: {
        id: { type: IntType },
        isEnable: { type: StringType },
    },
    async resolve({ request }, {
        id,
        isEnable,
    }) {

        try {
            if (request.user && request.user.admin == true) {
                const Update = await PopularLocation.update({
                    isEnable: isEnable == 'true' ? 0 : 1,
                }, {
                    where: {
                        id: id
                    }
                });
                return {
                    status: 'success'
                }
            } else {
                return {
                    status: 'failed'
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default updatePopularLocationStatus;
