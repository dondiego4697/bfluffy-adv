import {DbTable} from 'server/types/consts';
import {DBTableRegion} from 'server/types/db/region';

const rows: Omit<DBTableRegion.Schema, 'id'>[] = [
	{
		code: 12,
		display_name: 'Регион 12'
	},
	{
		code: 13,
		display_name: 'Регион 13'
	}
];

export const regions = {
	table: DbTable.REGION,
	rows
};
