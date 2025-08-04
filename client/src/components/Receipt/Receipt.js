import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Components
import CurrencyConverter from '../CurrencyConverter';
import ListNotFound from '../../routes/listNotFound/ListNotFound';
import NotFound from '../../routes/notFound/NotFound';
import HostClaimModal from '../HostClaimModal/HostClaimModal';

import messages from '../../locale/messages';
import { formatTime } from '../../helpers/formatting';
import { convert } from '../../helpers/currencyConvertion';
import { isRTL } from '../../helpers/formatLocale';
import { generateTime } from './helper';

//Images
import Faq from './question.svg';
import printIcon from '/public/SiteIcons/printer.png';
import arrowIcon from '/public/SiteIcons/paymentArrow.svg';

import cs from '../../components/commonStyle.css'
import s from './Receipt.css';

function tryFixJsonString(str) {
	if (typeof str !== 'string') return str;
	let fixed = str.trim();
	// Remove trailing commas before closing brackets
	fixed = fixed.replace(/,\s*([}\]])/g, '$1');
	// Close open array
	const openArr = (fixed.match(/\[/g) || []).length;
	const closeArr = (fixed.match(/\]/g) || []).length;
	if (openArr > closeArr) {
		fixed += ']'.repeat(openArr - closeArr);
	}
	// Close open object
	const openObj = (fixed.match(/{/g) || []).length;
	const closeObj = (fixed.match(/}/g) || []).length;
	if (openObj > closeObj) {
		fixed += '}'.repeat(openObj - closeObj);
	}
	return fixed;
}

class PaymentReceipt extends React.Component {

	static propTypes = {
		formatMessage: PropTypes.any,
		siteName: PropTypes.string.isRequired,
		data: PropTypes.shape({
			id: PropTypes.number.isRequired,
			listId: PropTypes.number.isRequired,
			checkIn: PropTypes.string.isRequired,
			checkOut: PropTypes.string.isRequired,
			basePrice: PropTypes.number.isRequired,
			delivery: PropTypes.number.isRequired,
			total: PropTypes.number.isRequired,
			discount: PropTypes.number.isRequired,
			discountType: PropTypes.string,
			guestServiceFee: PropTypes.number.isRequired,
			currency: PropTypes.string.isRequired,
			confirmationCode: PropTypes.number.isRequired,
			createdAt: PropTypes.string.isRequired,
			updatedAt: PropTypes.string.isRequired,
			listData: PropTypes.shape({
				id: PropTypes.number.isRequired,
				title: PropTypes.string.isRequired,
				street: PropTypes.string.isRequired,
				city: PropTypes.string.isRequired,
				state: PropTypes.string.isRequired,
				country: PropTypes.string.isRequired,
				zipcode: PropTypes.string.isRequired,
				listingData: PropTypes.shape({
					checkInStart: PropTypes.string.isRequired,
					checkInEnd: PropTypes.string.isRequired
				}),
				settingsData: PropTypes.arrayOf(PropTypes.shape({
					id: PropTypes.number,
					listsettings: PropTypes.shape({
						itemName: PropTypes.string.isRequired
					})
				}))
			}),
			hostData: PropTypes.shape({
				displayName: PropTypes.string.isRequired,
			}),
			guestData: PropTypes.shape({
				displayName: PropTypes.string.isRequired,
			}),
			bookingSpecialPricing: PropTypes.array,
		})
	};

	static defaultProps = {
		data: null
	};

	state = { showModal: false };

	print() {
		window.print()
	}

	changeModalState = (status = false) => this.setState({ showModal: status });

