import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import {GeoModel} from 'client/models/geo';
import bevis from 'client/lib/bevis';

import './geo.scss';

interface Props {
    geoModel?: GeoModel;
    label?: string;
    className?: string;
    onChange: (code: string) => void;
}

interface State {
    geoSubtext?: string;
    geoCodeSelected: string;
}

const b = bevis('geo-select');

@inject('geoModel')
@observer
export class GeoSelect extends React.Component<Props, State> {
    state: State = {
        geoCodeSelected: 'moskva'
    };

    public componentDidMount() {
        this.props.onChange(this.state.geoCodeSelected);
    }

    private searchCityHandler = (value: string) => {
        this.setState({
            geoSubtext: value
        });
    };

    private changeCityHandler = (value: string) => {
        this.setState({
            geoCodeSelected: value
        });

        this.props.onChange(value);
    };

    public render(): React.ReactNode {
        const geoObjects = this.props.geoModel!.findGeoObjectsByName(this.state.geoSubtext);
        const geoObjectsOptions = geoObjects.map((item) => (
            <div />
            // <Option key={`search-geo-object-${item.type}-${item.code}`} value={item.code}>
            //     {item.displayName}
            // </Option>
        ));

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <p className={b('label')}>{this.props.label}</p>
                    {/* <Select
                        showSearch
                        className={classnames(this.props.className, b('select'))}
                        showArrow={false}
                        filterOption={false}
                        dropdownClassName={b('select-container-dropdown')}
                        onSearch={this.searchCityHandler}
                        onChange={this.changeCityHandler}
                        bordered={false}
                        notFoundContent={null}
                        value={geoObjectsOptions.length ? this.state.geoCodeSelected : undefined}
                    >
                        {geoObjectsOptions}
                    </Select> */}
                </div>
            </div>
        );
    }
}
