import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';

import CurrencyConverter from '../CurrencyConverter'

// External Component
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-dates/initialize';

import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import {injectIntl, FormattedMessage } from 'react-intl';
// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./DayDragCalendar.css';
// Local
import { isRTL } from '../../helpers/formatLocale';

import SaveCalendar from './SaveCalendar';
import messages from '../../locale/messages';

class DayDragCalendar extends Component {
  static propTypes = {
    change: PropTypes.func,
    formName: PropTypes.string,
    disabledDates: PropTypes.array,
    blockedDates: PropTypes.array,
  };

  static defaultProps = {
    disabledDates: [],
    blockedDates: [],
    listId: null,
    sources: []
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      from: undefined,
      to: undefined,
      dateRange: [],
      chooseRangeDate: [],
      isPrice: [],
      sources: [],
      startHour: '09:00',
      endHour: '21:00',
      showHourlySettings: false,
      reservedDates: [], // New state for reserved dates
      isLoadingReservations: false
    };
    this.isDaySelected = this.isDaySelected.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.resetCalendar = this.resetCalendar.bind(this);
    this.renderDay = this.renderDay.bind(this);
    this.resetDatePickerChange = this.resetDatePickerChange.bind(this);
    this.handleHourlyChange = this.handleHourlyChange.bind(this);
    this.toggleHourlySettings = this.toggleHourlySettings.bind(this);
    this.fetchReservations = this.fetchReservations.bind(this);
  }

  async fetchReservations() {
    const { listId } = this.props;
    
    if (!listId) {
      return;
    }

    this.setState({ isLoadingReservations: true });

    try {
      const response = await fetch(`/api/list-reservations?listId=${listId}`);
      const result = await response.json();

      if (result.success && result.reservations) {
        // Convert reservation dates to Date objects for calendar blocking
        const reservedDates = [];
        
        result.reservations.forEach(reservation => {
          if (reservation.checkIn && reservation.checkOut) {
            const startDate = new Date(reservation.checkIn);
            const endDate = new Date(reservation.checkOut);
            
            // Add all dates in the reservation range
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              reservedDates.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          } else if (reservation.checkIn) {
            // Single day reservation
            reservedDates.push(new Date(reservation.checkIn));
          }
        });

        this.setState({ 
          reservedDates,
          isLoadingReservations: false 
        });
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      this.setState({ isLoadingReservations: false });
    }
  }

  UNSAFE_componentWillMount() {
    const { blockedDates, sources, availableDatesPrices } = this.props;
    if (blockedDates != undefined) {
      this.setState({ selectedDays: blockedDates });
    }

    let sourcesValue = [];
    let sourceObject = {};

    availableDatesPrices && availableDatesPrices.map((item, key) => {
      sourceObject = {};
      sourceObject["isSpecialPrice"] = item.isSpecialPrice;
      sourceObject["blockedDates"] = item.date;
      sourceObject["startTime"] = item.startTime;
      sourceObject["endTime"] = item.endTime;
      sourcesValue.push(sourceObject);
    });
    this.setState({ sources: sourcesValue });

    // Fetch reservations when component mounts
    this.fetchReservations();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { blockedDates, sources, availableDatesPrices, listId } = nextProps;
    if (blockedDates != undefined) {
      this.setState({ selectedDays: blockedDates });
    }
    let sourcesValue = [];
    let sourceObject = {};

    availableDatesPrices && availableDatesPrices.map((item, key) => {
      sourceObject = {};
      sourceObject["isSpecialPrice"] = item.isSpecialPrice;
      sourceObject["blockedDates"] = item.date;
      sourceObject["startTime"] = item.startTime;
      sourceObject["endTime"] = item.endTime;
      sourcesValue.push(sourceObject);
    });
    this.setState({ sources: sourcesValue });

    // Fetch reservations if listId changes
    if (listId && listId !== this.props.listId) {
      this.fetchReservations();
    }
  }

  renderDay(day) {
    const { currency, baseCurrency, isAdminCurrency } = this.props;
    const { dateRange, sources, availableDatesPrices, reservedDates } = this.state;
    const date = day.getDate();
    let dateRangeValue = moment(day).format('YYYY-MM-DD');

    // Check if this day is reserved
    const isReserved = reservedDates.some(reservedDay => 
      DateUtils.isSameDay(reservedDay, day)
    );

    // If reserved, show only "RESERVED" text
    if (isReserved) {
      return (
        <div className={s.responsiveDisplay}>
          <span className={'dateFontWeight'} style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
            RESERVED
          </span>
        </div>
      );
    }

    return (
      <div className={s.responsiveDisplay}>
        <span className={'dateFontWeight'}>{date}</span>
        <div>
          {
            sources && sources.map((item, key) => {
              let dateValue = moment(item.blockedDates).format('YYYY-MM-DD');
              if (dateRangeValue == dateValue) {
                return (
                  <div className={'priceAlignment'}>
                    <CurrencyConverter
                      amount={item.isSpecialPrice}
                      from={currency}
                    />
                    <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginTop: '2px' }}>
                      {item.startTime ? "Hourly Booking" : "Day Booking"}
                    </span>
                  </div>
                );
              }
            })
          }
        </div>
      </div >
    );
  }

  // Custom function to check if a day is reserved
  isReservedDay(day) {
    const { reservedDates } = this.state;
    return reservedDates.some(reservedDay => 
      DateUtils.isSameDay(reservedDay, day)
    );
  }

  isDaySelected(day) {
    const { selectedDays } = this.state;

    if (selectedDays.length > 0) {
      return selectedDays.some(selectedDay =>
        DateUtils.isSameDay(selectedDay, day),
      );
    }
  }

  async handleDayClick(day, { start, end, selected, disabled }) {
    const { blockedDates, change, formName } = this.props;
    
    // Don't allow selection of reserved dates
    if (this.isReservedDay(day)) {
      return;
    }

    let selectedDays = blockedDates.slice();
    let startDate, endDate;
    let dateRange = [], rangeStart, rangeEnd;

    if (disabled) {
      return;
    }

    const range = DateUtils.addDayToRange(day, this.state);
    startDate = range.from;
    endDate = range.to;

    if (startDate && !endDate) {
      rangeStart = new Date(startDate);
      dateRange.push(rangeStart);
    } else if (startDate && endDate) {
      rangeStart = new Date(startDate);
      rangeEnd = new Date(endDate);

      if (!DateUtils.isSameDay(rangeStart, rangeEnd)) {
        dateRange.push(rangeStart);

        rangeStart = new Date(+rangeStart);

        while (rangeStart < endDate) {

          dateRange.push(rangeStart);
          var newDate = rangeStart.setDate(rangeStart.getDate() + 1);
          rangeStart = new Date(newDate);
        }
      } else {
        startDate = null;
        endDate = null;
        dateRange, selectedDays = [];
      }
    }
    this.setState({ selectedDays, dateRange, from: startDate, to: endDate });

    change('ListPlaceStep3', 'startDate', startDate)
    change('ListPlaceStep3', 'endDate', endDate)
  }

  resetCalendar() {
    const { change } = this.props;
    // this.setState({ dateRange: [], from: null, to: null, startDate: null, endDate: null });
    this.setState({ dateRange: [], from: null, to: null, startDate: null, endDate: null });
    change('ListPlaceStep3', 'startDate', null)
    change('ListPlaceStep3', 'endDate', null)
  }

  resetDatePickerChange() {
    const { change } = this.props;
    this.setState({ dateRange: [], from: null, to: null });
  }

  handleHourlyChange = (type, value) => {
    this.setState({ [type]: value });
    this.props.change('ListPlaceStep3', type, value);
  }

  toggleHourlySettings = () => {
    this.setState(prevState => ({
      showHourlySettings: !prevState.showHourlySettings
    }));
  }

  renderHourlySettings = () => {
    const { startHour, endHour } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div className={s.hourlySettings}>
        <h4><FormattedMessage {...messages.hourlyAvailability} /></h4>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <FormattedMessage {...messages.startTime} />
              <FormControl
                type="time"
                value={startHour}
                onChange={(e) => this.handleHourlyChange('startHour', e.target.value)}
                className={s.timeInput}
              />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <FormattedMessage {...messages.endTime} />
              <FormControl
                type="time"
                value={endHour}
                onChange={(e) => this.handleHourlyChange('endHour', e.target.value)}
                className={s.timeInput}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { selectedDays, from, to, dateRange, showHourlySettings, reservedDates, isLoadingReservations } = this.state;
    const { disabledDates, formName, listId, availableDates, locale } = this.props;
    const { availableDatesPrices } = this.props;
    const { sources } = this.state;
    const { minDay, maxDay, houseRules, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime } = this.props;
    const { delivery, basePrice, currency, weeklyDiscount, monthlyDiscount, securityDeposit } = this.props;
    const { isStartDate, isEndDate, todayLabel, setStateLoading ,isSaving, isBlocking } = this.props;
    let dateObj = new Date();

    // Combine disabled dates with reserved dates
    const allDisabledDates = [
      DateUtils.isPastDay,
      ...disabledDates,
      ...reservedDates
    ];

    const modifiers = {
      start: from,
      end: to,
      selected: selectedDays,
      selecting: dateRange,
      available: availableDates,
      reserved: reservedDates // Add reserved dates as a modifier
    };

    return (
      <Row>
        <Col lg={8} md={12} sm={12} xs={12}>
          {isLoadingReservations && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
           Loading...
            </div>
          )}
          <DayPicker
            selectedDays={[this.isDaySelected, from, { from, to }]}
            onDayClick={this.handleDayClick}
            modifiers={modifiers}
            disabledDays={allDisabledDates}
            fromMonth={dateObj}
            renderDay={this.renderDay}
            localeUtils={MomentLocaleUtils}
            todayButton={todayLabel}
            className={'BecomeCalendar'}
            locale={isRTL(locale) ? locale : 'en-US'}
            dir={isRTL(locale) ? 'rtl' : 'ltr'}
            transitionDuration={0}
          />
    
          {showHourlySettings && this.renderHourlySettings()}
        </Col>
        <Col lg={4} md={4} sm={6} xs={12}>
          <SaveCalendar
            selectedDays={dateRange}
            start={from}
            end={to}
            formName={formName}
            resetCalendar={this.resetCalendar}
            resetDatePickerChange={this.resetDatePickerChange}
            listId={listId}
            minDay={minDay}
            maxDay={maxDay}
            houseRules={houseRules}
            checkInEnd={checkInEnd}
            checkInStart={checkInStart}
            cancellationPolicy={cancellationPolicy}
            maxDaysNotice={maxDaysNotice}
            bookingNoticeTime={bookingNoticeTime}
            delivery={delivery}
            basePrice={basePrice}
            currency={currency}
            isStartDate={isStartDate}
            isEndDate={isEndDate}
            weeklyDiscount={weeklyDiscount}
            monthlyDiscount={monthlyDiscount}
            setStateLoading={setStateLoading}
            isSaving={isSaving}
            isBlocking={isBlocking}
            securityDeposit={securityDeposit}
            startHour={this.state.startHour}
            endHour={this.state.endHour}
            selectedSlotData={sources && sources.find(item => {
              const dateValue = moment(item.blockedDates).format('YYYY-MM-DD');
              const selectedDate = moment(from).format('YYYY-MM-DD');
              return dateValue === selectedDate;
            })}
            reservedDates={reservedDates}
            fetchReservations={this.fetchReservations}
          />
        </Col>
      </Row>
    );
  }
}


const selector = formValueSelector('ListPlaceStep3');
const mapState = (state) => ({
  isStartDate: selector(state, 'startDate'),
  isEndDate: selector(state, 'endDate'),
  locale: state.intl.locale,
});

const mapDispatch = {
  change
};

export default
  withStyles(s)(connect(mapState, mapDispatch)(DayDragCalendar));

