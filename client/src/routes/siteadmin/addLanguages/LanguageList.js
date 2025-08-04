import React, { Component } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './LanguageList.css';
import cs from '../../../components/commonStyle.css';
import messages from '../../../locale/messages';

class LanguageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            loading: true,
            emailTemplates: [],
            selectedTemplate: null,
            showTemplateModal: false
        };
    }

    componentDidMount() {
        this.loadLanguages();
        this.loadEmailTemplates();
    }

    async loadLanguages() {
        const { getLanguages } = this.props;
        const response = await getLanguages();
        if (response && response.status === 200) {
            this.setState({
                languages: response.data,
                loading: false
            });
        }
    }

    async loadEmailTemplates() {
        try {
            const response = await fetch('/api/admin/email-templates', { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                this.setState({ emailTemplates: data.data });
            }
        } catch (e) {
            // handle error
        }
    }

    async handleDelete(id) {
        const { deleteLanguage } = this.props;
        const response = await deleteLanguage(id);
        if (response && response.status === 200) {
            this.loadLanguages();
        }
    }

    handleEdit(language) {
        const { setInitialValues } = this.props;
        setInitialValues(language);
    }

    handleEditTemplate = async (template) => {
        // Fetch full template (with content)
        const response = await fetch(`/api/admin/email-templates/${template.id}`, { credentials: 'include' });
        const data = await response.json();
        if (data.success) {
            this.setState({ selectedTemplate: data.data, showTemplateModal: true });
        }
    };

    handleSaveTemplate = async () => {
        const { selectedTemplate } = this.state;
        const response = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                subject: selectedTemplate.subject,
                content: selectedTemplate.content
            })
        });
        if (response.ok) {
            this.setState({ showTemplateModal: false, selectedTemplate: null });
            this.loadEmailTemplates();
        }
    };

    render() {
        const { languages, loading, emailTemplates, showTemplateModal, selectedTemplate } = this.state;
        const { formatMessage } = this.props.intl;

        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div className={cx(s.listContainer, 'maxwidthcenter')}>
                <h1 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.spaceBottom12)}>
                    <FormattedMessage {...messages.languagesList} />
                </h1>
                <Table responsive hover className={s.table}>
                    <thead>
                        <tr>
                            <th><FormattedMessage {...messages.languageTitle} /></th>
                            <th><FormattedMessage {...messages.languageCode} /></th>
                            <th><FormattedMessage {...messages.languageFileURL} /></th>
                            <th><FormattedMessage {...messages.actions} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.map((language) => (
                            <tr key={language.id}>
                                <td>{language.title}</td>
                                <td>{language.code}</td>
                                <td>{language.fileURL}</td>
                                <td>
                                    <Button 
                                        className={cx(cs.btnPrimary, cs.btnSm, s.actionButton)} 
                                        onClick={() => this.handleEdit(language)}
                                    >
                                        <FormattedMessage {...messages.edit} />
                                    </Button>
                                    <Button 
                                        className={cx(cs.btnDanger, cs.btnSm, s.actionButton)} 
                                        onClick={() => this.handleDelete(language.id)}
                                    >
                                        <FormattedMessage {...messages.delete} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Email Templates Section */}
                <h2 className={cx(cs.commonTotalText, cs.fontWeightBold, cs.spaceTop24, cs.spaceBottom12)}>Email Templates</h2>
                <Table responsive hover className={s.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emailTemplates.map((template) => (
                            <tr key={template.id}>
                                <td>{template.name}</td>
                                <td>{template.subject}</td>
                                <td>
                                    <Button 
                                        className={cx(cs.btnPrimary, cs.btnSm, s.actionButton)} 
                                        onClick={() => this.handleEditTemplate(template)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
Hey how are you
                {/* Edit Email Template Modal */}
                {showTemplateModal && selectedTemplate && (
                    <Modal show onHide={() => this.setState({ showTemplateModal: false })} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Email Template</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedTemplate.subject}
                                        onChange={e => this.setState({ selectedTemplate: { ...selectedTemplate, subject: e.target.value } })}
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={12}
                                        value={selectedTemplate.content}
                                        onChange={e => this.setState({ selectedTemplate: { ...selectedTemplate, content: e.target.value } })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleSaveTemplate} className={cs.btnPrimary}>Save</Button>
                            <Button variant="secondary" onClick={() => this.setState({ showTemplateModal: false })}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        );
    }
}

export default injectIntl(withStyles(s, cs)(LanguageList)); 