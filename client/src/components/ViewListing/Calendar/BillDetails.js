/* Plugins. */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Component.
import CurrencyConverter from '../../CurrencyConverter';

/* Action and helpers. */
import messages from '../../../locale/messages';
import billDetailsHelpers from '../../../helpers/billDetailsHelper';

// Images.
import Faq from './question.svg'

// Style.
import s from './Calendar.css';
import cx from 'classnames';

class BillDetails extends Component {
    static propTypes = {
        basePrice: PropTypes.number.isRequired,
        delivery: PropTypes.number,
        currency: PropTypes.string.isRequired,
        monthlyDiscount: PropTypes.number,
        weeklyDiscount: PropTypes.number,
        startDate: PropTypes.object.isRequired,
        endDate: PropTypes.object.isRequired,
        serviceFees: PropTypes.shape({
            guest: PropTypes.shape({
                type: PropTypes.string.isRequired,
                value: PropTypes.number.isRequired,
                currency: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        base: PropTypes.string.isRequired,
        rates: PropTypes.object.isRequired,
        formatMessage: PropTypes.any,
        specialPricing: PropTypes.array,
    };

    static defaultProps = {
        basePrice: 0,
        delivery: 0,
        monthlyDiscount: 0,
        weeklyDiscount: 0,
        startDate: null,
        endDate: null,
        specialPricing: [],
    }

    render() {
        const { basePrice, delivery, hourlyPrice, bookingType, startTime, endTime, currency, monthlyDiscount, weeklyDiscount, startDate, endDate } = this.props;
        const { serviceFees, base, rates, specialPricing, securityDeposit, securityDepositStatus } = this.props;
        const { formatMessage } = this.props.intl;

        let securityDepositAmount = securityDepositStatus == 1 ? securityDeposit : 0;

        // Calculate hours for hourly booking
        const calculateHours = () => {
            if (!startTime || !endTime) return 0;
            console.log('Start time in hours:', startTime);
            console.log('End time in hours:', endTime);

            let hours = endTime - startTime;
            
            if (hours < 0) {
                hours = 24 - startTime + endTime;
            }

            // Round to nearest 0.5
            hours = Math.round(hours * 2) / 2;
            console.log('Calculated hours:', hours);
            return hours;
        };

        let { isAverage, isDayTotal, discount, serviceFee, total, dayDifference, isSpecialPriceAssigned, discountType } =
            billDetailsHelpers({
                specialPricing, serviceFees, monthlyDiscount, weeklyDiscount, base, rates, currency,
                startDate, endDate, startTime, endTime, basePrice,hourlyPrice, delivery, securityDeposit: securityDepositAmount,
                discountForMonth: formatMessage(messages.monthlyDiscount),
                discountForWeek: formatMessage(messages.weeklyDiscount)
            });

        const hours = calculateHours();
        const totalPrice = hourlyPrice * hours;
        const dailyPrice = dayDifference *basePrice
        const finalTotal = totalPrice + (delivery || 0) + (serviceFee || 0) + (securityDeposit );
        console.log(hours, hourlyPrice, totalPrice, finalTotal,securityDeposit,total,"totalHours,securityDeposit");

        return (
            <FormGroup>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} className={'viewListingCalendarTable'}>
                    {
                        bookingType ? 
                        <table className={'table'}>
                        <tbody>
                            <tr className={cx(s.positionR)}>
                                <td className={cx(s.noBorder, 'textAlignRightRTL')}>
                                    <div className={s.specialPriceIcon}>
                                        {
                                            isSpecialPriceAssigned &&
                                            <span>
                                                <img src={Faq} className={cx(s.faqImage, 'faqImageRTL')} />
                                            </span>

                                        }
                                        <div className={cx(s.toolTip, s.toolTipRelativeSection, 'toolTipRelativeSectionRTL')}>
                                            <FormattedMessage {...messages.averageRate} />
                                        </div>
                                    </div>

                                    <div className={cx(s.specialPriceText, 'directionLtr')}>
                                        <CurrencyConverter
                                            amount={basePrice}
                                            from={currency}
                                        />
                                        {' x'} {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
                                    </div>
                                </td>

                                <td className={cx(s.noBorder, 'text-right', 'textAlignLeftRTL')}>
                                    <CurrencyConverter
                                        amount={basePrice*dayDifference}
                                        from={currency}
                                    />
                                </td>

                            </tr>
                            {
                                discount > 0 && <tr>
                                    <td className='textAlignRightRTL'>{discountType}</td>
                                    <td className={cx('text-right', s.discountText, 'textAlignLeftRTL')}>
                                        - <CurrencyConverter
                                            amount={discount}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            {
                                delivery > 0 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.cleaningFee} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={delivery}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            {
                                serviceFee > 0 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.serviceFee} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={serviceFee}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            {
                                securityDeposit > 0 && securityDepositStatus == 1 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.securityDeposit} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={securityDeposit}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }

                            <tr>
                                <td className='textAlignRightRTL'><FormattedMessage {...messages.total} /></td>
                                <td className={cx('text-right', 'textAlignLeftRTL')}>
                                    <CurrencyConverter
                                        amount={total}
                                        from={currency}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    :
                    <table className={'table'}>
                        <tbody>
                            <tr className={cx(s.positionR)}>
                                <td className={cx(s.noBorder, 'textAlignRightRTL')}>
                                    <div className={cx(s.specialPriceText, 'directionLtr')}>
                                        <CurrencyConverter
                                            amount={hourlyPrice}
                                            from={currency}
                                        />
                                        {' x'} {hours.toFixed(1)} {hours > 1 ? 'Hours' : 'Hour'}
                                    </div>
                                </td>
                                <td className={cx(s.noBorder, 'text-right', 'textAlignLeftRTL')}>
                                    <CurrencyConverter
                                        amount={totalPrice}
                                        from={currency}
                                    />
                                </td>
                            </tr>
                            {
                                delivery > 0 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.cleaningFee} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={delivery}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            {
                                serviceFee > 0 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.serviceFee} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={serviceFee}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            {
                                securityDeposit > 0 && securityDepositStatus == 1 && <tr>
                                    <td className='textAlignRightRTL'><FormattedMessage {...messages.securityDeposit} /></td>
                                    <td className={cx('text-right', 'textAlignLeftRTL')}>
                                        <CurrencyConverter
                                            amount={securityDeposit}
                                            from={currency}
                                        />
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td className='textAlignRightRTL'><FormattedMessage {...messages.total} /></td>
                                <td className={cx('text-right', 'textAlignLeftRTL')}>
                                    <CurrencyConverter
                                        amount={total}
                                        from={currency}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    }
                      
                    </Col>
                </Row>
            </FormGroup>
        );
    }
}

const selector = formValueSelector('BookingForm'); // <-- same as form name

const mapState = (state) => ({
    specialPricing: state?.viewListing?.specialPricing,
    startTime: selector(state, 'startTime'),
    endTime: selector(state, 'endTime'),
    securityDepositStatus: state?.siteSettings?.data?.securityDepositPreference
});

const mapDispatch = {};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(BillDetails)));
