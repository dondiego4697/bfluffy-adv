import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';

interface User {
	id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    verifiedCode: DBTableUsers.Schema['verified_code'];
    createdAt: DBTableUsers.Schema['created_at'];
    updatedAt: DBTableUsers.Schema['updated_at'];
    verified: DBTableUsers.Schema['verified'];
}

interface UpdateVerifiedCodeByEmailParams {
	email: string;
	verifiedCode: string;
}

const knex = Knex({client: 'pg'});

export async function verifiedUser(email: string): Promise<void> {
	const query = knex(DbTable.USERS)
		.update({verified: true})
		.where({email});

	await dbManager.executeModifyQuery(query.toString());
}

export async function updateVerifiedCodeByEmail(params: UpdateVerifiedCodeByEmailParams): Promise<User> {
	const {email, verifiedCode} = params;

	const query = knex(DbTable.USERS)
		.update({
			verified_code: verifiedCode
		})
		.where({email})
		.returning([
			'id',
			'email',
			'verified_code as verifiedCode',
			'created_at as createdAt',
			'updated_at as updatedAt',
			'verified'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}
