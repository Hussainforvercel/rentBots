import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// Styles
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Redux
import { connect } from 'react-redux';

// Redux form
import {change} from 'redux-form';

import { Button } from 'react-bootstrap';

// Helper
import {convert} from '../../../helpers/currencyConvertion';

// Locale
import messages from '../../../locale/messages';


import s from './Guests.css';

class PriceRange extends Component {
  
    
    render() {
        const { min, max } = this.props;

        return (
            <div className={s.root}>
                <div className={s.container}>
                    <div className={s.buttonBlock}>
                        <Button className={s.button}>
                        <FormattedMessage {...messages.showMapp} />
                        </Button>
                    </div>
                </div> 
            </div>
        );
    }
}


export default injectIntl(withStyles(s)(PriceRange));