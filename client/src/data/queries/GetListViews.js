import {
    GraphQLInt as IntType
} from 'graphql';
import { ListViews } from '../../data/models';
import ListViewsType from '../types/ListViewsType';

const GetListViews = {

    type: ListViewsType,

    args: {
        listId: { type: IntType }
    },

    async resolve({ request }, { listId }) {

        const count = await ListViews.count({
            where: {
                listId,
                createdAt: {
                    $lte: new Date(),
                    $gt: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        return {
            count
        };
    }
};

export default GetListViews;