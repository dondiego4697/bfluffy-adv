import * as React from 'react';

import bevis from 'client/lib/bevis';
import {UserRequestBookV1} from 'client/lib/request-book/v1/user';
import {ModalMessage} from 'client/components/base/modal-message';
import {SpinnerWrapper} from 'client/components/base/spinner/spinner-wrapper';

import './index.scss';

interface Props {
    url?: string;
}

interface State {
    uploading: boolean;
    url?: string;
}

const b = bevis('bfluffy-avatar-upload');

export class AvatarUpload extends React.Component<Props, State> {
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

        this.uploadAvatar(file);
    };

    private uploadAvatar(file: File) {
        this.setState({uploading: true});

        UserRequestBookV1.uploadAvatar(file).then(({imageUrl}) =>
            this.setState({
                url: imageUrl,
                uploading: false
            })
        );
    }

    public render(): React.ReactNode {
        const {url: propsUrl} = this.props;
        const {uploading, url: stateUrl} = this.state;

        const url = stateUrl || propsUrl;

        const uploadButton = (
            <div className={b('container')}>
                <SpinnerWrapper spinning={uploading}>
                    <label className={b('button-wrapper')}>
                        {(url && <img src={url} alt="avatar" className={b('avatar-preview')} />) || (
                            <span className={b('title')}>Загрузить аватарку</span>
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
