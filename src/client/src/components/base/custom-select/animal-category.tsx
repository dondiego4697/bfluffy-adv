import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import {AnimalModel} from 'client/models/animal';
import bevis from 'client/lib/bevis';

import './animal-category.scss';

interface Props {
    animalModel?: AnimalModel;
    label?: string;
    className?: string;
    onChange: (code: string) => void;
}

interface State {
    categoryCodeSelected: string;
}

const b = bevis('animal-category-select');

@inject('animalModel')
@observer
export class AnimalCategorySelect extends React.Component<Props, State> {
    state: State = {
        categoryCodeSelected: 'dogs'
    };

    public componentDidMount() {
        this.props.onChange(this.state.categoryCodeSelected);
    }

    private changeCategoryHandler = (value: string) => {
        this.setState({
            categoryCodeSelected: value
        });

        this.props.onChange(value);
    };

    public render(): React.ReactNode {
        const categoriesOptions = this.props.animalModel!.categoryList.map((item) => (
            <div />
            // <Option key={`search-animal-category-${item.code}`} value={item.code}>
            //     {item.displayName}
            // </Option>
        ));

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <p className={b('label')}>{this.props.label}</p>
                    {/* <Select
                        className={classnames(this.props.className, b('select'))}
                        dropdownClassName={b('select-container-dropdown')}
                        onChange={this.changeCategoryHandler}
                        bordered={false}
                        notFoundContent={null}
                        value={categoriesOptions.length ? this.state.categoryCodeSelected : undefined}
                    >
                        {categoriesOptions}
                    </Select> */}
                </div>
            </div>
        );
    }
}
