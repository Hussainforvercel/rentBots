import moment from 'moment';
import { startTimeData } from "./formatting.js";  // This is the correct import
import { momentFormat } from './momentHelper.js'


const dayDifferenceHelper = ({ startDate, endDate, startTime, endTime }) => {

    let momentStartTime, momentEndTime, momentStartDate, momentEndDate, dayDifference, checkIn, checkOut;
    momentStartDate = moment(startDate);
    momentEndDate = moment(endDate);
    dayDifference = momentEndDate.diff(momentStartDate, 'days');

    if (dayDifference == 1) {
        dayDifference = (Number((24 - startTime)) + Number(endTime)) <= 24 ? 1 : 2;
    } else { dayDifference += 1; }

    //DB datas.
    momentStartDate = momentFormat(startDate, 'YYYY-MM-DD');
    momentEndDate = momentFormat(endDate, 'YYYY-MM-DD');

    return {
        dayDifference,
        checkIn: momentStartDate,
        checkOut: momentEndDate
    };
};

export default dayDifferenceHelper;


export async function utcDateFormat(date) {
    return moment.utc(date).format('YYYY-MM-DD');
}

export async function dateFormat(date) {
    return moment(date).format('YYYY-MM-DD')
}