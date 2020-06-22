import {getAnimalBreedList} from 'server/v1/db-provider/animal/api/get-animal-breed-list';
import {getAnimalCategoryList} from 'server/v1/db-provider/animal/api/get-animal-category-list';

export const AnimalDbProvider = {
	getAnimalBreedList,
	getAnimalCategoryList
};
