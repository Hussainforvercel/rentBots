import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { PopularLocation } from '../../models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const deletePopularLocation = {
    type: PopularLocationType,
    args: {
        id: { type: new NonNull(IntType) }
    },
    async resolve({ request, response }, {
        id
    }) {
        try {
            if (request?.user?.admin) {
                const PopularLocationDetails = await PopularLocation.findById(id);
                if (!PopularLocationDetails) {
                    return {
                        status: '404'
                    }
                }

                const deleteLocation = await PopularLocation.destroy({
                    where: {
                        id: id
                    }
                });

                return {
                    status: deleteLocation ? '200' : '400'
                }
            } else {
                return {
                    status: 'notLoggedIn'
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

export default deletePopularLocation;