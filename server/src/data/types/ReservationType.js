import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType,
  GraphQLList as List,
} from "graphql";

// Models
// import {
//   Listing,
//   UserProfile,
//   Threads,
//   Payout,
//   TransactionHistory,
//   Transaction,
//   CancellationDetails,
//   User,
//   ThreadItems,
//   ClaimImages,
//   Country
// } from "../models";
// Type
import Listing from '../../data/models/Listing.js';
import UserProfile from '../../data/models/UserProfile.js';
import Threads from '../../data/models/Threads.js';
import Payout from '../../data/models/Payout.js';
import TransactionHistory from '../../data/models/TransactionHistory.js';
import Transaction from '../../data/models/Transaction.js';
import CancellationDetails from '../../data/models/CancellationDetails.js';
import User from '../../data/models/User.js';
import ThreadItems from '../../data/models/ThreadItems.js';
import ClaimImages from '../../data/models/ClaimImages.js';
import Country from '../../data/models/Country.js';
import ThreadsType from "./ThreadsType.js";
import ShowListingType from "./ShowListingType.js";
import ProfileType from "./ProfileType.js";
import PayoutType from "./PayoutType.js";
import TransactionHistoryType from "./TransactionHistoryType.js";
import TransactionType from "./TransactionType.js";
import CancellationDetailsType from "./CancellationDetailsType.js";
import UserType from "./UserType.js";
import ThreadItemsType from "./ThreadItemsType.js";
import dayDifferenceHelper from "../../helpers/dayDifferenceHelper.js";

