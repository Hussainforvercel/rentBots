import React from 'react'
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { graphql, compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Row from 'react-bootstrap/lib/Row';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import ListingDetails from './ListingDetails';
import StarRating from '../../StarRating';

import validate from './validate';
import WriteReviewMutation from './WriteReviewMutation.graphql';
import messages from '../../../locale/messages';
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster';

import s from './Rating.css';
import cs from '../../../components/commonStyle.css';
class RatingForm extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      reviewsCount: PropTypes.number.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      coverPhoto: PropTypes.number,
      reviewsCount: PropTypes.number,
      reviewsStarRating: PropTypes.number,
      listPhotos: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      }))
    }),
    formatMessage: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  renderFormControlTextArea = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={'inputFocusColor'}>
        <FormGroup className={cx(s.noMargin)}>
          <FormControl
            {...input}
            className={className}
            componentClass="textarea"
            placeholder={label}
          >
            {children}
          </FormControl>
          {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        </FormGroup>
      </div>
    );
  }

  renderStarRating = ({ input, label, meta: { touched, error }, children, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className={cx(s.starSize, 'writeOverAllIcon', 'writeOverAllIconRTL')}>
        <StarRating
          name={input.name}
          change={input.onChange}
          editing={true}
          starCount={5}
          className={cx(cs.writeReviewStarHeight)}
        />
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    );
  }

  handleChange = () => {
    history.push('/user/reviews/you');
  }

  submitForm = async (values, dispatch) => {
    const { mutate, gotoPage2 } = this.props;
    const { data } = await mutate({ variables: values });
    if (data?.writeReview?.status == '200') {
      gotoPage2();
    } else {
      showToaster({ messageId: 'alreadyReviewed', toasterType: 'error' })
    }
  }

  render() {
    const { data, hostData } = this.props;
    const { handleSubmit, submitting, isHost } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <Row className={s.landingContainer}>
        <Col xs={12} sm={6} md={7} lg={7} className={cx(s.landingContent, s.spaceTop5)}>
          <div className={cx(cs.spaceBottom4)}>
            <h1 className={s.landingContentTitle}><FormattedMessage {...messages.writeReview} /></h1>
            {isHost ? <p className={s.landingStep}><FormattedMessage {...messages.reviewPageTitle1} /> </p> : <p className={s.landingStep}><FormattedMessage {...messages.reviewPageTitle2} /></p>}
          </div>
          <Form onSubmit={handleSubmit(this.submitForm)}>
            <div>
              <div>
                <h2 className={s.rateingText}><FormattedMessage {...messages.reviewRating} /></h2>
                <Field
                  name="rating"
                  component={this.renderStarRating}
                />
              </div>
              <hr className={s.horizontalLineThrough} />
              <div className={cx(s.space4)}>
                <h2 className={s.rateingText}><FormattedMessage {...messages.reviewPageTitle} /></h2>
                <Field
                  className={cx(s.textareaInput)}
                  name="reviewContent"
                  component={this.renderFormControlTextArea}
                  label={formatMessage(messages.reviewTextArea)}
                />
              </div>
            </div>
            <div className={s.buttonGroup}>
              <Button className={cx(s.button, s.btnlarge, s.btnPrimaryBorder, s.marginRight, 'noMarginLeftRTL')}
                type="button"
                onClick={this.handleChange}
              >
                <FormattedMessage {...messages.cancel} />
              </Button>

              <Button className={cx(s.btn, s.button, s.btnPrimary, s.btnlarge, 'writeReviewBtnMarginLeftRTL')}
                type="submit"
                disabled={submitting}
              >
                <FormattedMessage {...messages.submit} />
              </Button>
            </div>
          </Form>
        </Col>
        <Col lg={5} md={5} sm={6} xs={12} className={cx(s.landingContent, s.spaceTop5)}>
          <ListingDetails data={data} hostData={hostData} />
        </Col>
      </Row>
    );
  }
}

RatingForm = reduxForm({
  form: 'RatingForm', // a unique name for this form
  validate
})(RatingForm);

export default compose(
  injectIntl,
  withStyles(s),
  graphql(WriteReviewMutation),
)(RatingForm);
