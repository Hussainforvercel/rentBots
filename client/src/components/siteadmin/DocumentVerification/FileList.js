import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';

import { photosShow } from '../../../helpers/photosShow';
import { documentuploadDir } from '../../../config';

class FileList extends React.Component {

    render(){

        const { data } = this.props;
        let pdf = "PDF";
        let img = "Image";
        let path = photosShow(documentuploadDir);

        return(
            <div>
               {
                    data.map((item, index) =>{
                        let icon = item.fileType == 'application/pdf' ? pdf : (img);                                           
                        return (
                            <div key={index}>
                                <a href={path + item.fileName} target="_blank">{icon} </a>                                
                            </div>
                        )                               
                   })
               }                           
           </div>
           
        )
    }

}
export default FileList;

