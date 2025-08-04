import { SiteSettings } from '../../../models';
import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const removeHomeLogo = {
  type: SiteSettingsType,
  async resolve({ request }) {
    try {
      if (request.user && request.user.admin == true) {
        let removeLogo = await SiteSettings.destroy({
          where: {
            name: 'homePageLogo'
          }
        });

        return {
          status: removeLogo ? '200' : '400'
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

export default removeHomeLogo;
