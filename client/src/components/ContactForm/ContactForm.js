import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import Loader from '../Loader';
import messages from '../../locale/messages';
import validate from './validate';
import { sendEmail } from '../../core/email/sendEmail';
import { googleCaptcha } from '../../config';
import showToaster from '../../helpers/toasterMessages/showToaster';
import mailLogo from './mailblack.svg';
import caller from './callLogo.svg';
import addressLogo from './address.svg';
import s from './ContactForm.css';

class ContactForm extends Component {
    static propTypes = {
        formatMessage: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.state = {
            contactLoading: false
        };
    }

    handleClick = async (values, dispatch) => {
        const { email } = this.props;
        let content = {
            phoneNumber: values.phoneNumber,
            name: values.name,
            email: values.email,
            contactMessage: values.contactMessage
        };
        this.setState({
            contactLoading: true
        })
        const { status, response } = await sendEmail(email, 'contact', content);
        this.setState({
            contactLoading: false
        })
        if (status === 200) {
            showToaster({ messageId: 'emailSent', toasterType: 'success' })
        } else {
            showToaster({ messageId: 'formError', toasterType: 'error' })
        }
        dispatch(reset('ContactForm'));
        grecaptcha.reset();
    }

    renderFormControl = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <FormControl {...input} placeholder={label} type={type} className={className} disabled={isDisabled} />
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
        const { formatMessage } = this.props.intl;
        return (
            <div>
                <FormControl
                    {...input}
                    className={className}
                    componentClass="textarea"
                >
                    {children}
                </FormControl>
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    renderCaptcha = ({ input, label, type, meta: { touched, error }, className, isDisabled }) => {
        const { formatMessage } = this.props.intl;
        let siteKey = googleCaptcha.sitekey;
        return (
            <div>
                <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={input.onChange}
                />
                {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </div>
        )
    }

    render() {
        const { error, handleSubmit, submitting, dispatch, pristine } = this.props;
        const { formatMessage } = this.props.intl;
        const { contactLoading } = this.state;
        const title = <h3>{formatMessage(messages.Required)}</h3>;
        const { email, phoneNumber, address } = this.props;
        return (
            <Grid fluid>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12} className={s.marginTop}>
                        <div>
                            {(email || phoneNumber || address) && <div className={s.space6}>
                                <h1 className={s.contactTitle}>
                                    <FormattedMessage {...messages.contactFormInformation} />
                                </h1>
                            </div>}
                            <Row className={s.dFlex}>
                                {email && <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                    <div className={s.space6}>
                                        <div>
                                            <div className={s.iconMargin}>
                                                <img src={mailLogo} className={s.mailIcon} />
                                            </div>
                                            <div>
                                                <h1 className={cx(s.contactTitle, s.subTitleText)}>
                                                    <FormattedMessage {...messages.contactFormEmail} />
                                                </h1>
                                                <a href={"mailto:" + email} className={s.linkText} target='_blank'>{email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>}
                                {phoneNumber && <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                    <div className={s.space6}>
                                        <div>
                                            <div className={s.iconMargin}>
                                                <img src={caller} className={s.mailIcon} />
                                            </div>
                                            <div>
                                                <h1 className={cx(s.contactTitle, s.subTitleText)}><FormattedMessage {...messages.contactFormCall} /></h1>
                                                <a href={"tel:" + phoneNumber} className={s.linkText} target='_blank'>
                                                    {phoneNumber}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>}
                                {address && <Col lg={4} md={4} sm={4} xs={12} className={s.alignCenter}>
                                    <div className={s.space6}>
                                        <div>
                                            <div className={s.iconMargin}>
                                                <img src={addressLogo} className={s.mailIcon} />
                                            </div>
                                            <h1 className={cx(s.contactTitle, s.subTitleText)}>
                                                <FormattedMessage {...messages.contactFormAddress} />
                                            </h1>
                                            <h4 className={s.addressText}>
                                                {address}
                                            </h4>
                                        </div>
                                    </div>
                                </Col>}
                            </Row>
                        </div>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12} className={cx(s.marginTop)}>
                        <div className={cx(s.formBackground, 'inputFocusColor')}>
                            <div className={s.formContainerHeader}>
                                <h2 className={s.captionText}><FormattedMessage {...messages.contactForm} /></h2>
                            </div>
                            <div className={s.formContainer}>
                                {error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
                                <form onSubmit={handleSubmit(this.handleClick)} >
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={6} md={6} lg={6} className={s.noPadding}>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <label className={s.labelText} >{formatMessage(messages.nameInContact)}</label>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Field name="name"
                                                    type="text"
                                                    component={this.renderFormControl}
                                                    label={formatMessage(messages.nameInContact)}
                                                    className={cx(s.formControlInput, s.backgroundTwo, 'contactInputRTL')}
                                                />
                                            </Col>
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={6} className={s.noPadding}>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <label className={s.labelText} >{formatMessage(messages.phoneNumber)}</label>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Field name="phoneNumber"
                                                    type="text"
                                                    component={this.renderFormControl}
                                                    label={formatMessage(messages.phoneNumber)}
                                                    className={cx(s.formControlInput, s.backgroundThree, 'contactInputRTL')}
                                                />
                                            </Col>
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <label className={s.labelText} >{formatMessage(messages.email)}</label>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Field name="email"
                                                type="text"
                                                component={this.renderFormControl}
                                                label={formatMessage(messages.email)}
                                                className={cx(s.formControlInput, s.backgroundOne, 'contactInputRTL')}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <label className={s.labelText} >{formatMessage(messages.contactMessage)}</label>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Field name="contactMessage"
                                                type="text"
                                                component={this.renderFormControlTextArea}
                                                label={formatMessage(messages.contactMessage)}
                                                className={cx(s.formControlInput, s.backgroundFour, s.textAreaBorder, 'contactTextInputRTL')}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.overFlowHidden, s.spaceTop1)}>
                                            <Field name="reCaptcha"
                                                component={this.renderCaptcha}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className={s.formGroup}>
                                        <Col xs={12} sm={12} md={12} lg={12} className={s.spaceTop3}>
                                            <Loader
                                                type={"button"}
                                                buttonType={"submit"}
                                                className={cx(s.button, s.btnPrimary, s.btnlarge)}
                                                disabled={submitting}
                                                show={contactLoading}
                                                label={formatMessage(messages.sendmail)}
                                            />
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }

}

ContactForm = reduxForm({
    form: 'ContactForm', // a unique name for this form
    validate
})(ContactForm);


const mapState = (state) => ({
    email: state?.siteSettings?.data?.email,
    phoneNumber: state?.siteSettings?.data?.phoneNumber,
    address: state?.siteSettings?.data?.address
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(ContactForm)));
