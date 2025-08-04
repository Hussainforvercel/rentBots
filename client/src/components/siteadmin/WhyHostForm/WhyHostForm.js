import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm, FieldArray, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import CommonFormComponent from '../../CommonField/CommonFormComponent';
import ImageUploadComponent from '../ImageUploadComponent/ImageUploadComponent';
import CommonImageDisplay from '../CommonImageDisplay/CommomImageDisplay';


// Style
import { whyHostUploadDir } from '../../../config';
import submit from './submit';
import validate from './validate';
import messages from '../../../locale/messages';
import { photosShow } from '../../../helpers/photosShow';

//Images
import infoImage from '/public/SiteIcons/priceHoverIcon.svg';
import defaultPic from '/public/AdminIcons/default.svg';
import deleteIcon from '/public/AdminIcons/dlt.png';
import tickIcon from '/public/SiteIcons/adminPlusIcon.svg';

//Style
import cs from '../../../components/commonStyle.css';
import s from './WhyHostForm.css';

class WhyHostForm extends Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,
  };

  renderDocument = ({ fields, meta: { touched, error } }) => {
    const { formatMessage } = this.props.intl;
    const { whyHostUploaderLoading } = this.props;
    let path = photosShow(whyHostUploadDir);

    return (
      <div className={s.whyFromGrid}>
        {fields && fields.length > 0 && fields.map((document, index) => {
          let fieldLength = fields.length - 1;
          let image = fields.get(index) && fields.get(index).imageName;

          const success = async (file, fromServer) => {
            const { fieldName, change, dataList } = this.props;
            const images = `${document}.imageName`
            const fileName = fromServer.file.filename;
            await change(images, fileName)
          }


          return (
            <div>
              <div className={s.sectionBorder}>
                <FormGroup className={cs.space3}>
                  <label className={s.labelTextNew}>{formatMessage(messages.imageLabel)}</label>
                  <div className={cs.picContainerMain}>
                    <div className={cx(cs.picContainer, 'bgBlack')}>
                      <div className={cx(cs.profilePic, cs.whiteBgImageUploadSec)}>
                        <CommonImageDisplay
                          loader={whyHostUploaderLoading['whyHostUploaderLoading' + index]}
                          image={image ? path + image : defaultPic}
                          isDefaultPic={image ? false : true}
                          isDelete={false}
                        />
                        {fields && fields.length > 1 && <div className={cx(cs.trashIconNew, 'trashIconRTL')}>
                          <img src={deleteIcon} onClick={() => fields.remove(index)} className={s.removeIcon} />
                        </div>}
                      </div>
                    </div>
                  </div>
                  <div className={cx(s.fullWidth, s.noPadding, s.space2, s.spaceTop2)}>
                    <div className={cx(cs.chooseBtnContainer, 'adminUploader')}>
                      <ImageUploadComponent
                        subText={formatMessage(messages.uploadSizedLabel)}
                        defaultMessage={formatMessage(messages.clickHeretoUploadImage)}
                        componentConfig={{
                          iconFiletypes: ['.jpg', '.png', '.jpeg'],
                          multiple: false,
                          showFiletypeIcon: false,
                          postUrl: '/uploadWhyHost'
                        }}
                        loaderName={`whyHostUploaderLoading${index}`}
                        success={success}
                        maxUploadText={cx(s.spaceTop2, cs.textAlignCenter)}

                      >
                      </ImageUploadComponent>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup className={cs.space3}>
                  <ControlLabel className={s.labelTextNew}>
                    <FormattedMessage {...messages.tabTitle} />
                  </ControlLabel>
                  <Field
                    name={`${document}.title`}
                    type="text"
                    placeholder={formatMessage(messages.tabTitle)}
                    component={CommonFormComponent}
                    inputClass={cx(cs.formControlInput)}
                    label={formatMessage(messages.tabTitle)}
                  />
                </FormGroup>
                <FormGroup className={cs.space3}>
                  <ControlLabel className={s.labelTextNew}>
                    <FormattedMessage {...messages.buttonLabel} />
                  </ControlLabel>
                  <Field
                    name={`${document}.buttonLabel`}
                    type="text"
                    placeholder={formatMessage(messages.buttonLabel)}
                    component={CommonFormComponent}
                    inputClass={cx(cs.formControlInput)}
                    label={formatMessage(messages.buttonLabel)}
                  />
                </FormGroup>
              </div>
              {
                fieldLength == index &&
                <div className={cx(s.spaceTop3, 'textAlignRightRtl', cs.dFlexWrapAlignEnd)}>
                  <Button
                    variant="primary"
                    onClick={() => fields.push({ imageName: null, title: null, buttonLabel: null })}
                    className={cx(cs.btnPrimary, cs.btnLarge, s.addLink, cs.dFlex)}
                  >
                    <img src={tickIcon} className={cs.csvImageSpace} />
                    {formatMessage(messages.addLabel)}
                  </Button>
                </div>
              }
            </div>
          )
        })
        }
      </div>
    )
  }


  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentAR')}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={s.dFlex}>
              <h1 className={s.headerTitle}><FormattedMessage {...messages.whyHostPage} /></h1>
              <div className={cx(s.specialPriceIcon, 'specialPriceIconRTL')}>
                <span className={'svgImg'}>
                  <img src={infoImage} className={cx(s.faqImage, 'specialpriceRtl')} />
                </span>
                <div className={cx(s.toolTip, s.toolTipRelativeSection, 'toolTipDarkMode', 'toolTipRelativeSectionAdminRTL')}>
                  <FormattedMessage {...messages.whyHostTooltipText} />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(submit)}>
              <FieldArray
                name="dataList"
                rerenderOnEveryChange={true}
                component={this.renderDocument}
              />
              <div className={cx(cs.textAlignRight, s.spaceTop3, 'textAlignLeftRtl')}>
                <Button className={cx(cs.btnPrimary, cs.btnLarge)} type="submit" disabled={submitting}>
                  <FormattedMessage {...messages.save} />
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }

}

WhyHostForm = reduxForm({
  form: 'WhyHostForm', // a unique name for this form
  validate
})(WhyHostForm);

const selector = formValueSelector('WhyHostForm');

const mapState = (state) => ({
  dataList: selector(state, 'dataList'),
  whyHostUploaderLoading: state.loader
});

const mapDispatch = {
  change
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(WhyHostForm)));