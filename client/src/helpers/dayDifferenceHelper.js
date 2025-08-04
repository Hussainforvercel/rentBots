import moment from "moment";

const dayDifferenceHelper = ({ startTime, endTime, startDate, endDate }) => {

    let momentStartDate, momentEndDate, dayDifference;
    momentStartDate = moment(startDate);
    momentEndDate = moment(endDate);
    dayDifference = momentEndDate.diff(momentStartDate, 'days');

    if (dayDifference == 1) {
        dayDifference = (Number((24 - startTime)) + Number(endTime)) <= 24 ? 1 : 2;
    } else { dayDifference += 1; }

    return dayDifference;

};

export default dayDifferenceHelper;


export async function utcDateFormat(date) {
    return moment.utc(date).format('YYYY-MM-DD');
}

export async function dateFormat(date) {
    return moment(date).format('YYYY-MM-DD')
}
