import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Elements } from 'react-stripe-elements';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { FormattedMessage, injectIntl } from 'react-intl';

// Component
import PaymentDetails from './PaymentDetails';
import PaymentForm from './PaymentForm';
import Avatar from '../../Avatar';
import ListCoverPhoto from '../../ListCoverPhoto';

// Helper
import billDetailsHelpers from '../../../helpers/billDetailsHelper';
import messages from '../../../locale/messages';

//Image
import steeringIcon from '/public/SiteIcons/steeringIcon.svg';
import arrowIcon from '/public/SiteIcons/paymentArrow.svg';
import starIcon from '/public/SiteIcons/star.svg';
import Arrow from '/public/siteImages/rightSideArrow.svg';

import cs from '../../commonStyle.css';
import s from './Payment.css';
import { formatTime } from '../../../helpers/formatting';

class Payment extends Component {

  static propTypes = {
    listId: PropTypes.number.isRequired,
    hostId: PropTypes.string.isRequired,
    guestId: PropTypes.string.isRequired,
    guestEmail: PropTypes.string.isRequired,
    hostDisplayName: PropTypes.string.isRequired,
    hostPicture: PropTypes.string,
    coverPhoto: PropTypes.string,
    listTitle: PropTypes.string.isRequired,
    allowedPersonCapacity: PropTypes.number.isRequired,
    listType: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    houseRules: PropTypes.arrayOf(PropTypes.shape({
      listsettings: PropTypes.shape({
        itemName: PropTypes.string.isRequired
      })
    })),
    checkIn: PropTypes.object.isRequired,
    checkOut: PropTypes.object.isRequired,
    guests: PropTypes.number.isRequired,
    basePrice: PropTypes.number.isRequired,
    delivery: PropTypes.number,
    currency: PropTypes.string.isRequired,
    weeklyDiscount: PropTypes.number,
    monthlyDiscount: PropTypes.number,
    listPhotos: PropTypes.array,
    serviceFees: PropTypes.shape({
      guest: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
      }).isRequired,
      host: PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    base: PropTypes.string.isRequired,
    rates: PropTypes.object.isRequired,
    bookingType: PropTypes.string.isRequired,
    policyName: PropTypes.string.isRequired,
    formatMessage: PropTypes.any,
    reviewsCount: PropTypes.number.isRequired,
    reviewsStarRating: PropTypes.number.isRequired,
  };

