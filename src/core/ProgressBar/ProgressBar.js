import React from 'react';
import { Progress } from 'semantic-ui-react';
import './style.css'

const ProgressBar = ({percentUploaded, uploadState}) => {
    return ( 
        uploadState && (
            <Progress 
                className="progress_bar"
                percent={percentUploaded}
                progress
                indicating
                size="medium"
                inverted
                // style={{ margin: '0.3em 0 0 0'}}
            />
        )
     );
}
 
export default ProgressBar;