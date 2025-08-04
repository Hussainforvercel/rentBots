import React from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import FindYourVehicleForm from '../../../components/siteadmin/FindYourVehicleForm/FindYourVehicleForm';
import Loader from '../../../components/Loader/Loader';

import getFindYourVehicleBlock from './getFindYourVehicleBlock.graphql';

import s from './FindYourVehicleBlock.css';
class FindYourVehicleBlock extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getFindYourVehicleBlock: PropTypes.object,
    })
  };


  render() {
    const { data: { getFindYourVehicleBlock, loading }, title } = this.props;
    let settingsCollection = {};

    if (loading) {
      return <Loader type={"text"} />;
    } else {
      getFindYourVehicleBlock && getFindYourVehicleBlock.results && getFindYourVehicleBlock.results.length > 0 && getFindYourVehicleBlock.results.map((item, key) => {
        item.value != null && (settingsCollection[item.name] = item.value)
      });
      return <FindYourVehicleForm initialValues={settingsCollection} title={title} />
    }
  }

}

export default compose(
  withStyles(s),
  graphql(getFindYourVehicleBlock, {
    options: (props) => ({
      ssr: true,
      fetchPolicy: 'network-only'
    })
  }),
)(FindYourVehicleBlock);
