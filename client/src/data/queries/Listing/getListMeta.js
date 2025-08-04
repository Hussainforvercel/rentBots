import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Listing } from '../../models';
import ShowListingType from '../../types/ShowListingType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getListMeta = {
    type: ShowListingType,

    args: {
        listId: { type: new NonNull(IntType) },
    },

    async resolve({ request }, { listId }) {
        try {
            return await Listing.findOne({
                where: {
                    id: listId
                }
            });
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getListMeta;