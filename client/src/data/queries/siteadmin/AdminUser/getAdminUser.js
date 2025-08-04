import { AdminUser } from '../../../../data/models';
import AdminUserType from '../../../types/siteadmin/AdminUserType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getAdminUser = {

  type: AdminUserType,

  async resolve({ request, response }) {
    try {
      if (request.user && request.user.admin) {
        return await AdminUser.findOne({
          where: {
            id: request.user.id
          }
        });
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'adminLoginError' })
        };
      }
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getAdminUser;

/*

query {
    getAdminUser {
        status
        errorMessage
        id
        email
        isSuperAdmin
        createdAt
    }
}

*/
