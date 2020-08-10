import * as React from 'react';
import {Upload} from 'antd';
import * as classnames from 'classnames';
import {ImgCropProps} from 'antd-img-crop';
import {
	UploadChangeParam as UploadChangeParams,
	RcFile
} from 'antd/lib/upload/interface';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';

import bevis from 'client/lib/bevis';
import {ImageCrop} from 'client/components/image-crop';
import {ModalMessage} from 'client/components/modal-message';

import './index.scss';
import 'antd/dist/antd.css';

interface Props {
    size: number;
    cropTitle: string;
    cropRotate?: ImgCropProps['rotate'];
    cropShape?: ImgCropProps['shape'];
    imageUrl?: string;
}

interface State {
    loading: boolean;
    imageUrl?: string;
}

const b = bevis('avatar-upload');

export class AvatarUpload extends React.Component<Props, State> {
    state = {
    	loading: false,
    	imageUrl: undefined
    }

    private onChangeHandler = (info: UploadChangeParams) => {
    	if (info.file.status === 'uploading') {
    		this.setState({loading: true});
    		return;
    	}

    	if (info.file.status === 'done') {
    		this.setState({
    			loading: false,
    			imageUrl: info.file.response.imageUrl
    		});
    	}
    }

    private beforeUploadHandler = (file: RcFile) => {
    	const isImage = ['image/jpeg', 'image/png'].includes(file.type);
    	if (!isImage) {
    		ModalMessage.showError('Неподдерживаемый формат изображения');
    	}

    	const isValidSize = file.size / 1024 / 1024 < 2; // less 2 MB
    	if (!isValidSize) {
    		ModalMessage.showError('Максимальный размер изображение 2 МБ');
    	}

    	return isImage && isValidSize;
    }

    private onUploadHandler = () => '/api/v1/edit/s3_storage/update_avatar'

    public render(): React.ReactNode {
    	const {imageUrl: imageUrlState, loading} = this.state;
    	const {imageUrl: imageUrlProps} = this.props;

    	const imageUrl = imageUrlState || imageUrlProps;

    	const uploadButton = (
    		<div className={b('upload-button-container')}>
    			{
    				imageUrl
                        && (
                        	<img
                        	src={imageUrl}
                        	alt='avatar'
                        	className={b('avatar-preview')}
                        	/>
                        )
    			}
    			{
    				!imageUrl && !loading && (
    					<div className={b('upload-button')}>
    						<PlusOutlined />
    						<div className='ant-upload-text'>Загрузить</div>
    					</div>
    				)
    			}
    			{
    				loading && (
    					<div
    						className={b('upload-button-loading')}
    					>
    						<LoadingOutlined />
    					</div>
    				)
    			}
    		</div>
    	);

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
    						showUploadList={false}
    						onChange={this.onChangeHandler}
    						beforeUpload={this.beforeUploadHandler}
    						className={classnames({
    							[b('round-avatar-selector')]: this.props.cropShape === 'round'
    						})}
    					>
    						{uploadButton}
    					</Upload>
    				</ImageCrop>
    			</div>
    		</div>
    	);
    }
}
