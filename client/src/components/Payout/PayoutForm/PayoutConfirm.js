import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Stripe
import { Elements } from 'react-stripe-elements';

// Redux
import { connect } from 'react-redux';

import { formValueSelector } from 'redux-form';

// Components
import PayPal from './Paypal';
import Stripe from './Stripe';
import Megasoft from './Megasoft';

class PayoutConfirm extends Component {
  static propTypes = {
    previousPage: PropTypes.any.isRequired,
    paymentType: PropTypes.string.isRequired,
    accountData: PropTypes.object.isRequired
  };

  render() {
    const { paymentType, previousPage, accountData } = this.props;
    
    if (paymentType === 2) {
      return (
        <Elements>
          <Stripe
            previousPage={previousPage}
          />
        </Elements>
      );
    } else if (paymentType === 1) {
      return <PayPal
        previousPage={previousPage}
      />
    } else  {
      return <Megasoft
        previousPage={previousPage}
        accountData={accountData}
      />
    }
  }
}

const selector = formValueSelector('PayoutForm');

const mapState = (state) => ({
  paymentType: selector(state, 'paymentType'),
  accountData: state.account.data
});

const mapDispatch = {};

export default connect(mapState, mapDispatch)(PayoutConfirm);