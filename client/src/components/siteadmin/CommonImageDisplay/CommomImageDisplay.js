import React from "react";

//image
import DeleteIcon from '/public/AdminIcons/dlt.png';
import defaultPic from '/public/AdminIcons/default.svg'

//style
import cp from '../../../components/commonStyle.css'
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

//component
import Loader from "../../Loader/Loader";


class CommonImageDisplay extends React.Component {

    render() {
        const { loader, loading, image, deleteImage, isDefaultPic, isDelete } = this.props;
        return (
            <div>
                <Loader show={loader} type={"page"}>
                    <div className={cp.profilePic}>
                        {
                            loading && <div className={cp.bannerImageBg} />
                        }
                        {
                            !loading && <div
                                style={{ backgroundImage: `url(${!isDefaultPic ? image : defaultPic})` }}
                                className={!isDefaultPic ? cp.bannerImageBg : cp.profileImageBg}
                            />
                        }
                    </div>
                    {
                        !loading && !isDefaultPic && isDelete && <a href="javascript:void(0);" onClick={() => deleteImage()} className={cx(cp.trashIconNew, 'trashIconRTL')}>
                            <img src={DeleteIcon} alt='Delete' />
                        </a>
                    }
                </Loader>
            </div>
        )
    }
};

export default withStyles(cp)(CommonImageDisplay);