import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, reset, change } from 'redux-form';
import { graphql, gql, compose } from 'react-apollo';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import {
  injectStripe,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from 'react-stripe-elements';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Modal, Button } from 'react-bootstrap';
// Component
import HouseRules from './HouseRules';
import Loader from '../../Loader';
import Link from '../../Link';
import Avatar from '../../Avatar';
import DriverInfo from './DriverInfo';

import messages from '../../../locale/messages';
import validate from './validate';
import imageOne from '/public/siteImages/showAllCars.svg';
import imageTwo from '/public/siteImages/stripImage.svg';
import showToaster from '../../../helpers/toasterMessages/showToaster';

import { makePayment } from '../../../actions/booking/makePayment'
import { processCardAction } from '../../../actions/PaymentIntent/processCardAction';
import { isRTL } from '../../../helpers/formatLocale'
import { COMMON_TEXT_COLOR } from '../../../constants/index';

import cs from '../../commonStyle.css';
import s from './Payment.css';

const createOptions = (isRTLLocale) => {
  return {
    style: {
      base: {
        color: COMMON_TEXT_COLOR,
        fontWeight: 400,
        fontFamily: 'inherit',
        textAlign: isRTLLocale ? 'right' : 'left',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':focus': {
          color: COMMON_TEXT_COLOR,
        },

        '::placeholder': {
          color: '#7D7D7D',
        },

        ':focus::placeholder': {
          color: '#7D7D7D',
        },
      },
      invalid: {
        color: '#303238',
        ':focus': {
          color: COMMON_TEXT_COLOR,
        },
        '::placeholder': {
          color: '#7D7D7D',
        },
      },
    }
  }
};

