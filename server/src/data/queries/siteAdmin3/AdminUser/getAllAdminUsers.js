import {
  GraphQLInt as IntType,
  GraphQLString as StringType
} from 'graphql';
import { AdminUser } from '../../../models';
import AdminUserCommonType from '../../../types/siteadmin/AdminUserCommonType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getAllAdminUsers = {

  type: AdminUserCommonType,

  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType }
  },

  async resolve({ request }, { currentPage, searchList }) {
    try {
      if (request.user && request.user.admin) {
        let limit = 10, offset = 0, keywordFilter = {}, commonFilter;

        commonFilter = {
          isSuperAdmin: {
            ne: true
          }
        };

        if (currentPage) offset = (currentPage - 1) * limit;

        if (searchList) {
          keywordFilter = {
            email: { $like: '%' + searchList + '%' }
          };
        }

        const results = await AdminUser.findAll({
          where: {
            $and: [
              keywordFilter,
              commonFilter
            ]
          },
          limit,
          offset,
          order: [['createdAt', 'DESC']],
        });

        const count = await AdminUser.count({
          where: {
            $and: [
              keywordFilter,
              commonFilter
            ]
          }
        });

        return {
          results,
          count,
          status: 200
        };
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'adminLogin' })
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

export default getAllAdminUsers;

