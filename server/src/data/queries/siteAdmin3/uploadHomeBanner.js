import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { Banner } from '../../../data/models';
import BannerType from '../../types/BannerType';

const uploadHomeBanner = {

  type: BannerType,

  args: {
    image: { type: StringType },
    id: { type: IntType }
  },

  async resolve({ request }, { image, id }) {

    if (request?.user && request?.user?.admin == true) {
      let isImageUploaded = false;

      // Site Name
      const updateImage = await Banner.update({
        image
      },
        {
          where: {
            id
          }
        })
        .then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isImageUploaded = true;
          } else {
            isImageUploaded = false;
          }
        });

      return { status: isImageUploaded ? 'success' : 'failed' }


    } else {
      return {
        status: 'notLoggedIn'
      }
    }

  },
};

export default uploadHomeBanner;
