import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';

import { checkAvailability } from '../../../actions/checkAvailability';
import { getSpecialPricingData } from '../../../actions/Listing/getSpecialPricingData';
import messages from '../../../locale/messages';
import { isRTL } from '../../../helpers/formatLocale';

// Helper function to check if a date is reserved
function isDateReserved(day, reservedSlots = [], isSingleDate = false) {
  // If isSingleDate is true, block any day with any reservation
  if (isSingleDate) {
    return reservedSlots.some(slot => {
      const start = moment(slot.checkIn).startOf('day');
      const end = moment(slot.checkOut).startOf('day');
      return moment(day).isBetween(start, end, 'day', '[]');
    });
  }
  // If isSingleDate is false, block only days with a daily reservation (isHourly === false)
  return reservedSlots.some(slot => {
    if (!slot.isHourly) {
      const start = moment(slot.checkIn).startOf('day');
      const end = moment(slot.checkOut).startOf('day');
      return moment(day).isBetween(start, end, 'day', '[]');
    }
    return false;
  });
}

class DateRange extends React.Component {
  static propTypes = {
    isSingleDate: PropTypes.bool,
    minimumNights: PropTypes.number.isRequired,
    maximumNights: PropTypes.number.isRequired,
    checkAvailability: PropTypes.func.isRequired,
    blockedDates: PropTypes.array.isRequired,
    listId: PropTypes.number.isRequired,
    formName: PropTypes.string.isRequired,
    maxDaysNotice: PropTypes.string.isRequired,
    formatMessage: PropTypes.func,
    reservedSlots: PropTypes.array,
  };

  static defaultProps = {
    blockedDates: [],
    maxDaysNotice: 'unavailable',
    isSingleDate: false,
    reservedSlots: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      focused: false,
      startDate: null,
      endDate: null,
      blockedDatesSet: new Set(),
    };
  }

  componentDidMount() {
    this.initDatesAndBlocked(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.initDatesAndBlocked(nextProps);
  }

  initDatesAndBlocked = (props) => {
    const {
      bookingStartDate,
      bookingEndDate,
      contactStartDate,
      contactEndDate,
      formName,
      blockedDates,
    } = props;

    const blockedDatesSet = new Set();
    blockedDates.forEach((day) => {
      if (day.calendarStatus !== 'available') {
        blockedDatesSet.add(moment(day.blockedDates).utc().format('YYYY-MM-DD'));
      }
    });

    let startDate = null;
    let endDate = null;

    if (formName === 'BookingForm') {
      startDate = bookingStartDate ? moment(bookingStartDate) : null;
      endDate = bookingEndDate && moment(bookingEndDate).isSameOrAfter(startDate) ? moment(bookingEndDate) : null;
    }

    if (formName === 'ContactHostForm') {
      startDate = contactStartDate ? moment(contactStartDate) : null;
      endDate = contactEndDate && moment(contactEndDate).isSameOrAfter(startDate) ? moment(contactEndDate) : null;
    }

    this.setState({ startDate, endDate, blockedDatesSet });
  };

  onDatesChange = async ({ startDate, endDate }) => {
    const {
      listId,
      formName,
      change,
      getSpecialPricingData,
      checkAvailability,
      maximumNights,
    } = this.props;

    this.setState({ startDate, endDate });

    await change(formName, 'startDate', startDate);
    await change(formName, 'endDate', endDate);
    await change(formName, 'startTime', '');
    await change(formName, 'endTime', '');

    if (startDate && endDate) {
      await getSpecialPricingData(
        listId,
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD')
      );
      await checkAvailability(
        listId,
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
        maximumNights
      );
    }
  };

  onSingleDateChange = async (date) => {
    const { formName, change } = this.props;
    this.setState({ startDate: date });
    await change(formName, 'startDate', date);
  };

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };

  onSingleFocusChange = ({ focused }) => {
    this.setState({ focused });
  };

  isDayBlocked = (day) => {
    const { blockedDatesSet } = this.state;
    const { reservedSlots, isSingleDate } = this.props;
    const dateStr = moment(day).format('YYYY-MM-DD');
    const blocked = blockedDatesSet.has(dateStr);
    const reserved = isDateReserved(day, reservedSlots, isSingleDate);
    // console.log('isDayBlocked', dateStr, { blocked, reserved });
    return blocked || reserved;
  };

  isOutsideRange = (day) => {
    const today = moment().startOf('day');
    if (day.isBefore(today, 'day')) return true; // Block all past dates

    const { maxDaysNotice } = this.props;
    if (maxDaysNotice === 'unavailable') return false;

    let limitDate;
    switch (maxDaysNotice) {
      case '3months':
        limitDate = today.clone().add(3, 'months');
        break;
      case '6months':
        limitDate = today.clone().add(6, 'months');
        break;
      case '9months':
        limitDate = today.clone().add(9, 'months');
        break;
      case '12months':
        limitDate = today.clone().add(12, 'months');
        break;
      default:
        return false;
    }

    return day.isAfter(limitDate, 'day');
  };

  render() {
    const { startDate, endDate, focusedInput, focused } = this.state;
    const { formatMessage } = this.props.intl;
    const { minimumNights, locale, isSingleDate } = this.props;

    return (
      <div>
        {isSingleDate ? (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDatesChange={this.onDatesChange}
            focusedInput={focusedInput}
            onFocusChange={this.onFocusChange}
            numberOfMonths={1}
            startDatePlaceholderText={formatMessage(messages.dateStart)}
            endDatePlaceholderText={formatMessage(messages.dateEnd)}
            minimumNights={minimumNights > 0 ? minimumNights - 1 : 0}
            isDayBlocked={this.isDayBlocked}
            isOutsideRange={this.isOutsideRange}
            hideKeyboardShortcutsPanel
            readOnly
            anchorDirection={isRTL(locale) ? 'right' : 'left'}
            isRTL={isRTL(locale)}
          />
        ) : (

          <SingleDatePicker
            date={startDate}
            onDateChange={this.onSingleDateChange}
            focused={focused}
            onFocusChange={this.onSingleFocusChange}
            id="single_date_picker"
            numberOfMonths={1}
            placeholder={formatMessage(messages.checkIn)}
            isDayBlocked={this.isDayBlocked}
            isOutsideRange={this.isOutsideRange}
            hideKeyboardShortcutsPanel
            readOnly
            anchorDirection={isRTL(locale) ? 'right' : 'left'}
            isRTL={isRTL(locale)}
          />
        )}
      </div>
    );
  }
}

const bookingFormSelector = formValueSelector('BookingForm');
const contactFormSelector = formValueSelector('ContactHostForm');

const mapState = (state) => ({
  bookingStartDate: bookingFormSelector(state, 'startDate'),
  bookingEndDate: bookingFormSelector(state, 'endDate'),
  contactStartDate: contactFormSelector(state, 'startDate'),
  contactEndDate: contactFormSelector(state, 'endDate'),
  locale: state.intl.locale,
});

const mapDispatch = {
  checkAvailability,
  change,
  getSpecialPricingData,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(DateRange)));
