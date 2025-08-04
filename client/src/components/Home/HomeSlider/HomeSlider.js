import React from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { injectIntl } from 'react-intl';

import Loader from '../../Loader/Loader';
import CommonListingItems from '../CommonListingItems/CommonListingItems';

import messages from '../../../locale/messages';
import { isRTL } from '../../../helpers/formatLocale';

import prevArrow from '/public/SiteIcons/sliderPrevArrow.svg';
import nextArrow from '/public/SiteIcons/sliderNextArrow.svg';

import s from './HomeSlider.css';

const nextArrowStyle = {
  right: '-14px',
  top: '40%',
  cursor: 'pointer',
  position: 'absolute',
  zIndex: '2'
};

const prevArrowStyle = {
  left: '-14px',
  top: '40%',
  cursor: 'pointer',
  position: 'absolute',
  zIndex: '2'
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      onClick={onClick}
      style={nextArrowStyle}
    >
      <img src={nextArrow} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      onClick={onClick}
      style={prevArrowStyle}
    >
      <img src={prevArrow} />
    </div>
  );
}

class SlideComponent extends React.Component {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      listPhotos: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
      })),
      coverPhoto: PropTypes.number,
      listingData: PropTypes.shape({
        basePrice: PropTypes.number,
        currency: PropTypes.string,
      }),
      settingsData: PropTypes.arrayOf(PropTypes.shape({
        listsettings: PropTypes.shape({
          itemName: PropTypes.string,
        }),
      })),
      id: PropTypes.number,
      beds: PropTypes.number,
      title: PropTypes.string,
      bookingType: PropTypes.string,
      reviewsCount: PropTypes.number,
      reviewsStarRating: PropTypes.number
    }))
  };

  static defaultProps = {
    data: []
  }

  static defaultProps = {
    data: [],
    arrow: true
  }

  constructor(props) {
    super(props);
    this.state = {
      isClient: false
    };
    this.swiper = React.createRef();

    this.state = {
      isBeginning: true,
      isEnd: false,
      load: false,
      showArrow: false,
    }
  }

  componentWillUnmount() {
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('touchend', this.progress);
      window.removeEventListener('mouseover', this.progress);
    }
  }

  componentDidMount() {
    const { data, fromPage } = this.props;
    const isBrowser = typeof window !== 'undefined';
    let smallDevice, showArrow;
    smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : true;
    showArrow = false;
    if (smallDevice) {
      showArrow = data?.length > 1 ? true : false
    } else {
      if (fromPage) {
        showArrow = data?.length > 2 ? true : false
      } else {
        showArrow = data?.length > 4 ? true : false
      }
    }
    this.setState({
      isClient: true,
      load: true,
      showArrow
    });

    if (isBrowser) {
      this.progress();
      window.addEventListener('touchend', this.progress);
      window.addEventListener('mouseover', this.progress);
    }
  }

  componentDidUpdate(prevProps) {
    const { locale } = this.props.intl;
    const { locale: prevLocale } = prevProps.intl;

    if (locale !== prevLocale) {
      this.setState({
        load: false
      });
      clearTimeout(this.loadSync);
      this.loadSync = null;
      this.loadSync = setTimeout(() => {
        this.setState({
          load: true
        })
        this.progress()
      }, 1);
    }
  }

  goNext = () => {
    const { current } = this.swiper;
    current?.swiper?.slideNext();
    this.progress();
  }

  goPrev = () => {
    const { current } = this.swiper;
    current?.swiper?.slidePrev();
    this.progress();
  }

  progress = () => {
    const { current } = this.swiper;
    this.setState({ isEnd: current?.swiper?.isEnd, isBeginning: current?.swiper?.isBeginning });
  }


  render() {
    const { data, intl: { locale }, arrow, similarClassName, similiarListPadding, fromPage, isEditWishList, className } = this.props;
    const { load, isBeginning, isEnd, showArrow } = this.state;
    const { formatMessage } = this.props.intl;
    const params = {
      slidesPerView: fromPage == 'viewProfile' ? 2 : (fromPage == 'whistList' ? 3 : 4),
      spaceBetween: 25,
      isFinite: false,
      breakpoints: {
        1200: {
          slidesPerView: fromPage == 'viewProfile' ? 2 : 4,
        },
        991: {
          slidesPerView: '3',
        },
        768: {
          slidesPerView: '3',
        },
        767: {
          slidesPerView: '2',
        },
        412: {
          slidesPerView: '1',
        },
        280: {
          slidesPerView: '1'
        }
      }
    }

    return (

      <Row className={cx('homeSlickSlider', className && className)}>
        <Col xs={12} sm={12} md={12} lg={12} className={similarClassName}>
          {
            !load && <div>
              <Loader type="text" />
            </div>
          }
          {
            load && <Swiper {...params} rtl={isRTL(locale)} ref={this.swiper} className={cx('row', s.noMargin)}>
              {
                data?.length > 0 && data?.map((item, index) => {
                  let carType, transmission, isListOwner, starRatingValue = 0, transmissionLabel;
                  carType = item?.settingsData[0].listsettings?.itemName;
                  transmission = item?.transmission;
                  isListOwner = item?.isListOwner;
                  transmission == '1' ? transmissionLabel = formatMessage(messages.Automatic) : transmissionLabel = formatMessage(messages.Manuall);
                  if (item?.reviewsCount > 0 && item?.reviewsStarRating > 0) {
                    starRatingValue = Math.round(item?.reviewsStarRating / item?.reviewsCount)
                  }
                  if (item?.listPhotos?.length > 0) {
                    return (
                      <div key={index} className={cx(s.background, s.positionRelative, similiarListPadding)}>
                        <CommonListingItems
                          id={item?.id}
                          key={index}
                          isChecked={item?.wishListStatus}
                          isEditWishList={isEditWishList}
                          title={item.title}
                          listPhotos={item?.listPhotos}
                          coverPhoto={item?.coverPhoto}
                          bookingType={item?.bookingType}
                          basePrice={item.listingData?.basePrice}
                          hourlyPrice={item.listingData?.hourlyPrice}

                          currency={item.listingData?.currency}
                          reviewsCount={item?.reviewsCount}
                          carType={carType}
                          transmissionLabel={transmissionLabel}
                          isListOwner={isListOwner}
                          userId={item?.userId}
                          starRatingValue={starRatingValue}
                        />
                      </div>
                    )
                  }
                })
              }
            </Swiper>
          }
          <div className={'homeSwiperArrow'}>
            {load && showArrow && !isBeginning && <SamplePrevArrow className={cx('prevRTL')} onClick={this.goPrev} />}
            {load && showArrow && !isEnd && <SampleNextArrow className={cx('nextRTL')} onClick={this.goNext} />}
          </div>
        </Col>
      </Row>
    );
  }
};

export default injectIntl(withStyles(s)(SlideComponent));