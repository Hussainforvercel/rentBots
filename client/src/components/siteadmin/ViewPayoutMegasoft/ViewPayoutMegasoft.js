import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewPayoutMegasoft.css';

import CurrencyConverter from '../../CurrencyConverter';
import Link from '../../Link';
import Loader from '../../Loader';

// Translation
import messages from '../../../locale/messages';

class ViewPayoutMegasoft extends React.Component {



    
  constructor(props) {
    super(props);
    this.state = {
      payout: null, 
      loading: true,
      error: null
    }
    this.fetchPayoutDetails = this.fetchPayoutDetails.bind(this);
    this.renderPayoutMegasoftDetails = this.renderPayoutMegasoftDetails.bind(this);
  }

  componentDidMount() {
    this.fetchPayoutDetails();
  }

  async fetchPayoutDetails() {
    const { id } = this.props;
    
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(`/api/payout-megasoft/${id}`);
      const result = await response.json();

      if (result.success) {
        this.setState({
          payout: result.data,
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

  renderPayoutMegasoftDetails() {
    const { payout } = this.state;
    // If listing or user is missing, don't show anything
    if (!payout?.listing?.user) return null;

    // If payoutDetails is missing, show a message
    if (!payout.listing.user.payoutDetails) {
      return (
        <div className={s.section}>
          <h3>Payout Account Details</h3>
          <div className={s.detailRow}>
            <div className={s.detailValue} style={{ color: 'red' }}>
              No payout account set by the user.
            </div>
          </div>
        </div>
      );
    }

    // Otherwise, show the details
    const details = payout.listing.user.payoutDetails;
    return (
      <div className={s.section}>
        <h3>Payout Account Details</h3>
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Account Type:</div>
          <div className={s.detailValue}>{details.accountType}</div>
        </div>
        <div className={s.detailRow}>
          <div className={s.detailLabel}>First Name:</div>
          <div className={s.detailValue}>{details.firstName}</div>
        </div>
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Last Name:</div>
          <div className={s.detailValue}>{details.lastName}</div>
        </div>
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Account Number:</div>
          <div className={s.detailValue}>{details.accountName}</div>
        </div>
        {details.nationalId && (
          <div className={s.detailRow}>
            <div className={s.detailLabel}>National ID:</div>
            <div className={s.detailValue}>{details.nationalId}</div>
          </div>
        )}
        {details.bankName && (
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Bank Name:</div>
            <div className={s.detailValue}>{details.bankName}</div>
          </div>
        )}
        {details.pagoMovilPhone && (
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Phone (PAGO MOVIL):</div>
            <div className={s.detailValue}>{details.pagoMovilPhone}</div>
          </div>
        )}
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Created At:</div>
          <div className={s.detailValue}>{moment(details.createdAt).format('MMM DD, YYYY HH:mm')}</div>
        </div>
        <div className={s.detailRow}>
          <div className={s.detailLabel}>Updated At:</div>
          <div className={s.detailValue}>{moment(details.updatedAt).format('MMM DD, YYYY HH:mm')}</div>
        </div>
      </div>
    );
  }

  renderPayoutDetails() {
    const { payout } = this.state;
    const { formatMessage } = this.props.intl;

    if (!payout) return null;

    return (
      <div className={s.detailsContainer}>
        {this.renderPayoutMegasoftDetails()}
        <div className={s.section}>
          <h3>Payout Information</h3>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>ID:</div>
            <div className={s.detailValue}>{payout.id}</div>
          </div>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Payment Method:</div>
            <div className={s.detailValue}>
              <span className={s.methodBadge + ' ' + s[payout.method.toLowerCase()]}>
                {payout.method}
              </span>
            </div>
          </div>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Amount:</div>
            <div className={s.detailValue}>
              {
payout.payoutAmount
              }Bs
             
            </div>
          </div>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Transfer Status:</div>
            <div className={s.detailValue}>
              <span className={payout.isAmountTransfer ? s.transferred : s.pending}>
                {payout.isAmountTransfer ? 'Transferred' : 'Pending'}
              </span>
            </div>
          </div>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Created Date:</div>
            <div className={s.detailValue}>
              {moment(payout.createdAt).format('MMM DD, YYYY HH:mm')}
            </div>
          </div>
          <div className={s.detailRow}>
            <div className={s.detailLabel}>Updated Date:</div>
            <div className={s.detailValue}>
              {moment(payout.updatedAt).format('MMM DD, YYYY HH:mm')}
            </div>
          </div>
        </div>

        {payout.listing && (
          <div className={s.section}>
            <h3>Listing Information</h3>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Listing ID:</div>
              <div className={s.detailValue}>
                <Link to={"/cars/" + payout.listing.id} target="_blank">
                  {payout.listing.id}
                </Link>
              </div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Title:</div>
              <div className={s.detailValue}>{payout.listing.title}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>City:</div>
              <div className={s.detailValue}>{payout.listing.city}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>State:</div>
              <div className={s.detailValue}>{payout.listing.state}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Country:</div>
              <div className={s.detailValue}>{payout.listing.country}</div>
            </div>
            {payout.listing.listingData && (
              <>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Base Price:</div>
                  <div className={s.detailValue}>
                    <CurrencyConverter
                      amount={payout.listing.listingData.basePrice}
                      from={payout.listing.listingData.currency || 'USD'}
                    />
                  </div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Security Deposit:</div>
                  <div className={s.detailValue}>
                    <CurrencyConverter
                      amount={payout.listing.listingData.securityDeposit}
                      from={payout.listing.listingData.currency || 'USD'}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {payout.listing?.user && (
          <div className={s.section}>
            <h3>Owner Information</h3>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>User ID:</div>
              <div className={s.detailValue}>{payout.listing.user.id}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Email:</div>
              <div className={s.detailValue}>{payout.listing.user.email}</div>
            </div>
            <div className={s.detailRow}>
              <div className={s.detailLabel}>Type:</div>
              <div className={s.detailValue}>{payout.listing.user.type}</div>
            </div>
            {payout.listing.user.profile && (
              <>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>First Name:</div>
                  <div className={s.detailValue}>{payout.listing.user.profile.firstName}</div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Last Name:</div>
                  <div className={s.detailValue}>{payout.listing.user.profile.lastName}</div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Display Name:</div>
                  <div className={s.detailValue}>{payout.listing.user.profile.displayName}</div>
                </div>
                <div className={s.detailRow}>
                  <div className={s.detailLabel}>Phone Number:</div>
                  <div className={s.detailValue}>{payout.listing.user.profile.phoneNumber}</div>
                </div>
              </>
            )}
          </div>
        )}

        <div className={s.actionsSection}>
          <Link to="/siteadmin/payout-megasoft" className={s.backButton}>
            ← Back to Megasoft Payouts
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { loading, error } = this.state;
    const { formatMessage } = this.props.intl;

    if (loading) {
      return <Loader type="text" />;
    }

    if (error) {
      return (
        <div className={s.errorContainer}>
          <h3>Error loading payout details</h3>
          <p>{error}</p>
          <Link to="/siteadmin/payout-megasoft" className={s.backButton}>
            ← Back to Megasoft Payouts
          </Link>
        </div>
      );
    }

    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentWrapperRTL')}>
        <div>
          <h1>{formatMessage(messages.payOutManagement) + ' - Megasoft Details'}</h1>
          {this.renderPayoutDetails()}
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
    connect(mapState, mapDispatch)(ViewPayoutMegasoft)
  )
); 