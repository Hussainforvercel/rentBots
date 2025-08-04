import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
} from 'graphql';
import { AdminModel } from '../../models';
import MarketingBannerType from '../../types/siteadmin/MarketingBannerType';

const updateMarketingBanner = {
    type: MarketingBannerType,
    args: {
        id: { type: new NonNull(IntType) },
        title: { type: new NonNull(StringType) },
        image: { type: new NonNull(StringType) },
        link: { type: new NonNull(StringType) },
        buttonText: { type: new NonNull(StringType) },
        isEnable: { type: BooleanType },
    },
    async resolve({ request }, { id, title, image, link, buttonText, isEnable }) {
        try {
            if (request.user && request.user.admin) {
                const banner = await AdminModel.findOne({
                    where: { id },
                    tableName: 'MarketingBanner'
                });

                if (banner) {
                    await banner.update({
                        title,
                        image,
                        link,
                        buttonText,
                        ...(typeof isEnable !== 'undefined' ? { isEnable } : {})
                    });

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
                        errorMessage: 'Banner not found'
                    };
                }
            } else {
                return {
                    status: 'error',
                    errorMessage: 'Not authorized'
                };
            }
        } catch (error) {
            console.error('Error updating marketing banner:', error);
            return {
                status: 'error',
                errorMessage: error.message
            };
        }
    }
};

export default updateMarketingBanner; 