import {
  GraphQLString as StringType,
} from 'graphql';
import { SiteSettings } from '../../../models';
import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const uploadLogo = {
  type: SiteSettingsType,
  args: {
    fileName: { type: StringType },
    filePath: { type: StringType },
  },
  async resolve({ request }, { fileName, filePath }) {

    try {
      if (request?.user?.admin == true) {
        let removeLogo = await SiteSettings.destroy({
          where: {
            title: 'Logo'
          }
        });

        let createLogoRecord = await SiteSettings.create({
          title: 'Logo',
          name: 'Logo',
          value: fileName,
          type: 'site_settings'
        });

        return {
          status: createLogoRecord ? 'success' : 'failed'
        }

      } else {
        return {
          status: 'not logged in'
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

export default uploadLogo;
