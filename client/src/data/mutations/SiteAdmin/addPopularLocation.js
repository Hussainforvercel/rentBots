import {
    GraphQLString as StringType
} from 'graphql';
import { PopularLocation } from '../../../data/models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const addPopularLocation = {
    type: PopularLocationType,
    args: {
        location: { type: StringType },
        locationAddress: { type: StringType },
        image: { type: StringType }
    },
    async resolve({ request }, {
        location,
        locationAddress,
        image
    }) {
        try {
            if (request.user && request.user.admin == true) {
                const Update = await PopularLocation.create({
                    location: location,
                    locationAddress: locationAddress,
                    image: image
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
export default addPopularLocation;