	render() {
		const { data, siteName, userId } = this.props;
		const { formatMessage } = this.props.intl;
		const { intl: { locale } } = this.props;

		function LinkWithTooltip({ id, children, href, tooltip }) {
			return (
				<OverlayTrigger
					overlay={<Tooltip className={s.tooltip} id={id}>{tooltip}</Tooltip>}
					placement="top"
					delayShow={300}
					delayHide={150}
				>
					{children}
				</OverlayTrigger>
			);
		}

		if (!data) {
			return <> <FormattedMessage {...messages.errorMessage} /> </>;
		} else if (!data.listData) {
			return <ListNotFound />
		} else if (data.paymentState !== "completed") {
			return <NotFound />
		} else {
			const { data, data: { id, listId, checkIn, checkOut, confirmationCode, createdAt, updatedAt, hostId, startTime, endTime, listTitle, dayDifference } } = this.props;
			const { data: { basePrice, delivery, total, discount, discountType, guestServiceFee, currency, hostServiceFee,isHourly, claimRefundedAt, megasoftVoucher } } = this.props;
			const { data: { hostData, guestData, licenseNumber, firstName, middleName, dateOfBirth, countryLabel, claimTransaction } } = this.props;
			const { data: { listData: { title, street, city, state, country, zipcode } } } = this.props;
			const { data: { listData: { listingData: { checkInStart, checkInEnd } } } } = this.props;
			const { data: { listData: { settingsData } }, refetch, currencyRates } = this.props;
			const { data: { bookingSpecialPricing, securityDeposit, claimRefund, claimAmount, claimStatus, claimImages, claimReason, cancellationDetails, reservationState, claimPayout } } = this.props;
			const { showModal } = this.state;

			let roomType, createdDate, updatedDate, birthDate, claimRefundedDate, checkInDate, checkOutDate, isAverage = 0, subTotal, userType;
			let momentStartDate, momentEndDate, dayPrice = 0, checkInTime, checkOutTime, isSpecialPricingAssinged, modalInitialValues = {};
			let isDayTotal = 0, formattedStartTime, formattedEndTime, claimPaidAmount = claimTransaction?.amount, claimPaidCurrency = claimTransaction?.currency;
			roomType = settingsData[0].listsettings.itemName;
			createdDate = createdAt ? moment(createdAt).format('ddd, MMM DD, YYYY ') : '';
			updatedDate = updatedAt ? moment(updatedAt).format('ddd, MMM DD, YYYY ') : '';
			birthDate = dateOfBirth ? moment(dateOfBirth, 'MM-DD-YYYY').format('MM/DD/YYYY') : '';
			claimRefundedDate = claimRefundedAt ? moment(claimRefundedAt).format('ddd, MMM Do, YYYY ') : '';
			checkInDate = checkIn ? moment(checkIn).utc().format('ddd, MMM DD, YYYY ') : '';
			checkOutDate = checkOut ? moment(checkOut).utc().format('ddd, MMM DD, YYYY ') : '';
			isSpecialPricingAssinged = (bookingSpecialPricing && bookingSpecialPricing.length > 0) ? true : false;
			modalInitialValues.securityDeposit = convert(currencyRates.base, currencyRates.rates, securityDeposit, currency, currencyRates.to).toFixed(2);

			if (claimStatus && claimStatus != 'pending') {
				modalInitialValues.claimAmount = convert(currencyRates.base, currencyRates.rates, claimAmount, currency, currencyRates.to).toFixed(2);
				modalInitialValues.claimReason = claimReason;
				modalInitialValues.claimImages = claimImages;
			}

			if (isSpecialPricingAssinged) {
				bookingSpecialPricing && bookingSpecialPricing.map((item, index) => {
					dayPrice = dayPrice + Number(item.isSpecialPrice);
				});
			} else {
				dayPrice = basePrice * dayDifference;
			}

			if (checkInStart === 'Flexible') {
				checkInTime = formatMessage(messages.flexibleCheckIn);
			} else {
				checkInTime = generateTime(checkInStart);
			}

			if (checkInEnd === 'Flexible') {
				checkOutTime = formatMessage(messages.flexibleCheckOut);
			} else {
				checkOutTime = generateTime(checkInEnd);
			}

			if (userId === hostId) {
				userType = 'owner';
				subTotal = total - hostServiceFee;
			} else {
				userType = 'renter';
				subTotal = total + guestServiceFee + securityDeposit;
			}

			isAverage = Number(dayPrice) / Number(dayDifference);
			isDayTotal = isAverage.toFixed(2) * dayDifference;
			dayPrice = isDayTotal;

			formattedStartTime = formatTime(startTime);
			formattedEndTime = formatTime(endTime);

			let checkOutDifference = 0;
			if (reservationState == 'completed') checkOutDifference = moment().diff(moment(checkOut), 'hour', true);
			if (cancellationDetails && reservationState == 'cancelled') {
				let todayDiff = moment().diff(moment(checkIn), 'hour', true);
				if (todayDiff > 0) checkOutDifference = moment().diff(moment(cancellationDetails.createdAt), 'hour', true);
			}

			let showSecurityDeposit = userType === "owner" && securityDeposit <= 0 ? false : true;

			const hourDiff = endTime - startTime;
			const hourlyDifference = hourDiff >= 0 ? hourDiff : (24 - startTime + endTime);
			return (
				<Grid fluid className={cx(s.container, cs.spaceTop4)}>
					<Row>
						<Col lg={12} md={12} sm={12} xs={12}>
							{showModal && <HostClaimModal
								refetchData={refetch}
								claimed={Boolean(claimStatus && claimStatus != 'pending')}
								reservationId={id}
								show={showModal}
								currency={currency}
								changeModalState={this.changeModalState}
								initialValues={modalInitialValues}
							/>}
							<div className={cx(s.diplayFlex, cs.spaceTop5, s.fullWidthMobile)}>
								<div className={cs.spaceBottom4}>
									<h2 className={cx(cs.commonTitleText, cs.paddingBottom1, cs.fontWeightBold)}><FormattedMessage {...messages.customerReceipt} /></h2>
									<h4 className={cx(cs.commonContentText, cs.fontWeightNormal)}><FormattedMessage {...messages.receipt} />: #{id}</h4>
								</div>
								<a className={cx(cs.btnPrimary, cs.btnlarge, "hidden-print", cs.displayInlineBlock, cs.spaceBottom4)} onClick={this.print}>
									<img src={printIcon} className={'commonIconSpace'} />
									<FormattedMessage {...messages.print} />
								</a>
							</div>
							<div className={s.receiptGrid}>
								<div className={cx(cs.spaceBottom4, { [s.directionRTLPrint]: isRTL(locale) })}>
									<div className={s.mainSection}>
										<h6 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom2)}><FormattedMessage {...messages.bookedBy} />: {guestData.firstName} </h6>
										<h4 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom2)}><span><FormattedMessage {...messages.confirmationCode} />:</span> <span>#{confirmationCode}</span></h4>
										<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal)}>{createdDate}</h5>
										<hr className={cx(s.listingHorizoltalLine, cs.spaceBottom3, cs.spaceTop3)} />
										<>
											<h3 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom3)}><FormattedMessage {...messages.vehicleDetails} /></h3>
											<div className={s.displayGridDetails}>
												<>
													<h4 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom8)}><FormattedMessage {...messages.ownersName} /></h4>
													<a href={'/users/show/' + hostData.profileId} target={"_blank"} className={cx(cs.siteLinkColor, cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom2, s.displayInline, "hidden-print")}>
														{hostData.firstName}
													</a>
													<span className={cx(cs.siteLinkColor, cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom2, s.displayInline, 'printText')}>{hostData.firstName}</span>
												</>
												<>
													<h4 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom8)}><FormattedMessage {...messages.whatKindOfPlace} /></h4>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom3)}>{roomType}</p>
												</>
											</div>
											<h5 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom8)}><FormattedMessage {...messages.location} /></h5>
											<a href={'/cars/' + listId} target={"_blank"} className={cx(cs.siteLinkColor, cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom2, s.displayInline, "hidden-print")}>{listTitle || title}</a>
											<span className={cx(cs.siteLinkColor, cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom2, s.displayInline, 'printText')}>{listTitle || title}</span>
											<p className={cx(cs.commonMediumText, cs.fontWeightNormal)}>
												<span>{street}</span>
												<span>{city}, {state} {zipcode}</span>{' '}
												<span>{country}</span>
											</p>
										</>
										<hr className={cx(s.listingHorizoltalLine, cs.spaceBottom3, cs.spaceTop3)} />
										<>
											<h4 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom3)}><FormattedMessage {...messages.tripDetails} /></h4>
											<div className={s.displayGridDate}>
												<h5 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom2)}><FormattedMessage {...messages.checkIn} /></h5>
												<span></span>
												<h5 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom2)}><FormattedMessage {...messages.checkOut} /></h5>
											</div>
											<div className={s.displayGridDate}>
												<div className={s.paddingRight}>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1)}>{checkInDate} </p>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom3)}>{formattedStartTime}</p>
												</div>
												<span className={s.tripArrowIconSec}>
													<img src={arrowIcon} className={cx(cs.dateArrowMargin, 'commonDateArrowRTLRotate', 'printMobileArrow')} />
												</span>
												<div className={s.paddingRight}>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1)}>{checkOutDate}</p>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom3)}>{formattedEndTime}</p>
												</div>
											</div>
											<div className={s.displayGridDetails}>
												
												<>
													<h6 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom2)}><FormattedMessage {...messages.travelDestination} /></h6>
													<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom3)}>{city}</p>
												</>
											</div>
											<h4 className={cx(cs.commonContentText, cs.fontWeightBold, cs.paddingBottom2)}><FormattedMessage {...messages.renterInfo} /></h4>
											<div className={s.displayGridDetails}>
												<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1, cs.dFlexWrapAlignStart, s.colSpaceRight, 'colReceiptSpaceLeftRTL')}>
													<span className={cx(cs.fontWeightMedium, s.infoDetailsPadding, 'receiptInfoDetailSpaceRTL')}><FormattedMessage {...messages.name} />:</span>
													<span>{firstName} {middleName && <>{middleName}</>}</span>
												</p>
												<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1, cs.dFlexWrapAlignStart)}>
													<span className={cx(cs.fontWeightMedium, s.infoDetailsPadding, 'receiptInfoDetailSpaceRTL')}><FormattedMessage {...messages.dob} />:</span>
													<span>{birthDate}</span>
												</p>
												<p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1, cs.dFlexWrapAlignStart, s.colSpaceRight, 'colReceiptSpaceLeftRTL')}>
													<span className={cx(cs.fontWeightMedium, s.infoDetailsPadding, 'receiptInfoDetailSpaceRTL')}><FormattedMessage {...messages.licenseNumber} />:</span>
													<span>{licenseNumber}</span>
												</p>
												{countryLabel && <p className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingBottom1, cs.dFlexWrapAlignStart)}>
													<span className={cx(cs.fontWeightMedium, s.infoDetailsPadding, 'receiptInfoDetailSpaceRTL')}><FormattedMessage {...messages.country} />:</span>
													<span>{countryLabel}</span>
												</p>}
											</div>
										</>
									</div>
								</div>
								<div className={cx({ [s.directionRTLPrint]: isRTL(locale) }, s.positionStickey)}>
									<div className={cx(s.mainSection, cs.spaceBottom4, s.bgColor, 'bgColorPrint')}>
										<h4 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom3)}><FormattedMessage {...messages.billing} /></h4>
										<div className={cx(s.diplayFlex, s.flexBillingSection)}>
											<div className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.positionRelative, s.splitUpColOneWidth)}>
												<div className={cx(s.specialPriceIcon, "hidden-print")}>
													{
														isSpecialPricingAssinged &&
														<span className={s.iconSection}>
															<img src={Faq} className={cx(s.faqImage, 'faqImageRTL')} />
														</span>
													}
													<div className={cx(s.toolTip, s.toolTipRelativeSection, 'toolTipRelativeSectionRTL')}>
														<FormattedMessage {...messages.averageRate} />
													</div>
												</div>
												<span className={cx('directionLtr', cs.displayInlineBlock)}>
													<CurrencyConverter
														amount={basePrice}
														from={currency}
													/>
													{' x'}
													{
                        isHourly ?
                        <>
                        {hourlyDifference} {hourlyDifference > 1 ? "Hour" :"Hours"}
                        </>
                        :
                        <>
                        {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                        </>

                      }
												</span>
											</div>
											<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
											{
                           isHourly ?
                           <>
                             <CurrencyConverter
                    amount={dayPrice*hourlyDifference}
                    from={currency}
                  />
                           </>
                  
                :
                <>
                  <CurrencyConverter
                    amount={dayPrice}
                    from={currency}
                  />
                </>
                }
											</h6>
										</div>
										{
											delivery > 0 && <>
												<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
												<div className={cx(s.diplayFlex, s.flexBillingSection)}>
													<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.splitUpColOneWidth)}>
														<FormattedMessage {...messages.cleaningFee} />
													</h5>
													<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={delivery}
															from={currency}
														/>
													</h6>
												</div>
											</>
										}
										{
											discount > 0 && <>
												<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
												<div className={cx(s.diplayFlex, s.flexBillingSection)}>
													<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.splitUpColOneWidth)}>{discountType}</h5>
													<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, s.discountColor, 'textAlignLeftRTL')}>{"-"}
														<CurrencyConverter
															amount={discount}
															from={currency}
														/>
													</h6>
												</div>
											</>
										}
										{
											userType === 'renter' && guestServiceFee > 0 && <>
												<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
												<div className={cx(s.diplayFlex, s.flexBillingSection)}>
													<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.splitUpColOneWidth)}><FormattedMessage {...messages.serviceFee} /></h5>
													<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={guestServiceFee}
															from={currency}
														/>
													</h6>
												</div>
											</>
										}
										{
											userType === 'owner' && hostServiceFee > 0 && <>
												<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
												<div className={cx(s.diplayFlex, s.flexBillingSection)}>
													<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.splitUpColOneWidth)}><FormattedMessage {...messages.serviceFee} /></h5>
													<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														{'-'}<CurrencyConverter
															amount={hostServiceFee}
															from={currency}
														/>
													</h6>
												</div>
											</>
										}
										{
											userType === 'renter' && securityDeposit > 0 && <>
												<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
												<div className={cx(s.diplayFlex, s.flexBillingSection)}>
													<h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, s.splitUpColOneWidth)}>
														<FormattedMessage {...messages.securityDeposit} />
													</h5>
													<h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={securityDeposit}
															from={currency}
														/>
													</h6>
												</div>
											</>
										}
										{userType === 'renter' && data.reservationState != 'cancelled' && <>
											<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
											<div className={cx(s.diplayFlex, s.flexBillingSection)}>
												<h5 className={cx(cs.commonMediumText, cs.fontWeightBold, s.splitUpColOneWidth)}><FormattedMessage {...messages.total} /></h5>
												<h6 className={cx(cs.commonMediumText, cs.fontWeightBold, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
													<CurrencyConverter
														amount={subTotal}
														from={currency}
													/>
												</h6>
											</div>
										</>}
										{userType === 'owner' && <>
											<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
											<div className={cx(s.diplayFlex, s.flexBillingSection)}>
												<h5 className={cx(cs.commonMediumText, cs.fontWeightBold, s.splitUpColOneWidth)}>
													{reservationState == 'completed' ? <FormattedMessage {...messages.earnings} /> :

														<FormattedMessage {...messages.estimatedEarnings} />
													}
												</h5>
												<h6 className={cx(cs.commonMediumText, cs.fontWeightBold, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
													<CurrencyConverter
														amount={subTotal > 0 ? subTotal : 0}
														from={currency}
													/>
												</h6>
											</div>
										</>
										}
										{userType === 'owner' && reservationState == 'cancelled' && cancellationDetails && <>
											<hr className={cx(cs.listingHorizoltalLine, cs.spaceBottom2, cs.spaceTop2)} />
											<div className={cx(s.diplayFlex, s.flexBillingSection)}>
												<h5 className={cx(cs.commonMediumText, cs.fontWeightBold, s.splitUpColOneWidth)}><FormattedMessage {...messages.actualEarnings} /></h5>
												<h6 className={cx(cs.commonMediumText, cs.fontWeightBold, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
													<CurrencyConverter
														amount={cancellationDetails.payoutToHost}
														from={currency}
													/>
												</h6>
											</div>
										</>}
									</div>
									{showSecurityDeposit && <div className={cx(s.mainSection, cs.spaceBottom4)}>
										{userType === 'renter' && <h4 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.paddingBottom3)}><FormattedMessage {...messages.payment} /></h4>}
										{
											userType === 'renter' &&
											<>
												<div className={cx(s.diplayFlex, cs.paddingBottom2)}>
													<h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.splitUpColOneWidth)}><FormattedMessage {...messages.paid} /></h5>
													<h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={subTotal}
															from={currency}
														/>
													</h6>
												</div>
												<p className={cx(cs.commonContentText, cs.fontWeightNormal)}>{updatedDate}</p>
											</>
										}
										{
											userType === 'owner' && securityDeposit > 0 &&
											<>
												<div className={cx(s.diplayFlex)}>
													<h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.splitUpColOneWidth)}><FormattedMessage {...messages.securityDepositByRenter} /></h5>
													<p className={cx(cs.commonContentText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={securityDeposit}
															from={currency}
														/>
													</p>
												</div>

												{claimStatus == 'pending' && checkOutDifference > 0 && checkOutDifference < 24 && <div className={cs.spaceTop8}><span><a className={cx(cs.siteLinkColor, cs.curserPointer, cs.commonContentText, cs.fontWeightMedium)} onClick={() => this.changeModalState(true)}>{' ('}<FormattedMessage {...messages.claimDamage} />{')'}</a></span></div>}
												{claimAmount > 0 && <div className={cs.spaceTop8}><span><a className={cx(cs.siteLinkColor, cs.curserPointer, cs.commonContentText, cs.fontWeightMedium)} onClick={() => this.changeModalState(true)}>{' ('}<FormattedMessage {...messages.claimDetails} />{')'}</a></span></div>}

											</>
										}
										{
											userType === 'renter' && (['approved', 'fullyRefunded'].includes(claimStatus)) &&
											<>
												<div className={cx(s.diplayFlex, cs.spaceTop4)}>
													<h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.splitUpColOneWidth)}>
														<FormattedMessage {...messages.refundedSecurityDeposit} />
													</h5>
													<h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={claimRefund}
															from={currency}
														/>
													</h6>
												</div>
												<p className={cx(cs.commonContentText, cs.fontWeightNormal, cs.spaceTop8)}>{claimRefundedDate}</p>

												{securityDeposit > 0 && claimAmount > 0 && <div className={cs.spaceTop8}><a className={cx(cs.siteLinkColor, cs.curserPointer, cs.commonContentText, cs.fontWeightMedium)} onClick={() => this.changeModalState(true)}>{' ('}<FormattedMessage {...messages.claimDetails} />{')'}</a></div>}

											</>
										}
										{
											userType === 'owner' && claimStatus == 'approved' && claimPayout > 0 && <>
												<div className={cx(s.diplayFlex, cs.spaceTop4)}>
													<h5 className={cx(cs.commonContentText, cs.fontWeightNormal, s.splitUpColOneWidth)}>
														<FormattedMessage {...messages.claimPaidToHost} />
													</h5>
													<h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.textAlignRight, s.splitUpColTwoWidth, 'textAlignLeftRTL')}>
														<CurrencyConverter
															amount={claimPayout}
															from={currency}
														/>
													</h6>
												</div>
												<p className={cx(cs.commonContentText, cs.fontWeightNormal, cs.spaceTop8)}>{claimRefundedDate}</p>
											</>
										}
									</div>}
								</div>
							</div>
							{megasoftVoucher && (() => {
								try {
									let parsed;
									try {
										parsed = typeof megasoftVoucher === 'string' ? JSON.parse(megasoftVoucher) : megasoftVoucher;
									} catch (e) {
										const fixed = tryFixJsonString(megasoftVoucher);
										try {
											parsed = JSON.parse(fixed);
										} catch (e2) {
											return (
												<div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
													<strong>Voucher Details:</strong>
													<pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
												</div>
											);
										}
									}
									if (typeof parsed === 'object' && parsed !== null) {
										const fieldOrder = [
											'control', 'codigo', 'descripcion', 'vtid', 'seqnum', 'authid', 'authname', 'factura', 'referencia', 'terminal', 'lote', 'rifba', 'monto', 'fecha', 'hora', 'cuenta', 'pan', 'aprobacion', 'status', 'tarjeta', 'banco', 'cliente', 'telefono', 'email', 'cedula', 'tipo', 'moneda', 'bancoDestino', 'bancoOrigen', 'cuentaDestino', 'cuentaOrigen', 'comercio', 'pos', 'c2p', 'p2c', 'zelle', 'zelleRef', 'zelleName', 'zelleEmail', 'zellePhone', 'zelleBank', 'zelleDate', 'zelleTime', 'zelleAmount', 'zelleStatus', 'zelleControl', 'zelleTerminal', 'zelleLote', 'zelleFactura', 'zelleAprobacion', 'zelleDescripcion', 'zelleCodigo', 'zelleSeqnum', 'zelleAuthid', 'zelleAuthname', 'zelleRifba', 'zelleMonto', 'zelleCuenta', 'zellePan', 'zelleCliente', 'zelleCedula', 'zelleTipo', 'zelleMoneda', 'zelleBancoDestino', 'zelleBancoOrigen', 'zelleCuentaDestino', 'zelleCuentaOrigen', 'zelleComercio', 'zellePos', 'zelleC2p', 'zelleP2c'
										];
										const shown = new Set();
										return (
											<div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
												<strong>Voucher Details:</strong>
												<div style={{ fontSize: 13, marginTop: 8 }}>
													{fieldOrder.map(key => {
														if (key === 'voucher') return null;
														if (parsed[key] !== undefined) {
															shown.add(key);
															let value = parsed[key];
															if (Array.isArray(value)) value = value.join(', ');
															return (
																<div key={key} style={{ marginBottom: 4 }}>
																	<strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
																</div>
															);
														}
														return null;
													})}
													{Object.keys(parsed).filter(key => !shown.has(key) && key !== 'voucher').map(key => {
														let value = parsed[key];
														if (Array.isArray(value)) value = value.join(', ');
														return (
															<div key={key} style={{ marginBottom: 4 }}>
																<strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
															</div>
														);
													})}
												</div>
											</div>
										);
									} else {
										return (
											<div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
												<strong>Voucher Details:</strong>
												<pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
											</div>
										);
									}
								} catch (e) {
									return (
										<div style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, padding: 12, margin: '16px 0', wordBreak: 'break-all' }}>
											<strong>Voucher Details:</strong>
											<pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>{megasoftVoucher}</pre>
										</div>
									);
								}
							})()}
							<p className={cx(cs.commonContentText, cs.fontWeightNormal, cs.paddingBottom2)}>
								{siteName} <FormattedMessage {...messages.receiptInfo1} />{' '}
								<FormattedMessage {...messages.receiptInfo2} /> {siteName}.{' '}
								<FormattedMessage {...messages.receiptInfo3} /> {siteName}.
							</p>
						</Col>
					</Row>
				</Grid >
			);
		}
	}
}

const mapState = (state) => ({
	siteName: state?.siteSettings?.data?.siteName,
	userId: state?.account?.data?.userId,
	currencyRates: state?.currency
});

const mapDispatch = {};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(PaymentReceipt)));