import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import cx from 'classnames';
import {
    Button,
    Row,
    FormGroup,
    Col,
    ControlLabel
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CommonFormComponent from '../../../CommonField/CommonFormComponent';
import submit from './submit';
import validate from './validate';
import s from './WhyHostFormBlock6.css';
import cs from '../../../../components/commonStyle.css';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../locale/messages';

class WhyHostFormBlock6 extends Component {

    render() {

        const { error, handleSubmit, submitting, dispatch, initialValues, title } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <div className={cx(cs.adminContentPadding)}>
                <div className={s.sectionCenter}>
                    <div className={cs.commonAdminBorderSection}>
                        <h1 className={s.headerTitle}><FormattedMessage {...messages.whyBecomeOwnerBlock7} /></h1>
                        <form onSubmit={handleSubmit(submit)}>
                            {error && <strong>{formatMessage(error)}</strong>}
                            <FormGroup className={s.space3}>

                                <label className={cs.labelTextNew} ><FormattedMessage {...messages.peaceTitleHeading} /></label>

                                <Field
                                    name="peaceTitleHeading"
                                    type="text"
                                    inputClass={cx(cs.formControlInput)}
                                    component={CommonFormComponent}
                                    label={formatMessage(messages.peaceTitleHeading)}
                                />

                            </FormGroup>

                            <FormGroup className={s.space3}>

                                <label className={cs.labelTextNew} ><FormattedMessage {...messages.peaceTitleHeading} /></label>

                                <Field
                                    name="peaceTitle3"
                                    inputClass={cx(cs.formControlInput)}
                                    type="text"
                                    component={CommonFormComponent}
                                    label={formatMessage(messages.tabTitle)}
                                />

                            </FormGroup>
                            <FormGroup className={s.space3}>

                                <label className={cs.labelTextNew} ><FormattedMessage {...messages.peaceContentLabel3} /></label>

                                <Field
                                    name="peaceContent3"
                                    componentClass={"textarea"}
                                    component={CommonFormComponent}
                                    label={formatMessage(messages.peaceContentLabel3)}
                                />

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

WhyHostFormBlock6 = reduxForm({
    form: 'WhyHostForm',
    validate
})(WhyHostFormBlock6);

export default injectIntl(withStyles(s, cs)(WhyHostFormBlock6));