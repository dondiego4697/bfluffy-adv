import * as React from 'react';

import bevis from 'client/lib/bevis';
import {ModalMessage} from 'client/components/base/modal-message';
import {SpinnerWrapper} from 'client/components/base/spinner/spinner-wrapper';

import './index.scss';

type ImageUrl = string;

interface Props {
    url?: string;
    text?: string;
    icon?: string;
    onUploadImage: (file: File) => Promise<ImageUrl>;
}

interface State {
    uploading: boolean;
    url?: string;
}

const b = bevis('bfluffy-image-upload');

export class ImageUpload extends React.Component<Props, State> {
    inputRef = React.createRef<HTMLInputElement>();

    state: State = {
        uploading: false,
        url: undefined
    };

    private onChangeHandler = () => {
        const input = this.inputRef.current;
        if (!input || !input.files) {
            return;
        }

        const file = input.files[0];
        const isValidSize = file.size / 1024 / 1024 < 2; // меньше 2 MB
        const isImage = ['image/jpeg', 'image/png'].includes(file.type);

        if (!isImage) {
            ModalMessage.showError('Неподдерживаемый формат изображения');
            return;
        }

        if (!isValidSize) {
            ModalMessage.showError('Максимальный размер изображение 2 МБ');
            return;
        }

        this.uploadImage(file);
    };

    private uploadImage(file: File) {
        this.setState({uploading: true});

        this.props
            .onUploadImage(file)
            .then((imageUrl) =>
                this.setState({
                    url: imageUrl
                })
            )
            .finally(() =>
                this.setState({
                    uploading: false
                })
            );
    }

    public render(): React.ReactNode {
        const {url: propsUrl, text, icon} = this.props;
        const {uploading, url: stateUrl} = this.state;

        const url = stateUrl || propsUrl;

        const uploadButton = (
            <div className={b('container')}>
                <SpinnerWrapper spinning={uploading}>
                    <label className={b('button-wrapper')}>
                        {(url && <img src={url} alt="image" className={b('image-preview')} />) || (
                            <span className={b('title')}>{text || (icon && <img src={icon} />) || ''}</span>
                        )}
                        <input
                            className={b('upload-button')}
                            ref={this.inputRef}
                            type="file"
                            name="file"
                            accept="image/jpeg,image/png"
                            onChange={this.onChangeHandler}
                        />
                    </label>
                </SpinnerWrapper>
            </div>
        );

        return <div className={b()}>{uploadButton}</div>;
    }
}
