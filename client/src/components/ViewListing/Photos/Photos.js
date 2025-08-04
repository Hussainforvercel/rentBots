
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import ListCoverPhoto from '../../ListCoverPhoto';
import ListGridCoverPhoto from '../../ListGridCoverPhoto';
import ImageSlider from '../ImageSlider';
import WishListIcon from '../../WishListIcon';
import ListDefaultPhoto from '../../ListDefaultPhoto';

import { openImageLightBox, closeImageLightBox } from '../../../actions/ImageLightBox';
import { setStickyTop } from '../../../actions/Sticky/StrickyActions';
import { openSocialShareModal } from '../../../actions/modalActions';
import messages from '../../../locale/messages';
import { photosShow } from '../../../helpers/photosShow';
import { fileuploadDir } from '../../../config';

import s from './Photos.css';
import cs from '../../../components/commonStyle.css';

//Images
import photoImage from '/public/siteImages/gallery.svg';

class Photos extends React.Component {
  static propTypes = {
    listPhotos: PropTypes.array,
    coverPhoto: PropTypes.number,
    openImageLightBox: PropTypes.any.isRequired,
    closeImageLightBox: PropTypes.any.isRequired,
    imageLightBox: PropTypes.bool.isRequired,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    listPhotos: [],
    imageLightBox: false
  }

  constructor(props) {
    super(props);
    this.state = {
      sources: []
    }
  }

  componentDidMount() {
    const { data, setStickyTop } = this.props;
    let sources = [], sourceObject = {}, coverPhoto;
    let sticky = document.querySelector('[data-sticky-top]'), stickyHeight = 412;
    let path = photosShow(fileuploadDir);

    if (data.listPhotos != null && data.listPhotos.length > 0) {
      coverPhoto = data.listPhotos[0].name;

      if (data.coverPhoto != undefined && data.coverPhoto != null) {

        data.listPhotos.map((item, key) => {
          if (item.id === data.coverPhoto) {
            sourceObject = {};
            sourceObject['src'] = `${path}x_large_` + item.name;
            sources.push(sourceObject);
          }
        });

        data.listPhotos.map((item, key) => {
          if (item.id != data.coverPhoto) {
            sourceObject = {};
            sourceObject['src'] = `${path}x_large_` + item.name;
            sources.push(sourceObject);
          }
        });

      } else {
        data.listPhotos.map((item, key) => {
          sourceObject = {};
          sourceObject['src'] = `${path}x_large_` + item.name;
          sources.push(sourceObject);
        });
      }
      this.setState({ sources });
    }
    stickyHeight = (sticky.getBoundingClientRect().height + 10);
    setStickyTop(stickyHeight);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    let sources = [], sourceObject = {}, coverPhoto;
    let sticky = document.querySelector('[data-sticky-top]'), stickyHeight = 412;
    let path = photosShow(fileuploadDir);

    if (data.listPhotos != null && data.listPhotos.length > 0) {

      coverPhoto = data.listPhotos[0].name;

      if (data.coverPhoto != undefined && data.coverPhoto != null) {

        data.listPhotos.map((item, key) => {
          if (item.id === data.coverPhoto) {
            sourceObject = {};
            sourceObject['src'] = `${path}x_large_` + item.name;
            sources.push(sourceObject);
          }
        });

        data.listPhotos.map((item, key) => {
          if (item.id != data.coverPhoto) {
            sourceObject = {};
            sourceObject['src'] = `${path}x_large_` + item.name;
            sources.push(sourceObject);
          }
        });

      } else {
        data.listPhotos.map((item, key) => {
          sourceObject = {};
          sourceObject['src'] = `${path}x_large_` + item.name;
          sourceObject['src'] = `${path}x_large_` + item.name;
          sources.push(sourceObject);
        });
      }

      this.setState({ sources });
    }
    stickyHeight = (sticky.getBoundingClientRect().height + 10);
    setStickyTop(stickyHeight);
  }

  openSliderClick = () => {
    const { openImageLightBox } = this.props;
    let root = document.getElementsByTagName('html')[0];
    root.classList.add('scrollHidden');
    openImageLightBox();
  }

  render() {
    const { sources } = this.state;
    const { data, closeImageLightBox, imageLightBox, openSocialShareModal, loading } = this.props;

    let coverPhoto = data.coverPhoto;
    let listPhotos = data.listPhotos;
    let wishListStatus = data.wishListStatus;
    let isListOwner = data.isListOwner;

    return (
      <div className={cx(s.bannerContainer)} data-sticky-top>
        <ImageSlider
          imageLightBox={imageLightBox}
          closeImageLightBox={closeImageLightBox}
          sources={sources}
        />
        {
          listPhotos && listPhotos.length == 0 && <ListDefaultPhoto
            className={s.bannerImage}
            coverPhoto={coverPhoto}
            listPhotos={listPhotos}
            photoType={"xx_large"}
            bgImage
          >
          </ListDefaultPhoto>
        }
        <a onClick={this.openSliderClick} className={s.gridPadding}>
          {
            listPhotos && listPhotos.length > 0 && listPhotos.length <= 3 && <ListCoverPhoto
              className={cx(s.bannerImage, s.singleImage)}
              coverPhoto={coverPhoto}
              listPhotos={listPhotos}
              photoType={"xx_large"}
              bgImage
            >
              {
                listPhotos && listPhotos.length > 0 && <Button
                  className={cx(s.viewPhotosBtn, 'viewPhotosBtnRTL', cs.commonMediumText, cs.fontWeightMedium)}
                  onClick={this.openSliderClick}
                >
                  <img src={photoImage} className={cx(s.photoImage, 'commonIconSpace')} />
                  <FormattedMessage {...messages.showAllPhotos} />
                </Button>
              }
            </ListCoverPhoto>
          }
        </a>
        {
          sources && sources.length > 0 && sources.length > 3 &&
          <ListGridCoverPhoto
            className={s.bannerImage}
            coverPhoto={coverPhoto}
            listPhotos={sources}
            photoType={"xx_large"}
            bgImage
          >
          </ListGridCoverPhoto >
        }

        {
          sources && sources.length > 0 && <div>
            <Button
              className={cx(s.viewPhotosBtn, 'viewPhotosBtnRTL', cs.commonMediumText, cs.fontWeightMedium)}
              onClick={this.openSliderClick}
            >
              <img src={photoImage} className={cx(s.photoImage, 'commonIconSpace')} />
              <FormattedMessage {...messages.showAllPhotos} />
            </Button>
          </div>
        }
        {/* {
          !isListOwner && !loading && <WishListIcon type="button" listId={data.id} key={data.id} isChecked={wishListStatus} />
        }
        {
          <div
            className={cx(s.buttonContainer, 'bannerContainerShareRTL')}
            onClick={openSocialShareModal}
          >
            <span><FontAwesome.FaSignOut className={s.wishListIcon} /></span>
            <span className={cx(s.paddingleft10, s.vtrMiddle)}> <FormattedMessage {...messages.share} /></span>
          </div>
        } */}
      </div>
    );
  }
}

const mapState = (state) => ({
  imageLightBox: state.viewListing.imageLightBox
});

const mapDispatch = {
  openImageLightBox,
  closeImageLightBox,
  setStickyTop,
  openSocialShareModal
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(Photos)));