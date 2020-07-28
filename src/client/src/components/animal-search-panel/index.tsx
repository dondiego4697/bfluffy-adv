import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Select} from 'antd';

import {AnimalModel} from 'client/models/animal';
import {GeoModel} from 'client/models/geo';
import bevis from 'client/lib/bevis';

import './index.scss';
import 'antd/dist/antd.css';

export interface SearchParams {
    breedCode?: string;
    categoryCode?: string;
    geoCode?: string;
}

interface Props {
    animalModel?: AnimalModel;
    geoModel?: GeoModel;
    onSearch: (params: SearchParams) => void;
}

interface State {
    breedSubtext?: string;
    breedCodeSelected?: string;
    categoryCodeSelected?: string;
    geoSubtext?: string;
    geoCodeSelected?: string;
}

const b = bevis('search-panel');
const {Option} = Select;

@inject('animalModel', 'geoModel')
@observer
export class AnimalSearchPanel extends React.Component<Props, State> {
    state: State = {
    	categoryCodeSelected: 'dogs',
    	geoCodeSelected: 'moskva'
    };

    private searchBreedHandler = (value: string) => {
    	this.setState({
    		breedSubtext: value
    	});
    }

    private changeBreedHandler = (value: string) => {
    	this.setState({
    		breedCodeSelected: value
    	});
    }

    private changeCategoryHandler = (value: string) => {
    	this.setState((previousState) => ({
    		categoryCodeSelected: value,
    		...(
    			previousState.categoryCodeSelected !== value
    				? {
    					breedCodeSelected: undefined,
    					breedSubtext: undefined
    				}
    				: {}
    		)
    	}));
    }

    private searchCityHandler = (value: string) => {
    	this.setState({
    		geoSubtext: value
    	});
    }

    private changeCityHandler = (value: string) => {
    	this.setState({
    		geoCodeSelected: value
    	});
    }

    private onSearchHandler = () => {
    	this.props.onSearch({
    		breedCode: this.state.breedCodeSelected,
    		categoryCode: this.state.categoryCodeSelected,
    		geoCode: this.state.geoCodeSelected
    	});
    }

    public render(): React.ReactNode {
    	const breeds = this.props.animalModel!.findBreedByName({
    		subtext: this.state.breedSubtext,
    		categoryCode: this.state.categoryCodeSelected
    	});

    	const breedsOptions = breeds.map((item) => (
    		<Option
    			key={`search-animal-breed-${item.breedCode}`}
    			value={item.breedCode}
    		>
    			{item.breedDisplayName}
    		</Option>
    	));

    	const categoriesOptions = this.props.animalModel!.categoryList.map((item) => (
    		<Option
    			key={`search-animal-category-${item.code}`}
    			value={item.code}
    		>
    			{item.displayName}
    		</Option>
    	));

    	const geoObjects = this.props.geoModel!.findGeoObjectsByName(this.state.geoSubtext);
    	const geoObjectsOptions = geoObjects.map((item) => (
    		<Option
    			key={`search-geo-object-${item.type}-${item.code}`}
    			value={item.code}
    		>
    			{item.displayName}
    		</Option>
    	));

    	return (
    		<div className={b()}>
    			<div className={b('container')}>
    				<div className={b('select-container')}>
    					<p>Кого вы ищите?</p>
    					<Select
    						dropdownClassName={b('select-container-dropdown')}
    						showSearch
    						dropdownMatchSelectWidth={false}
    						bordered={false}
    				    	showArrow={false}
    						filterOption={false}
    						placeholder='Порода'
    						onSearch={this.searchBreedHandler}
    						onChange={this.changeBreedHandler}
    						notFoundContent={null}
    						value={breedsOptions.length ? this.state.breedCodeSelected : undefined}
    					>
    						{breedsOptions}
    					</Select>
    				</div>
    				<div className={b('devider')} />
    				<div className={b('select-container')}>
    					<p>Выбирите категорию</p>
    					<Select
    						dropdownClassName={b('select-container-dropdown')}
    						onChange={this.changeCategoryHandler}
    						bordered={false}
    						notFoundContent={null}
    						value={categoriesOptions.length ? this.state.categoryCodeSelected : undefined}
    					>
    						{categoriesOptions}
    					</Select>
    				</div>
    				<div className={b('devider')} />
    				<div className={b('select-container')}>
    					<p>Город или регион</p>
    					<Select
    						showSearch
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
    					</Select>
    				</div>
    				<button
    					type='button'
    					className={b('search-button')}
    					onClick={this.onSearchHandler}
    				>
    					<img src='image/lens.svg' alt='lens-icon' />
    				</button>
    			</div>
    		</div>
    	);
    }
}
