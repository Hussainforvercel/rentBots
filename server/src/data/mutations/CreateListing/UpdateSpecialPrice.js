import {
	GraphQLList as List,
	GraphQLString as StringType,
	GraphQLInt as IntType,
	GraphQLNonNull as NonNull,
	GraphQLFloat as FloatType,
} from 'graphql';
import sequelize from 'sequelize';
// import { Listing, ListBlockedDates } from '../../../data/models';
import Listing from '../../models/Listing.js';
import ListBlockedDates from '../../models/ListBlockedDates.js';
import ListBlockedDatesResponseType from '../../types/ListBlockedDatesType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import { momentFormat } from '../../../helpers/momentHelper.js';
import isBookedDates from '../../../helpers/isBookedDates.js';

const UpdateSpecialPrice = {
	type: ListBlockedDatesResponseType,
	args: {
		listId: { type: new NonNull(IntType) },
		blockedDates: { type: new List(StringType) },
		calendarStatus: { type: StringType },
		isSpecialPrice: { type: FloatType }
	},
	async resolve({ request, response }, {
		listId,
		blockedDates,
		calendarStatus,
		isSpecialPrice
	}) {

		try {
			// Check whether user is logged in
			if (request.user || request.user.admin) {

				const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
				if (userStatusErrorMessage) {
					return {
						status: userStatusError,
						errorMessage: userStatusErrorMessage
					};
				}

				let where = { listId };
				if (!request.user.admin) {
					where = {
						listId,
						userId: request.user.id
					}
				};

				// Confirm whether the Listing Id is available
				const isListingAvailable = await Listing.findById(listId);
				if (isListingAvailable) {
					if (blockedDates) {
						let day, itemValue;

						const isExistDate = await isBookedDates({ blockedDates, listId });
						if (isExistDate.includes(1)) {
							return {
								status: 400,
								errorMessage: await showErrorMessage({ errorCode: 'updateBlockedDates' })
							}
						}

						await Promise.all(blockedDates.map(async (item, key) => {
							day = momentFormat(item, 'YYYY-MM-DD');

							let dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);
							let blockedDatesFind = await ListBlockedDates.findAll({
								where: {
									blockedDates: dayList,
									listId: listId
								},
								raw: true
							})

							if (blockedDatesFind && blockedDatesFind.length > 0) {
								itemValue = item;
								await Promise.all(blockedDatesFind.map(async (value, keys) => {
									if ((isSpecialPrice && calendarStatus == 'available') || (!isSpecialPrice && calendarStatus == 'blocked')) {
										const updateDates = await ListBlockedDates.update({
											listId,
											blockedDates: value.blockedDates,
											isSpecialPrice: isSpecialPrice,
											calendarStatus: calendarStatus,
										},
											{
												where: {
													listId,
													blockedDates: value.blockedDates
												}
											});
									} else if (!isSpecialPrice && calendarStatus != 'blocked') {
										const removeBlockedDates = await ListBlockedDates.destroy({
											where: {
												listId,
												blockedDates: value.blockedDates
											}
										});
									}
								}));
							}

							if (((calendarStatus == 'blocked') || (calendarStatus == 'available' && isSpecialPrice)) && blockedDatesFind.length == 0) {
								let updateBlockedDates = await ListBlockedDates.findOrCreate({
									where: {
										listId,
										blockedDates: item,
										calendarStatus: calendarStatus,
										isSpecialPrice: isSpecialPrice,
									},
									defaults: {
										//properties you want on create
										listId,
										blockedDates: item,
										calendarStatus: calendarStatus,
										isSpecialPrice: isSpecialPrice,
									}
								});
							}
						}));

						const listBlockedData = await ListBlockedDates.findAll({
							where: {
								listId
							},
							raw: true
						});

						return {
							results: listBlockedData,
							status: 200
						}
					} else {
						return {
							status: 400,
							errorMessage: await showErrorMessage({ errorCode: 'selectDates' })
						}
					}
				} else {
					return {
						status: 400,
						errorMessage: await showErrorMessage({ errorCode: 'sendCorrectListId' })
					}
				}
			} else {
				return {
					status: 500,
					errorMessage: await showErrorMessage({ errorCode: 'checkLoggedUser' })
				}
			}
		} catch (error) {
			return {
				status: 400,
				errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
			};
		}
	},
};

export default UpdateSpecialPrice;
