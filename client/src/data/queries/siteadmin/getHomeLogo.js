import { SiteSettings } from '../../../data/models';
import SiteSettingsType from '../../types/siteadmin/SiteSettingsType';

const getHomeLogo = {

  type: SiteSettingsType,

  async resolve({ request }) {

    return await SiteSettings.findOne({
      where: {
        name: 'homePageLogo'
      }
    });
    
  },
};

export default getHomeLogo;
