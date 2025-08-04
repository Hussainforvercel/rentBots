import { GraphQLString as StringType, GraphQLBoolean as BooleanType } from 'graphql';
import { SiteSettings } from '../../models';
import UpdateSiteSettingsType from '../../types/siteadmin/UpdateSiteSettingsType';
import passport from '../../../core/passport';
import showErrorMessage from '../../../helpers/showErrorMessage';

const updateConfigSettings = {
	type: UpdateSiteSettingsType,
	args: {
		deepLinkBundleId: { type: StringType },
		smtpHost: { type: StringType },
		smtpPort: { type: StringType },
		smptEmail: { type: StringType },
		smtpSender: { type: StringType },
		smtpSenderEmail: { type: StringType },
		smtpPassWord: { type: StringType },
		twillioAccountSid: { type: StringType },
		twillioAuthToken: { type: StringType },
		twillioPhone: { type: StringType },
		paypalClientId: { type: StringType },
		paypalSecret: { type: StringType },
		paypalHost: { type: StringType },
		maxUploadSize: { type: StringType },
		stripePublishableKey: { type: StringType },
		facebookAppId: { type: StringType },
		facebookSecretId: { type: StringType },
		googleSecretId: { type: StringType },
		googleClientId: { type: StringType },
		deepLinkContent: { type: StringType },
		fcmPushNotificationKey: { type: StringType },
		livechat: { type: StringType },
		showchat: { type: BooleanType },
		merchentID: { type: StringType },
		username: { type: StringType },
		password: { type: StringType },
		Token: { type: StringType },
	},
	async resolve({ request }, {
		deepLinkBundleId,
		smtpHost,
		smtpPort,
		smptEmail,
		smtpSender,
		smtpSenderEmail,
		smtpPassWord,
		twillioAccountSid,
		twillioAuthToken,
		twillioPhone,
		paypalClientId,
		paypalSecret,
		paypalHost,
		maxUploadSize,
		stripePublishableKey,
		facebookAppId,
		facebookSecretId,
		googleSecretId,
		googleClientId,
		deepLinkContent,
		fcmPushNotificationKey,
		livechat,
		showchat,
		merchentID,
		username,
		password,
		Token
	}) {
		try {
			if (!request.user || !request.user.admin) {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'userLoginAccount' })
				};
			}

			let siteSettingsFields = {
				deepLinkBundleId,
				smtpHost,
				smtpPort,
				smptEmail,
				smtpSender,
				smtpSenderEmail,
				smtpPassWord,
				twillioAccountSid,
				twillioAuthToken,
				twillioPhone,
				paypalClientId,
				paypalSecret,
				paypalHost,
				maxUploadSize,
				stripePublishableKey,
				facebookAppId,
				facebookSecretId,
				googleSecretId,
				googleClientId,
				deepLinkContent,
				fcmPushNotificationKey,
				livechat,
				showchat,
				merchentID,
				username,
				password,
				Token
			};

			await Promise.all(
				Object.keys(siteSettingsFields).map(async (item) => {
					await SiteSettings.update({ value: siteSettingsFields[item] }, { where: { name: item } })
				})
			);

			// Safely update Google OAuth2 credentials
			if (googleClientId && googleSecretId) {
				if (passport._strategies && passport._strategies.google && passport._strategies.google._oauth2) {
					passport._strategies.google._oauth2._clientId = googleClientId;
					passport._strategies.google._oauth2._clientSecret = googleSecretId;
				} else {
					// If strategy is not initialized, reinitialize it
					const { initializeGoogleStrategy } = require('../../../core/google');
					await initializeGoogleStrategy();
				}
			}

			return { status: 200 };
		}
		catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	},
};

export default updateConfigSettings;
