// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
} from 'graphql';
// Sequelize models
import { ServiceFees } from '../../models';
import ServiceFeesType from '../../types/ServiceFeesType';

const getServiceFees = {

  type: ServiceFeesType,

  async resolve({ request, response }) {
      return await ServiceFees.findOne();
  },
};

export default getServiceFees;

/**
query getServiceFees{
    getServiceFees{
        id
        guestType
        guestValue
        hostType
        hostValue
        currency
        status
    }
}
**/