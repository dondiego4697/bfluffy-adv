/* eslint-disable no-undef */
import * as React from 'react';
import {Upload} from 'antd';
import {ImgCropProps} from 'antd-img-crop';
import {
	UploadFile,
	UploadChangeParam as UploadChangeParams,
	RcFile
} from 'antd/lib/upload/interface';

import bevis from 'client/lib/bevis';
import {ImageCrop} from 'client/components/image-crop';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
    size: number;
    cropTitle: string;
    cropRotate?: ImgCropProps['rotate'];
    cropShape?: ImgCropProps['shape'];
}

interface State {
    fileList: UploadFile[];
}

const b = bevis('image-upload');

export class ImageUpload extends React.Component<Props, State> {
    state = {
    	fileList: []
    }

    private onChangeHandler = (info: UploadChangeParams) => {
    	this.setState({fileList: info.fileList});
    }

    private onPreviewHandler = async (file: UploadFile) => {
    	let src = file.url;
    	if (!src) {
    		src = await new Promise((resolve) => {
    			const reader = new FileReader();
    			reader.readAsDataURL(file.originFileObj as Blob);
    			reader.onload = () => resolve(reader.result as string);
    		});
    	}

    	const image = new Image();
    	image.src = src!;

    	const imgWindow = window.open(src);
        imgWindow!.document.write(image.outerHTML);
    }

    private onUploadHandler = () => 'url';

    public render(): React.ReactNode {
    	return (
    		<div className={b()}>
    			<div className={b('container')}>
    				<ImageCrop
    					title={this.props.cropTitle}
    					rotate={this.props.cropRotate}
    					shape={this.props.cropShape}
    				>
    					<Upload
    						action={this.onUploadHandler}
    						listType='picture-card'
    						fileList={this.state.fileList}
    						onChange={this.onChangeHandler}
    						onPreview={this.onPreviewHandler}
    					>
                            Загрузить
    					</Upload>
    				</ImageCrop>
    			</div>
    		</div>
    	);
    }
}