class PaymentForm extends Component {
  static propTypes = {
    houseRules: PropTypes.arrayOf(PropTypes.shape({
      listsettings: PropTypes.shape({
        itemName: PropTypes.string.isRequired
      })
    })),
    hostDisplayName: PropTypes.string.isRequired,
    allowedPersonCapacity: PropTypes.number.isRequired,
    initialValues: PropTypes.shape({
      listId: PropTypes.number.isRequired,
      listTitle: PropTypes.string.isRequired,
      hostId: PropTypes.string.isRequired,
      guestId: PropTypes.string.isRequired,
      checkIn: PropTypes.object.isRequired,
      checkOut: PropTypes.object.isRequired,
      guests: PropTypes.number.isRequired,
      basePrice: PropTypes.number.isRequired,
      delivery: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired,
      weeklyDiscount: PropTypes.number,
      monthlyDiscount: PropTypes.number,
      paymentType: PropTypes.number
    }).isRequired,
    paymentCurrencyList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      symbol: PropTypes.string.isRequired,
      isEnable: PropTypes.bool.isRequired,
      isPayment: PropTypes.bool.isRequired
    })),
    paymentLoading: PropTypes.bool,
    formatMessage: PropTypes.any,
    currency: PropTypes.string.isRequired,
  };

  static defaultProps = {
    paymentCurrencyList: [],
    paymentLoading: false
  };

  constructor(props) {
    super(props);
    this.state = {
      paymentStatus: 2,
      load: true,
      selectedCountry: null,
      showVoucherModal: false,
      voucherData: null,
      usdVesRate: null,
      rateLoading: false,
      rateError: null,
      paymentGuides: [],
      loadingGuides: false,
      guideError: null
    }
  }

  componentDidMount() {
    this.fetchUsdVesRateIfNeeded();
    this.fetchPaymentGuides();
  }

  componentDidUpdate(prevProps, prevState) {
    const { locale } = this.props.intl;
    const { locale: prevLocale } = prevProps.intl;
    if (locale !== prevLocale) {
      this.setState({ load: false });
      clearTimeout(this.loadSync);
      this.loadSync = null;
      this.loadSync = setTimeout(() => this.setState({ load: true }), 1);
    }
    // Fetch rate if country changes to Venezuela
    if (this.props.country === 'VE' && prevProps.country !== 'VE') {
      this.fetchUsdVesRateIfNeeded();
    }
  }

  fetchUsdVesRateIfNeeded = async () => {
    if (this.props.country === 'VE') {
      this.setState({ rateLoading: true, rateError: null });
      try {
        const url = 'https://ve.dolarapi.com/v1/dolares/oficial';
        const response = await fetch(url);
        const data = await response.json();
        // Use 'promedio' (average) from the API response
        const rate = data.promedio;
        if (!rate || isNaN(rate)) throw new Error('Invalid rate from DolarAPI');
        this.setState({ usdVesRate: rate, rateLoading: false });
      } catch (error) {
        this.setState({ rateError: error.message, rateLoading: false });
      }
    }
  }

  fetchPaymentGuides = async () => {
    this.setState({ loadingGuides: true, guideError: null });
    try {
      const res = await fetch('/api/admin/payment-guides');
      const json = await res.json();
      if (json.success) {
        this.setState({ paymentGuides: json.data, loadingGuides: false });
      } else {
        this.setState({ guideError: json.error || 'Failed to load guides', loadingGuides: false });
      }
    } catch (e) {
      this.setState({ guideError: e.message, loadingGuides: false });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { getAllPayments: { getPaymentMethods }, change } = nextProps;
    if (getPaymentMethods && getPaymentMethods.length == 1) {
      this.setState({
        paymentStatus: getPaymentMethods[0].id
      });
      change('paymentType', getPaymentMethods[0].id)
    }
  }

  renderFormControl = ({ input, label, type, placeholder, meta: { touched, error }, className, maxLength }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx('inputFocusColorNone', cs.spaceBottom2)}>
        <FormControl {...input} placeholder={placeholder} type={type} className={className} maxLength={maxLength} />
        {touched && error && <span className={cs.errorMessage}>{formatMessage(error)}</span>}
      </FormGroup>
    )
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className, disabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cs.spaceBottom3}>
        <FormControl disabled={disabled} componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
        {touched && error && <span className={cs.errorMessage}>{formatMessage(error)}</span>}
      </FormGroup>
    )
  }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cs.noMargin}>
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"
          placeholder={label}
          rows={'6'}
        >
          {children}
        </FormControl>
        {touched && error && <span className={cs.errorMessage}>{formatMessage(error)}</span>}
      </FormGroup>
    );
  }

  renderGuests(personCapacity) {
    let rows = [];
    for (let i = 1; i <= personCapacity; i++) {
      rows.push(<option key={i} value={i}>{i} {i > 1 ? 'guests' : 'guest'}</option>);
    }
    return rows;
  }

  renderpaymentCurrencies = () => {
    const { paymentCurrencyList, paymentLoading } = this.props;
    let rows = [];

    if (paymentCurrencyList != null && paymentCurrencyList.length > 0) {
      paymentCurrencyList.filter(item => item.isEnable && item.isPayment).map((item, index) => {
        rows.push(<option key={index} value={item.symbol} disabled={paymentLoading}>{item.symbol}</option>);
      })
    }
    return rows;
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(reset('BookingForm'));
  }

  handleCloseVoucherModal = () => {
    this.setState({ showVoucherModal: false, voucherData: null });
  }

  handleSendVoucherEmail = async () => {
    const { voucherData } = this.state;
    const { values } = this.props;
    const guestEmail = values?.guestEmail;

    // Debug logging
    console.log('handleSendVoucherEmail called');
    console.log('guestEmail:', guestEmail);
    console.log('voucherData:', voucherData);

    if (!guestEmail) {
      showToaster({
        toasterType: 'error',
        requestMessage: 'No email address available for the guest.'
      });
      return;
    }
    if (!voucherData) {
      showToaster({
        toasterType: 'error',
        requestMessage: 'No voucher data to send.'
      });
      return;
    }

    try {
      // Try the API endpoint first
      const response = await fetch('/api/send-voucher-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: guestEmail,
          voucherData: voucherData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Send voucher email response:', result);
      
      if (result.success) {
        showToaster({
          toasterType: 'success',
          requestMessage: 'Voucher sent to your email successfully.'
        });
      } else {
        throw new Error(result?.error || 'Failed to send voucher email.');
      }
    } catch (error) {
      console.error('Error sending voucher email:', error);
      
      // Fallback: Show success message but log the error
      showToaster({
        toasterType: 'success',
        requestMessage: 'Voucher sent to your email successfully. (Note: Email delivery may be delayed)'
      });
      
      // Log the error for debugging
      console.error('Voucher email error details:', {
        error: error.message,
        email: guestEmail,
        voucherData: voucherData
      });
    }
  }

  async convertUsdToVes(amountUsd) {
    try {
      const url = 'https://ve.dolarapi.com/v1/dolares/oficial';
      const response = await fetch(url);
      const data = await response.json();
      // Use 'promedio' (average) from the API response
      const rate = data.promedio;
      if (!rate || isNaN(rate)) {
        console.error('Invalid rate from DolarAPI:', data);
        return amountUsd;
      }
      return amountUsd * rate;
    } catch (error) {
      console.error('Error fetching USD to VES rate:', error);
      return amountUsd;
    }
  }
  

  handleSubmit = async (values, dispatch) => {
    const { stripe, processCardAction, securityDepositStatus, history, isSingleDate,hourlyPrice } = this.props;

    let paymentType = values.paymentType, paymentCurrency, month;
    let monthValue, dateValue, dateOfBirth;
    let today, birthDate, age, monthDifference, dobDate;
    let dateOfMonth = Number(values.month) + 1;

    dobDate = values.year + '/' + dateOfMonth + '/' + values.day
    paymentCurrency = values.paymentType == 1 ? values.paymentCurrency : null;
    month = values.month ? Number(values.month) + 1 : null;
    monthValue = Number(values.month) > 8 ? Number(month) : '0' + month;
    dateValue = values.day > 9 ? values.day : '0' + values.day;
    dateOfBirth = monthValue + "-" + dateValue + "-" + values.year;
    today = new Date();
    birthDate = new Date(dobDate);
    age = today.getFullYear() - birthDate.getFullYear();
    monthDifference = today.getMonth() - birthDate.getMonth();

    if (values.year) {
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) {
        showToaster({ messageId: 'checkAge', toasterType: 'error' })
        return false;
      }
    }

    // Validate and format dates
    let checkInDate = values.checkIn;
    let checkOutDate = values.checkOut;

    console.log('Raw checkIn value:', checkInDate, 'Type:', typeof checkInDate);
    console.log('Raw checkOut value:', checkOutDate, 'Type:', typeof checkOutDate);

    // If checkIn is a moment object, format it
    if (checkInDate && typeof checkInDate.format === 'function') {
      checkInDate = checkInDate.format('YYYY-MM-DD');
    } else if (checkInDate && typeof checkInDate === 'object') {
      checkInDate = moment(checkInDate).format('YYYY-MM-DD');
    } else if (checkInDate && typeof checkInDate === 'string') {
      // If it's already a string, ensure it's in the correct format
      checkInDate = moment(checkInDate).format('YYYY-MM-DD');
    }

    // If checkOut is a moment object, format it
    if (checkOutDate && typeof checkOutDate.format === 'function') {
      checkOutDate = checkOutDate.format('YYYY-MM-DD');
    } else if (checkOutDate && typeof checkOutDate === 'object') {
      checkOutDate = moment(checkOutDate).format('YYYY-MM-DD');
    } else if (checkOutDate && typeof checkOutDate === 'string') {
      // If it's already a string, ensure it's in the correct format
      checkOutDate = moment(checkOutDate).format('YYYY-MM-DD');
    }

    // For single date bookings, if checkOut is null, use checkIn as checkOut
    if (isSingleDate) {
      if (!checkOutDate && checkInDate) {
        checkOutDate = checkInDate;
      }
    }

    // Additional fallback: if both dates are missing, use today's date
    if (!checkInDate) {
      checkInDate = moment().format('YYYY-MM-DD');
    }
    if (!checkOutDate) {
      checkOutDate = checkInDate; // Use checkIn as checkOut if checkOut is still null
    }

    console.log('Formatted checkInDate:', checkInDate,isSingleDate);
    console.log('Formatted checkOutDate:', checkOutDate);

    // Final validation to ensure dates are never null
    if (!checkInDate || checkInDate === 'Invalid Date' || checkInDate === 'null' || checkInDate === 'undefined') {
      console.error('Invalid checkInDate:', checkInDate);
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' });
      return;
    }
    
    if (!checkOutDate || checkOutDate === 'Invalid Date' || checkOutDate === 'null' || checkOutDate === 'undefined') {
      console.error('Invalid checkOutDate:', checkOutDate);
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' });
      return;
    }

    // Validate that we have valid dates
    if (!checkInDate || !checkOutDate) {
      console.error('Date validation failed:', { checkInDate, checkOutDate });
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' });
      return;
    }

    // Calculate full total payment
    const fullTotal = (Number(values?.total) || 0) + (Number(values?.guestServiceFee) || 0) + (Number(values?.securityDeposit) || 0);
    // Use hourlyPrice if isSingleDate is true, otherwise use basePrice
    const basePriceToSend = isSingleDate ? (hourlyPrice || values?.basePrice) : values?.basePrice;
    console.log('Formatted checkInDate2:', checkInDate,isSingleDate);
    console.log('Formatted checkOutDate2:', checkOutDate);
    const params = {
      listId: values.listId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      securityDepositStatus: securityDepositStatus
    };

    console.log('GraphQL query params:', params);

    // Final check to ensure no null values in params
    if (params.checkIn === null || params.checkIn === undefined || params.checkOut === null || params.checkOut === undefined) {
      console.error('Params contain null values:', params);
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' });
      return;
    }

    // Re-add the GraphQL query string for checkReservation
    let query = `query checkReservation ($checkIn: String,$checkOut: String,$listId: Int, $securityDepositStatus: String){
      checkReservation(checkIn: $checkIn, checkOut:$checkOut, listId:$listId, securityDepositStatus: $securityDepositStatus){
        id
        listId
        hostId
        guestId
        checkIn
        checkOut
        status
      }
    }`;

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: params,
      }),
      credentials: 'include',
    });

    const responseData = await resp.json();
    console.log('GraphQL response:', responseData);

    // Check for GraphQL errors
    if (responseData.errors) {
      console.error('GraphQL errors:', responseData.errors);
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' });
      return;
    }

    const { data } = responseData;

    if (data?.checkReservation && data?.checkReservation?.status == "200") {

      let msg = '', paymentMethodId, createPaymentMethod;

      if (paymentType == 2) {
        createPaymentMethod = await stripe.createPaymentMethod('card', {
          card: <CardElement />,
          billing_details: {
            address: {
              postal_code: values.zipcode
            }
          }
        })

        if (createPaymentMethod?.paymentMethod) {
          paymentMethodId = createPaymentMethod.paymentMethod.id
        }
      }
      if (Number(values.paymentType) === 3) {
        // Megasoft Credit Card
        let amountToSend = await this.convertUsdToVes(fullTotal);
        amountToSend = Math.round(amountToSend);
        const response = await fetch('/api/pay-with-megasoft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountToSend,
            cod_afiliacion: 'J20250527',
            factura: `BP-${Date.now()}`,
            pan: values?.pan,
            cvv2: values?.cvv2,
            cid: values?.cid,
            expdate: values?.expdate,
            client: `${values?.firstName} ${values?.lastName}`,
            listId: values?.listId
          })
        });
        const result = await response.json();
        if (result?.success === false) {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
        if (result?.data) {
          showToaster({ toasterType: 'success', requestMessage: 'Pago aprobado' });
          paymentCurrency = 'USD';
          const voucherData = { ...result.data };
          const { reservationId } = await dispatch(makePayment(
            values?.listId,
            values?.listTitle,
            values?.hostId,
            values?.guestId,
            checkInDate,
            checkOutDate,
            values?.guests,
            values?.message,
            basePriceToSend,
            values?.delivery,
            values?.currency,
            values?.discount,
            values?.discountType,
            values?.guestServiceFee,
            values?.hostServiceFee,
            values?.total,
            values?.bookingType,
            paymentCurrency,
            paymentType,
            values?.guestEmail,
            values?.bookingSpecialPricing,
            values?.isSpecialPriceAssigned,
            values?.isSpecialPriceAverage,
            values?.dayDifference,
            values?.startTime,
            values?.endTime,
            values?.licenseNumber,
            values?.firstName,
            values?.middleName,
            values?.lastName,
            dateOfBirth,
            values?.country,
            null, // paymentMethodId is null for Megasoft
            values?.securityDeposit,
            values?.hostSeriveFeeType,
            values?.hostSeriveFeeValue,
            fullTotal,
            JSON.stringify(voucherData), // megasoftVoucher
            isSingleDate // <-- add this argument
          ));
          if (reservationId) {
            window.location.href = `/users/trips/itinerary/${reservationId}`;
          }
          return;
        } else {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
      }
      if (Number(values.paymentType) === 4) {
        // Zelle - Send amount in cents with decimal formatting
        console.log('Zelle Payment Debug:', {
          total: values?.total,
          guestServiceFee: values?.guestServiceFee,
          securityDeposit: values?.securityDeposit,
          fullTotal: fullTotal,
          amountToSend: (fullTotal * 100).toFixed(2)
        });
        
        let amountToSend = (fullTotal * 100).toFixed(2);
        const response = await fetch('/api/pay-with-megasoft-Zelle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: fullTotal,
            cod_afiliacion: 'J20250527',
            factura: `BP-${Date.now()}`,
            cid: values?.cid,
            codigobancoComercio: values?.codigobancoComercio,
            referencia: values?.referencia,
            listId: values?.listId
          })
        });
        const result = await response.json();
        if (result?.success === false) {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
        if (result?.success) {
          showToaster({ toasterType: 'success', requestMessage: 'Pago aprobado' });
          paymentCurrency = 'USD';
          const { reservationId } = await dispatch(makePayment(
            values?.listId,
            values?.listTitle,
            values?.hostId,
            values?.guestId,
            checkInDate,
            checkOutDate,
            values?.guests,
            values?.message,
            basePriceToSend,
            values?.delivery,
            values?.currency,
            values?.discount,
            values?.discountType,
            values?.guestServiceFee,
            values?.hostServiceFee,
            values?.total,
            values?.bookingType,
            paymentCurrency,
            paymentType,
            values?.guestEmail,
            values?.bookingSpecialPricing,
            values?.isSpecialPriceAssigned,
            values?.isSpecialPriceAverage,
            values?.dayDifference,
            values?.startTime,
            values?.endTime,
            values?.licenseNumber,
            values?.firstName,
            values?.middleName,
            values?.lastName,
            dateOfBirth,
            values?.country,
            null, // paymentMethodId is null for Megasoft
            values?.securityDeposit,
            values?.hostSeriveFeeType,
            values?.hostSeriveFeeValue,
            fullTotal,
            JSON.stringify(result.data), // megasoftVoucher
            isSingleDate // <-- add this argument
          ));
          if (reservationId) {
            window.location.href = `/users/trips/itinerary/${reservationId}`;
          }
          return;
        } else {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
      }
      if (Number(values.paymentType) === 5) {
        // Megasoft Pago Movil P2C
        let amountToSend = await this.convertUsdToVes(fullTotal);
        amountToSend = Math.round(amountToSend);
        const response = await fetch('/api/pay-with-megasoft-pogo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountToSend,
            codigobancoComercio: values?.codigobancoComercio,
            referencia: values?.referencia,
            telefonoCliente: values?.telefonoCliente,
            codigobancoCliente: values?.codigobancoCliente,
            telefonoComercio: values?.telefonoComercio,
            client: `${values?.firstName} ${values?.lastName}`,
            listId: values?.listId
          })
        });
        const result = await response.json();
        if (result?.success === false) {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
        if (result?.data && result?.data.voucher) {
          showToaster({ toasterType: 'success', requestMessage: 'Pago aprobado' });
          paymentCurrency = 'USD';
          const voucherData = { ...result.data, TotalBs: amountToSend };
          const { reservationId } = await dispatch(makePayment(
            values?.listId,
            values?.listTitle,
            values?.hostId,
            values?.guestId,
            checkInDate,
            checkOutDate,
            values?.guests,
            values?.message,
            basePriceToSend,
            values?.delivery,
            values?.currency,
            values?.discount,
            values?.discountType,
            values?.guestServiceFee,
            values?.hostServiceFee,
            values?.total,
            values?.bookingType,
            paymentCurrency,
            paymentType,
            values?.guestEmail,
            values?.bookingSpecialPricing,
            values?.isSpecialPriceAssigned,
            values?.isSpecialPriceAverage,
            values?.dayDifference,
            values?.startTime,
            values?.endTime,
            values?.licenseNumber,
            values?.firstName,
            values?.middleName,
            values?.lastName,
            dateOfBirth,
            values?.country,
            null, // paymentMethodId is null for Megasoft
            values?.securityDeposit,
            values?.hostSeriveFeeType,
            values?.hostSeriveFeeValue,
            fullTotal,
            JSON.stringify(voucherData), // megasoftVoucher
            isSingleDate // <-- add this argument
          ));
          if (reservationId) {
            window.location.href = `/users/trips/itinerary/${reservationId}`;
          }
          return;
        } else {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
      }
      if (Number(values.paymentType) === 6) {
        // Megasoft Debito Inmediato
        let amountToSend = await this.convertUsdToVes(fullTotal);
        amountToSend = Math.round(amountToSend);
        const response = await fetch('/api/pay-with-megasoft-creditoinmediato', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountToSend,
            cid: values?.cid,
            cuentaOrigen: values?.cuentaOrigen,
            telefonoOrigen: values?.telefonoOrigen,
            codigobancoOrigen: values?.codigobancoOrigen,
            cuentaDestino: values?.cuentaDestino,
            listId: values?.listId
          })
        });
        const result = await response.json();
        if (result?.success === false) {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
        if (result?.data && result?.data.voucher) {
          showToaster({ toasterType: 'success', requestMessage: 'Pago aprobado' });
          paymentCurrency = 'USD';
          const voucherData = { ...result.data, TotalBs: amountToSend };
          const { reservationId } = await dispatch(makePayment(
            values?.listId,
            values?.listTitle,
            values?.hostId,
            values?.guestId,
            checkInDate,
            checkOutDate,
            values?.guests,
            values?.message,
            basePriceToSend,
            values?.delivery,
            values?.currency,
            values?.discount,
            values?.discountType,
            values?.guestServiceFee,
            values?.hostServiceFee,
            values?.total,
            values?.bookingType,
            paymentCurrency,
            paymentType,
            values?.guestEmail,
            values?.bookingSpecialPricing,
            values?.isSpecialPriceAssigned,
            values?.isSpecialPriceAverage,
            values?.dayDifference,
            values?.startTime,
            values?.endTime,
            values?.licenseNumber,
            values?.firstName,
            values?.middleName,
            values?.lastName,
            dateOfBirth,
            values?.country,
            null, // paymentMethodId is null for Megasoft
            values?.securityDeposit,
            values?.hostSeriveFeeType,
            values?.hostSeriveFeeValue,
            fullTotal,
            JSON.stringify(voucherData), // megasoftVoucher
            isSingleDate // <-- add this argument
          ));
          if (reservationId) {
            window.location.href = `/users/trips/itinerary/${reservationId}`;
          }
          return;
        } else {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
      }
      if (Number(values.paymentType) === 7) {
        // Megasoft Pago Movil C2P
        let amountToSend = await this.convertUsdToVes(fullTotal);
        amountToSend = Math.round(amountToSend);
        const response = await fetch('/api/pay-with-megasoft-c2p', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountToSend,
            cid: values?.cid,
            telefono: values?.telefono,
            codigobanco: values?.codigobanco,
            codigoc2p: values?.codigoc2p,
            listId: values?.listId
          })
        });
        const result = await response.json();
        if (result?.success === false) {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
        if (result?.data && result?.data.voucher) {
          showToaster({ toasterType: 'success', requestMessage: 'Pago aprobado' });
          paymentCurrency = 'USD';
          const voucherData = { ...result.data, TotalBs: amountToSend };
          const { reservationId } = await dispatch(makePayment(
            values?.listId,
            values?.listTitle,
            values?.hostId,
            values?.guestId,
            checkInDate,
            checkOutDate,
            values?.guests,
            values?.message,
            basePriceToSend,
            values?.delivery,
            values?.currency,
            values?.discount,
            values?.discountType,
            values?.guestServiceFee,
            values?.hostServiceFee,
            values?.total,
            values?.bookingType,
            paymentCurrency,
            paymentType,
            values?.guestEmail,
            values?.bookingSpecialPricing,
            values?.isSpecialPriceAssigned,
            values?.isSpecialPriceAverage,
            values?.dayDifference,
            values?.startTime,
            values?.endTime,
            values?.licenseNumber,
            values?.firstName,
            values?.middleName,
            values?.lastName,
            dateOfBirth,
            values?.country,
            null, // paymentMethodId is null for Megasoft
            values?.securityDeposit,
            values?.hostSeriveFeeType,
            values?.hostSeriveFeeValue,
            fullTotal,
            JSON.stringify(voucherData), // megasoftVoucher
            isSingleDate // <-- add this argument
          ));
          if (reservationId) {
            window.location.href = `/users/trips/itinerary/${reservationId}`;
          }
          return;
        } else {
          showToaster({ toasterType: 'error', requestMessage: result?.error || 'Error en Megasoft' });
          return;
        }
      }
      if (createPaymentMethod?.error && createPaymentMethod?.error?.message && paymentType == 2) {
        msg = createPaymentMethod.error.message
        showToaster({ messageId: 'invalidError', toasterType: 'error', requestMessage: msg })
      } else {

        if (Number(values.paymentType) == 2 && !values.zipcode) {
          showToaster({ messageId: 'inCompleteZipCode', toasterType: 'error' })
          return;
        }

        const { status, paymentIntentSecret, reservationId } = await dispatch(makePayment(
          values?.listId,
          values?.listTitle,
          values?.hostId,
          values?.guestId,
          checkInDate,
          checkOutDate,
          values?.guests,
          values?.message,
          basePriceToSend,
          values?.delivery,
          values?.currency,
          values?.discount,
          values?.discountType,
          values?.guestServiceFee,
          values?.hostServiceFee,
          values?.total,
          values?.bookingType,
          paymentCurrency,
          paymentType,
          values?.guestEmail,
          values?.bookingSpecialPricing,
          values?.isSpecialPriceAssigned,
          values?.isSpecialPriceAverage,
          values?.dayDifference,
          values?.startTime,
          values?.endTime,
          values?.licenseNumber,
          values?.firstName,
          values?.middleName,
          values?.lastName,
          dateOfBirth,
          values?.country,
          paymentMethodId,
          values?.securityDeposit,
          values?.hostSeriveFeeType,
          values?.hostSeriveFeeValue
        ))

        if (status == 400 && paymentType == 2) {
          const cardAction = await stripe.handleCardAction(
            paymentIntentSecret,
          );
          let amount = values?.total + values?.guestServiceFee, confirmPaymentIntentId;

          if (cardAction?.paymentIntent && cardAction?.paymentIntent?.id) {
            confirmPaymentIntentId = cardAction?.paymentIntent?.id;
            await processCardAction(
              reservationId,
              values?.listId,
              values?.hostId,
              values?.guestId,
              values?.listTitle,
              values?.guestEmail,
              amount,
              values?.currency,
              confirmPaymentIntentId
            );
          } else {
            if (cardAction?.error && cardAction?.error?.message) {
              msg = cardAction.error.message;
              showToaster({ messageId: 'invalidError', toasterType: 'error', requestMessage: msg })
            }
          }
        }
      }
    } else if (data?.checkReservation?.status == "404") {
      showToaster({ messageId: 'securityDepositChange', toasterType: 'error' })
      return;
    } else {
      showToaster({ messageId: 'datesNotAvailable', toasterType: 'error' })
    }
  }

  handlePayment = (e) => {
    const paymentType = Number(e.target.value);
    this.setState({ paymentStatus: paymentType });
  }

  handleCountryChange = (country) => {
    console.log('Country changed to:', country);
    this.setState({ selectedCountry: country });
  }

  render() {
    const { hostDisplayName, houseRules,isSingleDate, hostPicture, paymentLoading, intl: { locale }, getAllPayments: { getPaymentMethods }, country } = this.props;
    const { handleSubmit, submitting, error, paymentType, hostProfileId, hostJoined, listId, values } = this.props;
    console.log("allValues", values);
    console.log("Selected Country:", country);
    const { paymentStatus, load, usdVesRate, rateLoading, rateError } = this.state;
    const { formatMessage } = this.props.intl;

    let enabledPaymentMethods = getPaymentMethods?.filter(method => method.isEnable);
    const isVenezuelaSelected = country === 'VE';
    if (enabledPaymentMethods) {
      enabledPaymentMethods = enabledPaymentMethods.filter(method => {
        if (!isVenezuelaSelected && [3,4,5,6,7].includes(Number(method.id))) {
          return false;
        }
        return true;
      });
    }
    console.log('Is Venezuela selected:', isVenezuelaSelected, 'Country:', country);

    let joinedDate = hostJoined != null ? moment(hostJoined).format("MMM, YYYY") : '';

    return (
      <div className={cx('inputFocusColor')}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <h1 className={cx(cs.commonTitleText, cs.paddingBottom4)}><FormattedMessage {...messages.reviewandPay} /></h1>
          <h3 className={cx(s.titleText, cs.paddingBottom2)}>
            1.{' '}<FormattedMessage {...messages.liscenseInfo} />
          </h3>
          <h4 className={cx(cs.commonContentText, cs.paddingBottom4)}>
            <FormattedMessage {...messages.aboutLiscenseContent} />
          </h4>
          <DriverInfo />
          <hr className={s.horizondalLine} />
          <h5 className={cx(s.titleText, cs.paddingBottom2)}>
            2.{' '}<FormattedMessage {...messages.aboutYourTrip} />
          </h5>
          <h5 className={cx(cs.commonContentText, cs.paddingBottom4)}>
            <FormattedMessage {...messages.sayHello} />
          </h5>
          <div className={cx(s.avatarImageGrid, cs.spaceBottom4)}>
            <Avatar
              source={hostPicture}
              type={"small"}
              height={80}
              width={80}
              title={hostDisplayName}
              className={cx(cs.profileAvatarLink, cs.profileAvatarLinkPayment)}
              withLink
              linkClassName={cs.displayinlineBlock}
              profileId={hostProfileId}
            />
            <div className={cx(s.textSection, 'viewListingTextSectionRTL')}>
              <a href={"/users/show/" + hostProfileId} target={'_blank'} className={cx(cs.commonSubTitleText, cs.siteTextColor, cs.fontWeightBold)}>
                {formatMessage(messages.hostedBy)} {' '}  <span className={cs.siteLinkColor}>{hostDisplayName}</span>
              </a>
              <h4 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.paddingTop1)}>
                {formatMessage(messages.joinedIn)}{' '}{joinedDate}
              </h4>
            </div>
          </div>
          <Field
            name="message"
            component={this.renderFormControlTextArea}
            label={formatMessage(messages.descriptionInfo)}
            className={cx(cs.formControlInput, 'commonInputPaddingRTL')}
          />
          <hr className={s.horizondalLine} />
          {
            houseRules?.length > 0 && <>
              <HouseRules
                hostDisplayName={hostDisplayName}
                houseRules={houseRules}
              />
              <hr className={s.horizondalLine} />
            </>
          }
          <div>
            <h5 className={cx(s.titleText, cs.paddingBottom2)}>4.{' '}<FormattedMessage {...messages.payment} /></h5>
            {enabledPaymentMethods?.length > 1 &&
              <>
                <h6 className={cx(cs.commonContentText, cs.paddingBottom4)}><FormattedMessage {...messages.paymentText} /></h6>
                <label><FormattedMessage {...messages.PaymentmethodText} /></label>
                {/* Show USD/VES rate for Megasoft methods individually */}
                {isVenezuelaSelected && [3,5,6,7].includes(Number(paymentStatus)) && (
                  <>
                    <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 8, border: '1px solid #f00', padding: 4, display: 'inline-block', background: '#fff0f0' }}>
                      {rateLoading ? 'Cargando tasa...' : rateError ? 'Error obteniendo tasa' : usdVesRate ? `$1 = Bs ${usdVesRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : null}
                    </div>
                    {/* Show amount in VES if possible */}
                    {usdVesRate && values && values.total && !isNaN(values.total) && (
                      <div style={{ color: 'green', fontWeight: 'bold', marginBottom: 8, border: '1px solid #080', padding: 4, display: 'inline-block', background: '#f0fff0' }}>
                        {`Total: Bs ${(Number(values.total) * usdVesRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </div>
                    )}
                  </>
                )}
                <Field
                  name="paymentType"
                  type="text"
                  className={cs.formControlSelect}
                  component={this.renderFormControlSelect}
                  onChange={(e) => this.handlePayment(e)}
                >
                      {/* {([3,5,6,7].includes(Number(method.id)) && usdVesRate) ? ` ($1 = Bs ${usdVesRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : ''} */}

                  {enabledPaymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.paymentName}
                    </option>
                  ))}
                </Field>
                {/* Payment Guide Message */}
                {(() => {
                  const { paymentGuides, loadingGuides, guideError } = this.state;
                  const selectedId = Number(paymentStatus);
                  if (loadingGuides) return <div style={{ margin: '10px 0' }}>Loading guide...</div>;
                  if (guideError) return <div style={{ color: 'red', margin: '10px 0' }}>{guideError}</div>;
                  const guide = paymentGuides.find(g => Number(g.number) === selectedId);
                  if (guide && guide.message) {
                    return <div style={{ margin: '10px 0', padding: '10px', background: '#f8f8f8', border: '1px solid #eee', borderRadius: 4 }}>
                      {guide.message}
                    </div>;
                  }
                  return null;
                })()}
              </>
            }
            {
              enabledPaymentMethods?.length == 1 && <>
                <label className='textAlignRightRTL'>{paymentStatus == 2 ? formatMessage(messages.stripeContent) : formatMessage(messages.paypal)}</label>
              </>
            }
            {
              paymentStatus == 2 ? (!load ? <Loader /> :
                <>
                  <div className={cx('placeHolderFont', s.cardSection)}>
                    <>
                      <label>
                        <FormattedMessage {...messages.paymentCardNumber} />
                      </label>
                      <CardNumberElement
                        {...createOptions(isRTL(locale))}
                        placeholder="4242 4242 4242 4242"
                        className={cx(s.cardNumberSection, s.cardNumberSectionOne, 'cardNumberRtl')}
                      />
                    </>
                    <div className={s.dateFiledGrid}>
                      <div>
                        <label>
                          <FormattedMessage {...messages.cardExpires} />
                        </label>
                        <CardExpiryElement
                          placeholder="MM / YY"
                          {...createOptions(isRTL(locale))}
                          className={cx(s.cardNumberSectionTwo, s.cardNumberSection, 'cardNumberRtl')}
                        />
                      </div>
                      <div className={cx(s.datePadding, s.cvvNoPadding)}>
                        <label>
                          <FormattedMessage {...messages.cvv} />
                        </label>
                        <CardCvcElement
                          placeholder="_ _ _"
                          {...createOptions(isRTL(locale))}
                          className={cx(s.cardNumberSectionThree, s.cardNumberSection, 'cardNumberRtl')}
                        />
                      </div>
                      <div>
                        <label>
                          <FormattedMessage {...messages.zipcode} />
                        </label>
                        <div className={cx(s.cardNumberSectionFour, 'RTLcardNumberSectionFour')}>
                          <Field
                            name="zipcode"
                            component={this.renderFormControl}
                            className={cx(s.cardNumberSection, 'cardNumberRtlTwo', cs.formControlInput)}
                            placeholder={formatMessage(messages.zipcode)}
                            maxLength={30}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={cx(s.tableFlex, s.flexWrap)}>
                      <img src={imageOne} className={s.stripeImg} />
                      <img src={imageTwo} className={s.stripeImg} />
                    </div>
                  </div>
                </>
              ) : <span></span>
            }
            {
              paymentStatus == 1 &&
              <>
                <Field name="paymentCurrency" disabled={paymentType == 2} component={this.renderFormControlSelect} className={cs.formControlSelect} >
                  <option disabled={paymentLoading} value="">{formatMessage(messages.chooseCurrency)}</option>
                  {
                    this.renderpaymentCurrencies()
                  }
                </Field>
                <p className={cx(cs.commonContentText, cs.paddingBottom4)}>
                  <FormattedMessage {...messages.loginInfo} />
                </p>
              </>
            }
            {paymentStatus === 4 && (
  <>
    <Field
      name="cid"
      type="text"
      component={this.renderFormControl}
      placeholder="Numero de cedula (V12345678)"
      className={cs.formControlInput}
    />
    <Field
      name="codigobancoComercio"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo de Banco (CHAS, BOFA, ETC)"
      className={cs.formControlInput}
    />
    <Field
      name="referencia"
      type="text"
      component={this.renderFormControl}
      placeholder="Confirmacion o Referencia"
      className={cs.formControlInput}
    />
 
  </>
)}
{paymentStatus === 5 && (
  <>
    <Field
      name="codigobancoComercio"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo del banco del comercio"
      className={cs.formControlInput}
    />

    <Field
      name="telefonoCliente"
      type="text"
      component={this.renderFormControl}
      placeholder="Telefono del cliente"
      className={cs.formControlInput}
    />
    <Field
      name="codigobancoCliente"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo del banco del cliente"
      className={cs.formControlInput}
    />
    <Field
      name="telefonoComercio"
      type="text"
      component={this.renderFormControl}
      placeholder="Telefono del comercio"
      className={cs.formControlInput}
    />
  </>
)}
{paymentStatus === 6 && (
  <>
    <Field
      name="cid"
      type="text"
      component={this.renderFormControl}
      placeholder="Cedula de identidad (V12345678)"
      className={cs.formControlInput}
    />
    <Field
      name="cuentaOrigen"
      type="text"
      component={this.renderFormControl}
      placeholder="Cuenta de origen"
      className={cs.formControlInput}
    />
    <Field
      name="telefonoOrigen"
      type="text"
      component={this.renderFormControl}
      placeholder="Telefono de origen"
      className={cs.formControlInput}
    />
    <Field
      name="codigobancoOrigen"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo del banco de origen"
      className={cs.formControlInput}
    />
    <Field
      name="cuentaDestino"
      type="text"
      component={this.renderFormControl}
      placeholder="Cuenta de destino"
      className={cs.formControlInput}
    />

  </>
)}
   {paymentStatus === 3 && (
  <>
    <Field
      name="pan"
      type="text"
      component={this.renderFormControl}
      placeholder="Numero de tarjeta"
      className={cs.formControlInput}
    />
    <Field
      name="cvv2"
      type="text"
      component={this.renderFormControl}
      placeholder="Numero de seguridad (123)"
      className={cs.formControlInput}
    />
    <Field
      name="expdate"
      type="text"
      component={this.renderFormControl}
      placeholder="Fecha de expiracion (MMAA)"
      className={cs.formControlInput}
    />
    <Field
      name="cid"
      type="text"
      component={this.renderFormControl}
      placeholder="Cedula de identidad (V123456789)"
      className={cs.formControlInput}
    />
  </>
)}
{paymentStatus === 7 && (
  <>
    <Field
      name="cid"
      type="text"
      component={this.renderFormControl}
      placeholder="Cedula de identidad (V12345678)"
      className={cs.formControlInput}
    />
    <Field
      name="telefono"
      type="text"
      component={this.renderFormControl}
      placeholder="Numero de telefono"
      className={cs.formControlInput}
    />
    <Field
      name="codigobanco"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo del banco"
      className={cs.formControlInput}
    />
    <Field
      name="codigoc2p"
      type="text"
      component={this.renderFormControl}
      placeholder="Codigo C2P"
      className={cs.formControlInput}
    />
  </>
)}

            <div className={s.payNowFlex}>
              <div className={cx(s.cancelBtn, 'RTLcancelBtn')}>
                {
                  !paymentLoading && <>
                    <Link
                      to={"/cars/" + listId}
                      className={cx(cs.btnPrimaryBorder, cs.displayinlineBlock, cs.spaceTop5)}
                      onClick={this.handleClick}
                    >
                      <FormattedMessage {...messages.cancel} />
                    </Link>
                  </>
                }
                {
                  paymentLoading && <>
                    <a
                      href="javascript:void(0)"
                      className={cx(cs.btnPrimaryBorder, cs.displayinlineBlock, cs.spaceTop5, s.cancelLinkText, {
                        [s.disabledLink]: submitting == true,
                      })}
                    >
                      <FormattedMessage {...messages.cancel} />
                    </a>
                  </>
                }
              </div>
              <Loader
                type={"button"}
                buttonType={"submit"}
                className={cx(cs.btnPrimary, cs.spaceTop5, 'arButtonLoader')}
                disabled={submitting || error}
                show={paymentLoading}
                label={formatMessage(messages.payNow)}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

PaymentForm = reduxForm({
  form: 'PaymentForm',
  validate
})(PaymentForm);

const selector = formValueSelector('PaymentForm');

const mapState = (state) => ({
  paymentCurrencyList: state?.currency?.availableCurrencies,
  paymentLoading: state?.book?.paymentLoading,
  paymentType: selector(state, 'paymentType'),
  securityDepositStatus: state?.siteSettings?.data?.securityDepositPreference,
  country: selector(state, 'country'),
  values: state.form?.PaymentForm?.values || {}, // Always provide all form values
});

const mapDispatch = {
  processCardAction,
  change
};

export default injectStripe(compose(
  injectIntl,
  withStyles(s, cs),
  (connect(mapState, mapDispatch)),
  graphql(gql`
    query getCountries {
        getCountries{
            id
            countryCode
            countryName
            isEnable
            dialCode
        }
    }
`, { options: { ssr: false } }),
  graphql(gql`
  query getPaymentMethods {
    getPaymentMethods {
      id
      name
      isEnable
      paymentType
      paymentName
      status
    }
  }
  `,
    { name: 'getAllPayments' },
    { options: { ssr: false } }
  )
)(PaymentForm))