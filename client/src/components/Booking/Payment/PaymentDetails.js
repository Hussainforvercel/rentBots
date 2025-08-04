import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Payment.css';
import cs from '../../commonStyle.css';

// Component
import CurrencyConverter from '../../CurrencyConverter';

// Locale
import messages from '../../../locale/messages';

//Images
import Faq from '/public/SiteIcons/question.svg';

class PaymentDetails extends Component {
  static propTypes = {
    delivery: PropTypes.number,
    currency: PropTypes.string.isRequired,
    dayDifference: PropTypes.number.isRequired,
    discount: PropTypes.number,
    discountType: PropTypes.string,
    priceForDays: PropTypes.number.isRequired,
    serviceFees: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    formatMessage: PropTypes.any,
    isSpecialPriceAssigned: PropTypes.bool,
  };

  static defaultProps = {
    isSpecialPriceAssigned: false,
  };


  render() {
    const { delivery, currency, dayDifference,basePrice, securityDeposit,hourlyPrice ,hourlyDifference,totalHourPrice} = this.props;
    const { priceForDays, serviceFees, discount, discountType, total } = this.props;
    const { formatMessage } = this.props.intl;
    const { isSpecialPriceAssigned, isAverage, securityDepositStatus,isSingleDate,} = this.props;

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
    const totalPrice = totalHourPrice
    console.log(hourlyDifference,hourlyPrice,"all items",totalPrice)

    return (
      <>
        <div className={cx(s.tableFlex, cs.commonMediumText)}>
          <div>
            <div className={s.specialPriceIcon}>
              {
                isSpecialPriceAssigned &&
                <span className={s.iconSection}>
                  <img src={Faq} className={cx(s.faqImage, 'faqImageRTL')} />
                </span>
              }
              <div className={cx(s.toolTip, s.toolTipRelativeSection, 'toolTipRelativeSectionRTL')}>
                <FormattedMessage {...messages.averageRate} />
              </div>
            </div>
            {
              isSingleDate ? 
              <>
           <div className={cx(s.specialPriceText, 'directionLtr')}>
              <CurrencyConverter
                amount={basePrice}
                from={currency}
              />
              {' x'} {dayDifference} {dayDifference > 1 ? formatMessage(messages.nights) : formatMessage(messages.night)}
            </div>
              </>
              :
  <>
  <div className={cx(s.specialPriceText, 'directionLtr')}>
              <CurrencyConverter
                amount={hourlyPrice}
                from={currency}
              />
           {hourlyDifference}
            </div>
  </>
            }
          
          </div>
          {isSingleDate ?
  <div>
            <CurrencyConverter
              amount={priceForDays}
              from={currency}
            />
          </div>
          :
  <div>
            <CurrencyConverter
              amount={totalPrice}
              from={currency}
            />
          </div>
          }
        
        </div>
        <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
        {
          delivery > 0 && <>
            <h5 className={cx(s.tableFlex, cs.commonMediumText, cs.fontWeightNormal)}>
              <FormattedMessage {...messages.cleaningFee} />
              <CurrencyConverter
                amount={delivery}
                from={currency}
              />
            </h5>
            <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
          </>

        }
        {
          serviceFees > 0 && <>
            <h6 className={cx(s.tableFlex, cs.commonMediumText, cs.fontWeightNormal)}>
              <FormattedMessage {...messages.serviceFee} />
              <CurrencyConverter
                amount={serviceFees}
                from={currency}
              />
            </h6>
            <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
          </>
        }
        {
          securityDeposit > 0 && securityDepositStatus == 1 && <>
            <h6 className={cx(s.tableFlex, cs.commonMediumText, cs.fontWeightNormal)}>
              <FormattedMessage {...messages.securityDeposit} />
              <CurrencyConverter
                amount={securityDeposit}
                from={currency}
              />
            </h6>
            <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
          </>
        }
        {
          discount > 0 && <>
            <h5 className={cx(s.tableFlex, cs.commonMediumText, cs.fontWeightNormal)}>
              <span>{discountType}</span>
              <span className={s.discountText}> -
                <CurrencyConverter
                  amount={discount}
                  from={currency}
                />
              </span>
            </h5>
            <hr className={cx(s.horizondalLine, s.hrLineSidePanelMargin)} />
          </>
        }
        <h4 className={cx(s.tableFlex, cs.commonContentText, cs.fontWeightMedium)}>
          <FormattedMessage {...messages.total} />
          <CurrencyConverter
            amount={total}
            from={currency}
          />
        </h4>
      </>
    );
  }
}

export default injectIntl(withStyles(s)(PaymentDetails));