/* Plugins */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import cx from 'classnames';
import { FcFlashOn } from 'react-icons/fc';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';

/* Components. */
import Loader from '../../Loader';
import Link from '../../Link';
import CurrencyConverter from '../../CurrencyConverter';
import ViewCount from '../ViewCount';
import BookingForm from './BookingForm';

// Locale
import messages from '../../../locale/messages';

//Images
import Arrow from '/public/siteImages/rightSideArrow.svg';

import s from './Calendar.css';
import cs from '../../../components/commonStyle.css';

class Calendar extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        personCapacity: PropTypes.number.isRequired,
        listingData: PropTypes.shape({
            basePrice: PropTypes.number.isRequired,
            hourlyPrice: PropTypes.number,
            delivery: PropTypes.number,
            currency: PropTypes.string,
            monthlyDiscount: PropTypes.number,
            weeklyDiscount: PropTypes.number,
            minDay: PropTypes.number,
            maxDay: PropTypes.number,
            maxDaysNotice: PropTypes.string,
        }),
        isLoading: PropTypes.bool,
        loading: PropTypes.bool,
        blockedDates: PropTypes.array,
        isHost: PropTypes.bool.isRequired,
        bookingType: PropTypes.string.isRequired,
        formatMessage: PropTypes.any,
        userBanStatus: PropTypes.number,
        reviewsCount: PropTypes.number.isRequired,
        reviewsStarRating: PropTypes.number.isRequired,
    };
    static defaultProps = {
        isLoading: false,
        loading: false,
        blockedDates: [],
        isHost: false,
        listingData: {
            basePrice: 0,
            hourlyPrice: 0,
            delivery: 0,
            monthlyDiscount: 0,
            weeklyDiscount: 0,
            minDay: 0,
            maxDay: 0
        }
    };
    constructor(props) {
        super(props);
    }
    render() {
        const { id, personCapacity, isLoading, isHost, userBanStatus, bookingType, data, showContactHostModal, cancellationPolicyData } = this.props;
        const { listingData: {hourlyPrice, basePrice, delivery, currency, monthlyDiscount, weeklyDiscount, minDay, maxDay, maxDaysNotice, securityDeposit } } = this.props;
        const { loading, blockedDates, startDate, endDate } = this.props;
        const { reviewsCount, reviewsStarRating, URLRoomType } = this.props;
        const { startTime, endTime } = this.props;

        let loadingStatus = loading || isLoading && !showContactHostModal ? true : false;
        let initialValues = {
            startDate,
            endDate,
            startTime,
            endTime
        }
        let starRatingValue = 0;
        if (reviewsCount > 0 && reviewsStarRating > 0) {
            starRatingValue = Math.round(reviewsStarRating / reviewsCount)
        }

        return (
            <>
                <div className={cx(s.bookItContainer, 'bookItContentCommon', 'modalMarginTop', 'bookItContainerRTL')}>
                    <div data-sticky-section>
                        <div className={cx(s.dflex)}>
                            <div className={cx(s.bootItPriceSection, s.displayFlex)}>
                                <div>
                                    {
                                        bookingType === "instant" && <>
                                            <FcFlashOn className={s.instantIcon} />
                                        </>
                                    }
                                    <CurrencyConverter
                                        amount={hourlyPrice}
                                        className={cx(s.bookItPrice, 'bookItPriceRTL', cs.commonTotalText, cs.fontWeightBold)}
                                        from={currency}
                                    />
                                </div>
                                <p className={cs.commonSmallText}><FormattedMessage {...messages.perHour} /></p>
                            </div>
                            <div className={cx(s.bootItPriceSection, s.displayFlex)}>
                                <div>
                                    {
                                        bookingType === "instant" && <>
                                            <FcFlashOn className={s.instantIcon} />
                                        </>
                                    }
                                    <CurrencyConverter
                                        amount={basePrice}
                                        className={cx(s.bookItPrice, 'bookItPriceRTL', cs.commonTotalText, cs.fontWeightBold)}
                                        from={currency}
                                    />
                                </div>
                                <p className={cs.commonSmallText}><FormattedMessage {...messages.perNight} /></p>
                            </div>
                        </div>
                        <div className={cx('bookItFormSection', s.bookItFormSection)}>
                            <Loader
                                show={loadingStatus}
                                type={"page"}
                            >
                                <BookingForm
                                    initialValues={initialValues}
                                    id={id}
                                    personCapacity={personCapacity}
                                    basePrice={basePrice}
                                    delivery={delivery}
                                    hourlyPrice={hourlyPrice}
                                    currency={currency}
                                    monthlyDiscount={monthlyDiscount}
                                    weeklyDiscount={weeklyDiscount}
                                    minDay={minDay}
                                    maxDay={maxDay}
                                    blockedDates={blockedDates}
                                    isHost={isHost}
                                    userBanStatus={userBanStatus}
                                    bookingType={bookingType}
                                    maxDaysNotice={maxDaysNotice}
                                    startDate={startDate}
                                    endDate={endDate}
                                    securityDeposit={securityDeposit}
                                    URLRoomType={URLRoomType}
                                    startTime={startTime}
                                    endTime={endTime}
                                    bookingLoader={isLoading}
                                />
                                <h5 className={cx(cs.commonSmallText, cs.fontWeightNormal, cs.textAlignCenter, cs.paddingTop2)}>
                                    <FormattedMessage {...messages.bookingInfo} />
                                </h5>
                                <ViewCount
                                    listId={id}
                                    isHost={isHost}
                                />
                                {
                                    cancellationPolicyData && <div className={cs.spaceTop2}>
                                        <p className={cx(cs.commonMediumText, cs.fontWeightBold)}>
                                            <span><FormattedMessage {...messages.cancellationPolicy} /></span>
                                            : <Link to={"/cancellation-policies/" + cancellationPolicyData?.policyName}>
                                                <span className={cs.siteLinkColor}>{cancellationPolicyData?.policyName}</span>
                                            </Link>
                                        </p>
                                        <p className={cx(cs.commonSmallText, cs.spaceTop1, cs.spaceBottom1)}>
                                            {cancellationPolicyData?.policyContent}
                                        </p>

                                        <Link to={"/cancellation-policies/" + cancellationPolicyData?.policyName} className={cx(cs.siteLinkColor, s.mobileSize)}>
                                            <FormattedMessage {...messages.viewDetails} />{' '}
                                            <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
                                        </Link>
                                    </div>
                                }
                            </Loader>
                        </div>
                    </div>
                </div>
                {
                    data?.listingData?.cancellation &&
                    <div className={cx(s.cancellationSection, cs.spaceTop4, cs.spaceBottom4)}>
                        <p className={cx(cs.commonSubTitleText, cs.fontWeightBold, cs.paddingBottom3)}>
                            <span><FormattedMessage {...messages.cancellationPolicy} /></span>
                            :   <Link
                                to={"/cancellation-policies/" + data?.listingData?.cancellation?.policyName}
                            ><span className={cs.siteLinkColor}>{data?.listingData?.cancellation?.policyName}</span></Link>
                        </p>
                        <p className={cx(cs.commonContentText, cs.paddingBottom2)}>
                            {data?.listingData?.cancellation?.policyContent}
                        </p>
                        <Link
                            to={"/cancellation-policies/" + data?.listingData?.cancellation?.policyName}
                            className={cx(cs.commonContentText, cs.siteLinkColor, cs.fontWeightMedium, s.borderBottom, cs.textDecorationNone)}
                        >
                            <FormattedMessage {...messages.viewDetails} />{' '}
                            <img src={Arrow} className={cx(cs.blueLeftArrow, 'loginArrowRTL')} />
                        </Link>
                    </div>
                }
            </>
        );
    }
}
const mapState = (state) => ({
    isLoading: state?.viewListing?.isLoading,
    showContactHostModal: state?.viewListing?.showContactHostModal,
});
const mapDispatch = {};
export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Calendar)))