import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import { injectIntl, FormattedMessage } from 'react-intl';
import axios from 'axios';

import DateRange from '../DateRange';
import CurrencyConverter from '../../CurrencyConverter';
import BillDetails from './BillDetails';
import BookingButton from './BookingButton';
import moment from 'moment'
import TimeField from '../TimeField';
import CustomCheckbox from '../../CustomCheckbox';

import messages from '../../../locale/messages';
import { bookingProcess } from '../../../actions/booking/bookingProcess';
import { generateTimes } from '../../../helpers/formatting';

import miniBus from '/public/siteImages/minibus.svg';

import s from './Calendar.css';
import cs from '../../../components/commonStyle.css';

class BookingForm extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    personCapacity: PropTypes.number.isRequired,
    basePrice: PropTypes.number.isRequired,
    delivery: PropTypes.number,
    currency: PropTypes.string,
    monthlyDiscount: PropTypes.number,
    weeklyDiscount: PropTypes.number,
    minDay: PropTypes.number,
    maxDay: PropTypes.number,
    maxDaysNotice: PropTypes.string,
    loading: PropTypes.bool,
    availability: PropTypes.bool,
    maximumStay: PropTypes.bool,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    blockedDates: PropTypes.array,
    isHost: PropTypes.bool.isRequired,
    guests: PropTypes.number,
    serviceFees: PropTypes.shape({
      guest: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    base: PropTypes.string.isRequired,
    rates: PropTypes.object.isRequired,
    bookingType: PropTypes.string.isRequired,
    bookingLoading: PropTypes.bool,
    formatMessage: PropTypes.any,
    account: PropTypes.shape({
      userBanStatus: PropTypes.number,
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      includeDelivery: false,
      isSingleDate: false,
      reservedSlots: [],
      isLoadingReservedSlots: false
    }
  }

  static defaultProps = {
    blockedDates: [],
    availability: true,
    maximumStay: false,
    minimumStay: false,
    startDate: null,
    endDate: null,
    guests: 1,
    personCapacity: 0,
  };

  componentDidMount() {
    const { URLRoomType, roomType, change } = this.props;
    this.setState({ includeDelivery: URLRoomType == "true" ? true : false })
    change('roomType', URLRoomType == "true" ? true : false)
    this.fetchReservedSlots();
  }

  fetchReservedSlots = async () => {
    const { id } = this.props;
    this.setState({ isLoadingReservedSlots: true });
    
    try {
      const response = await axios.get(`/api/list-reservations?listId=${id}&includeHourly=true`);
      if (response.data && response.data.success) {
        console.log("🚀 ~ BookingForm ~ fetchReservedSlots= ~ reservations:", response.data.reservations)
        this.setState({ 
          reservedSlots: response.data.reservations,
          isLoadingReservedSlots: false 
        });
      }
    } catch (error) {
      console.error('Error fetching reserved slots:', error);
      this.setState({ 
        reservedSlots: [],
        isLoadingReservedSlots: false 
      });
    }
  };

  renderFormControlSelect({ input, label, meta: { touched, error }, children, className }) {
    return (
      <div className={'inputFocusColor'}>
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
      </div>
    );
  }

  renderGuests(personCapacity) {
    const { formatMessage } = this.props.intl;
    const rows = [];
    for (let i = 1; i <= personCapacity; i++) {
      rows.push(<option key={i} value={i}>{i} {i > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}</option>);
    }
    return rows;
  }

  handleCheckBox = (event) => {
    const { change } = this.props;
    const { includeDelivery } = this.state;
    this.setState({ includeDelivery: !includeDelivery });
    change('roomType', event);
  }
  checkboxHorizontalGroup = ({ label, labelSmall }) => {
    const { delivery, currency, roomType } = this.props

    return (
      <div className={s.doorStepSection}>
        <div className={cx(s.doorStepImageSection, cs.displayFlex, cs.alignCenter, 'doorStepImageRTL')}>
          <img src={miniBus} className={s.doorStepImage} />
        </div>
        <div className={cx(s.doorStepText, 'doorStepRTL')}>
          <div>
            <p className={cs.commonMediumText}>{label}</p>
            <p className={cx(cs.commonSmallText, cs.siteLinkColor)}>({labelSmall}{' '}-{' '}{<CurrencyConverter amount={delivery} from={currency} />})</p>
          </div>
          <CustomCheckbox
            className={'icheckbox_square-green'}
            onChange={event => {
              this.handleCheckBox(event);
            }}
            checked={roomType}
            value={true}
          />
        </div>
      </div>
    )
  };

  handleDateCheckBox = (eventOrChecked) => {
    const checked = eventOrChecked && eventOrChecked.target
      ? eventOrChecked.target.checked
      : eventOrChecked;

    this.setState({ isSingleDate: checked });

    // sync to redux-form if needed
    const { change } = this.props;
    change('isSingleDate', checked);
  };


  render() {
    const { includeDelivery, reservedSlots, isLoadingReservedSlots } = this.state;
    const { formatMessage } = this.props.intl;
    const { id, basePrice,hourlyPrice, delivery, currency, isHost, bookingType } = this.props;
    const { monthlyDiscount, weeklyDiscount, minDay, maxDay, maxDaysNotice, securityDeposit } = this.props;
    const { isLoading, availability, maximumStay, guests, startDate, endDate, account, blockedDates, minimumStay } = this.props;
    const { bookingProcess, serviceFees, base, rates, bookingLoading, startTime, endTime } = this.props;
    const { roomType, bookingLoader } = this.props;
    const isDateChosen = startDate != null && (this.state.isSingleDate ? endDate : true)
    let userBanStatusValue, deliveryFee, deliveryStatus, isTimeChosen;
    let momentStartDate, momentEndDate, dayDifference, isDisabled = false, isValue = true;
    let isToday = false, startTimeLookup, endTimeLookup;

    if (account) {
      const { account: { userBanStatus } } = this.props;
      userBanStatusValue = userBanStatus;
    }

    if (includeDelivery) {
      deliveryFee = delivery
      deliveryStatus = 'include'
    } else {
      deliveryFee = 0
      deliveryStatus = 'exclude'
    }

    momentStartDate = moment(startDate);
    momentEndDate = moment(endDate);
    dayDifference = momentEndDate.diff(momentStartDate, 'days');

    isTimeChosen = isNaN(startTime) || isNaN(endTime) ? false : true;

    if ((startTime >= endTime) && dayDifference == 0) {
      isValue = false;
      isDisabled = true;
    }
    if ( !this.state.isSingleDate && !isTimeChosen) {
      isDisabled = true;
    } else if (this.state.isSingleDate && !isDateChosen) {
      isDisabled = true;
    }

    startTimeLookup = generateTimes(0, 1410, isToday);
    endTimeLookup = generateTimes(0, 0);

    if (momentStartDate) {
      isToday = moment(moment(momentStartDate)).isSame(moment(), 'day');
      startTimeLookup = generateTimes(0, 1410, isToday);
    }

    if (momentEndDate) {
      isToday = moment(moment(momentEndDate)).isSame(moment(), 'day');
      endTimeLookup = generateTimes(0, 0, isToday);
    }

    // Filter endTimeLookup to only allow times after startTime
    if (!isNaN(startTime)) {
      endTimeLookup = endTimeLookup.filter(item => item.value > startTime);
    }

    return (
      <Form>
        <FormGroup className={cs.spaceBottom4}>
          <div className={`${cs.displayFlex} ${cs.alignCenter} ${cs.spaceBetween}`}>
            <label>
              <FormattedMessage {...messages.dates} />
            </label>
            <div className={cs.displayFlex}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '10px',
                marginTop: '0px',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  width: '120px',
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '15px',
                  position: 'relative',
                  cursor: 'pointer'
                }} onClick={() => this.setState({ isSingleDate: !this.state.isSingleDate })}>
                  {/* Hourly Text */}
                  <span style={{
                    position: 'absolute',
                    left: '15px',
                    top: '7px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: this.state.isSingleDate ? '#666' : '#fff',
                    transition: 'all 0.3s ease',
                    zIndex: 3
                  }}>
                    Hourly
                  </span>
                  {/* Daily Text */}
                  <span style={{
                    position: 'absolute',
                    right: '15px',
                    top: '7px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: this.state.isSingleDate ? '#fff' : '#666',
                    transition: 'all 0.3s ease',
                    zIndex: 3
                  }}>
                    Daily
                  </span>
                  <div style={{
                    position: 'absolute',
                    width: '60px',
                    height: '26px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '13px',
                    top: '2px',
                    left: this.state.isSingleDate ? '58px' : '2px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }} />
                </div>
              </div>
            </div>
          </div>
          <span className={cx('viewListingDate')}>
            <DateRange
              key={this.state.isSingleDate ? 'hourly' : 'daily'}
              isSingleDate={this.state.isSingleDate}
              listId={id}
              minimumNights={minDay}
              maximumNights={maxDay}
              blockedDates={blockedDates}
              formName="BookingForm"
              maxDaysNotice={maxDaysNotice}
              startTime={startTime}
              endTime={endTime}
              reservedSlots={reservedSlots}
            />
          </span>
        </FormGroup>
        {/* time field */}
        {
          !this.state.isSingleDate && 
          <FormGroup className={cs.spaceBottom4}>
          <label>{formatMessage(messages.startLabel)}</label>
          <div className={s.displayGrid}>
            <TimeField
              name={"startTime"}
              className={cs.formControlSelect}
              TimeLookup={startTimeLookup}
              formName={"BookingForm"}
              label={formatMessage(messages.tripStart)}
              listId={id}
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              maximumNights={maxDay}
              value={startTime}
              minimumNights={minDay}
              classNameParent={cx(s.paddingRight, 'calendarPaddingRightRTL')}
              reservedSlots={reservedSlots}
            />
            <TimeField
              name={"endTime"}
              className={cs.formControlSelect}
              TimeLookup={endTimeLookup}
              formName={"BookingForm"}
              label={formatMessage(messages.tripEnd)}
              listId={id}
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              maximumNights={maxDay}
              value={endTime}
              minimumNights={minDay}
              classNameParent={cx(s.paddingLeft, 'calendarPaddingLeftRTL')}
              reservedSlots={reservedSlots}
            />
          </div>
        </FormGroup>
        }
        
        {
          (delivery != null || delivery != undefined) && Number(delivery) > 0 &&
          <FormGroup className={cs.spaceBottom3}>
            <Field
              name="roomType"
              component={this.checkboxHorizontalGroup}
              label={formatMessage(messages.doorstepDelivery)}
              labelSmall={formatMessage(messages.deliveryCharges)}
            />
          </FormGroup>
        }
        <FormGroup>
          {
            !isLoading && maximumStay && isDateChosen && !userBanStatusValue && <div className={cx(s.bookItMessage, cs.spaceTop1)}>
              <p className={cx(s.noMargin, s.textCenter, s.textError)}>
                <FormattedMessage {...messages.maximumStay} /> {maxDay} {maxDay > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
              </p>
            </div>
          }
          {
            !isLoading && minimumStay && isDateChosen && !userBanStatusValue && <div className={cx(s.bookItMessage, cs.spaceTop1)}>
              <p className={cx(s.noMargin, s.textCenter, s.textError)}>
                <FormattedMessage {...messages.minimumStayText} /> {minDay} {minDay > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
              </p>
            </div>
          }

          {
            !isLoading && !availability && isDateChosen && !userBanStatusValue && <div className={cx(s.bookItMessage, cs.spaceTop1)}>
              <p className={cx(s.noMargin, s.textCenter, s.textError)}>
                <FormattedMessage {...messages.hostErrorMessage2} />
              </p>
            </div>
          }
          {
            isTimeChosen && !isValue && <div className={cx(s.bookItMessage, cs.spaceTop1)}>
              <p className={cx(s.noMargin, s.textCenter, s.textError)}><FormattedMessage {...messages.youMustChooseTime} /></p>
            </div>
          }
        </FormGroup>
        {
          !bookingLoader && !maximumStay && !minimumStay && availability && isDateChosen && !userBanStatusValue &&  (this.state.isSingleDate ? true : isTimeChosen) && isValue && <BillDetails
            basePrice={basePrice}
            hourlyPrice={hourlyPrice}
            delivery={deliveryFee}
            currency={currency}
            monthlyDiscount={monthlyDiscount}
            weeklyDiscount={weeklyDiscount}
            startDate={startDate}
            endDate={endDate}
            bookingType={this.state.isSingleDate}
            serviceFees={serviceFees}
            base={base}
            rates={rates}
            securityDeposit={securityDeposit}
          />
        }
        <BookingButton
          listId={id}
          startDate={startDate}
          endDate={endDate}
          guests={!isNaN(guests) ? guests : 1}
          bookingProcess={bookingProcess}
          availability={availability}
          isDateChosen={isDateChosen}
          userBanStatus={userBanStatusValue}
          basePrice={basePrice}
          hourlyPrice={hourlyPrice}
          isSingleDate={this.state.isSingleDate}
          isHost={isHost}
          bookingType={bookingType}
          bookingLoading={bookingLoading}
          maximumStay={maximumStay}
          isDisabled={isDisabled}
          startTime={startTime}
          endTime={endTime}
          deliveryStatus={deliveryStatus}
          roomType={roomType}
        />
      </Form>
    );
  }
}
BookingForm = reduxForm({
  form: 'BookingForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(BookingForm);

const selector = formValueSelector('BookingForm');

const mapState = state => ({
  isLoading: state?.viewListing?.isLoading,
  availability: state?.viewListing?.availability,
  maximumStay: state?.viewListing?.maximumStay,
  minimumStay: state?.viewListing?.minimumStay,
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
  guests: Number(selector(state, 'guests')),
  account: state?.account?.data,
  serviceFees: state?.book?.serviceFees,
  base: state?.currency?.base,
  rates: state?.currency?.rates,
  bookingLoading: state?.book?.bookingLoading,
  startTime: Number(selector(state, 'startTime')),
  endTime: Number(selector(state, 'endTime')),
  roomType: selector(state, 'roomType')
});
const mapDispatch = {
  bookingProcess,
};
export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(BookingForm)));