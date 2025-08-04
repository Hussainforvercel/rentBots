import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { graphql, compose } from 'react-apollo';
import { Field, reduxForm, reset } from 'redux-form';
import validate from './validate';
// Style
import {
  Button,
  Row,
  FormGroup,
  Col,
  ControlLabel
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
// Component
import AdminStarRating from '../AdminStarRating';
import CommonFormComponent from '../../CommonField/CommonFormComponent';
import Link from '../../Link';
// GraphQL
import WriteAdminReviewMutation from './WriteAdminReviewMutation.graphql';
import history from '../../../core/history';
import messages from '../../../locale/messages';
import showToaster from '../../../helpers/toasterMessages/showToaster'
//Image
import arrowIcon from '/public/AdminIcons/backArrow.svg';
import s from './AdminReviewsForm.css';
import cs from '../../../components/commonStyle.css';

class AdminReviewsForm extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    initialValues: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }


  renderStarRating = ({ input, label, meta: { touched, error }, className, children }, value) => {
    const { formatMessage } = this.props.intl;
    return (
      <FormGroup className={s.noMargin}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <label className={cs.labelTextNew} >{label}</label>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className={s.starSize}>
              <AdminStarRating
                name={input.name}
                change={input.onChange}
                value={input.value}
                editing={true}
              />
              {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
            </span>
          </Col>
        </Row>
      </FormGroup>

    )
  }

  async submitForm(values, dispatch) {
    const { mutate } = this.props;
    const { data } = await mutate({ variables: values });
    if (data?.writeAdminReview) {
      if (data?.writeAdminReview?.status === '200') {
        if (values.id) {
          showToaster({ messageId: 'updateAdminReview', toasterType: 'success' })
        } else {
          showToaster({ messageId: 'submitAdminReview', toasterType: 'success'})
          dispatch(reset('AdminReviewsForm'));
        }
      } else if (data?.writeAdminReview?.status === '404') {
        showToaster({ messageId: 'listIdNotAvailable', toasterType: 'error'})
      } else {
        showToaster({ messageId: 'adminReviewFailed', toasterType: 'error' })
      }
      history.push('/siteadmin/reviews')
    }
  }

  render() {
    const { error, handleSubmit, submitting, title, initialValues } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={cx(s.pagecontentWrapper, 'adminReviewStar')}>
        <div className={s.sectionCenter}>
          {initialValues &&
            <div className={cx(cs.textAlignRight, cs.mobileDisplayBlock, 'textAlignLeftRTL', cs.spaceBottom4)}>
              <Link to={'/siteadmin/reviews'} className={cx(cs.siteLinkColor, cs.commonContentText, cs.fontWeightMedium, cs.commomLinkborderBottom, cs.textDecorationNone)}>
                <img src={arrowIcon} className={cx(cs.backArrowStyle, 'adminGoBackArrowRTL')} />
                <FormattedMessage {...messages.goBack} />
              </Link>
            </div>
          }
          <div className={s.panelHeader}>
            <h1 className={s.headerTitle}> {initialValues ? <FormattedMessage {...messages.editReviwes} /> : <FormattedMessage {...messages.writeReviwes} />} </h1>
            <form onSubmit={handleSubmit(this.submitForm)}>
              {error && <strong>{formatMessage(error)}</strong>}
              <FormGroup className={s.space3}>
                <ControlLabel className={cs.labelTextNew}>
                  <FormattedMessage {...messages.carIDText} />
                </ControlLabel>
                <Field name="listId" type="text" component={CommonFormComponent} label={formatMessage(messages.carIDText)} inputClass={cs.formControlInput} />
              </FormGroup>
              <FormGroup className={s.space3}>
                <ControlLabel className={cs.labelTextNew}>
                  <FormattedMessage {...messages.reviewContentLabel} />
                </ControlLabel>
                <Field name="reviewContent" component={CommonFormComponent} componentClass={'textarea'} label={formatMessage(messages.reviewContentLabel)} />
              </FormGroup>
              <Field name="rating" component={this.renderStarRating} label={formatMessage(messages.reviewRating)} />
              <FormGroup className={s.noMargin}>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} className={cx(cs.textAlignRight, 'textAlignLeftRTL')}>
                    <Button className={cx(cs.btnPrimary, cs.btnlarge)} type="submit" disabled={submitting}><FormattedMessage {...messages.submit} /></Button>
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

AdminReviewsForm = reduxForm({
  form: 'AdminReviewsForm', // a unique name for this form
  validate
})(AdminReviewsForm);

export default compose(injectIntl, withStyles(s, cs), graphql(WriteAdminReviewMutation))(AdminReviewsForm);