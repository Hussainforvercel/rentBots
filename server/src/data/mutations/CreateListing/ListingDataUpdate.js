import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
} from 'graphql';
import {
    Listing,
    UserHouseRules,
    ListingData,
} from '../../../data/models';
import EditListingType from '../../types/EditListingType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const ListingDataUpdate = {
    type: EditListingType,
    args: {
        id: { type: IntType },
        houseRules: { type: new List(IntType) },
        checkInStart: { type: StringType },
        checkInEnd: { type: StringType },
        minDay: { type: IntType },
        maxDay: { type: IntType },
        cancellationPolicy: { type: IntType },
        maxDaysNotice: { type: StringType },
        bookingNoticeTime: { type: StringType },
        basePrice: { type: FloatType },
        delivery: { type: FloatType },
        currency: { type: StringType },
        weeklyDiscount: { type: FloatType },
        monthlyDiscount: { type: FloatType },
        securityDeposit: { type: FloatType },
        minHours: { type: IntType },
        maxHours: { type: IntType },
        hourlyPrice: { type: FloatType },
        hourlyDiscount: { type: FloatType },
        dailyDiscount: { type: FloatType }
    },
    async resolve({ request, response }, {
        id,
        houseRules,
        checkInStart,
        checkInEnd,
        minDay,
        maxDay,
        cancellationPolicy,
        maxDaysNotice,
        bookingNoticeTime,
        basePrice,
        delivery,
        currency,
        weeklyDiscount,
        monthlyDiscount,
        securityDeposit,
        minHours,
        maxHours,
        hourlyPrice,
        hourlyDiscount,
        dailyDiscount
    }) {
        try {
            if (request.user || request.user.admin != true) {
                let where = { id: id };
                if (!request.user.admin) {
                    where = { id: id, userId: request.user.id };
                }

                // Confirm whether the Listing Id is available
                const isListingAvailable = await Listing.findOne({ where });
                let isListUpdated = false;

                if (isListingAvailable != null) {
                    // House Rules
                    if (houseRules) {
                        const removeHouseRules = await UserHouseRules.destroy({
                            where: {
                                listId: id
                            }
                        });
                        if (houseRules?.length > 0) {
                            houseRules.map(async (item, key) => {
                                let updateHouseRules = await UserHouseRules.create({
                                    listId: id,
                                    houseRulesId: item
                                })
                            });
                        }
                    }

                    // Check if record already available for this listing
                    const isListingIdAvailable = await ListingData.findOne({ where: { listId: id } });

                    if (isListingIdAvailable != null) {
                        // Update Record
                        const updateData = await ListingData.update({
                            checkInStart: checkInStart,
                            checkInEnd: checkInEnd,
                            minDay: minDay,
                            maxDay: maxDay,
                            cancellationPolicy: cancellationPolicy,
                            maxDaysNotice: maxDaysNotice,
                            bookingNoticeTime: bookingNoticeTime,
                            basePrice: basePrice,
                            delivery: delivery,
                            currency: currency,
                            weeklyDiscount,
                            monthlyDiscount,
                            securityDeposit,
                            minHours,
                            maxHours,
                            hourlyPrice,
                            hourlyDiscount,
                            dailyDiscount
                        },
                            {
                                where: {
                                    listId: id
                                }
                            });
                        isListUpdated = true;
                    }

                    if (isListUpdated) {
                        return {
                            status: 200
                        };
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'updateError' })
                        };
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default ListingDataUpdate; 