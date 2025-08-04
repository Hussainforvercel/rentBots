import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType
} from 'graphql';
import { Reservation, Threads, ThreadItems, UserProfile } from '../../data/models';
import ThreadItemsType from '../types/ThreadItemsType';
import showErrorMessage from '../../helpers/showErrorMessage';
import { sendNotifications } from '../../helpers/sendNotifications';

const CreateReservationThread = {
  type: ThreadItemsType,
  args: {
    reservationId: { type: new NonNull(IntType) }
  },
  async resolve({ request, response }, { reservationId }) {
    try {
      // Check if user already logged in
      if (request.user && !request.user.admin) {
        // Find Reservation and collect data
        const reservation = await Reservation.findOne({
          where: {
            id: reservationId,
          }
        });

        if (reservation) {
          //Find or create a thread
          const thread = await Threads.findOrCreate({
            where: {
              listId: reservation.listId,
              host: reservation.hostId,
              guest: reservation.guestId
            },
            defaults: {
              //properties you want on create
              listId: reservation.listId,
              host: reservation.hostId,
              guest: reservation.guestId,
              messageUpdatedDate: new Date()
            }
          });

          if (thread) {
            let bookType;
            if (reservation.reservationState === 'pending') {
              bookType = 'requestToBook';
            } else {
              bookType = 'intantBooking';
            }
            
            const threadItems = await ThreadItems.findOrCreate({
              where: {
                threadId: thread[0].dataValues.id,
                reservationId: reservation.id,
                sentBy: reservation.guestId,
                startDate: reservation.checkIn,
                endDate: reservation.checkOut,
                type: bookType,
                startTime: reservation.startTime,
                endTime: reservation.endTime
              },
              defaults: {
                //properties you want on create
                threadId: thread[0].dataValues.id,
                reservationId: reservation.id,
                sentBy: reservation.guestId,
                content: reservation.message,
                type: bookType,
                startDate: reservation.checkIn,
                endDate: reservation.checkOut,
                personCapacity: reservation.guests
              }
            });

            let notifyUserId, notifyUserType, notifyContent, userName, messageContent;
            notifyUserId = reservation.hostId;
            notifyUserType = 'owner';

            const hostProfile = await UserProfile.findOne({
              where: {
                userId: reservation.hostId
              }
            });

            const guestProfile = await UserProfile.findOne({
              where: {
                userId: reservation.guestId
              }
            });

            userName = (guestProfile && guestProfile.displayName) ? guestProfile.displayName : guestProfile.firstName;
            messageContent = userName + ': ' + reservation.message;

            notifyContent = {
              "screenType": "trips",
              "title": "New Booking",
              "userType": notifyUserType.toString(),
              "message": messageContent.toString(),
            };

            sendNotifications(notifyContent, notifyUserId);

            const updateThreads = await Threads.update({
              isRead: false,
              messageUpdatedDate: new Date()
            },
              {
                where: {
                  id: thread[0].dataValues.id
                }
              }
            );

            return threadItems[0];
          }
        } else {
          return {
            status: 'reservation not found'
          };
        }
      } else {
        return {
          status: "notLoggedIn"
        };
      }
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      }
    }
  },
};

export default CreateReservationThread; 