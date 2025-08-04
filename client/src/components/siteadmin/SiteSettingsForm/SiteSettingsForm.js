import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Uploader from './Uploader';
import HomeLogo from './HomeLogo';
import EmailLogoUploader from './EmailLogoUploader';
import FavIconUploader from './FavIconUploader';
import CommonFormComponent from '../../CommonField/CommonFormComponent';

import messages from '../../../locale/messages';
import submit from './submit';
import validate from './validate';

import siteSettingTooltipIcon from '/public/SiteIcons/siteSettingTooltipIcon.svg';

import s from './SiteSettingsForm.css';
import cp from '../../../components/commonStyle.css';
import OgImageUploader from './OgImageUploader/OgImageUploader';
class SiteSettingsForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,

  };

  constructor(props) {
    super(props);
    this.state = {
      homePageType: null,
    }
  }

  UNSAFE_componentWillMount() {
    const { homePageType } = this.props;

    if (homePageType) {
      this.setState({ hostTypeState: homePageType });
    }
  }

  componentDidMount() {
    const { homePageType } = this.props;

    if (homePageType) {
      this.setState({ hostTypeState: homePageType });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { homePageType } = nextProps;

    if (homePageType) {
      this.setState({ hostTypeState: homePageType });
    }
  }

  renderTooltip = (label) => {
    return (
      <>
        <OverlayTrigger placement='top' overlay={<Popover className='imageUploadTooltipContainer'>{label}</Popover>}>
          <img src={siteSettingTooltipIcon} className={cx('imageFlipRTL', "siteSettingTooltipIcon")} />
        </OverlayTrigger>
      </>
    )
  }

  render() {
    const { error, handleSubmit, submitting, dispatch, initialValues, appAvailableStatus, appForceUpdate, ogImage } = this.props;
    console.log("🚀 ~ SiteSettingsForm ~ render ~ initialValues:", initialValues)
    const { hostTypeState } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(cp.adminContentPadding)}>
        <div>

          <h1 className={cx(s.headerTitle, s.marginTop0, cp.spaceBottom3)}><FormattedMessage {...messages.siteSettings} /></h1>
          <form onSubmit={handleSubmit(submit)}>
            {error && <strong>{error}</strong>}
            <Row>
              <Col xs={12} sm={12} md={12} lg={6}>
                <div className={cx(s.siteContainer, s.space5)}>
                  <FormGroup className={cx(cp.noMarginBottom)}>
                    <label className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom20)} ><FormattedMessage {...messages.logoLabel} /></label>
                    <Uploader />
                  </FormGroup>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <div className={cx(s.siteContainer, s.space5)}>
                  <FormGroup className={cx(cp.noMarginBottom)}>
                    <label className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom20)} ><FormattedMessage {...messages.HomelogoLabel} /></label>
                    <HomeLogo />
                  </FormGroup>
                </div>
              </Col>
            </Row>

            <Row className={cx("siteSettingRow")}>
              <Col xs={12} sm={12} md={12} lg={4}>
                <div className={cx(s.siteContainer, s.space2, s.mobileSiteSettingSpace2)}>
                  <label className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom20)} ><FormattedMessage {...messages.EmaillogoLabel} /></label>
                  <EmailLogoUploader />
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <div className={cx(s.siteContainer, s.space2, s.mobileSiteSettingSpace2)}>
                  <label className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom20)} ><FormattedMessage {...messages.favIconlogoLabel} /></label>
                  <FavIconUploader />
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <div className={cx(s.siteContainer, s.space2, s.mobileSiteSettingSpace2)}>
                  <label className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom20, "tooltipLabelContainer")} ><FormattedMessage {...messages.ogImageLabel} /><>{this.renderTooltip(formatMessage(messages.ogToolTip))}</></label>
                  <OgImageUploader image={ogImage} />
                </div>
              </Col>
            </Row>

            <Row className={s.siteSettingFormFlex}>
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.siteName} />
                  </ControlLabel>
                  <Field name="siteName" type="text" component={CommonFormComponent} label={formatMessage(messages.siteName)} placeholder={formatMessage(messages.siteName)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.siteTitle} />
                  </ControlLabel>
                  <Field name="siteTitle" type="text" component={CommonFormComponent} label={formatMessage(messages.siteTitle)} placeholder={formatMessage(messages.siteTitle)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>

              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.metaKeywordLabel} />
                  </ControlLabel>
                  <Field name="metaKeyword" type="text" componentClass={"textarea"} component={CommonFormComponent} label={formatMessage(messages.metaKeywordLabel)} placeholder={formatMessage(messages.metaKeywordLabel)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.metaKeywordLabelDesc} />
                  </ControlLabel>
                  <Field name="metaDescription" type="text" componentClass={"textarea"} component={CommonFormComponent} label={formatMessage(messages.metaKeywordLabelDesc)} placeholder={formatMessage(messages.metaKeywordLabelDesc)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.facebookURL} />
                  </ControlLabel>
                  <Field name="facebookLink" type="text" component={CommonFormComponent} label={formatMessage(messages.facebookURL)} placeholder={formatMessage(messages.facebookURL)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.twitterURL} />
                  </ControlLabel>
                  <Field name="twitterLink" type="text" component={CommonFormComponent} label={formatMessage(messages.twitterURL)} placeholder={formatMessage(messages.twitterURL)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.instagramURL} />
                  </ControlLabel>
                  <Field name="instagramLink" type="text" component={CommonFormComponent} label={formatMessage(messages.instagramURL)} placeholder={formatMessage(messages.instagramURL)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.homePageLayout} />
                  </ControlLabel>
                  <Field name="homePageType" type="text" inputClass={cx(s.formControlSelect, s.fullWithSelect, cp.formControlSelect)} component={CommonFormComponent} label={formatMessage(messages.homePageLayout)}>
                    <option value={1}>{formatMessage(messages.homePageLayoutDesc)}</option>
                    <option value={2}>{formatMessage(messages.homePageLayoutDesc1)}</option>
                    <option value={3}>{formatMessage(messages.homePageLayoutDesc2)}</option>
                    <option value={4}>{formatMessage(messages.homePageLayoutDesc3)}</option>
                  </Field>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.phoneNumberFormat} />
                  </ControlLabel>
                  <Field
                    name="phoneNumberStatus"
                    type="text"
                    inputClass={cx(s.formControlSelect, s.fullWithSelect, cp.formControlSelect)}
                    component={CommonFormComponent}
                    label={formatMessage(messages.phoneNumberFormat)}
                  >
                    <option value={1}>{formatMessage(messages.twilioSMS)}</option>
                    <option value={3}>{formatMessage(messages.normalPhoneNumber)}</option>
                  </Field>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9, "tooltipLabelContainer")}>
                    <FormattedMessage {...messages.securityDepositAvailability} />
                    {this.renderTooltip(formatMessage(messages.securityDepositAvailabilityTooltip))}
                  </ControlLabel>
                  <Field
                    name="securityDepositPreference"
                    type="text"
                    inputClass={cx(s.formControlSelect, s.fullWithSelect, cp.formControlSelect)}
                    component={CommonFormComponent}
                    label={formatMessage(messages.securityDepositAvailability)}
                  >
                    <option value={1}>{formatMessage(messages.yesLabel)}</option>
                    <option value={2}>{formatMessage(messages.noLabel)}</option>
                  </Field>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.appAvailable} />
                  </ControlLabel>
                  <Field
                    name="appAvailableStatus"
                    type='text'
                    inputClass={cx(s.formControlSelect, s.fullWithSelect, cp.formControlSelect)}
                    component={CommonFormComponent}
                    label={formatMessage(messages.appAvailable)}
                  >
                    <option value={1}>{formatMessage(messages.enableLabel)}</option>
                    <option value={0}>{formatMessage(messages.disableLabel)}</option>
                  </Field>
                </FormGroup>
              </Col>
              {
                appAvailableStatus == 1 && <>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                      <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                        <FormattedMessage {...messages.playStoreUrl} />
                      </ControlLabel>
                      <Field name="playStoreUrl" type="text" component={CommonFormComponent} label={formatMessage(messages.playStoreUrl)} placeholder={formatMessage(messages.playStoreUrl)} inputClass={cx(cp.adminFormControlInput)} />
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                      <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                        <FormattedMessage {...messages.appStoreUrl} />
                      </ControlLabel>
                      <Field name="appStoreUrl" type="text" component={CommonFormComponent} label={formatMessage(messages.appStoreUrl)} placeholder={formatMessage(messages.appStoreUrl)} inputClass={cx(cp.adminFormControlInput)} />
                    </FormGroup>
                  </Col>
                </>
              }

              {appAvailableStatus == 1 && <>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                    <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                      <FormattedMessage {...messages.manageForceUpdate} />
                    </ControlLabel>
                    <Field
                      name="appForceUpdate"
                      type='text'
                      inputClass={cp.formControlSelect}
                      component={CommonFormComponent}
                      label={formatMessage(messages.manageForceUpdate)}
                    >
                      <option value="true">{formatMessage(messages.enableLabel)}</option>
                      <option value="false">{formatMessage(messages.disableLabel)}</option>
                    </Field>
                  </FormGroup>
                </Col>

                {
                  String(appForceUpdate) === 'true' &&
                  <>
                    <Col xs={12} sm={12} md={6} lg={3} className={cx(cp.noMarginBottom)}>
                      <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                        <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                          <FormattedMessage {...messages.androidLabel} />
                        </ControlLabel>
                        <Field
                          name="androidVersion"
                          type="text"
                          isAddon={true}
                          suffixLabel={"V"}
                          component={CommonFormComponent}
                          label={formatMessage(messages.androidVersion)}
                          inputClass={cx(cp.adminFormControlInput)}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={3} className={cx(cp.noMarginBottom)}>
                      <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                        <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                          <FormattedMessage {...messages.iosLabel} />
                        </ControlLabel>
                        <Field
                          name="iosVersion"
                          type="text"
                          isAddon={true}
                          suffixLabel={"V"}
                          component={CommonFormComponent}
                          label={formatMessage(messages.iosVersion)}
                          inputClass={cx(cp.adminFormControlInput)}
                        />
                      </FormGroup>
                    </Col>
                  </>
                }
              </>}

              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.emailIdLabel} />
                  </ControlLabel>
                  <Field name="email" type="text" component={CommonFormComponent} label={formatMessage(messages.emailIdLabel)} placeholder={formatMessage(messages.emailIdLabel)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.mobileNumberLabel} />
                  </ControlLabel>
                  <Field name="phoneNumber" type="text" component={CommonFormComponent} label={formatMessage(messages.mobileNumberLabel)} placeholder={formatMessage(messages.mobileNumberLabel)} inputClass={cx(cp.adminFormControlInput)} />
                </FormGroup>
              </Col>
            
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    <FormattedMessage {...messages.address} />
                  </ControlLabel>
                  <Field name="address" component={CommonFormComponent} label={formatMessage(messages.address)} placeholder={formatMessage(messages.address)} inputClass={cx(cp.adminFormControlInput)} componentClass={"textarea"} />
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <FormGroup className={cx(s.spaceTop3, cp.noMarginBottom)}>
                  <ControlLabel className={cx(cp.adminLableTextNew, s.marginTop0, s.marginBottom9)}>
                    Button Color
                  </ControlLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Field
                      name="ButtonColor"
                      component={({ input }) => (
                        <input
                          type="color"
                          {...input}
                          style={{ width: 40, height: 40, border: 'none', background: 'none', padding: 0 }}
                        />
                      )}
                    />
                    <Field
                      name="ButtonColor"
                      type="text"
                      component={CommonFormComponent}
                      label="Button Color"
                      placeholder="#ffffff"
                      inputClass={cx(cp.adminFormControlInput)}
                      style={{ width: 120 }}
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className={cx(cp.textAlignRight, cp.spaceTop5, 'textAlignLeftRTL')}>
                <FormGroup className={cx(cp.noMarginBottom)}>
                  <Button className={cx(cp.btnPrimary, cp.btnlarge)} type="submit" disabled={submitting} ><FormattedMessage {...messages.save} /></Button>
                </FormGroup>
              </Col>
            </Row>

          </form>


        </div>
      </div >
    );
  }

}


SiteSettingsForm = reduxForm({
  form: 'SiteSettingsForm', // a unique name for this form
  validate
})(SiteSettingsForm);

const selector = formValueSelector('SiteSettingsForm');

const mapState = (state) => ({
  homePageType: selector(state, 'homePageType'),
  appAvailableStatus: selector(state, 'appAvailableStatus'),
  appForceUpdate: selector(state, 'appForceUpdate'),
  ogImage: selector(state, 'ogImage')
});

const mapDispatch = {};

export default injectIntl(withStyles(s, cp)(connect(mapState, mapDispatch)(SiteSettingsForm)));