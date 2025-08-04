import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';

import Loader from '../../Loader';
import CountryList from '../../CountryList';
import CustomCheckbox from '../../CustomCheckbox/CustomCheckbox';

import { sendVerificationSms } from '../../../actions/SmsVerification/sendVerificationSms';
import { openSmsVerificationModal } from '../../../actions/SmsVerification/modalActions';
import showToaster from '../../../helpers/toasterMessages/showToaster';

import messages from '../../../locale/messages';

import s from './AddPhoneNumberForm.css';
import cs from '../../../components/commonStyle.css';

class AddPhoneNumberForm extends Component {

  static propTypes = {
    fieldType: PropTypes.string,
    formatMessage: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      countryCode: 'IN',
      country: '+91',
      phoneNumber: '',
      submitting: false,
      error: null,
      isAgreePhoneNumberVerification: false
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  submitForm = async () => {
    const { sendVerificationSms } = this.props;
    const { country, phoneNumber, isAgreePhoneNumberVerification } = this.state;
    let error = null, submitting = false;
    if (!phoneNumber) {
      error = { phoneNumber: 'mobileNumberRequired' };
    } else if (isNaN(phoneNumber)) {
      error = { phoneNumber: 'mobileNumberRequired' };
    }

    if (!isAgreePhoneNumberVerification && error === null) {
      showToaster({ messageId: 'isAgreePhoneNumberError', toasterType: 'error' });
      return;
    }

    submitting = (error === null && isAgreePhoneNumberVerification) ? true : false;
    this.setState({ submitting, error });

    if (error === null && submitting) {
      const { status, errorMessage } = await sendVerificationSms(country, phoneNumber);
      if (status != 200) {
        if (errorMessage == 'Authenticate') {
          error = { phoneNumber: 'twilioAuthErr' };
        } else {
          error = { phoneNumber: errorMessage ? errorMessage : 'Sorry, something went wrong. Please try again' }
        }
      }
    }
    if (this.refs.addPhoneNumberForm) {
      this.setState({ submitting: false, error });
    }
  }

  handleCountryChange = (e, selectedData) => {
    this.setState({
      country: selectedData.dialCode,
      countryCode: selectedData.countryCode
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { smsLoading, siteName } = this.props;
    const { country, phoneNumber, submitting, error, countryCode, isAgreePhoneNumberVerification } = this.state;
    return (
      <div ref='addPhoneNumberForm' className={cx(cs.commonBorderSection, cs.spaceBottom2, 'whiteBgColor', 'addPhoneNumber', 'addPhoneNumberRTL')}>
        <FormGroup className={cs.spaceBottom4}>
          <label className={cs.spaceBottom8}><FormattedMessage {...messages.chooseACountry} /></label>
          <CountryList
            input={
              {
                name: 'countryCode',
                onChange: this.handleChange,
                value: countryCode
              }
            }
            className={cs.formControlSelect}
            dialCode={false}
            getSelected={this.handleCountryChange}
          />
        </FormGroup>
        <div className={cs.spaceBottom2}>
          <FormGroup>
            <label className={cs.spaceBottom8}><FormattedMessage {...messages.addAPhoneNumber} /></label>
            <InputGroup>
              <InputGroup.Addon>{country}</InputGroup.Addon>
              <FormControl
                name={'phoneNumber'}
                value={phoneNumber}
                placeholder={formatMessage(messages.enterPhoneNumber)}
                type={'text'}
                className={cx(cs.formControlInput, s.phoneNumberField)}
                onChange={this.handleChange}
                maxLength={255}
              />
            </InputGroup>
            {error && error.phoneNumber && (
              <span className={cs.errorMessage}>
                {messages[error.phoneNumber]
                  ? formatMessage(messages[error.phoneNumber])  
                  : error.phoneNumber  
                }
              </span>
            )}
          </FormGroup>
        </div>

        <div className={cx(s.phoneNumberCheckBox, cs.spaceBottom3)}>
          <CustomCheckbox
            className={'icheckbox_square-green flexNoShrink'}
            name={'isAgreePhoneNumberVerification'}
            checked={isAgreePhoneNumberVerification}
            onChange={e => { this.setState({ isAgreePhoneNumberVerification: e }) }}
          />
          <p className={s.indicationTxt}>
            {formatMessage(messages.phoneNumberVerificationInfo1)}{" "}{siteName}{" "}{formatMessage(messages.phoneNumberVerificationInfo2)}{" "}
            <a href="/privacy" target="_blank">
              {formatMessage(messages.termsAndPrivacy)}
            </a>
          </p>
        </div>
        <div className={'textAlignEnd'}>
          <Loader
            type={"button"}
            buttonType={"button"}
            className={cx(cs.btnPrimary, cs.btnMedium, 'arButtonLoader')}
            disabled={smsLoading}
            show={smsLoading}
            label={formatMessage(messages.verifyViaSms)}
            handleClick={this.submitForm}
          />
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  profileId: state.account.data.profileId,
  smsLoading: state.loader.smsLoading,
  siteName: state.siteSettings.data.siteName,
});

const mapDispatch = {
  sendVerificationSms,
  openSmsVerificationModal
};

export default compose(
  injectIntl,
  withStyles(s, cs),
  connect(mapState, mapDispatch)
)(AddPhoneNumberForm);