import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { ThreadItems, Threads } from '../../data/models';
import ThreadItemsType from '../types/ThreadItemsType';

const readMessage = {

  type: ThreadItemsType,

  args: {
    threadId: { type: new NonNull(IntType) }
  },

  async resolve({ request, response }, {
    threadId
  }) {

    // Check if user already logged in
    if (request?.user && !request?.user?.admin) {

      const userId = request?.user?.id;

      // Create a thread item
      await ThreadItems.update({
        isRead: true
      }, {
        where: {
          threadId,
          sentBy: {
            $ne: userId
          },
          isRead: false
        }
      });

      await Threads.update({
        isRead: true,
      }, {
        where: {
          id: threadId,
        }
      });

      return {
        status: 'updated'
      };
    } else {
      return {
        status: 'notLoggedIn',
      };
    }
  },
};

export default readMessage;
