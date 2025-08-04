import sequelize from "sequelize";
import moment from 'moment';
// import { ListBlockedDates } from "../data/models";
import  ListBlockedDates  from "../data/models/ListBlockedDates.js";

const isBookedDates = async ({ blockedDates, listId }) => {
    let day, dayList;
    return await Promise.all(blockedDates.map(async (item, key) => {
        day = moment.utc(item).format('YYYY-MM-DD');
        dayList = sequelize.where(sequelize.fn('DATE', sequelize.col('blockedDates')), day);
        const blockedDatesData = await ListBlockedDates.count({
            where: {
                listId,
                reservationId: { $ne: null },
                blockedDates: dayList
            }
        });
        return blockedDatesData;
    }));
}

export default isBookedDates;