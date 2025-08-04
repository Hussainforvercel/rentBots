import { SiteSettings } from '../../../data/models';
import SiteSettingsType from '../../types/siteadmin/SiteSettingsType';

const getEmailLogo = {

  type: SiteSettingsType,

  async resolve({ request }) {

    return await SiteSettings.findOne({
      where: {
        name: 'emailLogo'
      }
    });
    
  },
};

export default getEmailLogo;
