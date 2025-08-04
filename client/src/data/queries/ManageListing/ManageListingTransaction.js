import {
    GraphQLList as List,
    GraphQLBoolean as BooleanType
} from 'graphql';
import { Listing } from '../../../data/models';
import ShowListingType from '../../types/ShowListingType';

const ManageListingTransaction = {

    type: new List(ShowListingType),

    args: {
        isReady: { type: BooleanType }
    },

    async resolve({ request }) {
        try {
            if (request?.user && request?.user?.admin != true) {
                const listingData = await Listing.findAll({
                    where: {
                        userId: request?.user?.id,
                        isReady: true
                    },
                    order: 'createdAt DESC'
                });

                return listingData;

            } else {
                return {
                    status: "notLoggedIn"
                };
            }
        } catch (error) {
            return {
                status: '400'
            };
        }
    },
};

export default ManageListingTransaction;
