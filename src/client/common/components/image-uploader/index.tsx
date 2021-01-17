import * as React from 'react';
import {inject} from 'mobx-react';
import * as classnames from 'classnames';

import bevis from 'common/lib/bevis';
import {CAMERA_SVG} from 'common/svg/icons';
import {Spinner} from 'common/components/spinner';
import {UIModel} from 'common/models/ui';

import './index.scss';

type ImageUrl = string;

interface Props {
    url?: string;
    iconType?: 'camera';
    onUpload: (file: File) => Promise<ImageUrl>;
    uiModel?: UIModel;
}

interface State {
    uploading: boolean;
    url?: string;
}

const b = bevis('bfluffy-image-uploader');

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png'];

@inject('uiModel')
export class ImageUploader extends React.Component<Props, State> {
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
        const isImage = ACCEPTED_FORMATS.includes(file.type);

        if (!isImage) {
            return this.props.uiModel?.showPopup({
                type: 'error',
                title: 'Ограничение',
                description: 'Неподдерживаемый формат изображения'
            });
        }

        if (!isValidSize) {
            return this.props.uiModel?.showPopup({
                type: 'error',
                title: 'Ограничение',
                description: 'Максимальный размер изображение 2 МБ'
            });
        }

        this.uploadImage(file);
    };

    private uploadImage(file: File) {
        this.setState({uploading: true});

        this.props
            .onUpload(file)
            .then((url) => this.setState({url}))
            .finally(() => this.setState({uploading: false}));
    }

    public render(): React.ReactNode {
        const {url: propsUrl, iconType = 'camera'} = this.props;
        const {url: stateUrl, uploading} = this.state;

        const url = stateUrl || propsUrl;
        const icon = iconType === 'camera' ? CAMERA_SVG : CAMERA_SVG;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div
                        className={classnames({
                            [b('spinner-container')]: true,
                            [b('spinner-container_hide')]: !uploading
                        })}
                    >
                        <Spinner />
                    </div>
                    <label className={b('button-wrapper')}>
                        {(url && <img src={url} alt="image" className={b('image-preview')} />) ||
                            (!uploading && <span className={b('icon')}>{icon}</span>)}
                        <input
                            className={b('upload-button')}
                            ref={this.inputRef}
                            type="file"
                            name="file"
                            accept={ACCEPTED_FORMATS.join(',')}
                            onChange={this.onChangeHandler}
                        />
                    </label>
                </div>
            </div>
        );
    }
}
