import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import sequelize from '../../../sequelize';
import { User } from '../../../../data/models';
import UserDocumentCommonType from '../../../types/siteadmin/UserDocumentListType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const showAllDocument = {

  type: UserDocumentCommonType,
  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType },
  },

  async resolve({ request, response }, { searchList, currentPage }) {
    try {
      const limit = 10;
      let offset = 0, searchFilter = {}, documentFilter = {};

      if (!request?.user || !request?.user?.admin) {
        return {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
      }

      documentFilter = {
        id: {
          $in: [
            sequelize.literal(`SELECT distinct userId FROM DocumentVerification `)
          ]
        }
      };

      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }

      if (searchList) {
        searchFilter = {
          id: {
            $or: [{
              $in: [sequelize.literal(`SELECT userId FROM UserProfile WHERE firstName like '%${searchList}%'`)]
            }, {
              $in: [sequelize.literal(`SELECT id FROM User WHERE email like '%${searchList}%'`)]
            }, {
              $in: [sequelize.literal(`SELECT userId FROM UserProfile WHERE profileId like '%${searchList}%'`)]
            },]
          }
        }
      }

      const count = await User.count({
        where: {
          $and: [
            documentFilter,
            searchFilter
          ],
          userDeletedAt: {
            $eq: null
          }
        }
      });

      const results = await User.findAll({
        attributes: ['id', 'email'],
        where: {
          $and: [
            documentFilter,
            searchFilter
          ],
          userDeletedAt: {
            $eq: null
          }
        },
        limit,
        offset,
      });

      return {
        results,
        count
      };

    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  },
};

export default showAllDocument;