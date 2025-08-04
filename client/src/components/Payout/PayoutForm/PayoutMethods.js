import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { graphql, compose } from 'react-apollo';

// Redux Form
import { reduxForm, change, formValueSelector, Field } from 'redux-form';

// Redux
import { connect } from 'react-redux';

import {
  Button,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Payout.css';
import cs from '../../../components/commonStyle.css';

import CommonTable from '../../CommonTable/CommonTable';

// Graphql
import getPaymentMethodsQuery from './getPaymentMethods.graphql';

// Locale
import messages from '../../../locale/messages';
import Loader from '../../Loader/Loader';

class PayoutMethods extends Component {
  static propTypes = {
    handleSubmit: PropTypes.any.isRequired,
    previousPage: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
    selectedCountry: PropTypes.string,
    PaymentMethodsData: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getPaymentMethods: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        processedIn: PropTypes.string.isRequired,
        fees: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        details: PropTypes.string.isRequired,
        paymentType: PropTypes.string.isRequired,
      }))
    })
  };

  static defaultProps = {
    selectedCountry: '',
    PaymentMethodsData: {
      loading: true,
      getPaymentMethods: []
    }
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { PaymentMethodsData: { loading, getPaymentMethods }, selectedCountry } = nextProps;
    const { change, paymentMethodId } = this.props;
    
    if (getPaymentMethods != null && getPaymentMethods.length > 0
      && (paymentMethodId === undefined || paymentMethodId === null)) {
      
      // Filter payment methods based on country
      let filteredMethods = Array.isArray(getPaymentMethods) ? getPaymentMethods : [];
      if (selectedCountry && selectedCountry.toLowerCase() === 've') {
        // For Venezuela, show only method with ID 3
        filteredMethods = filteredMethods.filter(method => method && method.id === 3);
        console.log("Showing only method ID 3 for VE:", filteredMethods);
      } else if (selectedCountry && selectedCountry.toLowerCase() !== 've' && filteredMethods.length > 0) {
        // For non-Venezuela countries, show only methods with ID 1 and 2
        filteredMethods = filteredMethods.filter(method => method && (method.id === 1 || method.id === 2));
        console.log("Filtered for non-VE country:", filteredMethods);
      }
      
      const activePayentMethods = filteredMethods && filteredMethods.find((o) => o && o.isEnable);
      if (activePayentMethods) {
        change('methodId', activePayentMethods.id);
        change('paymentType', activePayentMethods.paymentType);
        change('currency', activePayentMethods.currency);
        if (activePayentMethods.paymentType === 2) {
          change('businessType', 'individual');
        }
      }
    }
  }

  handleChange(methodId, paymentType, currency) {
    const { change } = this.props;
    change('methodId', methodId);
    change('paymentType', paymentType);
    change('currency', currency);
    if (paymentType === 2) {
      change('businessType', 'individual');
    }
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.payoutTitle) },
      { data: formatMessage(messages.payoutTitle1) },
      { data: formatMessage(messages.payoutTitle2) },
      { data: formatMessage(messages.payoutTitle3) },
      { data: formatMessage(messages.payoutTitle4) },
    ]
  };

  tbody = () => {
    const { PaymentMethodsData: { loading, getPaymentMethods }, selectedCountry } = this.props;
    const { paymentMethodId } = this.props;
    
    console.log(selectedCountry,"countrySelected")
    console.log(typeof selectedCountry, "countryType")
    console.log(selectedCountry?.toLowerCase(), "countryLowerCase")
    console.log(getPaymentMethods,"allPaymentMethods")
    
    // Filter payment methods based on country
    let filteredMethods = Array.isArray(getPaymentMethods) ? getPaymentMethods : [];
    if (selectedCountry && selectedCountry.toLowerCase() === 've') {
      // For Venezuela, show only method with ID 3
      filteredMethods = filteredMethods.filter(method => method && method.id === 3);
      console.log("Showing only method ID 3 for VE:", filteredMethods);
    } else if (selectedCountry && selectedCountry.toLowerCase() !== 've' && filteredMethods.length > 0) {
      // For non-Venezuela countries, show only methods with ID 1 and 2
      filteredMethods = filteredMethods.filter(method => method && (method.id === 1 || method.id === 2));
      console.log("Filtered for non-VE country:", filteredMethods);
    }
    
    console.log("Final filtered methods:", filteredMethods);
    
    return filteredMethods.map((item, index) => {
      let checked = false;
      if (item && item.id === parseInt(paymentMethodId)) {
        checked = true;
      }
      if (item && item.isEnable) {
        return {
          id: index,
          data: [
            {
              data: <span className={cx(s.payoutTitleFlex, s.alignItemBaseLine)}>
                <Field
                  name="methodId"
                  component="input"
                  value={item.id}
                  type="radio"
                  className={cx(cs.curserPointer, s.radioBtn)}
                  checked={checked}
                  onChange={() => this.handleChange(item.id, item.paymentType, item.currency)}
                />
                <span className={s.itemPadding}>{item.name}</span>
              </span>
            },
            { data: item.processedIn },
            { data: item.fees },
            { data: item.currency },
            { data: item.details }
          ]
        }
      }
      return null;
    }).filter(Boolean); // Remove null entries
  }

  render() {
    const { error, handleSubmit, previousPage, selectedCountry } = this.props;
    const { PaymentMethodsData: { loading, getPaymentMethods } } = this.props;
    const { formatMessage } = this.props.intl;

    // Filter payment methods based on country
    let filteredMethods = Array.isArray(getPaymentMethods) ? getPaymentMethods : [];
    if (selectedCountry && selectedCountry.toLowerCase() === 've') {
      // For Venezuela, show only method with ID 3
      filteredMethods = filteredMethods.filter(method => method && method.id === 3);
    } else if (selectedCountry && selectedCountry.toLowerCase() !== 've' && filteredMethods.length > 0) {
      // For non-Venezuela countries, show only methods with ID 1 and 2
      filteredMethods = filteredMethods.filter(method => method && (method.id === 1 || method.id === 2));
    }

    return (
      <div className={cx('inputFocusColor', cs.commonBorderSection, 'whiteBgColor', 'customRatioButton')}>
        <h3 className={cx(cs.commonTotalText, cs.paddingBottom3)}>{formatMessage(messages.addPayout)}</h3>
        <p className={cx(cs.commonMediumText, cs.paddingBottom2)}>
          <FormattedMessage {...messages.payoutIntro1} />
        </p>
        <p className={cx(cs.commonMediumText, cs.paddingBottom3)}>
          <FormattedMessage {...messages.payoutIntro2} />
        </p>
        {selectedCountry && selectedCountry.toLowerCase() !== 'VE' && (
          <p className={cx(cs.commonMediumText, cs.paddingBottom3)} style={{ color: '#666', fontStyle: 'italic' }}>
            Limited payment methods available for your selected country.
          </p>
        )}
        {selectedCountry && selectedCountry.toLowerCase() === 'VE' && (
          <p className={cx(cs.commonMediumText, cs.paddingBottom3)} style={{ color: '#28a745', fontStyle: 'italic' }}>
            All payment methods available for Venezuela.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {
            loading && <Loader type="text" />
          }
          {
            !loading && filteredMethods != undefined && filteredMethods.length > 0 &&
            <CommonTable
              thead={this.thead}
              tbody={this.tbody}
              className={'payoutListTable'}
            
            />
          }
          {
            !loading && filteredMethods != undefined && filteredMethods.length === 0 && <h5 className={cx(cs.commonTotalText, cs.paddingBottom3)}><FormattedMessage {...messages.noPaymentFound} /></h5>
          }
          <div className={cx(s.btnFlex, cs.spaceTop4)}>
            <Button className={cx(cs.btnPrimaryBorder, s.btnRight, 'payoutBackRTL')} onClick={previousPage}>
              <FormattedMessage {...messages.back} />
            </Button>
            <Button className={cs.btnPrimary} disabled={loading} type="submit">
              <FormattedMessage {...messages.next} />
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

PayoutMethods = reduxForm({
  form: 'PayoutForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(PayoutMethods);

const selector = formValueSelector('PayoutForm');

const mapState = (state) => ({
  paymentMethodId: selector(state, 'methodId')
});

const mapDispatch = {
  change
};

export default compose(
  injectIntl,
  withStyles(s, cs),
  connect(mapState, mapDispatch),
  graphql(getPaymentMethodsQuery, {
    name: 'PaymentMethodsData',
    options: {
      ssr: false,
    }
  }),
)(PayoutMethods);