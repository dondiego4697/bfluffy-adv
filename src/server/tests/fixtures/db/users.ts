import {DbTable, SignUpType} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';
import {getPasswordHash} from 'server/lib/crypto';

const rows: Omit<Omit<DBTableUsers.Schema, 'id'>, 'created_at'>[] = [
	{
		email: 'test@mail.ru',
		display_name: 'Test User',
		password: getPasswordHash('password'),
		sign_up_type: SignUpType.EMAIL,
		verified: false
	}
];

export const users = {
	table: DbTable.USERS,
	rows
};
