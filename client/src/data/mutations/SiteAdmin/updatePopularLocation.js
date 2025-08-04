import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import { PopularLocation } from '../../../data/models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const updatePopularLocation = {
    type: PopularLocationType,
    args: {
        id: { type: IntType },
        location: { type: StringType },
        locationAddress: { type: StringType },
        image: { type: StringType }
    },
    async resolve({ request }, {
        id,
        location,
        locationAddress,
        image
    }) {

        try {
            if (request.user && request.user.admin == true) {
                await PopularLocation.update({
                    location: location,
                    locationAddress: locationAddress,
                    image: image
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

export default updatePopularLocation;
