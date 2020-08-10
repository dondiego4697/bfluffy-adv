import * as React from 'react';
import ImgCrop, {ImgCropProps} from 'antd-img-crop';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
    title: string;
    shape?: ImgCropProps['shape'];
    rotate?: ImgCropProps['rotate'];
}

export class ImageCrop extends React.Component<Props> {
	public render(): React.ReactNode {
		return (
			<ImgCrop
				rotate={this.props.rotate}
				shape={this.props.shape}
				modalTitle={this.props.title}
				modalOk='ОК'
				modalCancel='Отмена'
			>
				{this.props.children}
			</ImgCrop>
		);
	}
}
