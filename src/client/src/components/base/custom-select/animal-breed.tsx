import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import {AnimalModel} from 'client/models/animal';
import bevis from 'client/lib/bevis';

import './animal-breed.scss';

interface Props {
    categoryCodeSelected?: string;
    animalModel?: AnimalModel;
    label?: string;
    className?: string;
    onChange: (code: string) => void;
}

interface State {
    breedSubtext?: string;
    breedCodeSelected?: string;
}

const b = bevis('animal-breed-select');

@inject('animalModel')
@observer
export class AnimalBreedSelect extends React.Component<Props, State> {
    state: State = {};

    private searchBreedHandler = (value: string) => {
        this.setState({
            breedSubtext: value
        });
    };

    private changeBreedHandler = (value: string) => {
        this.setState({
            breedCodeSelected: value
        });

        this.props.onChange(value);
    };

    public render(): React.ReactNode {
        const breeds = this.props.animalModel!.findBreedByName({
            subtext: this.state.breedSubtext,
            categoryCode: this.props.categoryCodeSelected
        });

        const breedsOptions = breeds.map((item) => (
            <div />
            // <Option key={`search-animal-breed-${item.breedCode}`} value={item.breedCode}>
            //     {item.breedDisplayName}
            // </Option>
        ));

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <p className={b('label')}>{this.props.label}</p>
                    {/* <Select
                        className={classnames(this.props.className, b('select'))}
                        dropdownClassName={b('select-container-dropdown')}
                        showSearch
                        dropdownMatchSelectWidth={false}
                        bordered={false}
                        showArrow={false}
                        filterOption={false}
                        placeholder="Порода"
                        onSearch={this.searchBreedHandler}
                        onChange={this.changeBreedHandler}
                        notFoundContent={null}
                        value={breedsOptions.length ? this.state.breedCodeSelected : undefined}
                    >
                        {breedsOptions}
                    </Select> */}
                </div>
            </div>
        );
    }
}
