import {
    GraphQLList as List,
} from 'graphql';
import sequelize from '../sequelize';
import { ListViews, Listing } from '../../data/models';
import ShowListingType from '../types/ShowListingType';

const GetMostViewedListing = {

    type: new List(ShowListingType),

    async resolve({ request }) {

        return await Listing.findAll({
            where: {
                isPublished: true
            },
            include: [
                {
                    model: ListViews,
                    attributes: [],
                    as: 'listViews',
                    required: true,
                    duplicating: false
                }
            ],
            order: [
                [sequelize.fn('count', sequelize.col('listViews.listId')), 'DESC'],
            ],
            group: ['listViews.listId'],
            limit: 10,
            offset: 0
        });

    }
};

export default GetMostViewedListing;