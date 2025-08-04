import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CurrencyConverter from '../../CurrencyConverter';
import s from './ViewReservation.css';
class HostServiceFee extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        hostTransaction: PropTypes.shape({
            id: PropTypes.number.isRequired,
        }),
        loading: PropTypes.bool,
        reservationId: PropTypes.number,
        reservationState: PropTypes.string.isRequired
    };

    static defaultProps = {
        loading: false,
        reservationId: 0,
    };

    render() {
        const { reservationId, reservationState, hostServiceFee } = this.props;
        const { id, currency, hostTransaction } = this.props;
        let amount = hostServiceFee || 0;
        if (reservationState === 'expired' || reservationState === 'declined') {
            amount = 0;
        }
        if ((hostTransaction != null && hostTransaction.id != undefined) || (reservationId === id)) {
            amount = hostServiceFee;
        }
        return (
            <span>
                <CurrencyConverter
                    amount={amount}
                    from={currency}
                />
            </span>
        );
    }
}

export default withStyles(s)(HostServiceFee);
