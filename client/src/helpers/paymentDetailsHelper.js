import dayDifferenceHelper from "./dayDifferenceHelper";

const paymentDetailsHelper = ({
    reservationData, startTime, endTime, startDate, endDate,
    basePrice, monthlyDiscount, weeklyDiscount, userType
}) => {

        let claimStatus, securityDeposit, claimAmount, claimPayout, dayDifference, priceForDays = 0;
        let hostServiceFee, guestServiceFee, isSpecialPricingAssinged, isAverage, isDayTotal, isDiscount;
        let isDiscountType, isDelivery, discount = 0, discountType, totalWithoutServiceFee = 0, total = 0;
        let hostEarnings = 0;

        guestServiceFee = reservationData?.guestServiceFee || 0;
        hostServiceFee = reservationData?.hostServiceFee || 0;
        isSpecialPricingAssinged = reservationData?.bookingSpecialPricing?.length > 0 ? true : false;

        if (reservationData) {
            claimStatus = reservationData?.claimStatus;
            securityDeposit = reservationData?.securityDeposit
            claimAmount = reservationData?.claimAmount;
            claimPayout = reservationData?.claimPayout;
        };

        if (startDate && endDate) {
            dayDifference = dayDifferenceHelper({ startTime, endTime, startDate, endDate });
            if (dayDifference > 0) {
                if (isSpecialPricingAssinged) {
                    reservationData?.bookingSpecialPricing.length > 0 && reservationData?.bookingSpecialPricing?.map((item) => {
                        priceForDays = priceForDays + Number(item.isSpecialPrice);
                    });
                } else priceForDays = Number(basePrice) * Number(dayDifference);
            }
        };

        isAverage = Number(priceForDays) / Number(dayDifference);
        isDayTotal = isAverage.toFixed(2) * dayDifference;
        priceForDays = isDayTotal;
        isDiscount = reservationData?.discount;
        isDiscountType = reservationData?.discountType;
        isDelivery = reservationData?.delivery;

        if (dayDifference >= 7) {
            if (monthlyDiscount > 0 && dayDifference >= 28) {
                discount = isDiscount;
                discountType = isDiscountType;
            } else {
                if (weeklyDiscount > 0) {
                    discount = isDiscount;
                    discountType = isDiscountType;
                }
            }
        };

        totalWithoutServiceFee = (priceForDays + isDelivery) - discount;
        if (userType === 'owner') {
            total = (priceForDays + isDelivery) - discount;
        } else {
            total = (Number(priceForDays) + Number(guestServiceFee) + Number(isDelivery) + Number(securityDeposit)) - discount;
        };
        hostEarnings = total - hostServiceFee;

        return {
            guestServiceFee, hostServiceFee, isSpecialPricingAssinged, priceForDays, dayDifference,
            claimStatus, securityDeposit, claimAmount, claimPayout, isDelivery, discount, total,
            isDayTotal, isDiscount, isDiscountType, isAverage, discountType, totalWithoutServiceFee,
            hostEarnings

        };
};

export default paymentDetailsHelper;