// import { User, Reservation, Reviews, Listing, Threads, ThreadItems } from '../../models';
import Reservation from '../../models/Reservation.js';
import  Reviews  from '../../models/Reviews.js';
import  User  from '../../models/User.js';
import  Listing  from '../../models/Listing.js';
import  Threads  from '../../models/Threads.js';
import  ThreadItems  from '../../models/ThreadItems.js';
import UserCommonType from '../../types/UserCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
// import sendSocketNotification from '../../../helpers/socket-notification/sendSocketNotification';

const deleteUser = {
	type: UserCommonType,
	async resolve({ request }) {

		try {
			let userId;
			if (request.user && request.user.id) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				userId = request.user.id;
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
						status: 400,
						errorMessage: await showErrorMessage({ errorCode: 'findActiveReservation' })
					};
				}

				const updateUserStatus = await User.update({
					userDeletedAt: new Date(),
					userDeletedBy: userId,
				}, {
					where: {
						id: userId
					}
				});

				if (updateUserStatus) {
					await Reviews.destroy({
						where: {
							authorId: userId
						}
					});

					await Listing.update({
						isPublished: false
					}, {
						where: {
							userId
						}
					});

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

					if (findThreads && findThreads.length > 0) {
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

							if (checkEnquiry && checkEnquiry.type == 'inquiry') {
								const thread = await ThreadItems.create({
									threadId: item.id,
									sentBy: userId,
									type: userId === item.host ? 'cancelledByHost' : 'cancelledByGuest',
									startDate: checkEnquiry.startDate,
									endDate: checkEnquiry.endDate,
									personCapacity: checkEnquiry.personCapacity,
									startTime: checkEnquiry.startTime,
									endTime: checkEnquiry.endTime,
								});
							}
						});
					}
				}

				// sendSocketNotification(`userlogout-${userId}`, '')

				return {
					status: updateUserStatus ? 200 : 400,
					errorMessage: updateUserStatus ? null : await showErrorMessage({ errorCode: 'accountDelete' })
				}
			} else {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	}
};

export default deleteUser;