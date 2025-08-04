import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Row from 'react-bootstrap/lib/Row';

import SidePanel from './SidePanel';
import SyncCalendar from './SyncCalendar';
import FooterButton from './FooterButton';
import IncrementButton from '../IncrementButton';
import CommonFormComponent from '../CommonField/CommonFormComponent';

import validateStep3 from './validateStep3';
import updateStep3 from './updateStep3';
import messages from '../../locale/messages';

import locationIcon from '/public/SiteIcons/locationIdea.svg';

import s from './ListPlaceStep1.css';
import cs from '../commonStyle.css';

class MinminDays extends Component {

  static propTypes = {
    previousPage: PropTypes.any,
    nextPage: PropTypes.any,
    listId: PropTypes.number.isRequired,
    listingSteps: PropTypes.shape({
      step3: PropTypes.string.isRequired,
      listing: PropTypes.shape({
        isPublished: PropTypes.bool.isRequired
      })
    }),
  };

  static defaultProps = {
    minDayData: 0,
    maxDayData: 0,
    listingSteps: {
      step3: "inactive",
      listing: {
        isPublished: false
      }
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      minNight: {
        itemName: null,
        otherItemName: null,
        startValue: 0,
        endValue: 0
      },
      maxNight: {
        itemName: null,
        otherItemName: null,
        startValue: 0,
        endValue: 0
      },
      minHours: {
        itemName: 'hour',
        otherItemName: 'hours',
        startValue: 0,
        endValue: 24
      },
      maxHours: {
        itemName: 'hour',
        otherItemName: 'hours',
        startValue: 0,
        endValue: 24
      },
      isEqual: false,
      policyContent: ''
    };
  }

  UNSAFE_componentWillMount() {
    const { listingFields } = this.props;
    const { cancellationPolicies, cancelPolicy } = this.props;
    if (cancellationPolicies?.length > 0) {
      let itemListData = cancelPolicy ? cancellationPolicies?.filter(policy => { if (policy?.id == cancelPolicy) return policy; }) : cancellationPolicies[0];
      this.setState({
        policyContent: itemListData && itemListData[0] ? itemListData[0]?.policyContent : itemListData?.policyContent
      });
    }
    if (listingFields != undefined) {
      this.setState({
        minNight: listingFields?.minNight[0],
        maxNight: listingFields?.maxNight[0],
        minHours: listingFields?.minHours?.[0] || this.state.minHours,
        maxHours: listingFields?.maxHours?.[0] || this.state.maxHours
      });
    }
  }

