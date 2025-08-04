import { SiteSettings } from '../../../models';
import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const removeLogo = {
  type: SiteSettingsType,
  async resolve({ request }) {

    try {
      if (request?.user?.admin == true) {
        let removeLogo = await SiteSettings.destroy({
          where: {
            title: 'Logo'
          }
        });

        return {
          status: removeLogo ? 'success' : 'failed'
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

export default removeLogo;
