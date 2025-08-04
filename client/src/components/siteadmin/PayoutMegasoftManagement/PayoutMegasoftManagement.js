import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PayoutMegasoftManagement.css';

import CurrencyConverter from '../../CurrencyConverter';
import Link from '../../Link';
import CustomPagination from '../../CustomPagination';
import CommonTable from '../../CommonTable/CommonTable';
import Loader from '../../Loader';

// Translation
import messages from '../../../locale/messages';

class PayoutMegasoftManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      payouts: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      },
      filters: {
        method: '',
        isAmountTransfer: '',
        startDate: '',
        endDate: ''
      }
    }
    this.paginationData = this.paginationData.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.fetchPayouts = this.fetchPayouts.bind(this);
    this.completeTransaction = this.completeTransaction.bind(this);
  }

  componentDidMount() {
    this.fetchPayouts();
  }

  componentDidUpdate(prevProps) {
    const { currentPage, method, isAmountTransfer, startDate, endDate } = this.props;
    const prevPropsState = {
      currentPage: prevProps.currentPage,
      method: prevProps.method,
      isAmountTransfer: prevProps.isAmountTransfer,
      startDate: prevProps.startDate,
      endDate: prevProps.endDate
    };

    const currentPropsState = { currentPage, method, isAmountTransfer, startDate, endDate };

    if (JSON.stringify(prevPropsState) !== JSON.stringify(currentPropsState)) {
      this.fetchPayouts();
    }
  }

  async fetchPayouts() {
    const { currentPage, method, isAmountTransfer, startDate, endDate } = this.props;
    
    this.setState({ loading: true, error: null });

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (method) params.append('method', method);
      if (isAmountTransfer !== '') params.append('isAmountTransfer', isAmountTransfer);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/payout-megasoft?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        this.setState({
          payouts: result.data.payouts,
          pagination: result.data.pagination,
          loading: false
        });
      } else {
        this.setState({
          error: result.error,
          loading: false
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      });
    }
  }

  async completeTransaction(payoutId) {
    try {
      const response = await fetch(`/api/payout-megasoft/${payoutId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the payouts list to show updated status
        this.fetchPayouts();
        // You could also show a success message here
      } else {
        console.error('Error completing transaction:', result.error);
        // You could show an error message here
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      // You could show an error message here
    }
  }

  paginationData(currentPage) {
    const { setStateVariable } = this.props;
    setStateVariable({ currentPage });
  }

  handleFilterChange = (filterType, value) => {
    const { setStateVariable } = this.props;
    setStateVariable({ 
      [filterType]: value,
      currentPage: 1 
    });
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.idLabel) },
      { data: formatMessage(messages.methodLabel) },
      { data: formatMessage(messages.amountLabel) },
      { data: formatMessage(messages.listingTitleLabel) },
      { data: formatMessage(messages.ownerNameLabel) },
      { data: formatMessage(messages.ownerEmailLabel) },
      { data: formatMessage(messages.transferStatusLabel) },
      { data: formatMessage(messages.createdDateLabel) },
      { data: formatMessage(messages.detailsLabel) },
      { data: formatMessage(messages.actionsLabel) },
    ]
  };

  tbody = () => {
    const { payouts } = this.state;
    const { formatMessage } = this.props.intl;

    return payouts.map(item => {
      return {
        id: item.id,
        data: [
          { data: item.id },
          {
            data: <span className={s.methodBadge + ' ' + s[item.method.toLowerCase()]}>
              {item.method}
            </span>
          },
          {
            data: item.method === 'ZELLE'
              ? `$${Number(item.payoutAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `Bs ${Number(item.payoutAmount).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          },
          {
            data: item.listing ? <a href={"/cars/" + item.listing.id} target='_blank'>
              {item.listing.title}
            </a> : 'N/A'
          },
          {
            data: item.listing?.user?.profile ? 
              `${item.listing.user.profile.firstName} ${item.listing.user.profile.lastName}` : 
              'N/A'
          },
          {
            data: item.listing?.user?.email || 'N/A'
          },
          {
            data: <span className={item.isAmountTransfer ? s.transferred : s.pending}>
              {item.isAmountTransfer ? formatMessage(messages.transferred) : formatMessage(messages.pending)}
            </span>
          },
          {
            data: moment(item.createdAt).format('MMM DD, YYYY HH:mm')
          },
          {
            data: <Link to={"/siteadmin/view-payout-megasoft/" + item.id}>
              {formatMessage(messages.detailsLabel)}
            </Link>
          },
          {
            data: !item.isAmountTransfer ? (
              <button 
                className={s.completeButton}
                onClick={() => this.completeTransaction(item.id)}
              >
                {formatMessage(messages.completeTransaction)}
              </button>
            ) : (
              <span className={s.completedText}>{formatMessage(messages.completed)}</span>
            )
          }
        ]
      }
    });
  }

  renderFilters() {
    const { method, isAmountTransfer, startDate, endDate } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className={s.filterSection}>
        <div className={s.filterRow}>
          <div className={s.filterItem}>
            <label>{formatMessage(messages.paymentMethodFilter)}</label>
            <select 
              value={method} 
              onChange={(e) => this.handleFilterChange('method', e.target.value)}
            >
              <option value="">{formatMessage(messages.allMethods)}</option>
              <option value="CREDIT_CARD">{formatMessage(messages.creditCard)}</option>
              <option value="ZELLE">{formatMessage(messages.zelle)}</option>
              <option value="P2C">{formatMessage(messages.p2c)}</option>
              <option value="DEBIT">{formatMessage(messages.debit)}</option>
              <option value="C2P">{formatMessage(messages.c2p)}</option>
            </select>
          </div>
          
          <div className={s.filterItem}>
            <label>{formatMessage(messages.transferStatusFilter)}</label>
            <select 
              value={isAmountTransfer} 
              onChange={(e) => this.handleFilterChange('isAmountTransfer', e.target.value)}
            >
              <option value="">{formatMessage(messages.allStatus)}</option>
              <option value="true">{formatMessage(messages.transferred)}</option>
              <option value="false">{formatMessage(messages.pending)}</option>
            </select>
          </div>
          
      
        </div>
      </div>
    );
  }

  render() {
    const { payouts, loading, error, pagination } = this.state;
    const { formatMessage } = this.props.intl;

    if (loading) {
      return <Loader type="text" />;
    }

    if (error) {
      return (
        <div className={s.errorContainer}>
          <h3>{formatMessage(messages.errorLoadingPayouts)}</h3>
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL')}>
        <div>
          {this.renderFilters()}
          <CommonTable
            thead={this.thead}
            tbody={this.tbody}
            title={formatMessage(messages.payOutManagement) + ' - Megasoft'}
          />
          {
            payouts.length > 0 &&
            <CustomPagination
              total={pagination.totalCount}
              currentPage={pagination.currentPage}
              defaultCurrent={1}
              defaultPageSize={10}
              change={this.paginationData}
              paginationLabel={formatMessage(messages.megasoftPayouts)}
            />
          }
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  // Add any Redux state mapping if needed
});

const mapDispatch = {
  // Add any Redux actions if needed
};

export default injectIntl(
  withStyles(s)(
    connect(mapState, mapDispatch)(PayoutMegasoftManagement)
  )
); 