  componentDidMount() {
    const { cancellationPolicies, cancelPolicy } = this.props;
    if (cancellationPolicies?.length > 0) {
      let itemListData = cancelPolicy ? cancellationPolicies?.filter(policy => { if (policy?.id == cancelPolicy) return policy; }) : cancellationPolicies[0];
      this.setState({
        policyContent: itemListData && itemListData[0] ? itemListData[0]?.policyContent : itemListData?.policyContent
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { listingFields } = nextProps;
    const { cancellationPolicies, cancelPolicy } = nextProps;

    if (cancellationPolicies?.length > 0) {
      let itemListData = cancelPolicy ? cancellationPolicies?.filter(policy => { if (policy?.id == cancelPolicy) return policy; }) : cancellationPolicies[0];
      this.setState({
        policyContent: itemListData && itemListData[0] ? itemListData[0]?.policyContent : itemListData?.policyContent
      });
    }
    if (listingFields != undefined) {
      this.setState({
        minNight: listingFields?.minNight[0],
        maxNight: listingFields?.maxNight[0],
        minHours: listingFields?.minHours?.[0] || this.state.minHours,
        maxHours: listingFields?.maxHours?.[0] || this.state.maxHours
      });
    }
  }

  handleCancellation = () => {
    const { cancellationPolicies, cancelPolicy } = this.props;
    let itemListData = cancellationPolicies && cancellationPolicies?.length > 0 ? cancellationPolicies?.filter(policy => policy?.id == cancelPolicy) : [];
    this.setState({
      policyContent: itemListData && itemListData[0] ? itemListData[0].policyContent : ''
    });
  }

  renderIncrementButton = ({ input, label, meta: { error, dirty }, stayNight }) => {
    const { formatMessage } = this.props.intl;
    const { minDayData, maxDayData } = this.props;
    const { minNight, maxNight } = this.state;
    let disableButton = false;
    if (minDayData > maxDayData) {
      this.setState({
        isDisabled: true
      })
      disableButton = true
    }

    return (
      <div>
        <IncrementButton
          {...input}
          labelSingluar={stayNight?.itemName}
          labelPlural={stayNight?.otherItemName}
          maxValue={stayNight.endValue}
          minValue={stayNight.startValue}
          incrementBy={1}
        />
        {dirty && disableButton && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    )
  }

  render() {
    const { handleSubmit, previousPage, nextPage, formPage, step } = this.props;
    const { listingSteps, listId } = this.props;
    const { formatMessage } = this.props.intl;
    const { minNight, maxNight, minHours, maxHours, policyContent } = this.state;

    return (
      <div className={cx(s.stepGrid, 'stepGridRTL')}>
        <SidePanel
          title={formatMessage(messages.step3Heading)}
          landingContent={formatMessage(messages.availabilityTripText)}
        />
        <form onSubmit={handleSubmit}>
          <div className={cx(s.landingMainContent, s.minMaxMobile)}>
            <FormGroup className={cs.spaceBottom4}>
              <ControlLabel className={s.landingLabel}>
                <FormattedMessage {...messages.availabilityWindowText} />
              </ControlLabel>
              <Field name="maxDaysNotice" component={CommonFormComponent} inputClass={cx(s.formControlSelect, s.jumboSelect)} >
                <option value={"available"}>{formatMessage(messages.datesOption5)}</option>
                <option value={"3months"}>{formatMessage(messages.datesOption1)}</option>
                <option value={"6months"}>{formatMessage(messages.datesOption2)}</option>
                <option value={"9months"}>{formatMessage(messages.datesOption3)}</option>
                <option value={"12months"}>{formatMessage(messages.datesOption4)}</option>
                <option value={"unavailable"}>{formatMessage(messages.datesDropDown)}</option>
              </Field>
            </FormGroup>
            <Row>
              <Col lg={6} md={6} sm={12} xs={12}>
                <FormGroup className={cx(cs.spaceBottom4)}>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.minTripLength} />
                  </ControlLabel>
                  <Field
                    name="minDay"
                    component={this.renderIncrementButton}
                    stayNight={minNight}
                  />
                </FormGroup>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <FormGroup className={cs.spaceBottom4}>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.maxTripLength} />
                  </ControlLabel>
                  <Field
                    name="maxDay"
                    component={this.renderIncrementButton}
                    stayNight={maxNight}
                  />
                </FormGroup>
              </Col>
            </Row>
             <Row>
              <Col lg={6} md={6} sm={12} xs={12}>
                <FormGroup className={cx(cs.spaceBottom4)}>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.minTripLengt2} />
                  </ControlLabel>
                  <Field
                    name="minHours"
                    component={this.renderIncrementButton}
                    stayNight={minHours}
                  />
                </FormGroup>
              </Col>
              <Col lg={6} md={6} sm={12} xs={12}>
                <FormGroup className={cs.spaceBottom4}>
                  <ControlLabel className={s.landingLabel}>
                    <FormattedMessage {...messages.maxTripLength2} />
                  </ControlLabel>
                  <Field
                    name="maxHours"
                    component={this.renderIncrementButton}
                    stayNight={maxHours}
                  />
                </FormGroup>
              </Col>
            </Row> 
            <FormGroup className={cx(cs.spaceBottom4)}>
              <ControlLabel className={s.landingLabel}>
                <FormattedMessage {...messages.chooseCancellationPolicy} />
              </ControlLabel>
              <Field name="cancellationPolicy" component={CommonFormComponent} inputClass={cx(s.formControlSelect, s.jumboSelect)} onChange={() => this.handleCancellation()} >
                <option value={"1"}>{formatMessage(messages.flexible)}</option>
                <option value={"2"}>{formatMessage(messages.moderate)}</option>
                <option value={"3"}>{formatMessage(messages.strict)}</option>
              </Field>
            </FormGroup>
            <div className={cx(s.searchToolTip, cs.spaceTop2, cs.spaceBottom4)}>
              <img src={locationIcon} className={'commonIconSpace'} />
              <span className={cx(s.locationTipCss, cs.commonMediumText)}>{policyContent}</span>
            </div>
            {
              listingSteps?.step3 === "completed"
              && listingSteps.listing && listingSteps.listing.isPublished && <div className={s.spaceTop4}>
                <h3 className={cx(s.landingLabel)}><FormattedMessage {...messages.syncCalendars} /></h3>
                <SyncCalendar listId={listId} />
              </div>
            }
          </div>
          <FooterButton
            nextPage={nextPage}
            previousPage={previousPage}
            nextPagePath={"calendar"}
            previousPagePath={"discount"}
            formPage={formPage}
            step={step}
          />
        </form>
      </div>
    );
  }
}

// Decorate with connect to read form values
const selector = formValueSelector('ListPlaceStep3'); // <-- same as form name

MinminDays = reduxForm({
  form: 'ListPlaceStep3', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate: validateStep3,
  onSubmit: updateStep3
})(MinminDays);

const mapState = (state) => ({
  minDayData: selector(state, 'minDay'),
  maxDayData: selector(state, 'maxDay'),
  cancelPolicy: selector(state, 'cancellationPolicy'),
  listingFields: state?.listingFields?.data,
  listingSteps: state?.location?.listingSteps,
  cancellationPolicies: state?.location?.cancellationPolicies
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(MinminDays)));
