import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux Form
import { Field, reduxForm } from 'redux-form';

// Redux
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import {
  Button,
  FormGroup,
  FormControl,
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Payout.css';
import cs from '../../../components/commonStyle.css';

// Locale
import messages from '../../../locale/messages';

// Validation
import validate from './validateMegasoft';

class Megasoft extends Component {
  static propTypes = {
    title: PropTypes.string,
    previousPage: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
    accountData: PropTypes.object,
    onEditComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(values) {
    if (this.state.isSubmitting) {
      return; // Prevent multiple submissions
    }

    this.setState({ isSubmitting: true });

    try {
      // Get profileId from accountData prop (this is the numeric ID we need)
      const profileId = this.props.accountData?.profileId;
      const editing = !!(this.props.initialValues && this.props.initialValues.id);
      const userId = editing ? (this.props.initialValues.userId || profileId) : profileId;

      if (!userId) {
        alert('Profile ID not found. Please try logging in again.');
        this.setState({ isSubmitting: false });
        return;
      }

      // Include only the required fields in the request
      const requestData = {
        accountType: values.accountType,
        firstName: values.firstName,
        lastName: values.lastName,
        accountName: values.accountName,
        confirmAccountName: values.confirmAccountName,
        nationalId: values.nationalId,
        bankName: values.bankName,
        pagoMovilPhone: values.pagoMovilPhone
      };

      let response, result;
      if (editing) {
        // Edit mode: use PUT
        response = await fetch(`/api/payout-megasoft-details/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include'
        });
      } else {
        // Add mode: use POST
        requestData.userId = userId;
        response = await fetch('/api/payout-megasoft-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include'
        });
      }
      result = await response.json();

      if (result.success) {
        // Show success message and notify parent
        alert('Payout details submitted successfully!');
        if (this.props.onEditComplete) {
          this.props.onEditComplete();
        }
      } else {
        // Show error message
        alert(result.error || 'Failed to submit payout details');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  renderField = ({ input, label, type, meta: { touched, error, dirty }, maxLength, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx(cs.spaceBottom4, className)}>
        <label>{label}</label>
        <FormControl {...input} componentClass="input" className={cx(cs.formControlInput, 'commonInputPaddingRTL')} placeholder={label} maxLength={maxLength} />
        {touched && error && <span className={cs.errorMessage}>{error}</span>}
      </FormGroup>
    );
  }

  renderSelectField = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={cx(cs.spaceBottom4, className)}>
        <label>{label}</label>
        <FormControl {...input} componentClass="select" className={cx(cs.formControlSelect, 'commonSelectPaddingRTL')}>
          {children}
        </FormControl>
        {touched && error && <span className={cs.errorMessage}>{error}</span>}
      </FormGroup>
    );
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, previousPage, initialValues } = this.props;
    const { formatMessage } = this.props.intl;
    const { isSubmitting } = this.state;
    const editing = !!(initialValues && initialValues.id);

    return (
      <div className={cx('inputFocusColor', cs.commonBorderSection, 'whiteBgColor')}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <h3 className={cx(cs.commonTotalText, cs.paddingBottom4)}>
            Megasoft Payout Details
          </h3>
          
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="accountType" 
                component={this.renderSelectField} 
                label="Account Type"
              >
                <option value="">Select Account Type</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </Field>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="firstName" 
                component={this.renderField} 
                label="First Name" 
                maxLength={50} 
              />
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="lastName" 
                component={this.renderField} 
                label="Last Name" 
                maxLength={50} 
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="accountName" 
                component={this.renderField} 
                label="Account Number" 
                maxLength={100} 
              />
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="confirmAccountName" 
                component={this.renderField} 
                label="Confirm Account Number" 
                maxLength={100} 
              />
            </Col>
          </Row>

          {/* New fields for National ID, Bank Name, and Phone (PAGO MOVIL) */}
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="nationalId" 
                component={this.renderField} 
                label="National ID" 
                maxLength={30} 
              />
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="bankName" 
                component={this.renderField} 
                label="Bank Name" 
                maxLength={100} 
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Field 
                name="pagoMovilPhone" 
                component={this.renderField} 
                label="Phone (PAGO MOVIL)" 
                maxLength={20} 
              />
            </Col>
          </Row>

          <div className={cx(s.btnFlex, cs.spaceTop4)}>
            <Button className={cx(cs.btnPrimaryBorder, s.btnRight, 'payoutBackRTL')} onClick={previousPage} disabled={isSubmitting}>
              <FormattedMessage {...messages.back} />
            </Button>
            <Button className={cs.btnPrimary} disabled={isSubmitting} type="submit">
              {isSubmitting ? (editing ? 'Editing...' : 'Submitting...') : (editing ? 'Edit' : 'Submit')}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

Megasoft = reduxForm({
  form: 'PayoutForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true
})(Megasoft);

const selector = formValueSelector('PayoutForm');

const mapState = (state) => ({
  accountType: selector(state, 'accountType'),
  firstName: selector(state, 'firstName'),
  lastName: selector(state, 'lastName'),
  accountName: selector(state, 'accountName'),
  confirmAccountName: selector(state, 'confirmAccountName'),
  accountData: state.account.data,
});

const mapDispatch = {
  // Add any Redux actions if needed
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Megasoft))); 