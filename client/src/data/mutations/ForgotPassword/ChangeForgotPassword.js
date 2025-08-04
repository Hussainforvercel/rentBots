import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { User, ForgotPassword } from '../../models';
import userEditProfileType from '../../types/userEditProfileType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const changeForgotPassword = {
  type: userEditProfileType,
  args: {
    email: { type: new NonNull(StringType) },
    newPassword: { type: new NonNull(StringType) },
  },
  async resolve({ request, response }, { email, newPassword }) {

    try {
      if (!request.user) {

        const updatePassword = User.update(
          {
            password: User.generateHash(newPassword)
          },
          {
            where: {
              email
            }
          }
        );
        const removeTokens = ForgotPassword.destroy({
          where: {
            email
          }
        });

        return {
          status: '200'
        };

      } else {
        return {
          status: '400'
        };
      }
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default changeForgotPassword;


/**
mutation changeForgotPassword($email: String!, $newPassword: String!) {
  changeForgotPassword (email: $email, newPassword: $newPassword) {
    status
  }
}
 */
