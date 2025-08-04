import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import cx from 'classnames';
import CurrencyConverter from '../CurrencyConverter';
import messages from '../../locale/messages';
import { convert } from '../../helpers/currencyConvertion';
import s from './Transaction.css';
import cs from '../../components/commonStyle.css';
import tickIcon from '/public/SiteIcons/complete.svg';
import pendingIcon from '/public/SiteIcons/pendingicon.svg';
class TotalAmount extends Component {
	static propTypes = {
		className: PropTypes.string.isRequired,
		mode: PropTypes.string.isRequired
	};

	render() {
		const { className, mode, base, rates, toCurrency, totalData } = this.props;
		const { formatMessage } = this.props.intl;
		let label, amount = 0, convertedTotal = 0, convertedHostService = 0, hostTotal = 0;
		if (mode === 'completed') {
			label = formatMessage(messages.paidOut);
			if (totalData && totalData.length > 0) {
				totalData.map((item) => {
					if (item.hostTransaction) {
						convertedTotal = convert(base, rates, item.hostTransaction.amount, item.hostTransaction.currency, toCurrency);
						amount = amount + convertedTotal;
					}
					if (item.claimTransaction) {
						convertedTotal = convert(base, rates, item.claimTransaction.amount, item.claimTransaction.currency, toCurrency);
						amount = amount + convertedTotal;
					}
				})
			}
		} else {
			label = formatMessage(messages.pendingPayouts);
			if (totalData && totalData.length > 0) {
				totalData.map((item) => {
					convertedTotal = convert(base, rates, item.total, item.currency, toCurrency);
					convertedHostService = convert(base, rates, item.hostServiceFee, item.currency, toCurrency);
					if (item.cancellationDetails && item.cancellationDetails.payoutToHost) {
						hostTotal = convert(base, rates, item.cancellationDetails.payoutToHost, item.cancellationDetails.currency, toCurrency);
					}
					else hostTotal = (convertedTotal - convertedHostService);
					amount = amount + hostTotal;
				})
			}
		}
		return (
			<h3 className={cx(className, cs.commonMediumText, s.marginBottom, cs.dFlex, cs.fontWeightNormal)}>
				{
					(mode === 'completed' ?
						<img src={tickIcon} className={cx(s.marginRight, 'marginRightRTL')} alt={'tick icon'} />
						:
						<img src={pendingIcon} className={cx(s.marginRight, 'marginRightRTL')} alt={'pending icon'} />
					)
				}
				<span className={cx(s.marginRight, 'marginRightRTL')}>{label}:</span>
				<span>
					<CurrencyConverter
						amount={amount}
						from={toCurrency}
					/>
				</span>
			</h3>
		);
	}
}


const mapState = (state) => ({
	base: state.currency.base,
	rates: state.currency.rates,
	toCurrency: state.currency.to,
});

const mapDispatch = {
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(TotalAmount)));
