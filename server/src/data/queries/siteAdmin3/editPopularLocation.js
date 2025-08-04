import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { PopularLocation } from '../../models';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const editPopularLocation = {

    type: PopularLocationType,

    args: {
        id: { type: new NonNull(IntType) },
    },

    async resolve({ request }, { id }) {

        try {
            const LocationData = await PopularLocation.find({
                attributes: [
                    'id',
                    'location',
                    'locationAddress',
                    'image',
                    'isEnable'
                ],
                where: {
                    id: id
                }
            });

            return LocationData;
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default editPopularLocation;