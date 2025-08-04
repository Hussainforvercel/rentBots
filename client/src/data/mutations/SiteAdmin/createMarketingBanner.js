import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { AdminModel } from '../../models';
import MarketingBannerType from '../../types/siteadmin/MarketingBannerType';

const createMarketingBanner = {
    type: MarketingBannerType,
    args: {
        title: { type: new NonNull(StringType) },
        image: { type: new NonNull(StringType) },
        link: { type: new NonNull(StringType) },
        buttonText: { type: new NonNull(StringType) }
    },
    async resolve({ request }, { title, image, link, buttonText }) {
        try {
            if (request.user && request.user.admin) {
                // Check if a banner already exists
                const existingBanner = await AdminModel.findOne({
                    tableName: 'MarketingBanner',
                    order: [['createdAt', 'DESC']]
                });

                let marketingBanner;
                if (existingBanner) {
                    // Update existing banner
                    marketingBanner = await existingBanner.update({
                        title,
                        image,
                        link,
                        buttonText
                    });
                } else {
                    // Create new banner
                    marketingBanner = await AdminModel.create({
                        title,
                        image,
                        link,
                        buttonText
                    }, {
                        tableName: 'MarketingBanner'
                    });
                }

                if (marketingBanner) {
                    return {
                        status: 'success',
                        id: marketingBanner.id,
                        title: marketingBanner.title,
                        image: marketingBanner.image,
                        link: marketingBanner.link,
                        buttonText: marketingBanner.buttonText
                    };
                } else {
                    return {
                        status: 'error',
                        errorMessage: 'Failed to create/update marketing banner'
                    };
                }
            } else {
                return {
                    status: 'error',
                    errorMessage: 'Not authorized'
                };
            }
        } catch (error) {
            console.error('Error creating/updating marketing banner:', error);
            return {
                status: 'error',
                errorMessage: error.message
            };
        }
    }
};

export default createMarketingBanner; 