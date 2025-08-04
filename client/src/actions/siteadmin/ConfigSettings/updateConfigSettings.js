import {
    UPDATE_CONFIG_SETTINGS_START,
    UPDATE_CONFIG_SETTINGS_SUCCESS,
    UPDATE_CONFIG_SETTINGS_ERROR,
} from '../../../constants';
import { setLoaderStart, setLoaderComplete } from '../../loader/loader';
import { setSiteSettings } from '../../siteSettings';
import { updateConfigSettingsMutation } from '../../../lib/graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster';

export const updateConfigSettings = (values) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: UPDATE_CONFIG_SETTINGS_START,
            });
            dispatch(setLoaderStart('configSettings'));

            const { data } = await client.mutate({
                mutation: updateConfigSettingsMutation,
                variables: values
            })

            dispatch(setLoaderComplete('configSettings'));

            if (data?.updateConfigSettings?.status == 200) {
                dispatch({ type: UPDATE_CONFIG_SETTINGS_SUCCESS });
                showToaster({ messageId: 'updateConfigSettings', toasterType: 'success' })
                dispatch(setSiteSettings());
            }
            else {
                let errorMessage = data?.updateConfigSettings?.errorMessage;
                dispatch({ type: UPDATE_CONFIG_SETTINGS_ERROR });
                showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: errorMessage })
            }

        }
        catch (err) {
            dispatch({ type: UPDATE_CONFIG_SETTINGS_ERROR });
            showToaster({ messageId: 'catchError', toasterType: 'error', requestMessage: err })
        }
    }
}
