import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Image from '../WhyHostFormBlock1/Image';
import CommonFormComponent from '../../../CommonField/CommonFormComponent';

import messages from '../../../../locale/messages';
import submit from './submit';
import validate from './validate';

import s from './WhyHostFormBlock4.css';
import cs from '../../../../components/commonStyle.css';

class WhyHostFormBlock4 extends Component {

  render() {
    const { error, handleSubmit, submitting, workImage1, workImage2, workImage3, workImage1Loader, workImage2Loader, workImage3Loader } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(cs.adminContentPadding)}>
        <div className={s.sectionCenter}>
          <div className={cs.commonAdminBorderSection}>
            <h1 className={s.headerTitle}><FormattedMessage {...messages.WhyBecomeOwnerBlock4} /></h1>
            <form onSubmit={handleSubmit(submit)}>
              {error && <strong>{formatMessage(error)}</strong>}
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.easyHostTitle} /> 1</label>
                <Field
                  name="easyHostTitle1"
                  type="text"
                  component={CommonFormComponent}
                  inputClass={cx(cs.formControlInput)}
                  label={formatMessage(messages.easyHostTitle1)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleLabel1} /></label>
                <Field
                  name="easyHostContent1"
                  component={CommonFormComponent}
                  componentClass={'textarea'}
                  label={formatMessage(messages.workTitleLabel1)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleContentLabel1} /></label>
                <Field
                  name="easyHostContent2"
                  component={CommonFormComponent}
                  componentClass={'textarea'}
                  label={formatMessage(messages.workTitleContentLabel1)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <div className={cx(s.siteContainer)}>
                  <label className={cs.labelTextNew} ><FormattedMessage {...messages.imageLabel} /> 1</label>
                  <Image image={workImage1} fieldName={"workImage1"} loader={workImage1Loader} />
                </div>
              </FormGroup>
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleLabel2} /></label>
                <Field
                  name="workTitle1"
                  type="text"
                  component={CommonFormComponent}
                  inputClass={cx(cs.formControlInput)}
                  label={formatMessage(messages.workTitleLabel2)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleContentLabel2} /></label>
                <Field
                  name="workContent1"
                  component={CommonFormComponent}
                  componentClass={'textarea'}
                  label={formatMessage(messages.workTitleContentLabel2)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <div className={cx(s.siteContainer)}>
                  <label className={cs.labelTextNew} ><FormattedMessage {...messages.imageLabel} /> 2</label>
                  <Image image={workImage2} fieldName={"workImage2"} loader={workImage2Loader} />
                </div>
              </FormGroup>
              <FormGroup className={s.space3}>
                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleLabel3} /></label>

                <Field
                  name="workTitle2"
                  type="text"
                  component={CommonFormComponent}
                  inputClass={cx(cs.formControlInput)}
                  label={formatMessage(messages.workTitleLabel3)}
                />

              </FormGroup>
              <FormGroup className={s.space3}>

                <label className={cs.labelTextNew} ><FormattedMessage {...messages.workTitleContentLabel3} /></label>

                <Field
                  name="workContent2"
                  component={CommonFormComponent}
                  componentClass={'textarea'}
                  label={formatMessage(messages.workTitleContentLabel3)}
                />
              </FormGroup>
              <FormGroup className={s.space3}>
                <div className={cx(s.siteContainer)}>
                  <label className={cs.labelTextNew} ><FormattedMessage {...messages.imageLabel} /> 3</label>

                  <Image image={workImage3} fieldName={"workImage3"} loader={workImage3Loader} />
                </div>
              </FormGroup>
              <FormGroup className={s.noMargin}>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} className={cx(cs.textAlignRight, 'textAlignLeftRTL')}>
                    <Button className={cx(cs.btnPrimary, cs.btnlarge)} type="submit" disabled={submitting}>
                      <FormattedMessage {...messages.save} />
                    </Button>
                  </Col>
                </Row>
              </FormGroup>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

WhyHostFormBlock4 = reduxForm({
  form: 'WhyHostForm',
  validate
})(WhyHostFormBlock4);

const selector = formValueSelector('WhyHostForm');

const mapState = (state) => ({
  workImage1Loader: state?.loader?.workImage1,
  workImage2Loader: state?.loader?.workImage2,
  workImage3Loader: state?.loader?.workImage3,
  workImage1: selector(state, 'workImage1'),
  workImage2: selector(state, 'workImage2'),
  workImage3: selector(state, 'workImage3'),
});

const mapDispatch = {};

export default compose(
  withStyles(s, cs),
  injectIntl,
  connect(mapState, mapDispatch)
)(WhyHostFormBlock4);