import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { ListSettings } from '../../models';
import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';

const addListSettings = {

  type: ListSettingsType,

  args: {
    typeId: { type: IntType },
    itemName: { type: StringType },
    itemDescription: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
    makeType: { type: StringType },
  },

  async resolve({ request }, {
    typeId,
    itemName,
    itemDescription,
    otherItemName,
    maximum,
    minimum,
    startValue,
    endValue,
    isEnable,
    makeType
  }) {

    if (request.user && request.user.admin == true) {

      if (typeId == 20 || typeId == 3) {
        const isExistsData = await ListSettings.findOne({
          attributes: ["id", 'itemName'],
          where: {
            itemName,
            typeId
          },
          raw: true
        });
        if (isExistsData) {
          return { status: 'failed' }
        }
      }

      const insertListSettings = await ListSettings.create({
        typeId: typeId,
        itemName: itemName.trim(),
        itemDescription: itemDescription,
        otherItemName: otherItemName,
        maximum: maximum,
        minimum: minimum,
        startValue: startValue,
        endValue: endValue,
        isEnable: isEnable,
        makeType: makeType,
      })

      return {
        status: 'success'
      }
    } else {
      return {
        status: 'failed'
      }
    }
  },
};

export default addListSettings;
