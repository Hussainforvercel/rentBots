
import fetch from 'node-fetch';
import { url } from '../../../config.js';

const getBillingDetails = async (variables) => {

    const query = `query getBillingCalculation($listId: Int!, $startDate: String!, $endDate: String!, $guests: Int!, $convertCurrency: String!, $startTime: Float, $endTime: Float, $isDeliveryIncluded: Boolean) {
          getBillingCalculation(listId: $listId, startDate: $startDate, endDate: $endDate, guests: $guests, convertCurrency: $convertCurrency, startTime: $startTime, endTime: $endTime, isDeliveryIncluded: $isDeliveryIncluded) {
            status
            errorMessage
            result {
                checkIn
                checkOut
                startTime
                endTime
                days
                basePrice
                delivery
                guests
                currency
                guestServiceFeePercentage
                hostServiceFeePercentage
                weeklyDiscountPercentage
                monthlyDiscountPercentage
                guestServiceFee
                hostServiceFee
                discountLabel
                discount
                subtotal
                total
                availableStatus
                averagePrice
                priceForDays
                specialPricing {
                  blockedDates
                  isSpecialPrice
                }
                isSpecialPriceAssigned
                securityDeposit
                hostServiceFeeType,
				hostServiceFeeValue 
            }
          }
        }`;

    const response = await new Promise((resolve, reject) => {
        fetch(url + '/graphql', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query, variables
            }),
            method: 'post',
        }).then(res => res.json())
            .then(function (body) {
                if (body) {
                    resolve(body)
                } else {
                    reject(error)
                }
            });
    });

    return response;
}

export default getBillingDetails;