const ReservationType = new ObjectType({
  name: "Reservation",
  fields: {
    id: {
      type: IntType,
    },
    listId: {
      type: IntType,
    },
    days: {
      type: IntType,
      async resolve(reser) {
        let totalDays = 0;
        if (
          reser.checkIn != null &&
          reser.checkOut != null &&
          reser.startTime != null &&
          reser.endTime != null
        ) {
          totalDays = await dayDifferenceHelper({
            startDate: reser.checkIn,
            endDate: reser.checkOut,
            startTime: reser.startTime,
            endTime: reser.endTime,
          });
        }
        return await totalDays.dayDifference;
      },
    },
    listTitle: {
      type: StringType,
    },
    listData: {
      type: ShowListingType,
      resolve(reservation) {
        return Listing.findOne({
          where: {
            id: reservation.listId,
          },
        });
      },
    },
    hostId: {
      type: StringType,
    },
    hostPayout: {
      type: PayoutType,
      resolve(reservation) {
        if (reservation.payoutId != null && reservation.payoutId > 0) {
          return Payout.findOne({
            where: {
              userId: reservation.hostId,
              id: reservation.payoutId,
            },
          });
        } else {
          return Payout.findOne({
            where: {
              userId: reservation.hostId,
              default: true,
            },
          });
        }
      },
    },
    hostTransaction: {
      type: TransactionHistoryType,
      resolve(reservation) {
        return TransactionHistory.findOne({
          where: {
            reservationId: reservation.id,
          },
        });
      },
    },
    hostData: {
      type: ProfileType,
      resolve(reservation) {
        return UserProfile.findOne({
          where: { userId: reservation.hostId },
        });
      },
    },
    guestId: {
      type: StringType,
    },
    guestData: {
      type: ProfileType,
      resolve(reservation) {
        return UserProfile.findOne({
          where: { userId: reservation.guestId },
        });
      },
    },
    transaction: {
      type: TransactionType,
      resolve(reservation) {
        return Transaction.findOne({
          where: { reservationId: reservation.id, paymentType: "booking" },
        });
      },
    },
    refundStatus: {
      type: TransactionType,
      resolve(reservation) {
        return Transaction.findOne({
          where: { reservationId: reservation.id, paymentType: "cancellation" },
        });
      },
    },
    guestUser: {
      type: UserType,
      resolve(reservation) {
        return User.findOne({
          where: { Id: reservation.guestId },
        });
      },
    },
    hostUser: {
      type: UserType,
      resolve(reservation) {
        return User.findOne({
          where: { Id: reservation.hostId },
        });
      },
    },
    checkIn: {
      type: StringType,
    },
    checkOut: {
      type: StringType,
    },
    guests: {
      type: IntType,
    },
    message: {
      type: StringType,
    },
    basePrice: {
      type: FloatType,
    },
    isHourly: {
      type: BooleanType,
      resolve(reservation) {
        return reservation.isHourly;
      }
    },
    megasoftVoucher: {
      type: StringType,
      resolve(reservation) {
        return reservation.megasoftVoucher;
      }
    },
    delivery: {
      type: FloatType,
    },
    currency: {
      type: StringType,
    },
    discount: {
      type: FloatType,
    },
    discountType: {
      type: StringType,
    },
    guestServiceFee: {
      type: FloatType,
    },
    hostServiceFee: {
      type: FloatType,
    },
    total: {
      type: FloatType,
      resolve: (reservation) =>
        (Number(reservation.total) || 0) +
        (Number(reservation.securityDeposit) || 0),
    },
    totalWithGuestServiceFee: {
      type: FloatType,
      resolve(reser) {
        return (
          (Number(reser.total) || 0) +
          (Number(reser.guestServiceFee) || 0) +
          (Number(reser.securityDeposit) || 0)
        );
      },
    },
    totalWithoutSecurityFee: {
      type: FloatType,
      resolve(reser) {
        return Number(reser.total) || 0;
      },
    },
    confirmationCode: {
      type: IntType,
    },
    reservationState: {
      type: StringType,
    },
    paymentState: {
      type: StringType,
    },
    payoutId: {
      type: IntType,
    },
    paymentMethodId: {
      type: IntType,
    },
    messageData: {
      type: ThreadsType,
      resolve(reservation) {
        return Threads.findOne({
          where: {
            listId: reservation.listId,
            $or: [
              {
                host: reservation.guestId,
              },
              {
                guest: reservation.guestId,
              },
            ],
          },
        });
      },
    },
    cancellationDetails: {
      type: CancellationDetailsType,
      resolve(reservation) {
        return CancellationDetails.findOne({
          where: {
            reservationId: reservation.id,
          },
        });
      },
    },
    createdAt: {
      type: StringType,
    },
    updatedAt: {
      type: StringType,
    },
    count: {
      type: IntType,
    },
    status: {
      type: StringType,
    },
    paymentMethodId: {
      type: IntType,
    },
    errorMessage: { type: StringType },
    cardToken: { type: StringType },
    threadData: {
      type: ThreadItemsType,
      resolve(reservation) {
        return ThreadItems.findOne({
          where: {
            reservationId: reservation.id,
          },
        });
      },
    },
    cancellationPolicy: {
      type: IntType,
    },

    isSpecialPriceAverage: {
      type: FloatType,
    },

    dayDifference: {
      type: FloatType,
    },

    startTime: {
      type: FloatType,
    },
    endTime: {
      type: FloatType,
    },
    licenseNumber: {
      type: StringType,
    },
    firstName: {
      type: StringType,
    },
    middleName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    countryCode: {
      type: StringType,
    },
    countryLabel: {
      type: StringType,
      async resolve(listSettings) {
        if (listSettings && listSettings.countryCode) {
          let foundSetting = await Country.findOne({
            attributes: ["countryName"],
            where: {
              countryCode: listSettings.countryCode,
            },
            raw: true,
          });

          return await foundSetting.countryName;
        }
      },
    },
    paymentIntentId: {
      type: StringType,
    },

    securityDeposit: {
      type: FloatType,
    },
    claimStatus: {
      type: StringType,
    },
    claimAmount: {
      type: FloatType,
    },
    claimPayout: {
      type: FloatType,
    },
    claimRefund: {
      type: FloatType,
    },
    claimReason: {
      type: StringType,
    },
    claimImages: {
      type: new List(StringType),
      async resolve(reservation) {
        const claimImages = await ClaimImages.findAll({
          where: { reservationId: reservation.id },
          raw: true,
        });
        return claimImages.map((item) => item.image);
      },
    },
    claimRefundedAt: {
      type: StringType,
      async resolve(reservation) {
        const threadItems = await ThreadItems.findOne({
          attributes: ["createdAt"],
          where: { reservationId: reservation.id, type: "claimRefunded" },
          raw: true,
        });
        return threadItems && threadItems.createdAt;
      },
    },
    actualEarnings: {
      type: FloatType,
      async resolve(reservation) {
        let actualEarnings = 0;
        if (reservation.reservationState == "completed") {
          actualEarnings = reservation.total - reservation.hostServiceFee;
        }
        if (reservation.reservationState == "cancelled") {
          const cancelData = await CancellationDetails.findOne({
            attributes: ["payoutToHost", "currency"],
            where: {
              reservationId: reservation.id,
            },
          });
          if (
            cancelData &&
            cancelData.payoutToHost &&
            cancelData.payoutToHost > 0
          )
            actualEarnings = cancelData.payoutToHost;
        }
        return actualEarnings;
      },
    },
    isClaimCancelStatus: {
      type: BooleanType,
    },
    hostServiceFeeType: {
      type: StringType,
    },
    hostServiceFeeValue: {
      type: FloatType,
    },
    bookingType: { type: StringType },
  },
});

export default ReservationType;
