import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CSVReader from 'react-csv-reader';

import ListSettingsModal from '../ListSettingsModal';
import CustomPagination from '../../CustomPagination';
import CommonTable from '../../CommonTable/CommonTable';
import EditListSettingsForm from '../ListSettingsForm/EditListSettingsForm';
import Loader from '../../Loader';

import messages from '../../../locale/messages';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { openListSettingsModal } from '../../../actions/siteadmin/modalActions';
import { getAdminListingSettings } from '../../../actions/siteadmin/getAdminListingSettings';
import { makeModelCsvUploader } from '../../../actions/siteadmin/MakeModelCsvUploader/makeModelCsvUploader';

import importIcon from '/public/AdminIcons/adminImportIcon.svg';
import toolTipIcon from '/public/AdminIcons/toolTipIcon.svg';

import s from './ListSettingsManagement.css';
import cs from '../../../components/commonStyle.css';
import Toaster from '../../Toaster/Toaster';

class ListSettingsManagement extends React.Component {

  static defaultProps = {
    loading: true
  };

  constructor(props) {
    super(props);
  }

  paginationData = async (currentPage, typeId) => {
    const { getAdminListingSettings } = this.props;
    await getAdminListingSettings(typeId, currentPage);
  }

  thead = () => {
    const { formatMessage } = this.props.intl;
    return [
      { data: formatMessage(messages.settingsIDLabel) },
      { data: formatMessage(messages.addNew) },
      { data: formatMessage(messages.status) },
      { data: formatMessage(messages.operationLabel) }
    ]
  };

  tbody = () => {
    const { openListSettingsModal } = this.props;
    const { formatMessage } = this.props.intl;
    const { adminListSettings } = this.props;
    let listSettingsData;
    if (adminListSettings) {
      listSettingsData = adminListSettings?.getAllAdminListSettings?.listSettingsData;
    }
    return listSettingsData?.length > 0 && listSettingsData?.map((value, key) => {
      let status = value?.isEnable == 1 ? formatMessage(messages.enabledLabel) : formatMessage(messages.disabledLabel);
      return {
        id: key,
        data: [
          { data: value?.id },
          { data: value?.itemName },
          { data: status },
          {
            data: <Button className={cx(cs.btnPrimaryBorder)} onClick={() => openListSettingsModal(value, "EditListSettingsForm")}>
              <FormattedMessage {...messages.manageLabel} />
            </Button>
          },
        ]
      }
    })
  }

  handleForce = (value) => {
    const { typeId, makeModelCsvUploader } = this.props;
    let modelIndex, setEmptyValue = this.inputRef.current.value = "";
    if (value && value.length > 0) {
      let makeIndex = value[0].findIndex(item => item == 'Make');
      modelIndex = typeId == 3 ? value[0].findIndex(item => item == 'Model') : null

      /* Make section. */
      if (typeId == 20) {
        if (makeIndex != 0) {
          showToaster({ messageId: 'csvFormat', toasterType: 'error' })
          setEmptyValue;
          return;
        };
        if (value.length > 0 && !value[0].includes("Make")) {
          showToaster({ messageId: 'csvFormat', toasterType: 'error' })
          setEmptyValue;
          return;
        };
      };

      /* Model Section. */
      if (typeId == 3) {
        if (makeIndex != 0 || modelIndex != 1) {
          showToaster({ messageId: 'csvFormatError', toasterType: 'error' })
          setEmptyValue;
          return;
        };
        if (value.length > 0 && !value[0].includes("Make", "Model")) {
          showToaster({ messageId: 'csvFormatError', toasterType: 'error' })
          setEmptyValue;
          return;
        };
      }
    };
    makeModelCsvUploader({ categoryList: value.splice(1, value.length), typeId, setEmptyValue });
  };

  inputRef = React.createRef();

