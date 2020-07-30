import * as React from 'react';
import ImgCrop from 'antd-img-crop';
import {ImgCropProps} from 'antd-img-crop';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
    shape?: ImgCropProps['shape'];
    rotate?: ImgCropProps['rotate'];
}

export class ImageCrop extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <ImgCrop
                rotate={this.props.rotate}
                shape={this.props.shape}
            >
                {this.props.children}
            </ImgCrop>
        );
    }
}
