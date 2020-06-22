import {DbTable} from 'server/types/consts';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';

const rows: Omit<DBTableAnimalBreed.Schema, 'id'>[] = [
	{
		code: 'cat-1',
		display_name: 'Кошка 1',
		animal_category_id: 1
	},
	{
		code: 'cat-2',
		display_name: 'Кошка 1',
		animal_category_id: 1
	},
	{
		code: 'dog-1',
		display_name: 'Собака 1',
		animal_category_id: 2
	},
	{
		code: 'dog-2',
		display_name: 'Собака 2',
		animal_category_id: 2
	},
];

export const animalBreeds = {
	table: DbTable.ANIMAL_BREED,
	rows
};
