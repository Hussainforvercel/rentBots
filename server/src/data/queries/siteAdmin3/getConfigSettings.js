import {
	GraphQLString as StringType,
	GraphQLList as List
} from 'graphql';
import { SiteSettings } from '../../models';
import SiteSettingsType from '../../types/siteadmin/SiteSettingsType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getConfigSettings = {

	type: new List(SiteSettingsType),

	args: {
		name: { type: StringType }
	},

	async resolve({ request }, { name }) {

		try {

			const results = await SiteSettings.findAll({
				attributes: [
					'id',
					'name',
					'value',
				],
				where: {
					name: {
						$in: ['siteName']
					}
				}
			});

			return results;

		} catch (error) {
			return {
				status: '400',
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			}
		}
	}
};

export default getConfigSettings;
