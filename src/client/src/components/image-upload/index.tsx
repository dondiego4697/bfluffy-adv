import * as React from 'react';
import {Upload} from 'antd';
import {ImgCropProps} from 'antd-img-crop';

import bevis from 'client/lib/bevis';
import {ImageCrop} from 'client/components/image-crop';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
    size: number;
    cropRotate?: ImgCropProps['rotate'];
    cropShape?: ImgCropProps['shape'];
}

const b = bevis('image-upload');

export class ImageUpload extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <ImageCrop
                        rotate={this.props.cropRotate}
                        shape={this.props.cropShape}
                    >
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            // fileList={fileList}
                            // onChange={onChange}
                            // onPreview={onPreview}
                        >
                            Загрузить
                        </Upload>
                    </ImageCrop>
                </div>
            </div>
        );
    }
}
