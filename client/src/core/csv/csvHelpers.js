import { Listing, Reservation, User, UserProfile } from "../../data/models";
import sequelize from "../../data/sequelize";

const getQuery = (column, separator) => {
    return sequelize.literal(`IF(${column} IS NULL OR ${column}="", "", CONCAT(${column},${separator}))`)
}

const getUserData = async ({ deleteFilter, searchFilter }) => {
    try {
        const results = await User.findAll({
            attributes: [
                [
                    sequelize.literal(`
                    CASE WHEN profile.profileId IS NOT NULL
                        THEN profile.profileId
                    ELSE
                        '-'
                    END
                `),
                    'ID'
                ],
                [
                    sequelize.literal(`
                    CASE WHEN profile.firstName IS NOT NULL
                        THEN profile.firstName
                    ELSE
                        '-'
                    END
                `),
                    'First Name'
                ],
                ['email', 'Email'],
                [
                    sequelize.literal(`
                        CASE WHEN profile.countryCode IS NOT NULL AND profile.phoneNumber IS NOT NULL
                            THEN CONCAT(profile.countryCode, ' ', profile.phoneNumber)
                        ELSE
                            "-"
                        END
                    `),
                    'Phone Number'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN profile.createdAt IS NOT NULL
                            THEN profile.createdAt
                        ELSE
                            '-'
                        END
                    `),
                    'Created at'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN profile.dateOfBirth IS NOT NULL
                            THEN profile.dateOfBirth
                        ELSE
                            '-'
                        END
                    `),
                    'Date of Birth'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN profile.gender IS NOT NULL
                            THEN profile.gender
                        ELSE
                            '-'
                        END
                    `),
                    'Gender'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN profile.info IS NOT NULL
                            THEN profile.info
                        ELSE
                            '-'
                        END
                    `),
                    'Bio info'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN profile.location IS NOT NULL
                            THEN profile.location
                        ELSE
                            '-'
                        END
                    `),
                    'Location'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN userBanStatus=true 
                            THEN 'Prohibit'
                        ELSE 
                            'Permit'
                        END
                    `),
                    'User status'
                ]
            ],
            where: {
                $and: [
                    deleteFilter,
                    searchFilter
                ]
            },
            include: [{
                model: UserProfile,
                as: 'profile',
                attributes: []
            }],
            order: [['createdAt', 'ASC']],
            raw: true,
        });
        return results;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const getListingData = async ({ searchFilter }) => {
    try {
        const result = await Listing.findAll({
            attributes: [
                ['id', 'ID'],
                [
                    sequelize.literal(`
                        CASE WHEN title IS NOT NULL
                            THEN title
                        ELSE
                            '-'
                        END 
                    `),
                    'Title'
                ],
                [
                    sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId=Listing.userId)`),
                    'Car Owner Name'
                ],
                [
                    sequelize.literal(`(SELECT email FROM User WHERE id=Listing.userId)`),
                    'Car Owner Email'
                ],
                [
                    sequelize.fn(
                        "concat",
                        getQuery('street', '", "'),
                        getQuery('buildingName', '", "'),
                        getQuery('city', '", "'),
                        getQuery('state', '", "'),
                        getQuery('country', '", "'),
                        getQuery('zipcode', '""')
                    ),
                    'Address'
                ],
                ['city', 'City'],
                ['state', 'State'],
                ['country', 'Country'],
                ['createdAt', 'Created Date'],
                [
                    sequelize.literal(`
                        CASE WHEN (select id FROM Recommend where listId=Listing.id) IS NULL
                            THEN 'No'
                        ELSE 
                            'Yes'
                        END
                    `),
                    'Recommend'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN isPublished=true 
                            THEN 'Yes'
                        ELSE 
                            'No'
                        END
                    `),
                    'Published'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN isReady=true 
                            THEN 'Yes'
                        ELSE 
                            'No'
                        END
                    `),
                    'Ready'
                ]
            ],
            where: { $and: [searchFilter] },
            order: [['id', 'ASC']],
            raw: true,
        });
        return result;
    } catch (error) {
        console.log(error)
        return [];
    }
}

const getReservationData = async ({ isRefunded, refundAmount, isPaidOut, payoutAmount, paymentStateFilter, searchFilter }) => {
    try {
        const result = await Reservation.findAll({
            attributes: [
                ['id', 'Reservation ID'],
                ['confirmationCode', 'Code'],
                ['reservationState', 'Status'],
                ['guestServiceFee', 'Renter Service Fee'],
                ['hostServiceFee', 'Car Owner Service Fee'],
                ['checkIn', 'Trip Start'],
                ['checkOut', 'Trip End'],
                ['securityDeposit', 'Security Deposit'],
                [
                    sequelize.literal(`
                CASE 
                    WHEN (SELECT title FROM Listing WHERE id=Reservation.listId) IS NOT NULL 
                    THEN (SELECT title FROM Listing WHERE id=Reservation.listId) 
                    ELSE '-' 
                END
               `),
                    'Car Name'
                ],
                [sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId=Reservation.guestId)`), 'Renter Name'],
                [
                    sequelize.literal(`
                        CASE WHEN (SELECT phoneNumber FROM UserProfile WHERE userId=Reservation.guestId) IS NOT NULL
                        THEN (
                            SELECT CONCAT(
                                (SELECT countryCode FROM UserProfile WHERE userId=Reservation.guestId),
                                " ",
                                (SELECT phoneNumber FROM UserProfile WHERE userId=Reservation.guestId)
                            ))
                            ELSE
                                "-"
                            END
                    `),
                    'Renter Phone Number'
                ],
                [sequelize.literal(`(SELECT email FROM User WHERE id=Reservation.guestId)`), 'Renter Email'],
                [sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId=Reservation.hostId)`), 'Car Owner Name'],
                [
                    sequelize.literal(`
                    CASE WHEN (SELECT phoneNumber FROM UserProfile WHERE userId=Reservation.hostId) IS NOT NULL
                    THEN (
                        SELECT CONCAT(
                            (SELECT countryCode FROM UserProfile WHERE userId=Reservation.hostId),
                            " ",
                            (SELECT phoneNumber FROM UserProfile WHERE userId=Reservation.hostId)
                        ))
                        ELSE 
                            "-"
                        END
                    `),
                    'Car Owner Phone Number'
                ],
                [sequelize.literal(`(SELECT email FROM User WHERE id=Reservation.hostId)`), 'Car Owner Email'],
                [
                    sequelize.literal(`
                    CASE
                        WHEN (SELECT createdAt FROM CancellationDetails WHERE reservationId=Reservation.id) IS NOT NULL
                        THEN (SELECT createdAt FROM CancellationDetails WHERE reservationId=Reservation.id)
                        ELSE '-'
                    END
                    `),
                    'CancelDate'
                ],
                [
                    sequelize.literal(`
                    CASE
                        WHEN (SELECT refundToGuest FROM CancellationDetails WHERE reservationId=Reservation.id) IS NOT NULL
                        THEN (SELECT refundToGuest FROM CancellationDetails WHERE reservationId=Reservation.id)
                        ELSE '-'
                    END
                    `),
                    'RefundAmount'
                ],
                [
                    sequelize.literal(`
                    CASE
                        WHEN (SELECT payoutToHost FROM CancellationDetails WHERE reservationId=Reservation.id) IS NOT NULL
                        THEN (SELECT payoutToHost FROM CancellationDetails WHERE reservationId=Reservation.id)
                        ELSE '-'
                    END
                    `),
                    'PayoutAmount'
                ],
                [
                    sequelize.literal(`
                        CASE WHEN reservationState='expired' OR reservationState='declined'
                            THEN IF((${isRefunded}) IS NULL,'Proceed Refund','Completed')
                        ELSE 
                            CASE WHEN reservationState='cancelled'
                                THEN IF((${isRefunded}) IS NULL, (IF((${refundAmount}) > 0,'Proceed Refund','Not Eligible')),'Completed')
                            ELSE
                                'Not Eligible'
                            END
                        END
                    `),
                    'Refund to Renter'
                ],
                ['currency', 'Currency'],
                [sequelize.literal(`total+guestServiceFee`), 'Sub Total'],
                [
                    sequelize.literal(`
                        CASE WHEN (
                            SELECT 
                                id 
                            FROM 
                                Payout AS P 
                            WHERE 
                                userId=Reservation.hostId 
                            AND 
                                (
                                    (P.default=true AND Reservation.payoutId IS NULL) 
                                    OR 
                                    (id=Reservation.payoutId AND id=Reservation.payoutId AND Reservation.payoutId IS NOT NULL)
                                )
                        ) is NULL
                            THEN "No Payout method"
                        ELSE 
                            CASE WHEN reservationState='expired' OR reservationState='declined'
                                THEN "Closed"
                            ELSE
                                CASE WHEN reservationState='cancelled'
                                    THEN IF((${isPaidOut}) IS NULL, (IF((${payoutAmount}) > 0,'Ready To Pay','Closed')),'Completed')
                                ELSE
                                    IF((${isPaidOut}) IS NULL, IF((DATEDIFF(Reservation.checkIn, NOW()) + 1) < 0,'Ready To Pay','Pending'), 'Completed')
                                END
                            END
                        END
                    `),
                    'Payout'
                ],
            ],
            where: {
                $and: [
                    paymentStateFilter,
                    searchFilter
                ]
            },
            order: [['createdAt', 'DESC']],
            raw: true,
        });
        return result;
    } catch (error) {
        console.log(error)
        return []
    }
}

const getSecurityDepositData = async ({ whereSearch, claimFilter }) => {
    try {
        const reservationData = await Reservation.findAll({
            attributes: [
                ['id', 'Booking ID'],
                [sequelize.literal(`(SELECT email FROM User WHERE id = Reservation.guestId)`), 'Renter Email'],
                [sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId = Reservation.guestId)`), 'Renter Name'],
                [sequelize.literal(`(SELECT email FROM User WHERE id = Reservation.hostId)`), 'Owner Email'],
                [sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId = Reservation.hostId)`), 'Owner Name'],
                ['currency', 'Currency'],
                ['securityDeposit', 'Security Deposit amount'],
                ['claimAmount', 'Claim amount requested by owner'],
                ['claimPayout', 'Security deposit amount Claimed by Owner'],
                ['claimRefund', 'Security deposit refunded to the Renter'],
                [
                    sequelize.literal(`
                        CASE WHEN claimStatus='pending'  
                            THEN 'Proceed To Refund'
                        ELSE 
                          CASE WHEN claimStatus='requested'  
                            THEN 'Proceed To Refund'
                          ELSE 
                            CASE WHEN claimStatus='approved'  
                             THEN 'Claimed'
                            ELSE
                               'Refunded'
                            END
                          END
                        END
                    `),
                    'status'
                ],
            ],
            where: {
                paymentState: 'completed',
                securityDeposit: { $gt: 0 },
                ...whereSearch,
                ...claimFilter
            },
            raw: true
        });
        return reservationData;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export {
    getUserData,
    getListingData,
    getReservationData,
    getSecurityDepositData
}