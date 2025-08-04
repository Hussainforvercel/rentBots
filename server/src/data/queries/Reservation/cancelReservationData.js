import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
// import {
// 	Reservation,
// 	Listing,
// 	Cancellation,
// 	Threads,
// 	ReservationSpecialPricing,
// 	ServiceFees
// } from '../../models';
import Reservation from '../../models/Reservation.js';
import Listing from '../../models/Listing.js';
import Cancellation from '../../models/Cancellation.js';
import Threads from '../../models/Threads.js';
import ReservationSpecialPricing from '../../models/ReservationSpecialPricing.js';
import ServiceFees from '../../models/ServiceFees.js';
import CancellationResponseType from '../../types/CancellationResponseType.js';
import { convert } from '../../../helpers/currencyConvertion.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { nestedMomentFormatter } from '../../../helpers/momentHelper.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import getCurrencyRates from '../../../helpers/currencyRatesHelper.js';
import { getUser } from '../../../helpers/getUserData.js';

const cancelReservationData = {
	type: CancellationResponseType,
	args: {
		reservationId: { type: new NonNull(IntType) },
		userType: { type: new NonNull(StringType) },
		currency: { type: StringType },
	},
	async resolve({ request }, { reservationId, currency, userType }) {

		try {
			if (!request.user || !request.user.id) {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'login' }),
				};
			}

			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}

			const id = reservationId;
			const userId = request.user.id;
			let where, cancellationData, listId, listData, policyData, threadData, reservationState, checkOutNewDate, checkOut;
			reservationState = [{ reservationState: 'pending' }, { reservationState: 'approved' }];
			checkOutNewDate = new Date();
			checkOutNewDate.setHours(0, 0, 0, 0);
			checkOut = { $gte: checkOutNewDate };

			let momentStartDate, days, interval, today = moment().startOf('day');
			let guestName, convertPayoutToHost = 0, accommodation, guestFees, remainingDays, policyName;
			let convertedEarnedAmount = 0, threadId;
			let hostName, startedIn, convertedNonRefundableDayPrice = 0, refundableDayPrice = 0, nonRefundableNightPrice = 0;
			let nonRefundableDayPrice = 0, updatedGuestFee = 0, updatedHostFee = 0;
			let payoutToHost = 0, subtotal = 0, convertedGuestFee = 0, refundAmount = 0;
			let refundDays = 0, earnedAmount = 0, convertedRefundAmount = 0;
			let convertHostFee = 0, convertedNonRefundAmount = 0, isSameCurrency = true, convertedSubTotal = 0;
			let isSpecialPriceAssigned = false, convertedSpecialPriceAverage = 0, priceForDays = 0;
			let hostRefund = 0, paidAmount = 0, basePrice = 0, deliveryPrice = 0;

			const serviceFees = await ServiceFees.findOne({ raw: true });
			const { base, rates } = await getCurrencyRates();

			if (userType === 'owner') {
				where = {
					id,
					hostId: userId,
					$or: reservationState,
					checkOut
				};
			} else {
				where = {
					id,
					guestId: userId,
					$or: reservationState,
					checkOut
				};
			}

			cancellationData = await Reservation.findOne({
				where,
				raw: true
			});

			if (!cancellationData) {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: 'supportContact' })
				};
			}

			if (cancellationData && cancellationData.delivery) {
				deliveryPrice = cancellationData.delivery;
			}

			const listingSpecialPricingData = await ReservationSpecialPricing.findAll({
				where: {
					reservationId: id
				},
				order: [['blockedDates', 'ASC']],
				raw: true
			});

			let bookingSpecialPricing = [];
			if (listingSpecialPricingData && listingSpecialPricingData.length > 0) {
				Promise.all(listingSpecialPricingData.map((item) => {
					let pricingRow = {}, currentPrice;
					if (item.blockedDates) {
						isSpecialPriceAssigned = true;
						currentPrice = Number(item.isSpecialPrice);
					} else {
						currentPrice = Number(cancellationData.basePrice);
					}
					pricingRow = {
						blockedDates: item.blockedDates,
						isSpecialPrice: currentPrice,
					};
					bookingSpecialPricing.push(pricingRow);
				}));
			}

			listId = cancellationData.listId
			if (cancellationData.checkIn != null && cancellationData.checkOut != null) {
				momentStartDate = moment(cancellationData.checkIn).startOf('day');
				days = cancellationData.dayDifference;
				interval = momentStartDate.diff(today, 'days');
			}

			const hostDetails = await getUser({ userId: cancellationData.hostId, attributes: ['email'], profileAttributes: ['firstName', 'picture', 'createdAt'] });
			const guestDetails = await getUser({ userId: cancellationData.guestId, attributes: ['email'], profileAttributes: ['firstName', 'picture', 'createdAt'] });

			threadData = await Threads.findOne({
				attributes: ['id'],
				where: {
					listId,
					$and: [{ host: cancellationData.hostId }, { guest: cancellationData.guestId }]
				},
				raw: true
			});

			listData = await Listing.findOne({
				attributes: ['id', 'title'],
				where: { id: listId },
				raw: true
			});

			policyData = await Cancellation.findOne({
				where: {
					id: cancellationData.cancellationPolicy
				},
				raw: true
			});

			if (!listData || !policyData) {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: (!listData) ? 'checkListing' : 'checkPolicy' }),
				};
			}

			threadId = threadData ? threadData.id : null;
			hostName = hostDetails ? hostDetails['profile.firstName'] : null;
			guestName = guestDetails ? guestDetails['profile.firstName'] : null;

			priceForDays = Number(cancellationData.basePrice) * Number(days);
			if (isSpecialPriceAssigned) {
				bookingSpecialPricing && bookingSpecialPricing.length > 0 && bookingSpecialPricing.map((item, index) => {
					priceForDays = Number(priceForDays) + Number(item.isSpecialPrice);
				});
			}

			policyName = policyData.policyName;
			if (interval >= policyData.priorDays) { // Prior
				accommodation = policyData.accommodationPriorCheckIn;
				guestFees = policyData.guestFeePriorCheckIn;
			} else if (interval < policyData.priorDays && interval > 0) { // Before
				accommodation = policyData.accommodationBeforeCheckIn;
				guestFees = policyData.guestFeeBeforeCheckIn;
				remainingDays = days - 1;
			} else { // During
				accommodation = policyData.accommodationDuringCheckIn;
				guestFees = policyData.guestFeeDuringCheckIn;
				remainingDays = (days - 1) + interval;
			}
			startedIn = interval;

			// Calculation 
			if (userType === 'renter') {
				paidAmount = cancellationData.total + cancellationData.guestServiceFee;
				updatedGuestFee = (cancellationData.guestServiceFee * (guestFees / 100));
				subtotal = cancellationData.total + cancellationData.guestServiceFee, refundDays = days,
					basePrice = getPriceWithDiscount({ basePrice: cancellationData.isSpecialPriceAverage || cancellationData.basePrice, discount: cancellationData.discount, nights: days });
				if (remainingDays >= 0) {
					if (interval <= 0 && remainingDays < days) { deliveryPrice = 0; }
					refundDays = remainingDays;
				}
				refundableDayPrice = ((refundDays * basePrice) * (accommodation / 100)) + deliveryPrice;
				hostRefund = cancellationData.total - refundableDayPrice;
				refundableDayPrice = (refundableDayPrice + updatedGuestFee);
				//Payout amount calculated with host service fee
				if (hostRefund > 0) {
					if (serviceFees) {
						updatedHostFee = cancellationData.hostServiceFeeType === 'percentage' ? (hostRefund * (Number(cancellationData.hostServiceFeeValue) / 100)) : hostRefund > cancellationData.hostServiceFee ? cancellationData.hostServiceFee : hostRefund;
					}
					payoutToHost = hostRefund - updatedHostFee;
				}
				//Non refundable amount calculated based on the total amount guest paid and the refundable amount with guest service fee
				nonRefundableNightPrice = paidAmount - refundableDayPrice;
				updatedGuestFee = cancellationData.guestServiceFee - updatedGuestFee;
				if (currency != cancellationData.currency) {
					isSameCurrency = false;
					if (updatedHostFee > 0) {
						convertHostFee = convert(base, rates, updatedHostFee, cancellationData.currency, currency);
					}
					if (refundableDayPrice > 0) {
						convertedRefundAmount = convert(base, rates, refundableDayPrice, cancellationData.currency, currency);
					}
					if (nonRefundableNightPrice > 0) {
						convertedNonRefundAmount = convert(base, rates, nonRefundableNightPrice, cancellationData.currency, currency);
					}
					if (updatedGuestFee > 0) {
						convertedGuestFee = convert(base, rates, updatedGuestFee, cancellationData.currency, currency);
					}
					if (payoutToHost > 0) {
						convertPayoutToHost = convert(base, rates, payoutToHost, cancellationData.currency, currency);
					}
					if (subtotal > 0) {
						convertedSubTotal = convert(base, rates, subtotal, cancellationData.currency, currency);
					}
					if (cancellationData && cancellationData.isSpecialPriceAverage > 0) {
						convertedSpecialPriceAverage = convert(base, rates, cancellationData.isSpecialPriceAverage, cancellationData.currency, currency);
					}
				}
				return {
					results: {
						reservationId,
						cancellationPolicy: policyName,
						refundToGuest: isSameCurrency ? refundableDayPrice : convertedRefundAmount.toFixed(2),
						nonRefundableDayPrice: isSameCurrency ? nonRefundableNightPrice : convertedNonRefundAmount.toFixed(2),
						payoutToHost: isSameCurrency ? payoutToHost : convertPayoutToHost.toFixed(2),
						guestServiceFee: isSameCurrency ? updatedGuestFee : convertedGuestFee.toFixed(2),
						hostServiceFee: isSameCurrency ? updatedHostFee : convertHostFee.toFixed(2),
						startedIn: startedIn,
						rentingFor: days,
						total: isSameCurrency ? subtotal : convertedSubTotal.toFixed(2),
						listId,
						currency,
						threadId,
						cancelledBy: 'renter',
						checkIn: nestedMomentFormatter(cancellationData.checkIn),
						checkOut: nestedMomentFormatter(cancellationData.checkOut),
						startTime: cancellationData.startTime,
						endTime: cancellationData.endTime,
						guests: cancellationData.guests,
						guestName,
						hostName,
						listTitle: listData.title,
						confirmationCode: cancellationData.confirmationCode,
						hostEmail: hostDetails.email,
						guestEmail: guestDetails.email,
						hostProfilePicture: hostDetails['profile.picture'],
						guestProfilePicture: guestDetails['profile.picture'],
						isSpecialPriceAverage: isSameCurrency ? cancellationData.isSpecialPriceAverage : convertedSpecialPriceAverage.toFixed(2),
						guestCreatedAt: guestDetails['profile.createdAt'],
						hostCreatedAt: hostDetails['profile.createdAt']
					},
					status: 200
				};
			} else { // Owner
				let updatedHostFee = cancellationData.hostServiceFee, updatedGuestFee = cancellationData.guestServiceFee, totalEarnings = cancellationData.total - cancellationData.hostServiceFee;
				subtotal = cancellationData.total + cancellationData.guestServiceFee;
				refundDays = days;
				let isSameDate = interval == 0 && days == 1;
				basePrice = getPriceWithDiscount({ basePrice: cancellationData.isSpecialPriceAverage || cancellationData.basePrice, discount: cancellationData.discount, nights: days });
				//Host Payout amount without subtracting host service fee. total has cleaning Fee with in it.
				if (interval <= 0 && remainingDays < days && !isSameDate) {
					refundDays = remainingDays;
					cancellationData['guestServiceFee'] = 0;
					deliveryPrice = 0;
				}
				refundAmount = (refundDays * basePrice) + deliveryPrice;
				hostRefund = cancellationData.total - refundAmount;
				//Payout amount calculated with host service fee
				if (hostRefund > 0) {
					//New host service fee calculated based on the host refund amount.
					if (serviceFees) {
						updatedHostFee = cancellationData.hostServiceFeeType === 'percentage' ? hostRefund * (Number(cancellationData.hostServiceFeeValue) / 100) : hostRefund > cancellationData.hostServiceFee ? cancellationData.hostServiceFee : hostRefund;
					}
					earnedAmount = hostRefund - updatedHostFee;
					nonRefundableDayPrice = totalEarnings - earnedAmount;
				} else {
					//Payout amount of host is zero
					nonRefundableDayPrice = totalEarnings;
					updatedGuestFee = 0; //Guest fee refunded
					updatedHostFee = 0;
				}
				//Adding guest service fee, if it could be refunded
				refundAmount = (refundAmount + cancellationData.guestServiceFee) - cancellationData.discount;
				if (currency != cancellationData.currency) {
					isSameCurrency = false;
					if (refundAmount > 0) {
						convertedRefundAmount = convert(base, rates, refundAmount, cancellationData.currency, currency);
					}
					if (nonRefundableDayPrice > 0) {
						convertedNonRefundableDayPrice = convert(base, rates, nonRefundableDayPrice, cancellationData.currency, currency);
					}
					if (earnedAmount > 0) {
						convertedEarnedAmount = convert(base, rates, earnedAmount, cancellationData.currency, currency);
					}
					if (updatedHostFee > 0) {
						convertHostFee = convert(base, rates, updatedHostFee, cancellationData.currency, currency);
					}
					if (subtotal > 0) {
						convertedSubTotal = convert(base, rates, subtotal, cancellationData.currency, currency);
					}

					if (cancellationData && cancellationData.isSpecialPriceAverage > 0) {
						convertedSpecialPriceAverage = convert(base, rates, cancellationData.isSpecialPriceAverage, cancellationData.currency, currency);
					}
					if (cancellationData && updatedGuestFee > 0) {
						convertedGuestFee = convert(base, rates, updatedGuestFee, cancellationData.currency, currency);
					}
				}

				return {
					results: {
						reservationId,
						cancellationPolicy: policyName,
						refundToGuest: isSameCurrency ? refundAmount : convertedRefundAmount.toFixed(2),
						payoutToHost: isSameCurrency ? earnedAmount : convertedEarnedAmount.toFixed(2),
						nonRefundableDayPrice: isSameCurrency ? nonRefundableDayPrice : convertedNonRefundableDayPrice.toFixed(2),
						guestServiceFee: isSameCurrency ? updatedGuestFee : convertedGuestFee.toFixed(2),
						hostServiceFee: isSameCurrency ? updatedHostFee : convertHostFee.toFixed(2),
						startedIn: startedIn,
						rentingFor: days,
						total: isSameCurrency ? subtotal : convertedSubTotal.toFixed(2),
						listId,
						currency,
						threadId,
						cancelledBy: 'owner',
						checkIn: nestedMomentFormatter(cancellationData.checkIn),
						checkOut: nestedMomentFormatter(cancellationData.checkOut),
						startTime: cancellationData.startTime,
						endTime: cancellationData.endTime,
						guests: cancellationData.guests,
						hostName,
						guestName,
						listTitle: listData.title,
						confirmationCode: cancellationData.confirmationCode,
						hostEmail: hostDetails.email,
						guestEmail: guestDetails.email,
						hostProfilePicture: hostDetails['profile.picture'],
						guestProfilePicture: guestDetails['profile.picture'],
						guestCreatedAt: guestDetails['profile.createdAt'],
						hostCreatedAt: hostDetails['profile.createdAt'],
						isSpecialPriceAverage: isSameCurrency ? cancellationData.isSpecialPriceAverage : convertedSpecialPriceAverage.toFixed(2),
					},
					status: 200
				}
			}
		} catch (error) {
			return {
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
				status: 400
			}
		}
	}
};

export default cancelReservationData;

export function getPriceWithDiscount({ basePrice, discount, nights }) {
	if (discount > 0) {
		let singleNightDiscount = discount / nights;
		basePrice = basePrice - singleNightDiscount;
	}
	return basePrice;
}

