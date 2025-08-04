import React from 'react';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { Button, Table, Modal, FormGroup, ControlLabel, FormControl, Glyphicon } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style.css';
import cs from '../../../components/commonStyle.css';

// Import static language files
import enUS from '../../../messages/en-US.json';
import frFR from '../../../messages/fr-FR.json';
import ptPT from '../../../messages/pt-PT.json';
import es from '../../../messages/es.json';
import itIT from '../../../messages/it-IT.json';


const staticLanguages = [
  { code: 'en-US', title: 'English (US)', messages: enUS },
  { code: 'fr-FR', title: 'French (FR)', messages: frFR },
  { code: 'pt-PT', title: 'Portuguese (PT)', messages: ptPT },
  { code: 'es', title: 'Spanish', messages: es },
  { code: 'it-IT', title: 'Italian (IT)', messages: itIT },
 
];

class LanguageManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLanguageModal: false,
      editingLang: null,
      editingJson: '',
      uploadError: null,
      emailTemplates: [],
      showTemplateModal: false,
      selectedTemplate: null,
      loading: false,
      // Search-related state
      searchTerm: '',
      searchMatches: [],
      currentMatchIndex: 0,
    };
    // Ref for textarea
    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    this.loadLanguages();
    this.loadEmailTemplates();
  }

  async loadEmailTemplates() {
    try {
      const response = await fetch('/api/admin/email-templates', { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        this.setState({ emailTemplates: data.data });
      } else {
        this.setState({ uploadError: `Error loading email templates: ${data.error}` });
      }
    } catch (e) {
      this.setState({ uploadError: `Error loading email templates: ${e.message}` });
    }
  }

  handleEdit = (lang) => {
    this.setState({
      editingLang: lang,
      editingJson: JSON.stringify(lang.messages, null, 2),
      showLanguageModal: true,
      uploadError: null,
    });
  };

  handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    this.setState({ searchTerm }, () => {
      this.updateSearchMatches();
    });
  };

  updateSearchMatches = () => {
    const { editingJson, searchTerm } = this.state;
    if (!searchTerm) {
      this.setState({ searchMatches: [], currentMatchIndex: 0 });
      return;
    }
    const matches = [];
    let idx = 0;
    const lowerJson = editingJson.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    while ((idx = lowerJson.indexOf(lowerSearch, idx)) !== -1) {
      matches.push(idx);
      idx += lowerSearch.length;
    }
    this.setState({ searchMatches: matches, currentMatchIndex: matches.length > 0 ? 0 : -1 });
  };

  scrollToMatch = (matchIdx) => {
    const { searchMatches, searchTerm, editingJson } = this.state;
    if (!this.textareaRef.current || !searchMatches.length) return;
    const pos = searchMatches[matchIdx];
    this.textareaRef.current.focus();
    this.textareaRef.current.setSelectionRange(pos, pos + searchTerm.length);

    // --- Ensure scroll to selection ---
    // Calculate the line number of the match
    const before = editingJson.slice(0, pos);
    const lineNumber = before.split('\n').length - 1;
    // Estimate line height (in px)
    const textarea = this.textareaRef.current;
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10) || 20;
    // Scroll so that the selected line is roughly centered
    const visibleLines = Math.floor(textarea.clientHeight / lineHeight);
    const targetScrollTop = Math.max(0, (lineNumber - Math.floor(visibleLines / 2)) * lineHeight);
    textarea.scrollTop = targetScrollTop;
  };

  handleSearchUp = () => {
    const { currentMatchIndex, searchMatches } = this.state;
    if (!searchMatches.length) return;
    const newIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    this.setState({ currentMatchIndex: newIndex }, () => {
      this.scrollToMatch(newIndex);
    });
  };

  handleSearchDown = () => {
    const { currentMatchIndex, searchMatches } = this.state;
    if (!searchMatches.length) return;
    const newIndex = (currentMatchIndex + 1) % searchMatches.length;
    this.setState({ currentMatchIndex: newIndex }, () => {
      this.scrollToMatch(newIndex);
    });
  };

  handleJsonChange = (e) => {
    this.setState({ editingJson: e.target.value }, () => {
      this.updateSearchMatches();
    });
  };

  async loadLanguages() {
    const languageCodes = [
      { code: 'en-US', title: 'English (US)' },
      { code: 'fr-FR', title: 'French (FR)' },
      { code: 'pt-PT', title: 'Portuguese (PT)' },
      { code: 'es', title: 'Spanish' },
      { code: 'it-IT', title: 'Italian (IT)' },
      
    ];

    try {
      const languages = await Promise.all(
        languageCodes.map(async (lang) => {
          try {
            const response = await fetch(`/admin/get-language-file?code=${lang.code}`, {
              credentials: 'include'
            });
            if (response.ok) {
              const data = await response.json();
              return {
                ...lang,
                messages: data.messages
              };
            } else {
              // If file doesn't exist, return empty messages
              return {
                ...lang,
                messages: {}
              };
            }
          } catch (error) {
            console.error(`Error loading ${lang.code}:`, error);
            return {
              ...lang,
              messages: {}
            };
          }
        })
      );
      
      this.setState({ languages, loading: false });
    } catch (error) {
      this.setState({ 
        uploadError: `Error loading languages: ${error.message}`,
        loading: false 
      });
    }
  }
  handleSave = async () => {
    const { editingJson, editingLang } = this.state;
    try {
        const parsed = JSON.parse(editingJson);
        
        const res = await fetch('/admin/update-language-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code: editingLang.code, messages: parsed }),
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                // Update the modal with the saved data and close the modal
                this.setState({
                    editingJson: JSON.stringify(data.messages, null, 2),
                    uploadError: null, // Clear any previous errors
                    showLanguageModal: false // Close the modal
                });
                // Optionally show success message
                console.log('Language file saved successfully!');
            } else {
                this.setState({ uploadError: data.error || 'Failed to save file' });
            }
        } else {
            const errorData = await res.json();
            this.setState({ uploadError: errorData.error || 'Failed to save file' });
        }
    } catch (e) {
        this.setState({ uploadError: 'Invalid JSON: ' + e.message });
    }
};

  handleEditTemplate = (template) => {
    this.setState({ selectedTemplate: template, showTemplateModal: true });
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
    } else {
      const errorData = await response.json();
      // this.setState({ uploadError: `Failed to save template: ${errorData.error}` });
    }
  };

  render() {
    const { 
      languages, 
      loading, 
      showLanguageModal, 
      editingLang, 
      editingJson, 
      uploadError, 
      emailTemplates, 
      showTemplateModal, 
      selectedTemplate 
    } = this.state;

    const languagesSafe = Array.isArray(languages) ? languages : [];

    if (loading) {
      return (
        <AdminLayout>
          <div className={s.root}>
            <div className={s.container}>
              <h1>Language Management</h1>
              <p>Loading languages...</p>
            </div>
          </div>
        </AdminLayout>
      );
    }

    return (
      <AdminLayout>
        <div className={s.root}>
          <div className={s.container}>
            <h1>Language Management</h1>
            {uploadError && (
              <div className={`alert alert-danger ${s.errorMessage}`}>{uploadError}</div>
            )}
            <div className={s.tableContainer}>
              <div className={s.headerBar}>
                <h2>Languages List</h2>
                <Button
                  bsStyle="info"
                  className={s.actionButton}
                  onClick={() => {
                    this.setState({ loading: true }, () => this.loadLanguages());
                  }}
                  disabled={loading}
                  style={{ marginBottom: 10 }}
                >
                  Reload Languages
                </Button>
              </div>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Language Title</th>
                    <th>Language Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {languagesSafe.map(lang => (
                    <tr key={lang.code}>
                      <td>{lang.title}</td>
                      <td>{lang.code}</td>
                      <td>
                        <Button
                          bsStyle="primary"
                          className={s.actionButton}
                          onClick={() => this.handleEdit(lang)}
                        >
                          <Glyphicon glyph="pencil" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Edit Language Modal */}
            <Modal show={showLanguageModal} onHide={() => this.setState({ showLanguageModal: false })} bsSize="large">
              <Modal.Header closeButton>
                <Modal.Title>Edit Language: {editingLang && editingLang.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <FormControl
                    type="text"
                    placeholder="Search..."
                    value={this.state.searchTerm}
                    onChange={this.handleSearchChange}
                    style={{ width: 200, marginRight: 10 }}
                  />
                  <Button onClick={this.handleSearchUp} disabled={this.state.searchMatches.length === 0} style={{ marginRight: 5 }}>↑</Button>
                  <Button onClick={this.handleSearchDown} disabled={this.state.searchMatches.length === 0}>↓</Button>
                  {this.state.searchMatches.length > 0 && (
                    <span style={{ marginLeft: 10 }}>
                      {this.state.currentMatchIndex + 1} / {this.state.searchMatches.length}
                    </span>
                  )}
                </div>
                <FormGroup>
                  <ControlLabel>JSON Content</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    rows={20}
                    value={editingJson}
                    onChange={this.handleJsonChange}
                    inputRef={this.textareaRef}
                  />
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleSave} className={cs.btnPrimary}>Save</Button>
                <Button onClick={() => this.setState({ showLanguageModal: false })}>Cancel</Button>
              </Modal.Footer>
            </Modal>

            {/* Email Templates Section */}
            <h2>Templates</h2>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emailTemplates.length === 0 ? (
                  <tr><td colSpan="3">No email  found.</td></tr>
                ) : emailTemplates.map((template) => (
                  <tr key={template.id}>
                    <td>{template.name}</td>
                    <td>{template.subject}</td>
                    <td>
                      <Button
                        bsStyle="primary"
                        className={s.actionButton}
                        onClick={() => this.handleEditTemplate(template)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Edit Email Template Modal */}
            {showTemplateModal && selectedTemplate && (
              <Modal show onHide={() => this.setState({ showTemplateModal: false })} bsSize="large">
                <Modal.Header closeButton>
                  <Modal.Title>Edit Email Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <FormGroup>
                      <ControlLabel>Subject</ControlLabel>
                      <FormControl
                        type="text"
                        value={selectedTemplate.subject}
                        onChange={e => this.setState({ selectedTemplate: { ...selectedTemplate, subject: e.target.value } })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Content</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        rows={12}
                        value={selectedTemplate.content}
                        onChange={e => this.setState({ selectedTemplate: { ...selectedTemplate, content: e.target.value } })}
                      />
                    </FormGroup>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleSaveTemplate} className={cs.btnPrimary}>Save</Button>
                  <Button onClick={() => this.setState({ showTemplateModal: false })}>Cancel</Button>
                </Modal.Footer>
              </Modal>
            )}

          </div>
        </div>
      </AdminLayout>
    );
  }
}

const LanguageManagementWithStyles = withStyles(s, cs)(LanguageManagement);

export default async function action() {
  return {
    title: 'Manage Languages',
    component: <LanguageManagementWithStyles />
  };
}
