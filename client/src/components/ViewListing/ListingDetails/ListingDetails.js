import React from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {
  Button,
  Collapse
} from 'react-bootstrap';
import cx from 'classnames';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

// Translation
import { injectIntl, FormattedMessage } from 'react-intl';

// Redux
import { connect } from 'react-redux';

// Internal Component
import ListItem from './ListItem';

// Redux Action
import { contactHostOpen } from '../../../actions/message/contactHostModal';
// Helper functions
import { formattingTime, checkIn, checkValue } from './helper';

// Locale
import messages from '../../../locale/messages';

//Images
import arrowIcon from '/public/SiteIcons/listArrowLeft.svg';

import s from './ListingDetails.css';
import cs from '../../../components/commonStyle.css';

class ListingDetails extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      listingData: PropTypes.shape({
        cancellation: PropTypes.shape({
          policyName: PropTypes.string.isRequired,
          policyContent: PropTypes.string.isRequired
        })
      })
    }),
    getSpecificSettings: PropTypes.any,
    settingsData: PropTypes.object,
    isHost: PropTypes.bool.isRequired,
    formatMessage: PropTypes.any,
    userBanStatus: PropTypes.number,
  };
  static defaultProps = {
    isHost: false,
    description: []
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ open: !this.state.open })
  }


  render() {
    const { data, contactHostOpen, isHost, userBanStatus, className } = this.props;
    const { open } = this.state;
    const { formatMessage } = this.props.intl;
    let minDay, maxDay, checkInStart, checkInEnd, propertyType, roomType,
      userAmenities = [], userSafetyAmenities = [], amenities = [],
      sharedSpaces = [], houseRules = [], bedTypes = [],
      description, personCapacity, bathrooms, bedrooms, beds;
    if (data?.listingData != undefined) {
      minDay = checkValue(data?.listingData?.minDay, 0);
      maxDay = checkValue(data?.listingData?.maxDay, 0);
      checkInStart = checkValue(data?.listingData?.checkInStart, '');
      checkInEnd = checkValue(data?.listingData?.checkInEnd, '');
    }
    if (data?.settingsData != undefined && data?.settingsData?.length > 0) {
      propertyType = checkValue(data?.settingsData && data?.settingsData[1]?.listsettings?.itemName, '');
      roomType = checkValue(data?.settingsData && data?.settingsData[0]?.listsettings?.itemName, '');
    }
    sharedSpaces = checkValue(data?.userSpaces, []);
    houseRules = checkValue(data?.houseRules, []);
    userAmenities = checkValue(data?.userAmenities, []);
    userSafetyAmenities = checkValue(data?.userSafetyAmenities, []);
    description = checkValue(data?.description, '');
    personCapacity = checkValue(data?.personCapacity, 0);
    bathrooms = checkValue(data?.bathrooms, 0);
    bedrooms = checkValue(data?.bedrooms, 0);
    beds = checkValue(data?.beds, 0);
    bedTypes = checkValue(data?.userBedsTypes, []);

    let count = 150, firstArray, restArray, dotString = false;
    if (description) {
      firstArray = description.slice(0, count);
      restArray = description.slice(count, description.length);
    }
    if (restArray?.length > 0) {
      dotString = true;
    }


    return (
      <div>
        <>
          <h5 className={cx(cs.commonSubTitleText, cs.fontWeightBold, cs.paddingBottom3)}>
            <FormattedMessage {...messages.aboutListing} />
          </h5>
          <div>
            <p className={cs.commonContentText}>
              {!this.state.open && count >= 150 && dotString === true &&
                <span>{firstArray} ...</span>
              }
              {!this.state.open && count >= 150 && dotString === false &&
                <span>{firstArray}</span>
              }
              {
                restArray?.length > 0 &&
                <span>
                  <Collapse in={open}>
                    <div>
                      {firstArray}{restArray}
                    </div>
                  </Collapse>
                  {
                    dotString &&
                    <div className={cs.paddingTop2}>
                      <Button
                        bsStyle="link"
                        className={s.showHideBtn}
                        onClick={() => this.handleClick()}
                      >
                        {this.state.open ? <FormattedMessage {...messages.closeAllLabel} /> : <FormattedMessage {...messages.showMore} />}

                        {
                          this.state.open && <FaAngleUp className={s.navigationIcon} />
                        }

                        {
                          !this.state.open && <FaAngleDown className={s.navigationIcon} />
                        }

                      </Button>
                    </div>
                  }
                </span>
              }
            </p>
          </div>
          {/* {
            !isHost && !userBanStatus &&
            <a href="javascript:void(0)" className={cx(s.sectionCaptionLink, s.sectionLink)} onClick={() => contactHostOpen(data.id)} >
              <FormattedMessage {...messages.contactHost} />
            </a>
          } */}
        </>
        <hr className={cs.listingHorizoltalLine} />
        {
          sharedSpaces?.length > 0 && <>
            <ListItem
              itemList={sharedSpaces}
              label={formatMessage(messages.sharedSpaces)}
              showLabel={formatMessage(messages.showMore)}
              hideLabel={formatMessage(messages.closeAllLabel)}
              className={s.listItemSection}
            />

          </>
        }

        {
          userAmenities?.length > 0 && <>
            <ListItem
              itemList={userAmenities}
              label={formatMessage(messages.carFeatures)}
              showLabel={formatMessage(messages.showMore)}
              hideLabel={formatMessage(messages.closeAllLabel)}
              className={s.listItemSection}
            />
          </>
        }

        {
          houseRules?.length > 0 && <>
            <ListItem
              itemList={houseRules}
              label={formatMessage(messages.houseRules)}
              showLabel={formatMessage(messages.showMore)}
              hideLabel={formatMessage(messages.closeAllLabel)}
            />
          </>
        }

        {/* {
          data && data.listingData && data.listingData.cancellation && <>
            <p className={cx(cs.commonSubTitleText, cs.fontWeightBold, cs.paddingBottom3)}>
              <FormattedMessage {...messages.cancellations} />
            </p>
            <div>
              <p>
                {data.listingData.cancellation.policyName}
              </p>
              <p>
                {data.listingData.cancellation.policyContent}
              </p>
              <div className={s.showHideMargin}>
                <Link
                  to={"/cancellation-policies/" + data.listingData.cancellation.policyName}
                  className={cx(s.sectionCaptionLink)}
                >
                  <FormattedMessage {...messages.viewDetails} />
                </Link>
              </div>
            </div>
          </>
        } */}

        {
          userSafetyAmenities?.length > 0 && <>
            <ListItem
              itemList={userSafetyAmenities}
              label={formatMessage(messages.safetyFeatures)}
              showLabel={formatMessage(messages.showMore)}
              hideLabel={formatMessage(messages.closeAllLabel)}
            />
          </>
        }

        {
          ((minDay != null && minDay) || (maxDay != null && maxDay > 0)) && <>
            <h6 className={cx(cs.commonSubTitleText, cs.fontWeightBold)}><FormattedMessage {...messages.availability} /></h6>
            <div className={s.minMaxSection}>
              {
                minDay != null && minDay > 0 &&
                <p className={cx(cs.commonContentText, s.displayFlex, cs.paddingTop3)}>
                  <img src={arrowIcon} className={cx(s.streeingImage, 'commonIconSpace')} />
                  <span>
                    <span className={cs.fontWeightBold}>{minDay} {minDay > 1 ? 'days' : 'day'}</span>{' '}
                    <FormattedMessage {...messages.minimumStay} />
                  </span>
                </p>
              }
              {
                maxDay != null && maxDay > 0 &&
                <p className={cx(cs.commonContentText, s.displayFlex, cs.paddingTop3)}>
                  <img src={arrowIcon} className={cx(s.streeingImage, 'commonIconSpace')} />
                  <span>
                    <span className={cs.fontWeightBold}>{maxDay} {maxDay > 1 ? 'days' : 'day'}</span>{' '}
                    <FormattedMessage {...messages.maximumNightStay} />
                  </span>
                </p>
              }
            </div>
            <hr className={cs.listingHorizoltalLine} />
          </>
        }
      </div>
    );
  }
}
const mapState = (state) => ({
  settingsData: state?.viewListing?.settingsData,
});
const mapDispatch = {
  contactHostOpen
};
export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(ListingDetails)));