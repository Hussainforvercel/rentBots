import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
  } from 'graphql';
  import {
    Listing,
    UserHouseRules,
    ListingData,
    ListPhotos,
    Currencies
  } from '../../../data/models';
  import EditListingType from '../../types/EditListingType';
  
  const updateListingStep3 = {
    type: EditListingType,
    args: {
      id: { type: IntType },
      carRules: { type: new List(IntType) },
      bookingNoticeTime: { type: StringType },
      checkInStart: { type: StringType },
      checkInEnd: { type: StringType },
      maxDaysNotice: { type: StringType },
      minDay: { type: IntType },
      maxDay: { type: IntType },
      minHours: { type: IntType },
      maxHours: { type: IntType },
      basePrice: { type: FloatType },
      delivery: { type: FloatType },
      currency: { type: StringType },
      weeklyDiscount: { type: FloatType },
      monthlyDiscount: { type: FloatType },
      hourlyPrice: { type: FloatType },
      hourlyDiscount: { type: FloatType },
      dailyDiscount: { type: FloatType },
      blockedDates: { type: new List(StringType) },
      bookingType: { type: new NonNull(StringType) },
      cancellationPolicy: { type: IntType },
      securityDeposit: { type: FloatType }
    },
  
    async resolve({ request, response }, {
      id,
      carRules,
      bookingNoticeTime,
      checkInStart,
      checkInEnd,
      maxDaysNotice,
      minDay,
      maxDay,
      minHours,
      maxHours,
      basePrice,
      delivery,
      currency,
      weeklyDiscount,
      monthlyDiscount,
      hourlyPrice,
      hourlyDiscount,
      dailyDiscount,
      blockedDates,
      bookingType,
      cancellationPolicy,
      securityDeposit
    }) {
      let isListUpdated = false;
  
      // Check whether user is logged in
      if (request?.user || request?.user?.admin) {
        let where = { id };
        if (!request?.user?.admin) {
          where = {
            id,
            userId: request?.user?.id
          }
        };
  
        // Confirm whether the Listing Id is available
        const isListingAvailable = await Listing.findById(id);
  
        if (isListingAvailable != null) {
          // Currency
          let getCurrenice = await Currencies.findOne({
            where: {
              isBaseCurrency: true
            }
          });
  
          let currencyValue = currency ? currency : getCurrenice?.symbol;
  
          // Update Booking Type
          if (bookingType) {
            const updateBookingType = await Listing.update({
              bookingType,
              lastUpdatedAt: new Date()
            }, {
              where
            })
          }
  
          // House Rules
          if (carRules) {
            const removeHouseRules = await UserHouseRules.destroy({
              where: {
                listId: id
              }
            });
            if (carRules?.length > 0) {
              carRules.map(async (item, key) => {
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
              bookingNoticeTime: bookingNoticeTime,
              checkInStart: checkInStart || 'Flexible',
              checkInEnd: checkInEnd || 'Flexible',
              maxDaysNotice: maxDaysNotice,
              minDay: minDay,
              maxDay: maxDay,
              minHours: minHours,
              maxHours: maxHours,
              basePrice: basePrice,
              delivery: delivery,
              currency: currencyValue,
              weeklyDiscount,
              monthlyDiscount,
              hourlyPrice,
              hourlyDiscount,
              dailyDiscount,
              cancellationPolicy,
              securityDeposit
            },
              {
                where: {
                  listId: id
                }
              });
            isListUpdated = true;
          } else {
            // Create New Record
            const createData = await ListingData.create({
              listId: id,
              bookingNoticeTime: bookingNoticeTime,
              checkInStart: checkInStart || 'Flexible',
              checkInEnd: checkInEnd || 'Flexible',
              maxDaysNotice: maxDaysNotice,
              minDay: minDay,
              maxDay: maxDay,
              minHours: minHours,
              maxHours: maxHours,
              basePrice: basePrice,
              delivery: delivery,
              currency: currencyValue,
              weeklyDiscount: weeklyDiscount,
              monthlyDiscount: monthlyDiscount,
              hourlyPrice: hourlyPrice,
              hourlyDiscount: hourlyDiscount,
              dailyDiscount: dailyDiscount,
              cancellationPolicy,
              securityDeposit
            });
  
            if (createData) {
              isListUpdated = true;
            }
          }
  
          if (isListUpdated) {
            const photosCount = await ListPhotos.count({ where: { listId: id } });
            if (photosCount > 0) {
              const updateListingStatus = await Listing.update({
                isReady: true
              }, {
                where: { id }
              });
            }
            return {
              status: 'success'
            }
          } else {
            return {
              status: 'failed'
            }
          }
        } else {
          return {
            status: 'notAvailable'
          }
        }
      } else {
        return {
          status: "notLoggedIn",
        };
      }
    },
  };
  
  export default updateListingStep3;