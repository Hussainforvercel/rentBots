import moment from 'moment';
import sequelize from '../../data/sequelize';
import { securityDepositSearchHelper, getPayoutData } from '../../helpers/adminSearchHelpers';
import { getListingData, getReservationData, getSecurityDepositData, getUserData } from './csvHelpers';

const users = async (search) => {
    try {
        let deleteFilter = { userDeletedAt: null }, searchFilter = {};

        if (search) {
            let getDate = moment(search).format('YYYY-MM-DD');
            searchFilter = {
                $or: [
                    {
                        id: {
                            $in: [
                                sequelize.literal(`
                                      SELECT
                                        userId
                                      FROM
                                        UserProfile
                                      WHERE 
                                        firstName like "%${search}%"
                                      OR 
                                        phoneNumber like "%${search}%"
                                      OR
                                        createdAt like "%${getDate}%"
                                      `)
                            ]
                        }
                    },
                    { email: { $like: '%' + search + '%' } }
                ]
            };
        }

        const results = await getUserData({ deleteFilter, searchFilter })

        return results;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const reservations = async (search) => {
    try {
        let isRefunded = `SELECT id FROM Transaction WHERE reservationId=Reservation.id AND paymentType='cancellation'`,
            refundAmount = `SELECT refundToGuest FROM CancellationDetails WHERE reservationId=Reservation.id`,
            isPaidOut = `SELECT id FROM TransactionHistory WHERE reservationId=Reservation.id AND payoutType = 'payout' LIMIT 1`,
            payoutAmount = `SELECT payoutToHost FROM CancellationDetails WHERE reservationId=Reservation.id`;

        let paymentStateFilter = { paymentState: 'completed' }, searchFilter = {};

        if (search) {
            searchFilter = {
                $or: [
                    { confirmationCode: { $like: '%' + search + '%' } },
                    { reservationState: { $like: '%' + search + '%' } },
                    { listId: { $in: [sequelize.literal(`SELECT id FROM Listing WHERE title like "%${search}%"`)] } }
                ]
            }
        }

        const result = await getReservationData({
            isRefunded, refundAmount, isPaidOut, payoutAmount, paymentStateFilter, searchFilter
        });

        if (result[0].CancelDate == null) {
            let data = await getPayoutData(result[0].Code)
            result[0].PayoutAmount = data
            return result;
        } else {
            return result;
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

const listings = async (search) => {
    try {
        let searchFilter = {};
        if (search) {
            let getDate = moment(search).format('YYYY-MM-DD');
            searchFilter = {
                $or: [
                    { title: { $like: '%' + search + '%' } },
                    { city: { $like: '%' + search + '%' } },
                    { state: { $like: '%' + search + '%' } },
                    { country: { $like: '%' + search + '%' } },
                    { street: { $like: '%' + search + '%' } },
                    { buildingName: { $like: '%' + search + '%' } },
                    { createdAt: { $in: [sequelize.literal(`SELECT createdAt FROM Listing WHERE createdAt like "%${getDate}%"`)] } },
                    {
                        userId: {
                            $in: [
                                sequelize.literal(`
                                    SELECT 
                                        id 
                                    FROM 
                                        User AS user LEFT OUTER JOIN UserProfile AS profile 
                                    ON 
                                        user.id=profile.userId 
                                    WHERE 
                                        profile.firstName like "%${search}%" 
                                    OR 
                                        user.email like "%${search}%"
                                `)
                            ]
                        }
                    }
                ]
            }
        }

        const result = await getListingData({ searchFilter });

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const securityDeposit = async (search, filterType) => {
    try {
        let whereSearch = {}, claimFilter = {};

        if (filterType == 'claimed') claimFilter["claimStatus"] = { $in: ['approved', 'fullyRefunded'] };
        else if (filterType == 'nonClaimed') claimFilter["claimStatus"] = { $in: ['requested', 'pending'] };
        else claimFilter["claimStatus"] = { $in: ['requested', 'approved', 'fullyRefunded', 'pending'] };

        if (search) {
            whereSearch = { $or: securityDepositSearchHelper(search) }
        };

        const reservationData = await getSecurityDepositData({ whereSearch, claimFilter });

        return reservationData;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const makeandModel = async () => {
    let csvData = [
        {
            "Make": "You can add 'make item' in this column",
            "Model": "You can add 'model item' in this column"
        }
    ]
    return csvData;
}

export {
    users, reservations, listings, securityDeposit, makeandModel
};