import * as React from 'react';
import {Link} from 'react-router-dom';

import bevis from 'client/lib/bevis';

import './index.scss';

interface Props {
    breed: string;
    city: string;
    address?: string;
    sex: boolean;
    updatedAt: string;
    cost: number;
    imageUrls: string[];
    onClickHandler: () => void;
}

const b = bevis('bfluffy-ad-list-item');

const DEFAULT_IMAGE = '/image/animal-category/cat.svg';

export class AdListItem extends React.Component<Props> {
    public render(): React.ReactNode {
        const {imageUrls, sex, breed, city, address, cost, updatedAt, onClickHandler} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')} onClick={onClickHandler}>
                    <div className={b('image-contaner')}>
                        <img src={imageUrls[0] || DEFAULT_IMAGE} />
                    </div>
                    <div className={b('info-container')}>
                        <p className={b('breed-title')}>{breed}</p>
                        <p className={b('address')}>{`${city}${address ? `, ${address}` : ''}`}</p>
                        <p className={b('updated-at')}>{updatedAt}</p>
                        <p
                            className={b('cost')}
                            dangerouslySetInnerHTML={{
                                __html: cost === 0 ? 'Бесплатно' : `${cost} &#x20bd;`
                            }}
                        />
                        <label className={b('sex-container')}>
                            <img src={sex ? '/image/sex-male.svg' : '/image/sex-female.svg'} />
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}
