import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// Redux
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';
// Compose
import { graphql, gql, compose } from 'react-apollo';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
import { DateUtils } from 'react-day-picker';
import {
  Button,
  FormGroup,
  Col,
  FormControl,
  Row,
} from 'react-bootstrap';
import Loader from '../Loader';
import AvailableDates from './AvailableDates';
import DateRange from './DateRange';
import messages from '../../locale/messages';
import { getListingDataStep3 } from '../../actions/getListingDataStep3';
import { getListBlockedDates } from '../../actions/Listing/getListBlockedDates';
import showToaster from '../../helpers/toasterMessages/showToaster';
//Image
import closeIcon from '/public/SiteIcons/saveCalenderClose.svg';
import c from './SaveCalendar.css';
import cs from '../commonStyle.css';
// Style
import s from '!isomorphic-style-loader!css-loader!./DayDragCalendar.css';
import { reduxForm } from 'redux-form';

class SaveCalendar extends Component {

  static propTypes = {
    change: PropTypes.func,
    formName: PropTypes.string,
    selectedDays: PropTypes.array,
    start: PropTypes.any,
    end: PropTypes.any
  };

  static defaultProps = {
    selectedDays: [],
    start: undefined,
    end: undefined,
    formName: 'ListPlaceStep3',
    formNameValue: 'CalendarPrice',
    isCurrentStatus: 2,
  };

  constructor(props) {
    super(props);
    this.state = {
      dateRange: [],
      isLoading: false,
      isCurrentStatus: 2,
      startHour: props.selectedSlotData?.startTime || '',
      endHour: props.selectedSlotData?.endTime || '',
      showHourlySettings: false,
      specialPrice: props.selectedSlotData?.isSpecialPrice || props.basePrice
    };
    this.chooseDates = this.chooseDates.bind(this);
    this.handleHourlyChange = this.handleHourlyChange.bind(this);
    this.toggleHourlySettings = this.toggleHourlySettings.bind(this);
  }

  componentDidMount() {
    this.setState({ isCurrentStatus: 2 });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { start, end, selectedSlotData } = nextProps;
    let dateRange = [], rangeStart, rangeEnd;
    if (start && !end) {
      rangeStart = new Date(start);
      dateRange.push(rangeStart);
    } else if (start && end) {
      rangeStart = new Date(start);
      rangeEnd = new Date(end);
      if (!DateUtils.isSameDay(rangeStart, rangeEnd)) {
        dateRange.push(rangeStart);
        rangeStart = new Date(+rangeStart);
        while (rangeStart < end) {
          dateRange.push(rangeStart);
          var newDate = rangeStart.setDate(rangeStart.getDate() + 1);
          rangeStart = new Date(newDate);
        }
      }
    }

    // Update state with selected slot data if available
    if (selectedSlotData) {
      this.setState({
        dateRange,
        startHour: selectedSlotData.startTime || this.state.startHour,
        endHour: selectedSlotData.endTime || this.state.endHour,
        specialPrice: selectedSlotData.isSpecialPrice || this.state.specialPrice
      });
    } else {
      this.setState({ dateRange });
    }
  }

