import moment from 'moment';

export const momentUtcHelper = date => moment.utc(date);

export const momentFormat = (date, format, type) => {
    return type ? moment(moment(date).format(format)) : moment(date).format(format);
};

export const nestedMomentFormatter = date => moment(moment(date)).format('YYYY-MM-DD');