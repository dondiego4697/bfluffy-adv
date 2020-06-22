import {DbTable} from 'server/types/consts';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';

const rows: Omit<DBTableAnimalCategory.Schema, 'id'>[] = [
	{
		code: 'cats',
		display_name: 'Кошки'
	},
	{
		code: 'dogs',
		display_name: 'Собаки'
	}
];

export const animalCategories = {
	table: DbTable.ANIMAL_CATEGORY,
	rows
};
