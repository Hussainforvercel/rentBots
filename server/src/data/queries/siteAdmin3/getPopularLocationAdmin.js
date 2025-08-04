import {
    GraphQLList as List
} from 'graphql';
import { PopularLocation } from '../../models';
import sequelize from '../../sequelize';
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const getPopularLocationAdmin = {

    type: new List(PopularLocationType),

    async resolve({ request }) {
        try {
            return await PopularLocation.findAll({
                where: {
                    isEnable: true,
                },

                order: [[sequelize.literal('RAND()')]],
            });
        } catch (error) {
            return {
                status: '500'
            };
        }
    }
};

export default getPopularLocationAdmin;