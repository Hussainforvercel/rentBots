import  User from '../../models/User.js';
import UserProfile from '../../models/UserProfile.js';
import WholeAccountType from '../../types/WholeAccountType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userAccount = {
  type: WholeAccountType,
  async resolve({ request, response }) {

    try {
      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        //Collect from Logged-in User
        let userId, email, preferredLanguageName, languages;
        userId = request.user.id;
        email = request.user.email;
        preferredLanguageName = null;
        languages = [
          { value: "id", label: "Bahasa Indonesia" },
          { value: "ms", label: "Bahasa Melayu" },
          { value: "ca", label: "Català" },
          { value: "da", label: "Dansk" },
          { value: "de", label: "Deutsch" },
          { value: "en", label: "English" },
          { value: "es", label: "Español" },
          { value: "el", label: "Eλληνικά" },
          { value: "fr", label: "Français" },
          { value: "it", label: "Italiano" },
          { value: "hu", label: "Magyar" },
          { value: "nl", label: "Nederlands" },
          { value: "no", label: "Norsk" },
          { value: "pl", label: "Polski" },
          { value: "pt", label: "Português" },
          { value: "fi", label: "Suomi" },
          { value: "sv", label: "Svenska" },
          { value: "tr", label: "Türkçe" },
          { value: "is", label: "Íslenska" },
          { value: "cs", label: "Čeština" },
          { value: "ru", label: "Русский" },
          { value: "th", label: "ภาษาไทย" },
          { value: "zh", label: "中文 (简体)" },
          { value: "zh-TW", label: "中文 (繁體)" },
          { value: "ja", label: "日本語" },
          { value: "ko", label: "한국어" }
        ];

        // Get All User Profile Data
        const userProfile = await UserProfile.findOne({
          attributes: [
            'profileId',
            'firstName',
            'lastName',
            'displayName',
            'dateOfBirth',
            'gender',
            'phoneNumber',
            'preferredLanguage',
            'preferredCurrency',
            'location',
            'info',
            'createdAt',
            'picture',
            'countryCode'
          ],
          where: { userId },
        });

        const userEmail = await User.findOne({
          attributes: [
            'email',
            'userBanStatus'
          ],
          where: {
            id: userId,
            userDeletedAt: {
              $eq: null
            },
          },
          order: [
            [`createdAt`, `DESC`],
          ],
        });

        if (userProfile && userEmail && !userEmail.userBanStatus) {
          if (userProfile.dataValues.preferredLanguage) {
            preferredLanguageName = languages.find(o => o.value === userProfile.dataValues.preferredLanguage);
            if (preferredLanguageName) {
              preferredLanguageName = preferredLanguageName.label;
            }
          }
          return {
            result: {
              userId: request.user.id,
              profileId: userProfile.dataValues.profileId,
              firstName: userProfile.dataValues.firstName,
              lastName: userProfile.dataValues.lastName,
              displayName: userProfile.dataValues.displayName,
              gender: userProfile.dataValues.gender,
              dateOfBirth: userProfile.dataValues.dateOfBirth,
              email: userEmail.email,
              userBanStatus: userEmail.userBanStatus,
              phoneNumber: userProfile.dataValues.phoneNumber,
              preferredLanguage: userProfile.dataValues.preferredLanguage,
              preferredLanguageName,
              preferredCurrency: userProfile.dataValues.preferredCurrency,
              location: userProfile.dataValues.location,
              info: userProfile.dataValues.info,
              createdAt: userProfile.dataValues.createdAt,
              picture: userProfile.dataValues.picture,
              countryCode: userProfile.dataValues.countryCode
            },
            status: 200
          }
        } else {
          if (!userProfile) {
            return {
              status: 500,
              errorMessage: await showErrorMessage({ errorCode: 'invalidProfile' })
            }
          } else {
            return {
              status: 500,
              errorMessage: await showErrorMessage({ errorCode: 'errorCheck' })
            }
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'getProfile' })
        }
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  }
};

export default userAccount;