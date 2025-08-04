
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FcFlashOn } from 'react-icons/fc';
import cx from 'classnames';

// Component
import CurrencyConverter from '../../CurrencyConverter';
import MapListingPhotos from '../MapListingPhotos';
import StarRating from '../../StarRating';
import WishListIcon from '../../WishListIcon';

// Locale
import messages from '../../../locale/messages';

// Helper
import { formatURL } from '../../../helpers/formatURL';

//Image
import streeingIcon from '/public/SiteIcons/steeringIcon.svg';
import startIcon from '/public/SiteIcons/star.svg';
import arrowIcon from '/public/SiteIcons/rentNowArrow.svg';

// Style
import s from './MapListingItem.css';
import cs from '../../commonStyle.css';

class MapListingItem extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    basePrice: PropTypes.number,
    currency: PropTypes.string,
    title: PropTypes.string,
    beds: PropTypes.number,
    personCapacity: PropTypes.number,
    carType: PropTypes.string,
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    bookingType: PropTypes.string.isRequired,
    reviewsCount: PropTypes.number,
    reviewsStarRating: PropTypes.number,
    formatMessage: PropTypes.any,
    wishListStatus: PropTypes.bool,
    isListOwner: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    const { onCloseClick } = this.props;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      onCloseClick();
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      id,
      basePrice,
      hourlyPrice,
      currency,
      title,
      beds,
      personCapacity,
      carType,
      coverPhoto,
      listPhotos,
      bookingType,
      reviewsCount,
      reviewsStarRating,
      wishListStatus,
      isListOwner,
      transmission,
      personalized
    } = this.props;
    const { count } = this.state;
    let bedsLabel = 'Trip';
    let guestsLabel = 'guest', transmissionLabel;
    if (beds > 1) {
      bedsLabel = 'Trips';
    }

    if (personCapacity > 1) {
      guestsLabel = 'guests';
    }

    let starRatingValue = 0, personalizeURL = '', startDate, endDate, location;
    if (reviewsCount > 0 && reviewsStarRating > 0) {
      starRatingValue = Math.round(reviewsStarRating / reviewsCount)
    }
    let activeItem = 0, photoTemp, photosList = listPhotos.slice();
    if (listPhotos && listPhotos.length > 1) {
      listPhotos.map((x, y) => { if (x.id === coverPhoto) activeItem = y });
      if (activeItem > 0) {
        photoTemp = photosList[0];
        photosList[0] = photosList[activeItem];
        photosList[activeItem] = photoTemp;
      }
    }

    transmission == '1' ? transmissionLabel = formatMessage(messages.Automatic) : transmissionLabel = formatMessage(messages.Manuall);
    startDate = personalized?.startDate ? "?&startdate=" + personalized?.startDate : '';
    endDate = personalized?.endDate ? "&enddate=" + personalized?.endDate : '';
    personalizeURL = startDate + endDate;

    if (personalized?.location && personalized?.startDate && personalized?.endDate) {
      startDate = personalized?.startDate ? "&startdate=" + personalized?.startDate : '';
      location = personalized?.location ? "?&address=" + personalized?.location : '';
      personalizeURL = location + startDate + endDate;
    } else if (personalized?.location) {
      location = personalized?.location ? "?&address=" + personalized?.location : '';
      personalizeURL = location
    }
    return (
      <div className={cx(s.listItemContainer, 'mapInfoWindow-')} ref={this.setWrapperRef}>
        <div className={cx(s.listPhotoContainer)}>
          {
            !isListOwner && <WishListIcon listId={id} key={id} isChecked={wishListStatus} />
          }
          <Row>
            <Col xs={12} sm={12} md={12}>
              {
                photosList && photosList.length > 0 && <MapListingPhotos
                  id={id}
                  coverPhoto={coverPhoto}
                  listPhotos={photosList}
                  formatURL={formatURL}
                  title={title}
                  personalizeURL={personalizeURL}
                />
              }
            </Col>
          </Row>
          <div className={s.listInfo}>
            <a className={s.listInfoLink} href={"/cars/" + formatURL(title) + '-' + id + personalizeURL} target={"_blank"}>
              <div className={cx(s.textEllipsis, s.infoDesc, s.infoText, s.infoSpace)}>
                <div className={cx(s.listingInfo, cs.commonSmallText)}>
                  <img src={streeingIcon} className={cx('imgIconRight', s.streeingIcon)} />
                  <span className='carTypeRTL'>{carType}</span>
                  <span className={s.dotCss}></span>
                  <span>{transmissionLabel}</span>
                </div>
              </div>
              <div className={cx(s.priceCss, 'priceCssRTL', cs.commonSubTitleText, cs.fontWeightBold, s.priceContainer)}>
                  <div className={s.priceItem}>
                    {bookingType === "instant" && <span><FcFlashOn className={s.instantIcon} /></span>}
                    <CurrencyConverter
                      amount={basePrice}
                      from={currency}
                    />
                    {' '}<span className={cx(cs.fontWeightNormal, cs.commonSmallText)}><FormattedMessage {...messages.perNight} /></span>
                  </div>
                  <div className={s.priceItem}>
                    {bookingType === "instant" && <span><FcFlashOn className={s.instantIcon} /></span>}
                    <CurrencyConverter
                      amount={hourlyPrice}
                      from={currency}
                    />
                    {' '}<span className={cx(cs.fontWeightNormal, cs.commonSmallText)}>Hour</span>
                </div>
              </div>
              <div className={cx(s.textEllipsis, s.listingTitle, cs.commonContentText)}>
                {title}
              </div>
              <div className={s.HRRight}>
                {starRatingValue > 0 && <div className={cx(s.reviewCss, 'reviewCssSliderRTL', cs.commonContentText)}>
                  <img src={startIcon} />&nbsp;<span>{starRatingValue}</span>
                </div>}
                <a className={s.btn} href={"/cars/" + formatURL(title) + '-' + id + personalizeURL} target={'_blank'}>
                  <FormattedMessage {...messages.rentNowText} />
                  <img src={arrowIcon} className={cx(s.arrowIconCss, 'viewArrowLeft')} />
                </a>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  personalized: state?.personalized,
});
const mapDispatch = {};
export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(MapListingItem)));
