import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { injectIntl } from 'react-intl';

import NewsBox from '../NewsBox';
import NewsBoxSkeleton from "../../Skeleton/NewsBoxSkeleton";

import getImageBannerQuery from './getImageBanner.graphql';

import s from './ImageBanner.css';
import l from '../../Skeleton/Skeleton.css';

class ImageBanner extends React.Component {

  static propTypes = {
    getImageBannerData: PropTypes.shape({
      loading: PropTypes.bool,
      getImageBanner: PropTypes.object
    }),
  };

  static defaultProps = {
    getImageBannerData: {
      loading: true
    },
  }

  render() {
    const { getImageBannerData } = this.props;
    return (
      <>
        {getImageBannerData?.loading ?
          <div className={s.pageContainer}>
            <div className={s.container}>
              <NewsBoxSkeleton />
            </div>
          </div> : (
            <div className={s.pageContainer}>
              <div className={s.container}>
                <NewsBox data={getImageBannerData?.getImageBanner} />
              </div>
            </div>
          )}
      </>
    )
  }
}

export default compose(
  injectIntl,
  withStyles(s, l),
  graphql(getImageBannerQuery, {
    name: 'getImageBannerData',
    options: {
      ssr: false
    }
  }),
)(ImageBanner);
