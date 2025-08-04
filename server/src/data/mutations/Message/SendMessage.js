import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType
} from 'graphql';
// import { Listing, ThreadItems, Threads, User, UserProfile } from '../../../data/models';
import Listing from '../../models/Listing.js'
import ThreadItems from '../../models/ThreadItems.js'
import Threads from '../../models/Threads.js'
import User from '../../models/User.js'
import UserProfile from '../../models/UserProfile.js'
import SendMessageType from '../../types/SendMessageType.js';
import { sendNotifications } from '../../../helpers/sendNotifications.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import { getUserEmail } from '../../../helpers/getUserData.js';
import { sendEmail } from '../../../libs/sendEmail.js';
// import sendSocketNotification from '../../../helpers/socket-notification/sendSocketNotification';

const SendMessage = {
  type: SendMessageType,
  args: {
    threadId: { type: new NonNull(IntType) },
    content: { type: StringType },
    type: { type: StringType },
    startDate: { type: StringType },
    endDate: { type: StringType },
    personCapacity: { type: IntType },
    reservationId: { type: IntType },
    startTime: { type: FloatType },
    endTime: { type: FloatType }
  },
  async resolve({ request, response }, {
    threadId,
    content,
    type,
    startDate,
    endDate,
    personCapacity,
    reservationId,
    startTime,
    endTime
  }) {

    try {
      // Check if user already logged in
      if (request.user && !request.user.admin) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        const userId = request.user.id;
        let where = {
          id: userId,
          userBanStatus: 1
        };
        let notifyUserId, guestId, hostId, notifyUserType, messageContent;
        let userName, listId, notifyContent = {}, emailContent;

        // Check whether User banned by admin
        const isUserBan = await User.findOne({ where });
        if (!isUserBan) {

          if (type == 'approved' || type == 'declined' || type == 'preApproved') {
            let statusFilter = { $in: ['approved', 'declined', 'preApproved'] };
            const checkStatus = await ThreadItems.findOne({
              where: {
                threadId,
                sentBy: userId,
                content,
                startDate,
                endDate,
                personCapacity,
                startTime,
                endTime,
                $or: [{ type: statusFilter }]
              }
            });
            if (checkStatus) {
              return {
                status: 400,
                errorMessage: await showErrorMessage({errorCode: 'checkStatus' })
              }
            }
          }
          // Create a thread item
          const threadItems = await ThreadItems.create({
            threadId,
            sentBy: userId,
            content,
            type,
            startDate,
            endDate,
            personCapacity,
            reservationId,
            startTime,
            endTime
          });
          if (threadItems) {
            const updateThreads = await Threads.update({
              isRead: false,
              messageUpdatedDate: new Date(),
            },
              {
                where: {
                  id: threadId
                }
              }
            );

            const getThread = await Threads.findOne({
              where: {
                id: threadId
              },
              raw: true
            });

            if (getThread && getThread.host && getThread.guest) {
              notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
              notifyUserType = getThread.host === userId ? 'renter' : 'owner';
              guestId = getThread.host === userId ? getThread.guest : getThread.host;
              hostId = getThread.host === userId ? getThread.host : getThread.guest;
              listId = getThread.listId;
            }

            const hostProfile = await UserProfile.findOne({
              where: {
                userId: getThread.host
              }
            });

            const guestProfile = await UserProfile.findOne({
              where: {
                userId: getThread.guest
              }
            });
            const guestEmailDetail = await User.findOne({ attributes: ['email'], where: { id: getThread.guest }, raw: true });

            if (hostProfile && guestProfile && getThread) {
              //  userName = getThread.host === userId ? (guestProfile && guestProfile.displayName) : (hostProfile && hostProfile.displayName);
              userName = getThread.host === userId ? (hostProfile && hostProfile.displayName) : (guestProfile && guestProfile.displayName);
            }

            messageContent = userName + ': ' + content;
            notifyContent = {
              "screenType": "message",
              "title": "New Message",
              "userType": notifyUserType.toString(),
              "message": messageContent.toString(),
              "threadId": threadId.toString(),
              "guestId": guestId.toString(),
              "guestName": guestProfile && ((guestProfile.displayName).toString()),
              "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
              "hostId": hostId.toString(),
              "hostName": hostProfile && ((hostProfile.displayName).toString()),
              "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
              "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
              "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
              "listId": listId.toString()
            };

            if (type == 'preApproved') {
              messageContent = userName + ': ' + 'Your request is pre-approved';
              notifyContent = {
                "screenType": "message",
                "title": "New Booking",
                "userType": "renter",
                "message": messageContent.toString(),
                "threadId": threadId.toString(),
                "guestId": guestId.toString(),
                "guestName": guestProfile && ((guestProfile.displayName).toString()),
                "guestPicture": (guestProfile && guestProfile.picture) ? ((guestProfile.picture).toString()) : '',
                "hostId": hostId.toString(),
                "hostName": hostProfile && ((hostProfile.displayName).toString()),
                "hostPicture": (hostProfile && hostProfile.picture) ? ((hostProfile.picture).toString()) : '',
                "guestProfileId": guestProfile && ((guestProfile.profileId).toString()),
                "hostProfileId": hostProfile && ((hostProfile.profileId).toString()),
                "listId": listId.toString()
              };

              const listData = await Listing.findOne({ attributes: ['title'], where: { id: listId }, raw: true });
              emailContent = {
                guestName: guestProfile && guestProfile.firstName,
                hostName: hostProfile && hostProfile.firstName,
                listTitle: listData && listData.title,
                threadId,
              };
              sendEmail(guestEmailDetail.email, 'bookingPreApproval', emailContent);
            }

            // sendNotifications(notifyContent, notifyUserId);
            if (type !== 'approved' && type !== 'declined') {
              sendNotifications(notifyContent, notifyUserId);
            }

            if (type === 'message') { // Send Message - Email template
              emailContent = {
                receiverName: (notifyUserType === 'renter' ? (guestProfile && guestProfile.firstName) : (hostProfile && hostProfile.firstName)),
                senderName: (notifyUserType === 'renter' ? (hostProfile && hostProfile.firstName) : (guestProfile && guestProfile.firstName)),
                receiverType: notifyUserType,
                type: notifyUserType,
                message: content,
                threadId
              };
              const { email } = await getUserEmail(notifyUserId);
              sendEmail(email, 'message', emailContent);
            }

            // let id = notifyUserType === 'owner' ? getThread.host : getThread.guest;
            // sendSocketNotification(`viewMessageThread-${id}`, {
            //   threadType: notifyUserType,
            //   threadId
            // });
            // sendSocketNotification(`messageThread-${id}`, '');

            return {
              results: threadItems,
              status: 200,
            };
          } else {
            return {
              status: 400,
              errorMessage: await showErrorMessage({errorCode: 'failedToCreateThreadItems' })
            }
          }
        } else {
          return {
            status: 500,
            errorMessage: await showErrorMessage({errorCode: 'userBanned' })
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({errorCode: 'loginError' })
        };
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default SendMessage;