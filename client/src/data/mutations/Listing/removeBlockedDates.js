import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
import sequelize from 'sequelize';
import { ListBlockedDates } from '../../models';
import ListBlockedDatesType from '../../types/ListBlockedDatesType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const removeBlockedDates = {
    type: ListBlockedDatesType,
    args: {
        listId: { type: new NonNull(IntType) },
        blockedDates: { type: new List(StringType) },
        startTime: { type: StringType },
        endTime: { type: StringType }
    },
    async resolve({ request }, { listId, blockedDates, startTime, endTime }) {

        try {
            // Check whether user is logged in
            if (request?.user || request?.user?.admin) {
                // Collect all records of Blocked Dates except Reservation Dates
                let day, dayList;
                const isExistDate = await Promise.all(blockedDates.map(async (item, key) => {
                    day = moment.utc(item).format('YYYY-MM-DD');
                    dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);
                    const blockedDatesData = await ListBlockedDates.count({
                        where: {
                            listId,
                            reservationId: {
                                $ne: null
                            },
                            blockedDates: dayList
                        }
                    });
                    return blockedDatesData;
                }))

                if (isExistDate.includes(1)) return { status: '400' }

                let newBlockedDates = [];

                const existBlockedDates = await Promise.all(blockedDates.map(async (item, key) => {
                    day = moment(item).format('YYYY-MM-DD');
                    dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);

                    let blockedDatesFind = await ListBlockedDates.findOne({
                        attributes: ['blockedDates', 'id'],
                        where: {
                            blockedDates: dayList,
                            listId: listId,
                            reservationId: {
                                $eq: null
                            }
                        },
                        raw: true
                    })

                    if (blockedDatesFind && blockedDatesFind.id) {
                        newBlockedDates.push({
                            id: blockedDatesFind.id,
                            listId,
                            blockedDates: blockedDatesFind.blockedDates,
                            startTime: startTime || '',
                            endTime: endTime || ''
                        })
                    }
                    else {
                        newBlockedDates.push({
                            listId,
                            blockedDates: moment(item).format('YYYY-MM-DD'),
                            startTime: startTime || '',
                            endTime: endTime || ''
                        })
                    }
                }));

                if (newBlockedDates && newBlockedDates.length > 0) {
                    const createNewBlockedDates = await ListBlockedDates.bulkCreate(newBlockedDates, {
                        updateOnDuplicate: ['listId', 'blockedDates', 'startTime', 'endTime']
                    })
                }

                return {
                    status: '200'
                };
            }
        } catch (error) {
            return {
                status: "400",
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
};

export default removeBlockedDates;
