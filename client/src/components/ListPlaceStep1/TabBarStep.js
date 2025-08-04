// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Style
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TabBarStep1.css';

// Translation
import { injectIntl } from 'react-intl';

// Locale
import messages from '../../locale/messages';

import history from '../../core/history';
import { Tabs, Tab } from "react-tabs-scrollable";
import { activeTabs } from '../../helpers/listingTabs';
import setTabActiveIndex from '../../actions/setTabActiveIndex';

//Image
class TabBarStep extends Component {

  static propTypes = {
    listingSteps: PropTypes.shape({
      step1: PropTypes.string,
      step2: PropTypes.string,
      step3: PropTypes.string
    }),
  };

  static defaultProps = {
    arrow: true,
    listingSteps: {
      step1: 'inactive',
      step2: 'inactive',
      step3: 'inactive'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      load: false,
      isClient: false,
      activeTab: 1
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      isClient: true,
      load: true
    });
  }

  componentDidUpdate(prevProps) {
    const { locale } = this.props.intl;
    const { locale: prevLocale } = prevProps.intl;
    if (locale !== prevLocale) {
      this.setState({
        load: false
      });
      clearTimeout(this.loadSync);
      this.loadSync = null;
      this.loadSync = setTimeout(() => {
        this.setState({
          load: true
        });
      }, 3000);
    }
  }

  nextPage(formPage) {
    history.push(formPage);
  }

  onTabClick(e, index) {
    const { setTabActiveIndex } = this.props;
    setTabActiveIndex(index)
  };

  render() {
    const { formPage, step, listingSteps, activeIndex } = this.props;
    const { formatMessage } = this.props.intl;
    const { load, isClient } = this.state;

    let pathname = formPage;
    let tabBarData = [];
    tabBarData = activeTabs(step, listingSteps);

    return (
      <div className='tabBarStepContainer'>
        {tabBarData && tabBarData.length > 0 && load && isClient &&
          <div>
            {load && isClient &&
              <Tabs
                activeTab={activeIndex || 0}
                onTabClick={this.onTabClick}
                hideNavBtns={true}
                hideNavBtnsOnMobile={true}
                tabsContainerClassName="becomeHostInnerBox becomeHostInnerBoxRtl"
                tabsUpperContainerClassName="becomeHostTabsContainer"
                isRTL={true}>
                {tabBarData.map((item, index) => {
                  let isActive =  item?.activePaths ? item?.activePaths?.includes(pathname) : (pathname === item.pathname)
                  return (
                    <Tab key={item.pathname} tabAs="div">
                      <a onClick={() => this.nextPage(item.pathname)}>
                        <div className={cx(s.tabBorder, { [s.active]: isActive }, 'tabBorderRTL')} >
                          <div className={s.iconBg}><img src={item.icon} /></div>
                          <span className={cx(s.tabFont, 'tabFontRTL')}>{formatMessage(item.text)}</span>
                        </div>
                      </a>
                    </Tab>
                  )
                })
                }
              </Tabs>
            }
          </div>
        }
      </div>
    );
  }

}

const mapState = (state) => ({
  listingSteps: state.location.listingSteps,
  existingList: state.location.isExistingList,
  activeIndex: state.calendar.activeIndex
});

const mapDispatch = {
  setTabActiveIndex
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(TabBarStep)));