  // Check if any selected dates are reserved
  hasReservedDates() {
    const { dateRange } = this.state;
    const { reservedDates } = this.props;
    
    if (!reservedDates || reservedDates.length === 0) {
      return false;
    }

    return dateRange.some(selectedDate => 
      reservedDates.some(reservedDate => 
        DateUtils.isSameDay(selectedDate, reservedDate)
      )
    );
  }

  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl
          {...input}
          placeholder={label}
          type={type}
          className={className}
          maxLength={3}
        />
      </div>
    )
  }

  renderDateRange = ({ input, label, meta: { touched, error }, formName, numberOfMonths, startDateName, endDateName, index, defaultStartDate, defaultEndDate, isCurrentStatus, resetCalendar }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={cx('specialPriceCalendar')}>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <DateRange
          {...input}
          formName={formName}
          numberOfMonths={numberOfMonths}
          index={index}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
          isCurrentStatus={isCurrentStatus}
          resetCalendar={resetCalendar}
        />
      </div>
    )
  }

  async handleSave() {
    const { change, selectedDays, setStateLoading, reservedDates } = this.props;
    const { resetCalendar, mutate, listId, getListingDataStep3, getListBlockedDates } = this.props;
    const { formatMessage } = this.props.intl;
    const { minDay, maxDay, houseRules, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime } = this.props;
    const { basePrice, delivery, currency, isStartDate, isEndDate, monthlyDiscount, weeklyDiscount, securityDeposit } = this.props;

    // Check if any selected dates are reserved
    if (this.hasReservedDates()) {
      showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: 'Some selected dates are already reserved and cannot be blocked.' });
      return;
    }

    let minDayValues = minDay != '' ? minDay : 0;
    let maxDayValues = maxDay != '' ? maxDay : 0;
    let checkInEndValue = checkInEnd != '' ? checkInEnd : 'flexible';
    let checkInStartValue = checkInStart != '' ? checkInStart : 'flexible';
    let isCancel = cancellationPolicy ? cancellationPolicy : '1';
    let isMaxDays = maxDaysNotice ? maxDaysNotice : 'unavailable';
    let isBooking = bookingNoticeTime ? bookingNoticeTime : 58;
    let updatedSelectedDays = selectedDays;
    let errorMsg = formatMessage(messages.selectedDatesError);

    let dateRangeNew = [], rangeStart, rangeEnd;
    if (isStartDate && !isEndDate) {
      rangeStart = new Date(isStartDate);
      dateRangeNew.push(rangeStart);
    } else if (isStartDate && isEndDate) {
      rangeStart = new Date(isStartDate);
      rangeEnd = new Date(isEndDate);
      if (!DateUtils.isSameDay(rangeStart, rangeEnd)) {
        dateRangeNew.push(rangeStart);
        rangeStart = new Date(+rangeStart);
        while (rangeStart < isEndDate) {
          dateRangeNew.push(rangeStart);
          var newDate = rangeStart.setDate(rangeStart.getDate() + 1);
          rangeStart = new Date(newDate);
        }
      }
    }
    setStateLoading({ isSaving: true });

    if (dateRangeNew && dateRangeNew.length > 0) {
      dateRangeNew.forEach(async (item, index) => {
        let selectedIndex = updatedSelectedDays.findIndex(selectedDay =>
          DateUtils.isSameDay(selectedDay, item)
        );
        if (selectedIndex < 0) {
          updatedSelectedDays.push(item);
        }
      });
      const { data } = await mutate({
        variables: {
          listId,
          blockedDates: updatedSelectedDays,
          calendarStatus: 'blocked'
        }
      })
      if (data && data.UpdateBlockedDates && data.UpdateBlockedDates.status == '200') {
        await change('ListPlaceStep3', 'blockedDates', updatedSelectedDays);
        await getListingDataStep3(listId);
        await getListBlockedDates(
          listId,
          minDayValues,
          maxDayValues,
          checkInEndValue,
          checkInStartValue,
          houseRules,
          isCancel,
          isMaxDays,
          isBooking,
          basePrice,
          delivery,
          currency,
          monthlyDiscount,
          weeklyDiscount,
          securityDeposit
        );
        await getListingDataStep3(listId);
        
        // Refresh reservations after blocking dates
        if (this.props.fetchReservations) {
          this.props.fetchReservations();
        }
      } else if (data?.UpdateBlockedDates?.status == '400') {
        showToaster({ messageId: 'updateBlockedDates', toasterType: 'error' })
      } else {
        showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: errorMsg })
      }
      await resetCalendar();
    }

    clearTimeout(this.loadSync);
    this.loadSync = null;
    this.loadSync = setTimeout(() => {
      setStateLoading({ isSaving: false });
    }, 1000);

  }

  chooseDates(e) {
    this.setState({ isCurrentStatus: e });
  }

  handleHourlyChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.props.change('ListPlaceStep3', name, value);
  }

  toggleHourlySettings() {
    this.setState(prevState => ({
      showHourlySettings: !prevState.showHourlySettings
    }));
  }

  renderHourlySettings() {
    const { startHour, endHour } = this.state;
    return (
      <div className={s.hourlySettings}>
        <h4><FormattedMessage {...messages.hourlyAvailability} /></h4>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <FormControl
                type="time"
                name="startHour"
                value={startHour}
                onChange={this.handleHourlyChange}
              />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <FormControl
                type="time"
                name="endHour"
                value={endHour}
                onChange={this.handleHourlyChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { selectedDays, start, end, formName, resetCalendar, listId, resetDatePickerChange } = this.props;
    const { formatMessage } = this.props.intl;
    const { minDay, maxDay, houseRules, checkInEnd, checkInStart } = this.props;
    const { cancellationPolicy, maxDaysNotice, bookingNoticeTime, isStartDate, isEndDate } = this.props;
    const { basePrice, delivery, currency, monthlyDiscount, weeklyDiscount, isSaving, setStateLoading, isBlocking, securityDeposit } = this.props;
    const { isCurrentStatus, dateRange, isLoading, showHourlySettings } = this.state;
    let isBlock = 1, isAvailable = 2;

    // Check if any selected dates are reserved
    const hasReservedDates = this.hasReservedDates();

    return (
      <div>
        {(start || isStartDate) && <Col lg={12} md={12} sm={12} xs={12} className={cx(c.saveCalendarContainer, c.CalendarPopup)}>
          <div className={c.innerCPopup}>
            <FormGroup className={cx(c.textRight, cs.spaceBottom4)}>
              <Button bsStyle="link"
                className={cx(c.noPadding)}
                onClick={() => { resetCalendar() }}>
                <img src={closeIcon} />
              </Button>
            </FormGroup>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#484848',
              marginBottom: '20px',
              textAlign: 'start',
              fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif'
            }}>
              Add Availability Slots Days or Hours
            </h2>
            
            {/* Warning message for reserved dates */}
            {hasReservedDates && isCurrentStatus === 1 && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '15px',
                color: '#856404'
              }}>
                <strong>Warning:</strong> Some selected dates are already reserved and cannot be blocked.
              </div>
            )}

            <div className={c.aBlockWrap}>
              <div className={c.aBWLeft}>
                <Button
                  className={cx(c.btnBg, { [c.active]: isCurrentStatus == 2 })}
                  onClick={() => this.chooseDates(isAvailable)}
                >
                  <FormattedMessage {...messages.available} />
                </Button>
              </div>
              <div className={c.aBWCenter}>
                <Button
                  className={cx(c.btnBg, { [c.active]: isCurrentStatus == 3 })}
                  onClick={() => this.chooseDates(3)}
                >
                  <FormattedMessage {...messages.available2} />
                </Button>
              </div>
              <div className={c.aBWRight}>
                <Button
                  className={cx(c.btnBg, { [c.active]: isCurrentStatus == 1 })}
                  onClick={() => this.chooseDates(isBlock)}
                >
                  <FormattedMessage {...messages.Blockk} />
                </Button>
              </div>
            </div>

            <FormGroup className={cx(cs.spaceTop5, c.marginBottom)}>
              <label>
                <FormattedMessage {...messages.selectedDates} />
              </label>
            </FormGroup>

            <FormGroup className={cs.spaceBottom4}>
              <Field
                name="blockedDates"
                component={this.renderDateRange}
                defaultStartDate={start}
                defaultEndDate={end}
                formName={formName}
                isCurrentStatus={isCurrentStatus}
                resetCalendar={resetDatePickerChange}
              />
            </FormGroup>

            {(isCurrentStatus === 2 || isCurrentStatus === 3) && <AvailableDates
              start={start}
              end={end}
              listId={listId}
              selectedDays={selectedDays}
              resetCalendar={resetCalendar}
              dateRange={dateRange}
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
              isCurrentStatus={isCurrentStatus}
              weeklyDiscount={weeklyDiscount}
              monthlyDiscount={monthlyDiscount}
              setStateLoading={setStateLoading}
              isBlocking={isBlocking}
              isSaving={isSaving}
              securityDeposit={securityDeposit}
              selectedSlotData={this.props.selectedSlotData}
            />}


            <div className={c.flexBtn}>
              <Button
                disabled={isSaving || isBlocking}
                className={cx(c.btnPrimaryBorder, c.btnlarge, c.buttonRight, 'mrLeftRTL')}
                onClick={() => { resetCalendar() }}
              >
                <FormattedMessage {...messages.deSelect} />
              </Button>
              {isCurrentStatus == 1 && <FormGroup className={cx(c.formGroup, c.buttonLeft)}>
                <Loader
                  type={"button"}
                  buttonType={"button"}
                  show={isSaving}
                  className={cx(c.btnPrimary, c.btnlarge)}
                  disabled={isSaving || isBlocking || hasReservedDates}
                  label={formatMessage(messages.blockDates)}
                  handleClick={() => { this.handleSave() }}
                  containerClass={c.loaderContainer}
                />
              </FormGroup>}
            </div>

          </div>
        </Col>}
      </div>
    );
  }
}

const mapState = (state) => ({});

const mapDispatch = {
  change,
  getListingDataStep3,
  getListBlockedDates
};

export default reduxForm({
  form: 'ListPlaceStep3',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(
  compose(
    injectIntl,
    withStyles(s, c, cs),
    connect(mapState, mapDispatch),
    graphql(gql`
      mutation (
        $listId: Int!, 
        $blockedDates: [String],
        $calendarStatus: String
      ) {
            UpdateBlockedDates (
              listId: $listId, 
              blockedDates: $blockedDates,
              calendarStatus: $calendarStatus
        ) {
          status
        }
        }
    `)
  )(SaveCalendar)
);

