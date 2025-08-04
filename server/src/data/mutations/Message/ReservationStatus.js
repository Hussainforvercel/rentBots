import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';
// import { ThreadItems, Threads, User, Reservation, ListBlockedDates, UserProfile, Listing } from '../../../data/models';
import ThreadItems from '../../models/ThreadItems.js';
import Threads from '../../models/Threads.js';
import User from '../../models/User.js';
import Reservation from '../../models/Reservation.js';
import ListBlockedDates from '../../models/ListBlockedDates.js';
import UserProfile from '../../models/UserProfile.js';
import Listing from '../../models/Listing.js'
import SendMessageType from '../../types/SendMessageType.js';
import { sendNotifications } from '../../../helpers/sendNotifications.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import { getUser } from '../../../helpers/getUserData.js';
import { sendEmail } from '../../../libs/sendEmail.js';

const ReservationStatus = {
    type: SendMessageType,
    args: {
        threadId: { type: new NonNull(IntType) },
        content: { type: StringType },
        type: { type: StringType },
        startDate: { type: StringType },
        endDate: { type: StringType },
        personCapacity: { type: IntType },
        reservationId: { type: IntType },
        actionType: { type: StringType },
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
        actionType,
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
                }
                // Check whether User banned by admin
                const isUserBan = await User.findOne({ where });
                let isStatus = false;
                if (!isUserBan) {
                    let notifyUserId, notifyUserType, notifyContent,
                        userName, messageContent, listId;

                    const getThread = await Threads.findOne({
                        where: {
                            id: threadId
                        },
                        raw: true
                    });

                    if (getThread && getThread.host && getThread.guest) {
                        notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
                        notifyUserType = getThread.host === userId ? 'renter' : 'owner';
                    }

                    const hostProfile = await UserProfile.findOne({
                        where: {
                            userId: getThread.host
                        }
                    });

                    if (hostProfile && getThread) {
                        userName = hostProfile && hostProfile.displayName ? hostProfile.displayName : hostProfile.firstName
                    }
                    listId = getThread && getThread.listId;

                    if (type == 'approved' || type == 'declined') {
                        let statusFilter = { $in: ['approved', 'declined'] };
                        const checkStatus = await ThreadItems.findOne({
                            where: {
                                threadId,
                                sentBy: userId,
                                startDate,
                                endDate,
                                personCapacity,
                                reservationId,
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

                    const reservationDetails = await Reservation.findOne({ where: { id: reservationId }, attributes: ['guestId', 'hostId', 'checkIn', 'confirmationCode'], raw: true })
                    const listData = await Listing.findOne({ attributes: ['title', 'city'], where: { id: listId }, raw: true });
                    const hostDetails = await getUser({ userId: reservationDetails.hostId, attributes: ['email'], profileAttributes: ['firstName'] });
                    const guestDetails = await getUser({ userId: reservationDetails.guestId, attributes: ['email'], profileAttributes: ['firstName'] });

                    let emailContent = {
                        hostName: hostDetails && hostDetails['profile.firstName'],
                        guestName: guestDetails && guestDetails['profile.firstName'],
                    }

                    if (actionType == 'approved') {
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
                            await Threads.update({
                                isRead: false,
                                messageUpdatedDate: new Date(),
                            },
                                {
                                    where: {
                                        id: threadId
                                    }
                                }
                            );
                        }

                        await Reservation.update({
                            reservationState: 'approved'
                        },
                            {
                                where: {
                                    id: reservationId
                                }
                            }
                        );

                        messageContent = userName + ': ' + 'Booking is approved';

                        isStatus = true;
                        notifyContent = {
                            "screenType": "trips",
                            "title": "Approved",
                            "userType": notifyUserType.toString(),
                            "message": messageContent.toString(),
                        };

                        emailContent['listTitle'] = listData && listData.title;
                        emailContent['listCity'] = listData && listData.city;
                        emailContent['threadId'] = threadId;
                        sendEmail(guestDetails.email, 'bookingConfirmedToGuest', emailContent);
                    } else if (actionType == 'declined') {

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
                            await Threads.update({
                                isRead: false,
                                messageUpdatedDate: new Date(),
                            },
                                {
                                    where: {
                                        id: threadId
                                    }
                                }
                            );
                        }

                        await Reservation.update({
                            reservationState: type
                        },
                            {
                                where: {
                                    id: reservationId
                                }
                            }
                        );

                        await ListBlockedDates.update({
                            reservationId: null,
                            calendarStatus: 'available'
                        }, {
                            where: {
                                reservationId,
                                calendarStatus: 'blocked',
                                isSpecialPrice: {
                                    $ne: null
                                }
                            }
                        });

                        await ListBlockedDates.destroy({
                            where: {
                                reservationId,
                                calendarStatus: 'blocked',
                                isSpecialPrice: {
                                    $eq: null
                                }
                            }
                        });

                        isStatus = true;
                        messageContent = userName + ' : ' + 'Booking is declined';
                        notifyContent = {
                            "screenType": "trips",
                            "title": "Declined",
                            "userType": notifyUserType.toString(),
                            "message": messageContent.toString(),
                        };
                        emailContent['checkIn'] = reservationDetails && reservationDetails.checkIn;
                        emailContent['confirmationCode'] = reservationDetails && reservationDetails.confirmationCode;
                        sendEmail(guestDetails.email, 'bookingDeclinedToGuest', emailContent);
                    }

                    if (isStatus) {
                        sendNotifications(notifyContent, notifyUserId);
                        return {
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

export default ReservationStatus;