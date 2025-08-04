import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import { change, reset, initialize } from 'redux-form';

// Compose
import { graphql, gql, compose } from 'react-apollo';
// Translation
import { injectIntl, FormattedMessage } from 'react-intl';
// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';
// External Component
import { DateUtils } from 'react-day-picker';
// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
	FormGroup,
	ControlLabel,
	FormControl,
	Form,
	Row,
	Col
} from 'react-bootstrap';
// Loader
import Loader from '../Loader';
import CommonFormComponent from '../CommonField/CommonFormComponent';
import { getListBlockedDates } from '../../actions/Listing/getListBlockedDates';
import { getListingDataStep3 } from '../../actions/getListingDataStep3';
// Locale
import messages from '../../locale/messages';
import validate from './validate';
import { normalizePrice } from '../EditProfileForm/normalizePhone';
import showToaster from '../../helpers/toasterMessages/showToaster';
import s from '!isomorphic-style-loader!css-loader!./DayDragCalendar.css';
import c from './SaveCalendar.css';
import cs from '../commonStyle.css';

class AvailableDates extends Component {

	constructor(props) {
		super(props);
		const { selectedSlotData } = props;
		this.state = {
			dateRange: [],
			isLoading: false,
			isDisabled: false,
			startHour: selectedSlotData?.startTime || '',
			endHour: selectedSlotData?.endTime || '',
		};
		this.submitForm = this.submitForm.bind(this);
		this.handleHourlyChange = this.handleHourlyChange.bind(this);
	}

	handleHourlyChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
		this.props.change('CalendarPrice', name, value);
	}

	componentDidMount() {
		const { formErrors, selectedSlotData, initialize } = this.props;
		this.setState({ isDisabled: formErrors?.hasOwnProperty('syncErrors') ? true : false });
		
		// Initialize form with selected slot data
		if (selectedSlotData) {
			initialize({
				isSpecialPrice: selectedSlotData.isSpecialPrice,
				startTime: selectedSlotData.startTime,
				endTime: selectedSlotData.endTime
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { start, end, formErrors, selectedSlotData, initialize } = nextProps;
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

		// Update form when selected slot data changes
		if (selectedSlotData) {
			initialize({
				isSpecialPrice: selectedSlotData.isSpecialPrice,
				startTime: selectedSlotData.startTime,
				endTime: selectedSlotData.endTime
			});
			this.setState({
				startHour: selectedSlotData.startTime || '',
				endHour: selectedSlotData.endTime || ''
			});
		}

		this.setState({ 
			isDisabled: formErrors?.hasOwnProperty('syncErrors') ? true : false,
			dateRange 
		});
	}


	async submitForm() {
		const { listId, resetCalendar, dispatch, mutate } = this.props;
		const { isSpecialPrice, start, end, selectedDays, getListBlockedDates, getListingDataStep3 } = this.props;
		const { dateRange, isLoading, startHour, endHour } = this.state;
		const { formatMessage } = this.props.intl;
		const { minDay, maxDay, houseRules, checkInEnd, checkInStart } = this.props;
		const { cancellationPolicy, maxDaysNotice, bookingNoticeTime } = this.props;
		const { basePrice, delivery, currency, isStartDate, isEndDate, monthlyDiscount, weeklyDiscount, securityDeposit } = this.props;
		const { removeBlockedDates, updateBlockedDates, setStateLoading } = this.props;

		let minDayValues, maxDayValues, checkInEndValue, checkInStartValue, isCancel,
			isMaxDays, isBooking, updatedAvailableDatesDays, dateRangeNew = [], rangeStart, rangeEnd;

		minDayValues = minDay != '' ? minDay : 0;
		maxDayValues = maxDay != '' ? maxDay : 0;
		checkInEndValue = checkInEnd != '' ? checkInEnd : 'flexible';
		checkInStartValue = checkInStart != '' ? checkInStart : 'flexible';
		isCancel = cancellationPolicy ? cancellationPolicy : '1';
		isMaxDays = maxDaysNotice ? maxDaysNotice : 'unavailable';
		isBooking = bookingNoticeTime ? bookingNoticeTime : 58;
		updatedAvailableDatesDays = dateRange;
		setStateLoading({ isBlocking: true })

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

		if (isSpecialPrice && (isNaN(isSpecialPrice) || (parseFloat(isSpecialPrice, 10) < 0.1))) {
			showToaster({ messageId: 'invalidSpecialPrice', toasterType: 'error' })
			setStateLoading({ isBlocking: false })
			return;
		}

		if (dateRangeNew?.length > 0) {

			dateRangeNew.forEach(async (item, index) => {
				let selectedIndex = updatedAvailableDatesDays.findIndex(selectedDay =>
					DateUtils.isSameDay(selectedDay, item)
				);

				if (selectedIndex < 0) {
					updatedAvailableDatesDays.push(item);
				}
			});


			if (isSpecialPrice && isSpecialPrice > 0) {

				const { data } = await updateBlockedDates({
					variables: {
						listId,
						blockedDates: updatedAvailableDatesDays,
						calendarStatus: 'available',
						isSpecialPrice: isSpecialPrice,
						startTime: startHour || '',
						endTime: endHour || ''
					}
				});

				if (data?.UpdateBlockedDates?.status == '400') {
					showToaster({ messageId: 'updateBlockedDates', toasterType: 'error' })
				}

			} else {
				const { data } = await removeBlockedDates({
					variables: {
						listId,
						blockedDates: updatedAvailableDatesDays,
						startTime: startHour || '',
						endTime: endHour || ''
					}
				});
				if (data?.removeBlockedDates?.status == '200') {

				} else if (data?.removeBlockedDates?.status == '400') {
					showToaster({ messageId: 'removeBlockedDates', toasterType: 'error' })
				} else {
					setStateLoading({ isBlocking: false })
				}
			}
			await change("blockedDates", updatedAvailableDatesDays);
			await change("startTime", startHour || '');
			await change("endTime", endHour || '');
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
			await resetCalendar();
			window.scroll({ top: 0 });
			setStateLoading({ isBlocking: false })
		}
	}
	renderHourlySettings() {
		const { startHour, endHour } = this.state;
		return (
			<div className={s.hourlySettings}>
				<h4><FormattedMessage {...messages.hourlyAvailability} /></h4>
				<Row>
					<Col xs={6}>
						<FormGroup>
							<ControlLabel><FormattedMessage {...messages.startTime} /></ControlLabel>
							<FormControl
								type="time"
								name="startHour"
								value={startHour}
								onChange={this.handleHourlyChange}
								className={s.timeInput}
							/>
						</FormGroup>
					</Col>
					<Col xs={6}>
						<FormGroup>
							<ControlLabel><FormattedMessage {...messages.endTime} /></ControlLabel>
							<FormControl
								type="time"
								name="endHour"
								value={endHour}
								onChange={this.handleHourlyChange}
								className={s.timeInput}
							/>
						</FormGroup>
					</Col>
				</Row>
			</div>
		);
	}

	render() {
		const { error, handleSubmit, submitting, start, end, isStartDate, isBlocking, isSaving, isCurrentStatus } = this.props;
		const { formatMessage } = this.props.intl;
		const { isDisabled } = this.state;

		return (
			<div>
				<Form onSubmit={handleSubmit(this.submitForm)}>
					{error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
					<FormGroup className={cx(s.formGroup, cs.spaceBottom4)}>
						<ControlLabel className={s.landingLabel}>
							<FormattedMessage {...messages.sessionPrice} />
						</ControlLabel>
						<Field
							name="isSpecialPrice"
							type="text"
							component={CommonFormComponent}
							label={formatMessage(messages.basePriceLabel)}
							inputClass={cx(s.formControlInput, s.jumboInput, c.inputHeight)}
							normalize={normalizePrice}
						/>
					</FormGroup>
					{isCurrentStatus === 3 && this.renderHourlySettings()}
					<FormGroup className={cx(c.formGroup, c.buttonLeft, 'arButtonLoader', 'buttonLeftRTL')}>
						<Loader
							type={"button"}
							buttonType={"button"}
							show={isBlocking}
							className={cx(c.btnPrimary, c.btnlarge)}
							disabled={submitting || isSaving || isDisabled}
							label={formatMessage(messages.save)}
							containerClass={c.loaderContainer}
							handleClick={this.submitForm}
						/>
					</FormGroup>
				</Form>
			</div>
		);
	}
}

AvailableDates = reduxForm({
	form: 'CalendarPrice', // a unique name for this form
	validate,
})(AvailableDates);

const selector = formValueSelector('CalendarPrice');

const mapState = (state) => ({
	isSpecialPrice: selector(state, 'isSpecialPrice'),
	formErrors: state.form.CalendarPrice,
});

const mapDispatch = {
	change,
	getListBlockedDates,
	getListingDataStep3
};

export default compose(
	injectIntl,
	withStyles(s, c, cs),
	connect(mapState, mapDispatch),
	graphql(gql`
    mutation (
      $listId: Int!, 
      $blockedDates: [String],
      $calendarStatus: String,
      $isSpecialPrice: Float,
      $startTime: String,
      $endTime: String
    ) {
          UpdateBlockedDates (
            listId: $listId, 
            blockedDates: $blockedDates,
            calendarStatus: $calendarStatus,
            isSpecialPrice: $isSpecialPrice,
            startTime: $startTime,
            endTime: $endTime
        ) {
          status
        }
        }
  `, {
		name: 'updateBlockedDates'
	}),
	graphql(gql`
      mutation removeBlockedDates(
      $listId: Int!,
      $blockedDates: [String],
      $startTime: String,
      $endTime: String
      ){
        removeBlockedDates(
          listId: $listId, 
          blockedDates: $blockedDates,
          startTime: $startTime,
          endTime: $endTime
          ) {
              status
              errorMessage
          }
      }
  `, {
		name: 'removeBlockedDates'
	}),
)(AvailableDates);
