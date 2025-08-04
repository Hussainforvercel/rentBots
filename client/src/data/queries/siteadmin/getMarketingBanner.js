import {
    GraphQLList as List,
    GraphQLInt as IntType,
} from 'graphql';
import { AdminModel } from '../../models';
import MarketingBannerType from '../../types/siteadmin/MarketingBannerType';

const getMarketingBanner = {
    type: MarketingBannerType,
    args: {
        id: { type: IntType }
    },
    async resolve({ request }, { id }) {
        try {
            let where = {};
            if (id) {
                where.id = id;
            }

            const banner = await AdminModel.findOne({
                where,
                tableName: 'MarketingBanner',
                order: [['createdAt', 'DESC']]
            });

            if (banner) {
                return {
                    status: 'success',
                    id: banner.id,
                    title: banner.title,
                    image: banner.image,
                    link: banner.link,
                    buttonText: banner.buttonText,
                    isEnable: banner.isEnable
                };
            } else {
                return {
                    status: 'error',
                    errorMessage: 'No banner found'
                };
            }
        } catch (error) {
            console.error('Error fetching marketing banner:', error);
            return {
                status: 'error',
                errorMessage: error.message
            };
        }
    }
};

export default getMarketingBanner; 