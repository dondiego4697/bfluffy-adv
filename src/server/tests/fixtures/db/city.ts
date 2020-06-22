import {DbTable} from 'server/types/consts';
import {DBTableCity} from 'server/types/db/city';

const rows: Omit<DBTableCity.Schema, 'id'>[] = [
	{
		code: 'gorod-1',
		display_name: 'Город 1',
		region_id: 1
	},
	{
		code: 'gorod-2',
		display_name: 'Город 2',
		region_id: 1
	},
	{
		code: 'gorod-3',
		display_name: 'Город 3',
		region_id: 2
	},
	{
		code: 'gorod-4',
		display_name: 'Город 4',
		region_id: 2
	}
];

export const cities = {
	table: DbTable.CITY,
	rows
};
