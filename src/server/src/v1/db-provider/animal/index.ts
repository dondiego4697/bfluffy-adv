import {getAnimalBreedList} from 'server/v1/db-provider/animal/api/get-animal-breed-list';
import {getAnimalBreedByCode} from 'server/v1/db-provider/animal/api/get-animal-breed-by-code';

export const AnimalDbProvider = {
	getAnimalBreedList,
	getAnimalBreedByCode
};