  render() {
    const { guestEmail, hostDisplayName, hostPicture, coverPhoto, listPhotos, bookingType, policyName, policyContent } = this.props;
    const { listId, listTitle, allowedPersonCapacity, hostProfileId, hostJoined, transmission, settingsData } = this.props;
    const { houseRules, hostId, guestId, securityDeposit, securityDepositStatus ,hourlyPrice,isSingleDate} = this.props;
    const { guests, checkIn, checkOut, startTime, endTime } = this.props;
    const { formatMessage } = this.props.intl;
    const { basePrice, delivery, currency, weeklyDiscount, monthlyDiscount } = this.props;
    const { serviceFees, base, rates, specialPricing, bookingData, reviewsCount, reviewsStarRating } = this.props;
    let formattedStartTime, formattedEndTime, starRatingValue = 0, totalWithoutFees = 0;
    let carType = settingsData && settingsData.length > 0 && settingsData[0].listsettings.itemName, transmissionLabel;
    transmission == '1' ? transmissionLabel = formatMessage(messages.Automatic) : transmissionLabel = formatMessage(messages.Manuall);

    let securityDepositAmount = securityDepositStatus == 1 ? securityDeposit : 0;
console.log('--- Props Passed to billDetailsHelpers ---');
console.log({
  specialPricing,
  serviceFees,
  monthlyDiscount,
  weeklyDiscount,
  base,
  rates,
  currency,
  startTime,
  endTime,
  hourlyPrice:isSingleDate,
  bookingType: hourlyPrice,
  basePrice,
  delivery,
  securityDeposit: securityDepositAmount,
  startDate: checkIn,
  endDate: checkOut,
  discountForMonth: formatMessage(messages.monthlyDiscount),
  discountForWeek: formatMessage(messages.weeklyDiscount)
});
    let {
      discountType, isAverage, isDayTotal, discount, serviceFee: guestServiceFee,
      hostServiceFee, total, dayDifference, isSpecialPriceAssigned, priceForDays, bookingSpecialPricing
    } =
      billDetailsHelpers({
        specialPricing, serviceFees, monthlyDiscount, weeklyDiscount, base, rates, currency,
        startTime, endTime, startDate: checkIn, endDate: checkOut,  hourlyPrice:isSingleDate,
  bookingType: hourlyPrice,
        basePrice, delivery, securityDeposit: securityDepositAmount,
        discountForMonth: formatMessage(messages.monthlyDiscount),
        discountForWeek: formatMessage(messages.weeklyDiscount)
      });
console.log('--- Returned Values from billDetailsHelpers ---');
console.log({
  discountType,
  isAverage,
  isDayTotal,
  discount,
  guestServiceFee,
  hostServiceFee,
  total,
  dayDifference,
  isSpecialPriceAssigned,
  priceForDays,
  bookingSpecialPricing
});
    totalWithoutFees = (priceForDays + delivery) - discount;

    let checkInDate = checkIn ? moment(checkIn).format('ddd, MMM D, YYYY') : '';
    let checkOutDate = checkOut ? moment(checkOut).format('ddd, MMM D, YYYY') : '';

    let initialValues = {
      listId,
      listTitle,
      hostId,
      guestId,
      guests,
      checkIn,
      checkOut,
      basePrice,
      currency,
      delivery,
      discount,
      discountType,
      guestServiceFee,
      hostServiceFee,
      hostSeriveFeeType: serviceFees?.host?.type,
      hostSeriveFeeValue: serviceFees?.host?.value,
      total: totalWithoutFees,
      bookingType,
      paymentType: '2',
      guestEmail,
      isSpecialPriceAssigned,
      bookingSpecialPricing: JSON.stringify(bookingSpecialPricing),
      isSpecialPriceAverage: isAverage.toFixed(2),
      dayDifference,
      startTime,
      endTime,
      securityDeposit: securityDepositAmount
    };

    formattedStartTime = startTime ? formatTime(startTime) : "00";
    formattedEndTime =endTime ? formatTime(endTime) : "00";
const rawDiff = endTime - startTime;
const hours = rawDiff >= 0 ? rawDiff : (24 - startTime + endTime);
console.log(hours, "testhours")
const formattedHours = parseFloat(hours.toFixed(1));
const hourlyDifference = `x ${formattedHours} ${formattedHours > 1 ? 'Hours' : 'Hour'}`;
const totalHourPrice = formattedHours*isSingleDate
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Math.round(reviewsStarRating / reviewsCount)
    }
    return (
      <Grid fluid className={s.container}>
        <Row className={cx(cs.positionRelative, cs.displayFlex, s.paymentFlexDirection, cs.alignItemFlexStart)}>
          <Col lg={7} md={7} sm={12} xs={12} className={cx(cs.spaceTop7, 'paymentDetailsPadding')}>
            <Elements>
              <PaymentForm
                hostDisplayName={hostDisplayName}
                houseRules={houseRules}
                isSingleDate={!hourlyPrice}
                hourlyPrice = {isSingleDate}
                allowedPersonCapacity={allowedPersonCapacity}
                initialValues={initialValues}
                listId={listId}
                hostPicture={hostPicture}
                hostProfileId={hostProfileId}
                hostJoined={hostJoined}
              />
            </Elements>
          </Col>
          <Col lg={5} md={5} sm={12} xs={12} className={cx(cs.spaceTop7, cs.paymentSticky)}>
            <div className={s.datePanelSection}>
              <div className={cx(cs.positionRelative, cs.spaceBottom3)}>
                <a href={"/cars/" + listId} target={"_blank"}>
                {listPhotos && listPhotos.length > 0 && (
                      <div 
                        className={cx(s.imageContent, cs.spaceBottom1)}
                        style={{
                          backgroundImage: `url(/images/upload/${listPhotos[0].name})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          width: '100%',
                          height: '200px',
                          borderRadius: '8px'
                        }}
                      />
                    )}
                </a>
                <div className={cx(cs.positionAvatar, 'positionAvatarRTL')}>
                  <Avatar
                    source={hostPicture}
                    title={hostDisplayName}
                    profileId={hostProfileId}
                    className={cx(cs.profileAvatarLink, cs.profileAvatarLinkSmall)}
                    width={44}
                    height={44}
                    withLink
                  />
                </div>
              </div>
              <div className={cx(s.houseRules, cs.spaceTop3)}>
                <img src={steeringIcon} className={'commonIconSpace'} />
                <h6 className={cx(cs.commonSmallText, cs.fontWeightNormal)}>
                  <span>{carType}</span>
                  <span className={cs.dotCss}></span>
                  <span>{transmissionLabel}</span>
                </h6>
              </div>
              {/* <a href={"/cars/" + listId} target={"_blank"} className={cx(cs.spaceTop1, cs.commonContentText, cs.fontWeightBold, cs.siteLinkColor)}>
                {listTitle}
              </a> */}
              <div className={cx(cs.spaceTop1, cs.commonContentText, cs.fontWeightBold)}>
                {listTitle}
              </div>
              {starRatingValue > 0 && <div className={cx(cs.spaceTop1, cs.commonContentText, s.starFlex)}>
                <img src={starIcon} className={'searchHeaderIcon'} /> <span>{starRatingValue}</span>
              </div>}
              <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
              <div className={s.tableFlex}>
                <div>
                  <h4 className={cx(cs.commonSmallText, cs.fontWeightNormal, cs.paddingBottom1)}><FormattedMessage {...messages.checkIn} /></h4>
                  <h5 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.siteLinkColor, cs.paddingBottom1)}>{checkInDate}</h5>
                  {
                    formattedStartTime &&
                    <h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.siteLinkColor)}>{formattedStartTime}</h6>
                  }
                </div>
                <img src={arrowIcon} className={cx(s.arrowMargin, 'commonDateArrowRTLRotate')} />
                <div>
                  <h5 className={cx(cs.commonSmallText, cs.fontWeightNormal, cs.paddingBottom1)}><FormattedMessage {...messages.checkOut} /></h5>
                  <h4 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.siteLinkColor, cs.paddingBottom1)}>{checkOutDate}</h4>
                  {
                    formattedEndTime &&
                    <h6 className={cx(cs.commonContentText, cs.fontWeightNormal, cs.siteLinkColor)}> {formattedEndTime}</h6>
                  }
                </div>
              </div>
              <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
              <PaymentDetails
                basePrice={basePrice}
                hourlyPrice={isSingleDate}
                isSingleDate={hourlyPrice}
                hourlyDifference={hourlyDifference}
                delivery={delivery}
                securityDeposit={securityDeposit}
                currency={currency}
                dayDifference={dayDifference}
                totalHourPrice={totalHourPrice}
                priceForDays={priceForDays}
                discount={discount}
                discountType={discountType}
                serviceFees={guestServiceFee}
                total={total}
                bookingSpecialPricing={bookingSpecialPricing}
                isSpecialPriceAssigned={isSpecialPriceAssigned}
                isAverage={isAverage}
                securityDepositStatus={securityDepositStatus}
              />
            </div>
            <div className={cx(s.cancellationSectionPayment, cs.spaceTop4, cs.spaceBottom4)}>
              <p className={cx(cs.commonSubTitleText, cs.fontWeightBold, cs.paddingBottom3)}>
                <span><FormattedMessage {...messages.cancellationPolicy} /></span>
                :   <a
                  href={"/cancellation-policies/"} className={cs.siteLinkColor}
                  target={'_blank'}
                ><span >{policyName}</span></a>
              </p>
              <p className={cx(cs.commonContentText, cs.paddingBottom2)}>
                {policyContent}
              </p>
              <a
                href={"/cancellation-policies/"}
                target={'_blank'}
                className={cx(cs.commonContentText, cs.siteLinkColor, cs.fontWeightMedium, cs.commomLinkborderBottom, cs.textDecorationNone)}
              >
                <FormattedMessage {...messages.viewDetails} />
                <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
              </a>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default injectIntl(withStyles(s, cs)(Payment));