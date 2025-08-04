import {
  GraphQLInt as IntType,
} from 'graphql';
import {
  ListSettings
} from '../../../data/models';
import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import checkListSettingsActivity from '../../../helpers/checkListSettingsActivity';
import showErrorMessage from '../../../helpers/showErrorMessage';

const deleteListSettings = {

  type: ListSettingsType,

  args: {
    id: { type: IntType },
    typeId: { type: IntType }
  },

  async resolve({ request }, { id, typeId }) {
    try {
      let isListSettingsDeleted = false;

      if (!request?.user || !request?.user?.admin) {
        return {
          status: 'failed'
        };
      }

      const status = await checkListSettingsActivity(typeId, id);

      if (status) {
        return {
          status
        };
      };

      if (typeId == 20) {
        const isModel = await ListSettings.findOne({
          where: { makeType: id },
          raw: true
        });

        if (isModel) {
          return {
            status: "modelUsed",
          }
        }
      }

      await ListSettings.destroy({
        where: {
          id
        }
      })
        .then(function (instance) {
          // Check if any rows are affected
          if (instance > 0) {
            isListSettingsDeleted = true;
          }
        });

      return {
        status: isListSettingsDeleted ? 'success' : 'failed'
      };
    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  },
};

export default deleteListSettings;
