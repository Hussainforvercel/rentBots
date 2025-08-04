import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ManagePaymentGateway.css';
import CommonTable from '../../CommonTable/CommonTable';
import { updatePaymentGatewayStatus } from '../../../actions/siteadmin/updatePayemntGatewayStatus';
// Translation
import messages from '../../../locale/messages';
class ManagePaymentGateway extends React.Component {
    static propTypes = {
        getAllPayments: PropTypes.shape({
            loading: PropTypes.bool,
            refetch: PropTypes.any.isRequired,
            getAllPaymentMethods: PropTypes.array
        }),
        title: PropTypes.string.isRequired,
    };

    state = {
        paymentGuides: [],
        loadingGuides: false,
        guideEdits: {}, // { [id]: { number, name, message } }
        savingGuideId: null,
        guideError: null
    };

    componentDidMount() {
        this.fetchPaymentGuides();
    }

    fetchPaymentGuides = async () => {
        this.setState({ loadingGuides: true, guideError: null });
        try {
            const res = await fetch('/api/admin/payment-guides');
            const json = await res.json();
            if (json.success) {
                this.setState({ paymentGuides: json.data, loadingGuides: false });
            } else {
                this.setState({ guideError: json.error || 'Failed to load guides', loadingGuides: false });
            }
        } catch (e) {
            this.setState({ guideError: e.message, loadingGuides: false });
        }
    };

    handleGuideChange = (id, field, value) => {
        this.setState(prev => ({
            guideEdits: {
                ...prev.guideEdits,
                [id]: {
                    ...prev.guideEdits[id],
                    [field]: value
                }
            }
        }));
    };

    handleSaveGuide = async (id) => {
        const { paymentGuides, guideEdits } = this.state;
        const guide = paymentGuides.find(g => g.id === id);
        const edits = guideEdits[id] || {};
        const payload = {
            number: edits.number !== undefined ? edits.number : guide.number,
            name: edits.name !== undefined ? edits.name : guide.name,
            message: edits.message !== undefined ? edits.message : guide.message
        };
        this.setState({ savingGuideId: id, guideError: null });
        try {
            const res = await fetch(`/api/admin/payment-guides/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.success) {
                // Update local state
                this.setState(prev => ({
                    paymentGuides: prev.paymentGuides.map(g => g.id === id ? json.data : g),
                    guideEdits: { ...prev.guideEdits, [id]: {} },
                    savingGuideId: null
                }));
            } else {
                this.setState({ guideError: json.error || 'Failed to save', savingGuideId: null });
            }
        } catch (e) {
            this.setState({ guideError: e.message, savingGuideId: null });
        }
    };

    handleUpdate(id, e) {
        const { updatePaymentGatewayStatus, getAllPayments: { refetch } } = this.props;
        let isEnable = e.target.value;
        isEnable = isEnable == 'true' ? true : false;
        updatePaymentGatewayStatus(id, isEnable);
        refetch();
    }

    thead = () => {
        const { formatMessage } = this.props.intl;
        return [
            { data: formatMessage(messages.idLabel) },
            { data: formatMessage(messages.paymentGateway) },
            { data: formatMessage(messages.status) }
        ]
    };

    tbody = () => {
        const { getAllPayments: { getAllPaymentMethods } } = this.props;
        const { formatMessage } = this.props.intl;

        return getAllPaymentMethods?.map(value => {
            return {
                id: value?.id,
                data: [
                    { data: value?.id },
                    {
                        data: value?.paymentName
                    },
                    {
                        data: <select value={value.isEnable} onChange={(e) => this.handleUpdate(value.id, e)}>
                            <option value={true}>{formatMessage(messages.activeLabel)}</option>
                            <option value={false}>{formatMessage(messages.inActiveLabel)}</option>
                        </select>
                    },
                ]
            }
        })
    }

    render() {
        const { getAllPayments: { getAllPaymentMethods } } = this.props;
        const { formatMessage } = this.props.intl;
        const { paymentGuides, loadingGuides, guideEdits, savingGuideId, guideError } = this.state;

        return (
            <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL')}>
                <CommonTable
                    thead={this.thead}
                    tbody={this.tbody}
                    title={formatMessage(messages.paymentGatewaySection)}
                />
                {/* Payment Guide Section */}
                <div style={{ marginTop: 40 }}>
                    <h2>{messages.paymentGuideSection ? formatMessage(messages.paymentGuideSection) : 'Payment Guide'}</h2>
                    {loadingGuides && <div>Loading...</div>}
                    {guideError && <div style={{ color: 'red' }}>{guideError}</div>}
                    <table className={cx('table', 'table-bordered', 'table-striped')} style={{ width: '100%', marginTop: 20 }}>
                        <thead>
                            <tr>
                                <th>{formatMessage(messages.idLabel)}</th>
                                <th>{messages.nameLabel ? formatMessage(messages.nameLabel) : 'Name'}</th>
                                <th>{messages.messageLabel ? formatMessage(messages.messageLabel) : 'Message'}</th>
                                <th>{messages.actionsLabel ? formatMessage(messages.actionsLabel) : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentGuides.map(guide => {
                                const edit = guideEdits[guide.id] || {};
                                return (
                                    <tr key={guide.id}>
                                        <td>{guide.id}</td>
                                       
                                        <td>
                                       { guide.name}
                                        
                                        </td>
                                        <td>
                                            <textarea
                                                value={edit.message !== undefined ? edit.message : guide.message}
                                                onChange={e => this.handleGuideChange(guide.id, 'message', e.target.value)}
                                                rows={3}
                                                style={{ width: 250 }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className={cx('btn', 'btn-primary')}
                                                onClick={() => this.handleSaveGuide(guide.id)}
                                                disabled={savingGuideId === guide.id}
                                            >
                                                {savingGuideId === guide.id
                                                    ? (messages.savingLabel ? formatMessage(messages.savingLabel) : 'Saving...')
                                                    : (messages.saveLabel ? formatMessage(messages.saveLabel) : 'Save')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!paymentGuides || paymentGuides.length === 0) && !loadingGuides && (
                                <tr><td colSpan={5}>{formatMessage(messages.noRecordFound)}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

const mapState = (state) => ({
});

const mapDispatch = {
    updatePaymentGatewayStatus
};

export default compose(injectIntl, withStyles(s), connect(mapState, mapDispatch))(ManagePaymentGateway);