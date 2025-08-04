import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Styles
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Redux form
import {change} from 'redux-form';

import {
    Button,
    Grid,
    Row,
    Col,
    Breadcrumb
} from 'react-bootstrap';

import Dates from '../Dates';
import Guests from '../Guests';
import MapSwitch from '../MapSwitch';

// Helper
import {convert} from '../../../helpers/currencyConvertion';

import s from './SearchPageHeader.css';

class SearchPageHeader extends Component {
   
    
    render() {

        return (
                <div className={s.root}>
                    <div className={s.container}>
                        <div className={s.header}>
                            <Dates />
                            <Guests />
                        </div>
                    </div>  
                </div>
        );
    }
}


export default withStyles(s) (SearchPageHeader);