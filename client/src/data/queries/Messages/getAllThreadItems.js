import {
  GraphQLList as List,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';
import { ThreadItems } from '../../models';
import ThreadItemsType from '../../types/ThreadItemsType';

const getAllThreadItems = {

  type: new List(ThreadItemsType),

  args: {
    threadId: { type: new NonNull(IntType) },
    offset: { type: IntType },
  },

  async resolve({ request }, { threadId, offset }) {
    try {
      const limit = 5;
      if (request?.user || request?.user?.admin) {
        return await ThreadItems.findAll({
          where: {
            threadId
          },
          order: [[`createdAt`, `DESC`]],
          limit,
          offset
        });
      } else {
        return {
          status: "notLoggedIn",
        };
      }
    } catch (error) {
      return {
        status: '400'
      };
    }
  }
};

export default getAllThreadItems;