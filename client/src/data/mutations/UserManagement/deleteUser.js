import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { User, Listing, Threads, Reviews, Reservation, ThreadItems, DocumentVerification } from '../../models';
import DeleteUserType from '../../types/siteadmin/DeleteUserType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const deleteUser = {
  type: DeleteUserType,
  args: {
    userId: { type: new NonNull(StringType) },
  },
  async resolve({ request }, { userId }) {

    try {
      if (request?.user?.admin == true) {
        const findActiveReservation = await Reservation.count({
          where: {
            paymentState: 'completed',
            reservationState: {
              $in: ['pending', 'approved']
            },
            $or: [{
              hostId: userId,
            }, {
              guestId: userId
            }]
          }
        });

        if (findActiveReservation > 0) {
          return {
            status: 'activebooking',
            errorMessage: await showErrorMessage({ errorCode: 'findActiveReservation' })
          };
        }

        const updateUserStatus = await User.update({
          userDeletedAt: new Date()
        }, {
          where: {
            id: userId
          }
        });

        await Reviews.destroy({
          where: {
            authorId: userId
          }
        });

        if (updateUserStatus) {
          await Listing.destroy({
            where: {
              userId
            }
          });

          await DocumentVerification.destroy({
            where: {
              userId
            }
          });
        }

        const findThreads = await Threads.findAll({
          attributes: ['id', 'host'],
          where: {
            $or: [
              {
                host: userId
              },
              {
                guest: userId
              }
            ]
          },
          raw: true
        });

        if (findThreads?.length > 0) {
          findThreads.map(async (item, key) => {
            const checkEnquiry = await ThreadItems.findOne({
              attributes: ['id', 'type', 'startDate', 'endDate', 'personCapacity', 'startTime', 'endTime'],
              where: {
                threadId: item.id,
              },
              limit: 1,
              order: [['createdAt', 'DESC']],
              raw: true
            });

            if (checkEnquiry?.type == 'inquiry') {
              const thread = await ThreadItems.create({
                threadId: item.id,
                sentBy: userId,
                type: userId === item.host ? 'cancelledByHost' : 'cancelledByGuest',
                startDate: checkEnquiry?.startDate,
                endDate: checkEnquiry?.endDate,
                personCapacity: checkEnquiry?.personCapacity,
                startTime: checkEnquiry?.startTime,
                endTime: checkEnquiry?.endTime,
              });
            }
          });
        }

        return {
          status: updateUserStatus ? "success" : "failed"
        };
      } else {
        return { status: "failed" };
      }
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default deleteUser;