  renderTable(listSettingsTypeData, listSettingsData, count) {
    const { page, openListSettingsModal, typeId, makeModelCsvUploading } = this.props;
    const { formatMessage } = this.props.intl;
    let currentTypeId = listSettingsTypeData && listSettingsTypeData?.id;

    return (
      <div>
        <Toaster/>
        <ListSettingsModal />
        <div className={cx(cs.displayFlex, cs.spaceBetween, cs.alignCenter, s.gap, cs.spaceBottom5, s.exportSmapleSheetMobileView)}>
          <Button className={cx(cs.btnPrimary, cs.btnlarge)}
            onClick={() => openListSettingsModal({ typeId: listSettingsTypeData?.id }, "AddListSettingsForm")}>
            <FormattedMessage {...messages.addNewLabel} />
          </Button>

          {

            (typeId == 20 || typeId == 3) && <div>
              <div className={cx(s.importMakeGap, cs.displayFlex, cs.alignCenter, s.exportSmapleSheetMobileView)}>
                <div className={s.tooltipIcon}>
                  <a href={`/export-admin-data?type=make-model`} className={cx(cs.displayFlex, cs.alignCenter, s.tooltipIconGap, cs.siteLinkColor, cs.commonLinkBorder, cs.noTextDecration, cs.fontWeightMedium)}>
                    {formatMessage(messages.sampleSheet)}
                    <img src={toolTipIcon} />
                  </a>
                  <p className={s.toolTipText}>
                    <FormattedMessage {...messages.sampleSheetTooltipText} />
                  </p>
                </div>
                {makeModelCsvUploading ? <span className={cx(cs.commonLinkBorder, cs.noTextDecration, cs.fontWeightMedium, cs.siteLinkColor)}><FormattedMessage {...messages.csvImporting} /></span> : <div className={'csvFileImport'}>
                  <CSVReader
                    ref={this.inputRef}
                    onFileLoaded={this.handleForce}
                    onError={(error) => error && showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: error })}
                    label={
                      <>
                        <span>
                          {typeId == 20 ? formatMessage(messages.importMake) : formatMessage(messages.importModel)}
                        </span>
                        <span>
                          <img src={importIcon} />
                        </span>
                      </>
                    }
                  />
                </div>}
              </div>
            </div>}
        </div>
        <CommonTable
          thead={this.thead}
          tbody={this.tbody}
          isLink
          isHeadingHide
        />

        {
          listSettingsData?.length > 0 && <div>
            <CustomPagination
              total={count}
              currentPage={page}
              defaultCurrent={1}
              defaultPageSize={10}
              change={(e) => this.paginationData(e, currentTypeId)}
              paginationLabel={formatMessage(messages.listSettings)}
            />
          </div>
        }
      </div>
    );

  }

  renderForm(listSettingsTypeData, listSettingsData) {
    return (
      <div>
        <EditListSettingsForm
          initialValues={listSettingsData?.length > 0 && listSettingsData[0]}
          fieldType={listSettingsTypeData?.fieldType}
          title={listSettingsTypeData?.typeLabel}
        />
      </div>
    );
  }

  render() {
    const { loading, adminListSettings } = this.props;
    let listSettingsTypeData, listSettingsData, count, errorMessage, status;

    if (!loading && adminListSettings) {
      status = adminListSettings?.getAllAdminListSettings?.status;
      if (status === 200) {
        listSettingsTypeData = adminListSettings?.getAllAdminListSettings?.listSettingsTypeData;
        listSettingsData = adminListSettings?.getAllAdminListSettings?.listSettingsData;
        count = adminListSettings?.getAllAdminListSettings?.count;
      } else {
        errorMessage = adminListSettings?.getAllAdminListSettings?.errorMessage;
      }
    }

    if (loading) {
      return <Loader type={"text"} />;
    } else {
      if (listSettingsTypeData?.fieldType === "numberType") {
        return (
          <div className={cx(s.pagecontentWrapper)}>
            <div className={s.contentBox}>
              {this.renderForm(listSettingsTypeData, listSettingsData)}
            </div>
          </div>
        )
      } else {
        return (
          <div className={cx(s.pagecontentWrapper)}>
            <div className={s.contentBox}>
              <h1 className={s.headerTitle}>{listSettingsTypeData?.typeLabel}</h1>
              {this.renderTable(listSettingsTypeData, listSettingsData, count)}
            </div>
          </div>
        )
      }
    }
  }
}

const mapState = (state) => ({
  loading: state?.adminListSettingsData?.loading,
  adminListSettings: state?.adminListSettingsData?.data,
  page: state?.adminListSettingsData?.currentPage,
  makeModelCsvUploading: state?.loader?.makeModelCsvUploading
});

const mapDispatch = {
  openListSettingsModal,
  getAdminListingSettings,
  makeModelCsvUploader
};

export default compose(
  injectIntl,
  withStyles(s, cs),
  connect(mapState, mapDispatch)
)(ListSettingsManagement);