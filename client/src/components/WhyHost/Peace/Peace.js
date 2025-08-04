import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-id-swiper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import { injectIntl } from 'react-intl';

import { isRTL } from '../../../helpers/formatLocale';
import { photosShow } from '../../../helpers/photosShow';
import { homebanneruploadDir } from '../../../config';
//Image
import nextIcon from '/public/SiteIcons/sliderNextArrow.svg';
import prevIcon from '/public/SiteIcons/sliderPrevArrow.svg';

import s from './Peace.css';
import cs from '../../commonStyle.css';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <img src={nextIcon} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <img src={prevIcon} />
    </div>
  );
}
class Peace extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
    siteName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showArrow: false,
      load: false,
    }
    this.swiper = React.createRef();
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
  }

  componentDidMount() {
    const { reviewData } = this.props;
    const isBrowser = typeof window !== 'undefined';
    let smallDevice, showArrow;
    smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : true;
    showArrow = false;
    if (smallDevice) {
      showArrow = reviewData && reviewData.length > 1 ? true : false
    } else {
      showArrow = reviewData && reviewData.length > 3 ? true : false
    }
    this.setState({
      showArrow,
      load: true
    })
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
        });
      }, 3000);
    }
  }

  goNext() {
    if (!this.swiper) return;
    const { current } = this.swiper;
    current.swiper.slideNext();
  }

  goPrev() {
    if (!this.swiper) return;
    const { current } = this.swiper;
    current.swiper.slidePrev();
  }

  render() {
    const { data, reviewData, intl: { locale }, siteName } = this.props;
    const { load } = this.state;

    let path = photosShow(homebanneruploadDir);

    const params = {
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      breakpoints: {
        1024: {
          slidesPerView: 3
        },
        768: {
          slidesPerView: 'auto',
        },
        820: {
          slidesPerView: 3
        },
        767: {
          slidesPerView: 1,
        },
        375: {
          slidesPerView: 1
        },
        360: {
          slidesPerView: 1
        },
        280: {
          slidesPerView: 1
        }
      }
    };
    return (
      <div className={s.easyImage}>
        <div className={s.container}>
          <h3 className={cx(s.heading)}>
            {data && data.peaceTitleHeading}
          </h3>

          {load && <div><Swiper {...params} rtl={isRTL(locale)} ref={this.swiper}>
            {reviewData.map((review) => {
              let image = review.image ? `${path}${review.image}` : defaultPic;
              return (
                <div className={s.whiteBox}>
                  <div className={cx(cs.dFlex, s.gap)}>
                    <img src={image} className={s.iconCss} />
                    <div>
                      <div className={cx(cs.commonSubTitleText, cs.fontWeightBold)}>{review.userName}</div>
                      <div className={cx(cs.commonSmallText, s.grayText)}>{siteName}</div>
                    </div>
                  </div>
                  <p className={cx(cs.commonContentText, cs.spaceTop4)}>{review.reviewContent}</p>
                </div>
              )
            })
            }
          </Swiper>
            {this.state.showArrow && <div className={s.arrowCenter}>
              <SamplePrevArrow
                className={cx(s.displayInline, 'superPrevArrowRTL')}
                onClick={this.goPrev}
              />
              <SampleNextArrow
                className={cx(s.displayInline, 'superNextArrowRTL')}
                onClick={this.goNext}
              />
            </div>}
          </div>
          }
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  siteName: state.siteSettings.data.siteName,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Peace)));
