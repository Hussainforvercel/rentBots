import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';

import DateRange from '../DateRange';
import Avatar from '../../Avatar';
import Loader from '../../Loader';
import TimeField from '../TimeField';

import validate from './validate';
import submit from './submit';
import messages from '../../../locale/messages';
import { generateTimes } from '../../../helpers/formatting';
import { contactHostClose } from '../../../actions/message/contactHostModal';

import streeing from '/public/siteImages/steering.svg';
import arrow from '/public/SiteIcons/rentNowArrow.svg';

import s from './ContactHost.css';
import cs from '../../../components/commonStyle.css';
import c from '../../../components/ViewListing/common.css';

class ContactHost extends React.Component {
  static propTypes = {
    showContactHostModal: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    picture: PropTypes.string,
    profileId: PropTypes.number.isRequired,
    personCapacity: PropTypes.number.isRequired,
    minDay: PropTypes.number,
    maxDay: PropTypes.number,
    maxDaysNotice: PropTypes.string,
    blockedDates: PropTypes.array,
    availability: PropTypes.bool,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    contactHostClose: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
    maximumStay: PropTypes.bool,
  };

  static defaultProps = {
    showContactHostModal: false,
    id: 0,
    profileId: 0,
    displayName: null,
    picture: null,
    personCapacity: 0,
    minDay: 0,
    maxDay: 0,
    blockedDates: [],
    availability: false,
    startDate: null,
    endDate: null,
    maximumStay: false,
    minimumStay: false
  };

  constructor(props) {
    super(props);
  }

