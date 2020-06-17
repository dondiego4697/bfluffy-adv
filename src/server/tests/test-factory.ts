import * as Knex from 'knex';
import * as faker from 'faker';
import {SignUpType, DbTable} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';
import {dbManager} from 'server/lib/db-manager';
import {formatCreatedDate} from 'server/lib/date-format';
import {getPasswordHash} from 'server/lib/crypto';

interface CreateUserParams {
    signUpType: SignUpType;
    password?: string;
    verified?: boolean;
}

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

const USER_COLUMNS = [
	knex.raw('id'),
	knex.raw('email'),
	knex.raw('display_name as "displayName"'),
	knex.raw('password'),
	knex.raw('sign_up_type as "signUpType"'),
	knex.raw('created_at as "createdAt"'),
	knex.raw('verified')
];

async function createUser(params: CreateUserParams): Promise<User> {
	const query = knex(DbTable.USERS)
		.insert({
			email: faker.internet.email(),
			display_name: faker.name.findName(),
			password: getPasswordHash(params.password || faker.internet.password()),
			sign_up_type: params.signUpType,
			verified: params.verified
		})
		.returning('*');

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());

	return {
		...row,
		createdAt: formatCreatedDate(row.createdAt)
	};
}

async function getAllUsers(): Promise<User[]> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows.map((row) => ({
		...row,
		createdAt: formatCreatedDate(row.createdAt)
	}));
}

async function getUserByCredentials(email: string, password: string): Promise<User[]> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS)
		.where({email, password});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	return {
		...row,
		createdAt: formatCreatedDate(row.createdAt)
	};
}

export const TestFactory = {
	createUser,
	getAllUsers,
	getUserByCredentials
};
