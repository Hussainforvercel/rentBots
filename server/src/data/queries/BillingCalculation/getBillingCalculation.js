import {
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType,
	GraphQLBoolean as BooleanType
} from 'graphql';
import moment from 'moment';
// import { ListBlockedDates, ListingData, ServiceFees } from '../../../data/models';
import ListBlockedDates from '../../models/ListBlockedDates.js';
import ListingData from '../../models/ListingData.js';
import ServiceFees from '../../models/ServiceFees.js';
import BillingType from '../../types/BillingType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import dayDifferenceHelper from '../../../helpers/dayDifferenceHelper.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import { momentFormat } from '../../../helpers/momentHelper.js';
import { convert } from '../../../helpers/currencyConvertion.js';
import getCurrencyRates from '../../../helpers/currencyRatesHelper.js';
import { getConfigurationData } from '../../../libs/getConfigurationData.js'

const getBillingCalculation = {
	type: BillingType,
	args: {
		listId: { type: new NonNull(IntType) },
		startDate: { type: new NonNull(StringType) },
		endDate: { type: new NonNull(StringType) },
		guests: { type: new NonNull(IntType) },
		convertCurrency: { type: new NonNull(StringType) },
		startTime: { type: FloatType },
		endTime: { type: FloatType },
		isDeliveryIncluded: { type: BooleanType },
	},
	async resolve({ request }, { listId, startDate, endDate, guests, convertCurrency, startTime, endTime, isDeliveryIncluded }) {

		let dayDifference, priceForDays = 0, discount = 0, discountType, total = 0;
		let hostServiceFee = 0, guestServiceFee = 0, weeklyDiscountPercentage = 0, monthlyDiscountPercentage = 0;
		let subtotal = 0, convertedAmount = 0, convertedPriceForDays = 0, isMaxDay = false;
		let convertGuestServiceFee = 0, convertDeliveryPrice = 0, convertDiscount = 0, convertHostFee = 0, isMinDay = false;
		let guestErrorMessage, convertedMonthlyDiscountPercentage = 0, convertedWeeklyDiscountPercentage = 0;
		let bookingSpecialPricing = [], convertedAveragePrice = 0, securityDeposit = 0;
		let stayedNights = [], isSpecialPriceAssigned = false, breakPoint, convertEndDate, convertStartDate;
		let isAverage = 0, dayDiff, noticeTimeValue, totalWithoutServiceFee = 0, isBlocked;
		let deliveryFee = 0, hostServiceFeeType, hostServiceFeeValue, deliveryTotal = 0, currentDate;

		if (request && request.user) {
			const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
			if (userStatusErrorMessage) {
				return {
					status: userStatusError,
					errorMessage: userStatusErrorMessage
				};
			}
		}

		const listingData = await ListingData.findOne({
			where: {
				listId
			},
			raw: true
		});
		if (!listingData) {
			return {
				errorMessage: await showErrorMessage({ errorCode: 'invalidListId' }),
				status: 400
			};
		}
		dayDiff = dayDifferenceHelper({ startDate, endDate, startTime, endTime });
		dayDifference = dayDiff.dayDifference;
		if (listingData.maxDay && listingData.maxDay > 0) {
			if (dayDifference > listingData.maxDay) {
				isMaxDay = true;
			}
		}
		if (listingData.minDay && listingData.minDay > 0) {
			if (dayDifference < listingData.minDay) {
				isMinDay = true;
			}
		}
		noticeTimeValue = listingData.maxDaysNotice;

		try {
			if (noticeTimeValue) {
				let noticeErrorMessage, formattedCheckout, formattedBreakPoint;
				formattedCheckout = new Date(endDate);
				if (noticeTimeValue == 'unavailable') {
					noticeErrorMessage = await showErrorMessage({ errorCode: 'checkDates' });
				} else if (noticeTimeValue == '3months') {
					breakPoint = moment().add(3, 'months');
					noticeErrorMessage = await showErrorMessage({ errorCode: 'maxAllowed3Months' })
				} else if (noticeTimeValue == '6months') {
					breakPoint = moment().add(6, 'months');
					noticeErrorMessage = await showErrorMessage({ errorCode: 'maxAllowed6Months' })
				} else if (noticeTimeValue == '9months') {
					breakPoint = moment().add(9, 'months');
					noticeErrorMessage = await showErrorMessage({ errorCode: 'maxAllowed9Months' })
				} else if (noticeTimeValue == '12months') {
					breakPoint = moment().add(12, 'months');
					noticeErrorMessage = await showErrorMessage({ errorCode: 'maxAllowed12Months' })
				}
				formattedBreakPoint = new Date(breakPoint);
				if (formattedCheckout > formattedBreakPoint) {
					return {
						status: 400,
						errorMessage: noticeErrorMessage
					}
				}
			}

			if (isMaxDay) {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: 'maxDays', error: listingData.maxDay })
				};
			} else if (isMinDay) {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: 'minDays', error: listingData.minDay })
				};
			}

			convertStartDate = new Date(startDate);
			convertStartDate.setHours(0, 0, 0, 0);
			convertEndDate = new Date(endDate);
			convertEndDate.setHours(23, 59, 59, 999);

			const checkAvailableDates = await ListBlockedDates.findAll({
				where: {
					listId,
					blockedDates: {
						$between: [convertStartDate, convertEndDate]
					}
				},
				raw: true
			});
			isBlocked = checkAvailableDates && checkAvailableDates.length > 0 ? checkAvailableDates.filter(o => o.calendarStatus == "blocked") : [];
			if (isBlocked && isBlocked.length > 0) {
				return {
					status: 400,
					errorMessage: await showErrorMessage({ errorCode: 'checkDates' })
				}
			}

			const specialPricingData = await ListBlockedDates.findAll({
				where: {
					listId,
					blockedDates: {
						$between: [convertStartDate, convertEndDate]
					},
					calendarStatus: 'available'
				},
				order: [['blockedDates', 'ASC']],
				raw: true
			});

			if (startDate && endDate) {
				weeklyDiscountPercentage = listingData.weeklyDiscount > 0 ? listingData.weeklyDiscount : 0;
				monthlyDiscountPercentage = listingData.monthlyDiscount > 0 ? listingData.monthlyDiscount : 0;
				if (dayDifference > 0) {
					for (let i = 0; i < dayDifference; i++) {
						currentDate = moment(moment(startDate)).add(i, 'day');
						stayedNights.push(currentDate);
					}
					if (stayedNights && stayedNights.length > 0) {
						stayedNights.map((item) => {
							let isSpecialPricing;
							if (item) {
								let pricingRow, currentPrice;
								if (specialPricingData && specialPricingData.length > 0) {
									isSpecialPricing = specialPricingData.find(o => momentFormat(item, 'MM/DD/YYYY') == momentFormat(o.blockedDates, 'MM/DD/YYYY'));
								}
								if (isSpecialPricing && isSpecialPricing.isSpecialPrice) {
									isSpecialPriceAssigned = true;
									currentPrice = Number(isSpecialPricing.isSpecialPrice);
								} else {
									currentPrice = Number(listingData.basePrice);
								}
								pricingRow = {
									blockedDates: item,
									isSpecialPrice: currentPrice,
								};
								bookingSpecialPricing.push(pricingRow);
							}
						});
					}
				}
				priceForDays = bookingSpecialPricing.reduce(
					(total, item) => total + Number(item.isSpecialPrice), 0
				);
				const securityDepositData = await getConfigurationData({ name: ['securityDepositPreference'] });
				securityDeposit = securityDepositData.securityDepositPreference == 1 ? listingData.securityDeposit : 0
			}
			isAverage = Number(priceForDays) / Number(dayDifference);
			priceForDays = isAverage.toFixed(2) * dayDifference;
			deliveryFee = isDeliveryIncluded ? listingData.delivery : 0
			if (dayDifference >= 7) {
				if (monthlyDiscountPercentage > 0 && dayDifference >= 28) {
					discount = (Number(priceForDays) * Number(monthlyDiscountPercentage)) / 100;
					discountType = monthlyDiscountPercentage + "% " + "monthly price discount";
				} else {
					discount = (Number(priceForDays) * Number(weeklyDiscountPercentage)) / 100;
					discountType = weeklyDiscountPercentage + "% " + "weekly price discount";
				}
			}
			totalWithoutServiceFee = (priceForDays + deliveryFee) - discount;
			const serviceFees = await ServiceFees.findOne();
			const { base, rates } = await getCurrencyRates();

			if (serviceFees) {
				hostServiceFeeType = serviceFees.hostType;
				hostServiceFeeValue = serviceFees.hostValue;
				if (serviceFees.guestType === 'percentage') {
					guestServiceFee = totalWithoutServiceFee * (Number(serviceFees.guestValue) / 100);
				} else {
					guestServiceFee = convert(base, rates, serviceFees.guestValue, serviceFees.currency, convertCurrency);
				}
				if (serviceFees.hostType === 'percentage') {
					hostServiceFee = totalWithoutServiceFee * (Number(serviceFees.hostValue) / 100);
				} else {
					hostServiceFee = convert(base, rates, serviceFees.hostValue, serviceFees.currency, convertCurrency);
				}
			}

			// conversion details
			if (guestServiceFee > 0) {
				convertGuestServiceFee = guestServiceFee;
				if (serviceFees.guestType === 'percentage') {
					convertGuestServiceFee = convert(base, rates, guestServiceFee, listingData.currency, convertCurrency);
				}
			}

			if (hostServiceFee > 0) {
				convertHostFee = hostServiceFee;
				if (serviceFees.hostType === 'percentage') {
					convertHostFee = convert(base, rates, hostServiceFee, listingData.currency, convertCurrency);
				}
			}
			if (listingData.basePrice > 0) {
				convertedAmount = convert(base, rates, listingData.basePrice, listingData.currency, convertCurrency);
			}
			if (priceForDays > 0) {
				convertedPriceForDays = priceForDays;
				if (listingData.currency != convertCurrency) {
					convertedPriceForDays = convert(base, rates, priceForDays, listingData.currency, convertCurrency);
				}
			}
			if (monthlyDiscountPercentage > 0) {
				convertedMonthlyDiscountPercentage = convert(base, rates, monthlyDiscountPercentage, listingData.currency, convertCurrency);
			}
			if (weeklyDiscountPercentage > 0) {
				convertedWeeklyDiscountPercentage = convert(base, rates, weeklyDiscountPercentage, listingData.currency, convertCurrency);
			}
			if (discount > 0) {
				convertDiscount = convert(base, rates, discount, listingData.currency, convertCurrency);
			}
			if (listingData.delivery > 0) {
				convertDeliveryPrice = convert(base, rates, listingData.delivery, listingData.currency, convertCurrency);
			}
			if (isAverage > 0) {
				convertedAveragePrice = convert(base, rates, isAverage, listingData.currency, convertCurrency);
			}
			if (securityDeposit > 0) {
				securityDeposit = convert(base, rates, securityDeposit, listingData.currency, convertCurrency)
			}
			deliveryTotal = isDeliveryIncluded ? convertDeliveryPrice : 0;
			total = (convertedPriceForDays + convertGuestServiceFee + deliveryTotal) - convertDiscount + securityDeposit;
			subtotal = (convertedPriceForDays + deliveryTotal) - convertDiscount + securityDeposit;

			return {
				status: 200,
				result: {
					checkIn: dayDiff.checkIn,
					checkOut: dayDiff.checkOut,
					startTime,
					endTime,
					days: dayDifference,
					basePrice: convertedAmount.toFixed(2),
					delivery: convertDeliveryPrice.toFixed(2),
					guests: guests > 0 ? guests : guestErrorMessage,
					currency: convertCurrency,
					guestServiceFeePercentage: serviceFees.guestValue,
					hostServiceFeePercentage: serviceFees.hostValue,
					weeklyDiscountPercentage: convertedWeeklyDiscountPercentage,
					monthlyDiscountPercentage: convertedMonthlyDiscountPercentage,
					guestServiceFee: convertGuestServiceFee.toFixed(2),
					hostServiceFee: convertHostFee.toFixed(2),
					discountLabel: discountType,
					discount: convertDiscount.toFixed(2),
					subtotal: subtotal.toFixed(2),
					total: total.toFixed(2),
					availableStatus: "Available",
					averagePrice: convertedAveragePrice.toFixed(2),
					priceForDays: convertedPriceForDays.toFixed(2),
					specialPricing: bookingSpecialPricing,
					isSpecialPriceAssigned: isSpecialPriceAssigned,
					securityDeposit: securityDeposit.toFixed(2),
					hostServiceFeeType,
					hostServiceFeeValue
				},
			};

		} catch (error) {
			return {
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
				status: 400
			};
		}
	},
};

export default getBillingCalculation;