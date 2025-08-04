import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BannerSettings.css';

// Component
import Loader from '../../../components/Loader';
import MarketingBannerForm from '../../../components/siteadmin/MarketingBannerForm/MarketingBannerForm';

class BannerSettings extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getMarketingBanner: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        image: PropTypes.string,
        link: PropTypes.string,
      }),
    }),
  };

  static defaultProps = {
    data: {
      loading: true
    }
  };

  render() {
    const { data: { loading, getMarketingBanner }, title } = this.props;

    if (loading) {
      return <Loader type={"text"} />;
    } else {
      return <MarketingBannerForm 
        initialValues={getMarketingBanner} 
        title={title} 
        image={getMarketingBanner?.image} 
        link={getMarketingBanner?.link}
        id={getMarketingBanner?.id} 
        isEnable={getMarketingBanner?.isEnable}
      />
    }
  }
}

export default compose(
  withStyles(s),
  graphql(gql`
    {
      getMarketingBanner {
        id
        title
        image
        link
        isEnable
      }
    }
  `, {
    options: {
      ssr: false,
      fetchPolicy: 'network-only'
    }
  }),
  graphql(gql`
    mutation updateMarketingBanner($id: Int!, $title: String!, $image: String!, $link: String!, $isEnable: Boolean) {
      updateMarketingBanner(id: $id, title: $title, image: $image, link: $link, isEnable: $isEnable) {
        status
        isEnable
      }
    }
  `, {
    name: 'updateMarketingBanner'
  })
)(BannerSettings); 