  renderGuests = (personCapacity) => {
    let rows = [];
    for (let i = 1; i <= personCapacity; i++) {
      rows.push(<option key={i} value={i}>{i} {i > 1 ? 'guests' : 'guest'}</option>);
    }
    return rows;
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={'inputFocusColor'}>
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    )
  }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className, placeholder }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={'inputFocusColor'}>
        <label>{label}</label>
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"
          placeholder={placeholder}
          rows={'5'}
        >
          {children}
        </FormControl>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    )
  }

  renderWarningBlock = (content, error) => {
    let bgClass;
    if (error) {
      bgClass = s.alertBlockError;
    } else {
      bgClass = s.alertBlockSuccess;
    }
    return (
      <div className={cx(s.alertBlock, bgClass, cs.spaceBottom3, s.mobileMargin)}>
        <h4 className={cx(cs.commonContentText)}>
          {content}
        </h4>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { showContactHostModal, contactHostClose } = this.props;
    const { id, minDay, maxDay, maxDaysNotice, blockedDates } = this.props;
    const { profileId, picture, displayName } = this.props;
    const { availability, startDate, endDate, isLoading, maximumStay, minimumStay } = this.props;
    const { handleSubmit, submitting, startTime, endTime } = this.props;

    let isDateChosen, isTimeChosen, isValue = true, isToday = false;
    let momentStartDate, momentEndDate, dayDifference, startTimeLookup, endTimeLookup;
    let disabled, loadingStatus;

    isDateChosen = startDate != null && endDate != null || false;
    isTimeChosen = isNaN(startTime) || isNaN(startTime) ? false : true;
    momentStartDate = moment(startDate);
    momentEndDate = moment(endDate);
    dayDifference = momentEndDate.diff(momentStartDate, 'days');

    startTimeLookup = generateTimes(0, 1410, isToday);
    endTimeLookup = generateTimes(0, 0);

    if (momentStartDate) {
      isToday = moment(moment(momentStartDate)).isSame(moment(), 'day');
      startTimeLookup = generateTimes(0, 1410, isToday);
    }

    if (momentEndDate) {
      isToday = moment(moment(momentEndDate)).isSame(moment(), 'day');
      endTimeLookup = generateTimes(0, 0, isToday);
    }

    if ((startTime >= endTime) && dayDifference == 0) {
      isValue = false;
    }

    if (startTime && !endTime) {
      isValue = false;
    }

    if ( !isTimeChosen || !isValue) {
      disabled = true;
    } else {
      disabled = false;
    }
    console.log(disabled,isDateChosen,isTimeChosen,isValue,"testing")
    loadingStatus = isLoading || false;

    return (
      <div>
        <Modal show={showContactHostModal} onHide={contactHostClose} animation={false} className={'moreFilterModal'}>
          <Modal.Header closeButton>
            <FormattedMessage {...messages.contactHost} />
          </Modal.Header>
          <Modal.Body>
            <div className={cx(s.displayGrid, s.mainPadding)}>
              <div className={cx(s.avatarSection, 'contactHostAvatarRTL')}>
                <div className={cx(cs.textAlignCenter, s.paddingCommon)}>
                  <Avatar
                    source={picture}
                    height={96}
                    width={96}
                    title={displayName}
                    className={cx(s.profileAvatar, c.profileAvatarLink)}
                    withLink
                    linkClassName={cs.displayinlineBlock}
                    profileId={profileId}
                  />
                  <div className={cs.spaceTop1}>
                    <a href={"/users/show/" + profileId} target="_blank" className={cx(cs.commonSubTitleText, cs.siteLinkColor, cs.fontWeightBold, cs.paddingTop3)}>
                      {displayName}
                    </a>
                  </div>
                </div>
                <hr className={cx(cs.listingHorizoltalLine, s.contactLine)} />
                <div className={s.paddingCommon}>
                  <p className={cx(cs.commonContentText, cs.fontWeightMedium)}><FormattedMessage {...messages.contactHostinfo1} />:</p>
                  <h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingTop3, s.displayFlex)}>
                    <img src={streeing} className={cx(s.streeingImage, 'commonIconSpace')} />
                    <span>
                      <FormattedMessage {...messages.contactHostinfo2} /> {displayName} <FormattedMessage {...messages.contactHostinfo3} />
                    </span>
                  </h6>
                  <h6 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingTop3, s.displayFlex)}>
                    <img src={streeing} className={cx(s.streeingImage, 'commonIconSpace')} />
                    <span>
                      <FormattedMessage {...messages.contactHost7} />
                    </span>
                  </h6>
                  <h5 className={cx(cs.commonMediumText, cs.fontWeightNormal, cs.paddingTop3, s.displayFlex)}>
                    <img src={streeing} className={cx(s.streeingImage, 'commonIconSpace')} />
                    <span><FormattedMessage {...messages.contactHostinfo6} />!</span>
                  </h5>
                </div>
              </div>
              <div className={cx(s.dateSection, 'contactHostDateSectionRTL')}>
                <Loader
                  show={loadingStatus}
                  type={"page"}
                >
                  <div>
                    {
                      (!isDateChosen || !isTimeChosen && (!maximumStay && !minimumStay && availability)) && this.renderWarningBlock(<h4 className={cs.commonContentText}><FormattedMessage {...messages.hostErrorMessage1} /></h4>)
                    }
                    {
                      !maximumStay && !availability && !minimumStay && isDateChosen && this.renderWarningBlock(<p className={cs.commonContentText}><FormattedMessage {...messages.hostErrorMessage2} /></p>, "error")
                    }
                    {
                      isDateChosen && maximumStay && this.renderWarningBlock(<h6 className={cs.commonContentText}><FormattedMessage {...messages.maximumStay} /> {maxDay} <FormattedMessage {...messages.nights} /></h6>, "error")
                    }
                    {
                      isDateChosen && minimumStay && this.renderWarningBlock(<h6 className={cs.commonContentText}><FormattedMessage {...messages.minimumStayText} /> {minDay} <FormattedMessage {...messages.nights} /></h6>, "error")
                    }
                    {
                      availability && isDateChosen && isValue && isTimeChosen && this.renderWarningBlock(<p className={cs.commonContentText}><FormattedMessage {...messages.hostErrorMessage3} /></p>)
                    }
                    {
                      isTimeChosen && !isValue &&
                      this.renderWarningBlock(<div className={s.errorCss}><FormattedMessage {...messages.chooseDifferentEndTime} /></div>)
                    }
                    <Form onSubmit={handleSubmit(submit)}>
                      <FormGroup className={cs.spaceBottom4}>
                        <label><FormattedMessage {...messages.dates} /></label>
                        <div className={'viewListingDate'}>
                          <DateRange
                            listId={id}
                            minimumNights={minDay}
                            maximumNights={maxDay}
                            blockedDates={blockedDates}
                            formName={"ContactHostForm"}
                            maxDaysNotice={maxDaysNotice}
                          />
                        </div>
                      </FormGroup>
                      <FormGroup className={cs.spaceBottom4}>
                        <label>{formatMessage(messages.startLabel)}</label>
                        <div className={s.displayTimeGrid}>
                          <TimeField
                            name={"startTime"}
                            className={cs.formControlSelect}
                            TimeLookup={startTimeLookup}
                            formName={"ContactHostForm"}
                            label={formatMessage(messages.tripStart)}
                            listId={id}
                            startDate={startDate}
                            endDate={endDate}
                            startTime={startTime}
                            endTime={endTime}
                            maximumNights={maxDay}
                            value={startTime}
                            minimumNights={minDay}
                            classNameParent={cx(s.paddingRight, 'contactHostPaddingRightRTL')}
                          />
                          <TimeField
                            name={"endTime"}
                            className={cs.formControlSelect}
                            TimeLookup={endTimeLookup}
                            formName={"ContactHostForm"}
                            label={formatMessage(messages.tripEnd)}
                            listId={id}
                            startDate={startDate}
                            endDate={endDate}
                            startTime={startTime}
                            endTime={endTime}
                            maximumNights={maxDay}
                            value={endTime}
                            minimumNights={minDay}
                            classNameParent={cx(s.paddingLeft, 'contactHostPaddingLeftRTL')}
                          />
                        </div>
                      </FormGroup>
                      <FormGroup className={cs.spaceBottom4}>
                        <Field
                          name="content"
                          component={this.renderFormControlTextArea}
                          className={cx(cs.formControlInput, 'commonInputPaddingRTL')}
                          label={formatMessage(messages.contactMessage)}
                          placeholder={formatMessage(messages.textBoxMessage)}
                        />
                      </FormGroup>
                      <Button className={cx(cs.btnPrimary, cs.btnLarge, cs.fullWidth)} type="submit" disabled={submitting || disabled}>
                        <FormattedMessage {...messages.sendMessage} />
                        <img src={arrow} className={cx(s.arrowIconCss, 'sliderArrowRTL')} />
                      </Button>
                    </Form>
                  </div>
                </Loader>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div >
    );
  }
}

ContactHost = reduxForm({
  form: "ContactHostForm",
  validate
})(ContactHost);

const selector = formValueSelector('ContactHostForm');

const mapState = (state) => ({
  isLoading: state?.viewListing?.isLoading,
  showContactHostModal: state?.viewListing?.showContactHostModal,
  availability: state?.viewListing?.availability,
  maximumStay: state?.viewListing?.maximumStay,
  minimumStay: state?.viewListing?.minimumStay,
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
  startTime: Number(selector(state, 'startTime')),
  endTime: Number(selector(state, 'endTime')),
});

const mapDispatch = {
  contactHostClose
};

export default injectIntl(withStyles(s, cs, c)(connect(mapState, mapDispatch)(ContactHost)));