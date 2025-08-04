import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './LanguageForm.css';
import cs from '../../../components/commonStyle.css';
import CommonFormComponent from '../../../components/CommonField/CommonFormComponent';
import messages from '../../../locale/messages';

class LanguageForm extends Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async handleFormSubmit(values) {
        const { createLanguage, updateLanguage, paginationData } = this.props;
        const response = values.id 
            ? await updateLanguage(values.id, values.title, values.code, values.fileURL)
            : await createLanguage(values.title, values.code, values.fileURL);
            
        if (response && response.status === 200) {
            paginationData(1);
        }
    }

    render() {
        const { error, handleSubmit, submitting, initialValues } = this.props;
        const { formatMessage } = this.props.intl;

        return (
            <div className={cx(s.formMaxWidth, 'maxwidthcenter', 'empty')}>
                <h1 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.spaceBottom12)}>
                    {initialValues ? <FormattedMessage {...messages.editLanguage} /> : <FormattedMessage {...messages.addLanguage} />}
                </h1>
                <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                    {error && <strong>{formatMessage(error)}</strong>}
                    
                    <FormGroup className={s.space3}>
                        <ControlLabel className={cs.labelTextNew}>
                            <FormattedMessage {...messages.languageTitle} />
                        </ControlLabel>
                        <Field
                            name="title"
                            type="text"
                            component={CommonFormComponent}
                            label={formatMessage(messages.languageTitle)}
                            inputClass={cs.formControlInput}
                        />
                    </FormGroup>

                    <FormGroup className={s.space3}>
                        <ControlLabel className={cs.labelTextNew}>
                            <FormattedMessage {...messages.languageCode} />
                        </ControlLabel>
                        <Field
                            name="code"
                            type="text"
                            component={CommonFormComponent}
                            label={formatMessage(messages.languageCode)}
                            inputClass={cs.formControlInput}
                        />
                    </FormGroup>

                    <FormGroup className={s.space3}>
                        <ControlLabel className={cs.labelTextNew}>
                            <FormattedMessage {...messages.languageFileURL} />
                        </ControlLabel>
                        <Field
                            name="fileURL"
                            type="text"
                            component={CommonFormComponent}
                            label={formatMessage(messages.languageFileURL)}
                            inputClass={cs.formControlInput}
                        />
                    </FormGroup>

                    <FormGroup className={s.space3}>
                        <div className={cx(cs.textAlignRight, 'textAlignLeftRTL')}>
                            <Button className={cx(cs.btnPrimary, cs.btnlarge)} type="submit" disabled={submitting}>
                                {initialValues ? <FormattedMessage {...messages.update} /> : <FormattedMessage {...messages.addLabel} />}
                            </Button>
                        </div>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

LanguageForm = reduxForm({
    form: 'LanguageForm',
    enableReinitialize: true,
})(LanguageForm);

export default injectIntl(withStyles(s, cs)(LanguageForm)); 