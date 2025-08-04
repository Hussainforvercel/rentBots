import {
  GraphQLString as StringType,
} from 'graphql';
import { SiteSettings } from '../../../models';
import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const uploadHomeLogo = {
  type: SiteSettingsType,
  args: {
    fileName: { type: StringType }
  },
  async resolve({ request }, { fileName }) {

    try {
      if (request.user && request.user.admin == true) {
        let removeLogo = await SiteSettings.destroy({
          where: {
            name: 'homePageLogo'
          }
        });

        let createLogoRecord = await SiteSettings.create({
          title: 'Home Page Logo',
          name: 'homePageLogo',
          value: fileName,
          type: 'site_settings'
        });

        return {
          status: createLogoRecord ? '200' : '400'
        }
      } else {
        return {
          status: '400'
        }
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default uploadHomeLogo;
