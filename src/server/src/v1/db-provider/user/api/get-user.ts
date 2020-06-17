import * as Knex from 'knex';
import {dbManager} from 'server/lib/db-manager';
import {DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';
import {formatCreatedDate} from 'server/lib/date-format';

interface User {
	id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    displayName: DBTableUsers.Schema['display_name'];
    password: DBTableUsers.Schema['password'];
    signUpType: DBTableUsers.Schema['sign_up_type'];
    createdAt: string;
    verified: DBTableUsers.Schema['verified'];
}

const knex = Knex({client: 'pg'});

export async function getUserByEmail(email: string): Promise<User | undefined> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('email'),
			knex.raw('display_name as "displayName"'),
			knex.raw('password'),
			knex.raw('sign_up_type as "signUpType"'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('verified')
		])
		.from(DbTable.USERS)
		.where({email});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	if (!row) {
		return;
	}

	return {
		...row,
		createdAt: formatCreatedDate(row.createdAt)
	};
}

export async function getUserByCredentials(email: string, password: string): Promise<User | undefined> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('email'),
			knex.raw('display_name as "displayName"'),
			knex.raw('password'),
			knex.raw('sign_up_type as "signUpType"'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('verified')
		])
		.from(DbTable.USERS)
		.where({
			email,
			password
		});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	if (!row) {
		return;
	}

	return {
		...row,
		createdAt: formatCreatedDate(row.createdAt)
	};
}
