import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';

interface User {
	id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    displayName: DBTableUsers.Schema['display_name'];
    password: DBTableUsers.Schema['password'];
    signUpType: DBTableUsers.Schema['sign_up_type'];
    createdAt: DBTableUsers.Schema['created_at'];
    verified: DBTableUsers.Schema['verified'];
}

const knex = Knex({client: 'pg'});

export async function verifiedUser(email: string): Promise<void> {
	const query = knex(DbTable.USERS)
		.update({verified: true})
		.where({email});

	await dbManager.executeModifyQuery(query.toString());
}

export async function updatePasswordByEmail(email: string, password: string): Promise<User> {
	const query = knex(DbTable.USERS)
		.update({
			password,
			verified: true
		})
		.where({email})
		.returning([
			'id',
			'email',
			'display_name as displayName',
			'password',
			'sign_up_type as signUpType',
			'created_at as createdAt',
			'verified'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}
