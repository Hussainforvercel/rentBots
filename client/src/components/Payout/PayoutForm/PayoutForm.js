import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import PayoutBillingDetails from './PayoutBillingDetails';
import PayoutConfirm from './PayoutConfirm';
import PayoutMethods from './PayoutMethods';
import Megasoft from './Megasoft';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import cs from '../../../components/commonStyle.css';
import cx from 'classnames';

class PayoutForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    accountData: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      payoutDetails: null,
      loading: true,
      editMode: false
    };
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.handleEdit = this.handleEdit.bind(this);
    this.fetchPayoutDetails = this.fetchPayoutDetails.bind(this);
    this.handleEditComplete = this.handleEditComplete.bind(this);
  }

  async componentDidMount() {
    await this.fetchPayoutDetails();
  }

  async fetchPayoutDetails() {
    const profileId = this.props.accountData?.profileId;
    if (!profileId) {
      this.setState({ loading: false });
      return;
    }
    try {
      const res = await fetch(`/api/payout-megasoft-details/${profileId}`);
      const result = await res.json();
      if (result.success && result.data) {
        this.setState({ payoutDetails: result.data, loading: false, editMode: false });
      } else {
        this.setState({ payoutDetails: null, loading: false, editMode: false });
      }
    } catch (error) {
      this.setState({ payoutDetails: null, loading: false, editMode: false });
    }
  }

  handleEdit() {
    this.setState({ editMode: true });
  }

  handleEditComplete() {
    this.fetchPayoutDetails();
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 })
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 })
  }

  renderTable(details) {
    return (
      <div className={cx('inputFocusColor', cs.commonBorderSection, 'whiteBgColor')}>
        <h3 className={cx(cs.commonTotalText, cs.paddingBottom4)}>Megasoft Payout Details</h3>
        <table className={cs.commonTable} style={{ width: '100%', marginBottom: 20 }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7', borderTopLeftRadius: 8 }}>Account Type</th>
              <td style={{ padding: '12px 16px', background: '#fff', borderTopRightRadius: 8 }}>{details.accountType}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>First Name</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.firstName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>Last Name</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.lastName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>Account Number</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.accountName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>Confirm Account Number</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.confirmAccountName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>National ID</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.nationalId}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>Bank Name</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.bankName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', background: '#f7f7f7' }}>Phone (PAGO MOVIL)</th>
              <td style={{ padding: '12px 16px', background: '#fff' }}>{details.pagoMovilPhone}</td>
            </tr>
          
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button className={cs.btnPrimary} style={{ minWidth: 120, fontWeight: 600, fontSize: 16, borderRadius: 6, boxShadow: '0 1px 4px rgba(44,62,80,0.08)' }} onClick={this.handleEdit}>
            Edit
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { page, payoutDetails, loading, editMode } = this.state;
    const { initialValues, selectedCountry, accountData } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }
    // If payout details exist and not editing, show table and skip forms
    if (payoutDetails && !editMode) {
      return this.renderTable(payoutDetails);
    }

    // If editing, show only the Megasoft form, pre-filled
    if (editMode && payoutDetails) {
      return (
        <Megasoft
          initialValues={payoutDetails}
          accountData={accountData}
          onEditComplete={this.handleEditComplete}
          previousPage={() => this.setState({ editMode: false })}
        />
      );
    }

    // If no details, show the normal multi-step form
    return (
      <div>
        {
          page === 1 && <PayoutBillingDetails
            onSubmit={this.nextPage}
            initialValues={initialValues}
            nextPage={this.nextPage}
          />
        }
        {
          page === 2 && <PayoutMethods
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            initialValues={initialValues}
            selectedCountry={selectedCountry}
          />
        }
        {
          page === 3 && <PayoutConfirm
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            initialValues={initialValues}
          />
        }
      </div>
    );
  }
}

const selector = formValueSelector('PayoutForm');

const mapState = (state) => ({
  selectedCountry: selector(state, 'country'),
  accountData: state.account.data
});

PayoutForm = reduxForm({
  form: 'PayoutForm', // a unique name for this form
  destroyOnUnmount: true,
})(PayoutForm);

export default connect(mapState)(PayoutForm);