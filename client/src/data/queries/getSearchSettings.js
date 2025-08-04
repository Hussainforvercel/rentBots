import { SearchSettings } from '../../data/models';
import SearchSettingsType from '../types/SearchSettingsType';

const getSearchSettings = {

  type: SearchSettingsType,

  async resolve({ request }) {

    return await SearchSettings.findOne();
  },
};

export default getSearchSettings;