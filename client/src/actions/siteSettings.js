import {
  SET_SITE_SETTINGS_START,
  SET_SITE_SETTINGS_SUCCESS,
  SET_SITE_SETTINGS_ERROR
} from '../constants';
import { siteSettings as query } from '../lib/graphql';

export const setSiteSettings = () => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({
        type: SET_SITE_SETTINGS_START,
      });

      // Fetch both site_settings and config_settings
      const settingsData = {};
      
      // Fetch site_settings
      const { data: siteData } = await client.query({
        query,
        variables: { type: "site_settings" },
        fetchPolicy: 'network-only'
      });
      
      if (siteData?.siteSettings) {
        siteData.siteSettings.forEach((item) => {
          settingsData[item.name] = item.value;
        });
      }

      // Fetch config_settings
      const { data: configData } = await client.query({
        query,
        variables: { type: "config_settings" },
        fetchPolicy: 'network-only'
      });
      
      if (configData?.siteSettings) {
        configData.siteSettings.forEach((item) => {
          settingsData[item.name] = item.value;
        });
      }

      // Successfully loaded settings
      dispatch({
        type: SET_SITE_SETTINGS_SUCCESS,
        data: settingsData
      });

    } catch (error) {
      dispatch({
        type: SET_SITE_SETTINGS_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
