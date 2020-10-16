import * as React from 'react';
import {inject} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';

import {GeneralDataModel} from 'common/models/general-data';
import bevis from 'common/lib/bevis';

import './index.scss';

import {ImageUploader} from 'common/components/image-uploader';
import {UserRequestBookV1} from 'common/lib/request-book/v1/user';

interface Props extends RouteComponentProps {
    generalDataModel?: GeneralDataModel;
}

const b = bevis('main-page');

@inject('generalDataModel')
export class MainPage extends React.Component<Props> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <ImageUploader
                        iconType="camera"
                        onUpload={(file) => UserRequestBookV1.updateAvatar(file).then(({url}) => url)}
                    />
                </div>
            </div>
        );
    }
}
