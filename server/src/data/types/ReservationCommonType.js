import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
} from 'graphql';
// Models
import ReservationType from './ReservationType.js';

const ReservationCommonTypes = new ObjectType({
    name: 'Reservationlist',
    fields: {
        results: {
            type: ReservationType
        },
        status: {
            type: IntType
        },
        errorMessage: {
            type: StringType
        },
        convertedBasePrice: {
            type: FloatType
        },
        convertedIsSpecialAverage: {
            type: FloatType
        },
        convertedTotalDaysAmount: {
            type: FloatType
        },
        convertedGuestServicefee: {
            type: FloatType
        },
        convertedHostServiceFee: {
            type: FloatType
        },
        convertTotalWithGuestServiceFee: {
            type: FloatType,
            resolve: converted => Number(converted.convertTotalWithGuestServiceFee) + Number(converted.convertedSecurityDeposit)
        },
        convertedDeliveryPrice: {
            type: FloatType
        },
        convertedDiscount: {
            type: FloatType
        },
        convertedTotalWithHostServiceFee: {
            type: FloatType
        },
        convertedSecurityDeposit: {
            type: FloatType
        },
        convertTotalWithoutSecurityDeposit: {
            type: FloatType,
            resolve: converted => Number(converted.convertTotalWithGuestServiceFee)
        },
        convertedClaimRefund: {
            type: FloatType
        },
        convertedClaimAmount: {
            type: FloatType
        },
        convertedClaimPayout: {
            type: FloatType
        },
        actualEarnings: {
            type: FloatType
        },
        convertedClaimPaidAmount:{
            type: FloatType
        }
    }
});

export default ReservationCommonTypes;
