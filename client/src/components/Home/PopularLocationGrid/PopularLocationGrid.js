import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
    Grid,
    Row,
} from 'react-bootstrap';
import cx from 'classnames';

// Locale
import Loader from '../../Loader/Loader';
import PopularLocationGridItem from '../PopularLocationGridItem';

import { photosShow } from '../../../helpers/photosShow';
import { locationuploadDir } from '../../../config';

import s from './PopularLocationGrid.css';

class PopularLocationGrid extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        loading: PropTypes.bool,
    };

    render() {
        const { loading, data } = this.props;
        let imagePath = photosShow(locationuploadDir);

        if (loading) {
            return <Loader type={"text"} />
        } else {
            return (
                <Grid fluid>
                    <Row className={cx(s.GridCollapse)}>

                        {
                            data && data.length > 0 && data.map((item, index) => {
                                if (item.isEnable == 'true') {
                                    let path = index == 2 ? imagePath + item.image : `${imagePath}medium_` + item.image;
                                    return <PopularLocationGridItem id={item.id} location={item.location} image={item.image} locationAddress={item.locationAddress} key={index} path={path} />;
                                }
                            })
                        }
                    </Row>
                </Grid>
            );
        }
    }
}

export default withStyles(s)(PopularLocationGrid);
