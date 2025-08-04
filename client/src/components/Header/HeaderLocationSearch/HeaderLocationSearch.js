import React, { Component } from 'react';

// Translation
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader/!css-loader!@ubilabs/react-geosuggest/module/geosuggest.css';

//Components
import SearchForm from './SearchForm/SearchForm';

import c from './HeaderLocationSearch.css';

class HeaderLocationSearch extends Component {

    render() {

        return (
            <div className={'headerSearch'}>
               <SearchForm/>
            </div>
        )
    }
}



export default injectIntl(withStyles(s, c)((HeaderLocationSearch)));