import { ImageBanner } from '../models';
import ImageBannerType from '../types/ImageBannerType';

const getImageBanner = {

  type: ImageBannerType,

  async resolve({ request }) {
    return await ImageBanner.findOne();
  }
};

export default getImageBanner;
