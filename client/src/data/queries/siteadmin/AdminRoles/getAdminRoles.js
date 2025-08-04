
import { AdminRoles } from '../../../models';
import AdminRoleCommonType from '../../../types/siteadmin/AdminRoleCommonType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getAdminRoles = {

  type: AdminRoleCommonType,

  async resolve({ request }) {
    try {
      if (request?.user && request?.user?.admin) {

        const results = await AdminRoles.findAll({
          order: [['createdAt', 'DESC']],
        });

        return await {
          results,
          status: 200
        };
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'adminLogin' })
        };
      }
    }
    catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getAdminRoles;

