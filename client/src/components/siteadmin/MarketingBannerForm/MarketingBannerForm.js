import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import { compose } from 'redux';
import cx from 'classnames';
import {
  Button,
  Row,
  FormGroup,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl } from 'react-intl';

import ImageUploadComponent from '../ImageUploadComponent/ImageUploadComponent';
import CommomImageDisplay from '../CommonImageDisplay/CommomImageDisplay';
import { photosShow } from '../../../helpers/photosShow';
import { homebanneruploadDir } from '../../../config';

import PictureImage from '/public/AdminIcons/default.svg'
import s from './MarketingBannerForm.css';
import cp from '../../../components/commonStyle.css';

class MarketingBannerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.initialValues?.title || '',
      link: props.initialValues?.link || '',
      image: props.initialValues?.image || '',
      buttonText: props.initialValues?.buttonText || 'Learn More',
      id: props.initialValues?.id || null,
      isEnable: typeof props.initialValues?.isEnable === 'boolean' ? props.initialValues.isEnable : true,
      loading: false,
      error: null,
      success: false
    };
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({ [name]: type === 'checkbox' ? checked : value, success: false });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, link, image, buttonText, id, isEnable } = this.state;
    
    try {
      this.setState({ loading: true, error: null, success: false });
      
      if (!id) {
        // Create new banner
        const { data } = await this.props.createMarketingBanner({
          variables: { title, image, link, buttonText, isEnable }
        });
        
        if (data.createMarketingBanner) {
          this.setState({ 
            id: data.createMarketingBanner.id,
            loading: false,
            success: true
          });
        }
      } else {
        // Update existing banner
        const { data } = await this.props.updateMarketingBanner({
          variables: { id: parseInt(id, 10), title, image, link, buttonText, isEnable }
        });
        
        if (data.updateMarketingBanner) {
          this.setState({ 
            loading: false,
            success: true
          });
        }
      }
    } catch (error) {
      this.setState({ 
        error: error.message,
        loading: false,
        success: false
      });
    }
  }

  success = async (file, fromServer) => {
    const fileName = fromServer.file.filename;
    this.setState({ image: fileName });
  }

  render() {
    const { title, link, image, buttonText, loading, error, success, isEnable } = this.state;
    const { formatMessage } = this.props.intl;
    let path = photosShow(homebanneruploadDir);

    return (
      <div className='listPhotoContainer'>
        <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL', 'adminPhotoUplod', 'dzInputContainer')}>
          <div className={cx(cp.adminContentPadding)}>
            <div className={s.sectionCenter}>
              <div className={cp.commonAdminBorderSection}>
                <h1 className={s.headerTitle}>Marketing Banner Settings</h1>
                <form onSubmit={this.handleSubmit}>
                  {error && <div className={s.error}>{error}</div>}
                  {success && <div className={s.success}>Banner saved successfully!</div>}
                  
                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew}>Banner Image</label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} className={cp.textAlignCenter}>
                        <div className={'uploadDropZoneSection'}>
                          <ImageUploadComponent
                            defaultMessage="Click or drag image to upload"
                            componentConfig={{
                              iconFiletypes: ['.jpg', '.png', '.jpeg'],
                              multiple: false,
                              showFiletypeIcon: false,
                              postUrl: '/uploadHomeBanner'
                            }}
                            loaderName={'bannerUploaderLoading'}
                            success={this.success}
                          >
                          </ImageUploadComponent>
                          <img src={PictureImage} alt={'PictureImage'} className={'uploadDropZoneSectionImage'} />
                        </div>
                        {image && (
                          <CommomImageDisplay
                            loader={loading}
                            image={path + image}
                          />
                        )}
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup >
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew}>Title</label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <input
                          type="text"
                          name="title"
                          value={title}
                          onChange={this.handleInputChange}
                          className={cx(cp.formControlInput)}
                          placeholder="Enter banner title"
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew}>Link</label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <input
                          type="text"
                          name="link"
                          value={link}
                          onChange={this.handleInputChange}
                          className={cx(cp.formControlInput)}
                          placeholder="Enter banner link"
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew}>Button Text</label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <input
                          type="text"
                          name="buttonText"
                          value={buttonText}
                          onChange={this.handleInputChange}
                          className={cx(cp.formControlInput)}
                          placeholder="Enter button text"
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className={s.space3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <label className={cp.labelTextNew}>Enable Banner</label>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <input
                          type="checkbox"
                          name="isEnable"
                          checked={isEnable}
                          onChange={this.handleInputChange}
                        />
                        <span style={{ marginLeft: 8 }}>{isEnable ? 'Enabled' : 'Disabled'}</span>
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className={s.noMargin}>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} className={cx(cp.textAlignRight, 'textAlignLeftRTL')}>
                        <Button 
                          className={cx(cp.btnPrimary, cp.btnlarge)} 
                          type="submit" 
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </Button>
                      </Col>
                    </Row>
                  </FormGroup>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MarketingBannerForm.propTypes = {
  initialValues: PropTypes.object,
  intl: PropTypes.object.isRequired
};

export default compose(
  injectIntl,
  withStyles(s, cp),
  graphql(gql`
    mutation createMarketingBanner($title: String!, $image: String!, $link: String!, $buttonText: String!, $isEnable: Boolean) {
      createMarketingBanner(title: $title, image: $image, link: $link, buttonText: $buttonText, isEnable: $isEnable) {
        id
        status
        title
        image
        link
        buttonText
        isEnable
      }
    }
  `, {
    name: 'createMarketingBanner'
  }),
  graphql(gql`
    mutation updateMarketingBanner($id: Int!, $title: String!, $image: String!, $link: String!, $buttonText: String!, $isEnable: Boolean) {
      updateMarketingBanner(id: $id, title: $title, image: $image, link: $link, buttonText: $buttonText, isEnable: $isEnable) {
        id
        status
        title
        image
        link
        buttonText
        isEnable
      }
    }
  `, {
    name: 'updateMarketingBanner'
  })
)(MarketingBannerForm); 