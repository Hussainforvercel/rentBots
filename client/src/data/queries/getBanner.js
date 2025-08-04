import { Banner } from '../../data/models';
import BannerType from '../types/BannerType';

const getBanner = {

    type: BannerType,

    async resolve({ request }) {
        return await Banner.findOne();
    }
};

export default getBanner;