//Model

import { Privileges } from '../../../models';
//Type
import PrivilegesCommonType from '../../../types/siteadmin/PrivilegesCommonType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getPrivileges = {

	type: PrivilegesCommonType,

	async resolve({ request }) {

		try {

			const results = await Privileges.findAll();

			return {
				status: results.length > 0 ? 200 : 400,
				results,
				errorMessage: results.length > 0 ? null : await showErrorMessage({ errorCode: 'noRecordFound' })
			};

		} catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	}
};

export default getPrivileges;
