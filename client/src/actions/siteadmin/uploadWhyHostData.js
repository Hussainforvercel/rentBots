import {
	WHYHOST_UPDATE_ERROR,
	WHYHOST_UPDATE_START,
	WHYHOST_UPDATE_SUCCESS
} from '../../constants';
import { setLoaderStart, setLoaderComplete } from '../loader/loader';
import showToaster from '../../helpers/toasterMessages/showToaster';
import showErrorMessage from '../../helpers/showErrorMessage';
import { updateWhyHost as mutation } from '../../lib/graphql';

export default function uploadWhyHostData(dataList) {
	return async (dispatch, getState, { client }) => {
		let status, errorMessage = await showErrorMessage({ errorCode: 'somethingWrong' });

		try {
			dispatch({
				type: WHYHOST_UPDATE_START
			});
			dispatch(setLoaderStart('whyHostData'));

			const { data } = await client.mutate({
				mutation,
				variables: {
					dataList
				}
			});

			if (data?.updateWhyHost?.status == 200) {
				showToaster({ messageId: 'updateWhyHost', toasterType: 'success' })
				await dispatch({
					type: WHYHOST_UPDATE_SUCCESS
				});
				await dispatch(setLoaderComplete('whyHostData'));

			} else {
				errorMessage = data?.updateWhyHost?.errorMessage
				showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: errorMessage })

				await dispatch({
					type: WHYHOST_UPDATE_ERROR
				});
				dispatch(setLoaderComplete('whyHostData'));
			}
		} catch (error) {
			errorMessage = await showErrorMessage({ errorCode: 'catchError', error })

			showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: errorMessage })

			await dispatch({
				type: WHYHOST_UPDATE_ERROR
			});
			dispatch(setLoaderComplete('whyHostData'));
		}
	}
};