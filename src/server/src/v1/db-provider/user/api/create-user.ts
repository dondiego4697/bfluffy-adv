import * as Boom from '@hapi/boom';
import * as Knex from 'knex';
import {omit} from 'lodash';
import {UserDbProvider} from 'server/v1/db-provider/user';
import {dbManager} from 'server/lib/db-manager';
import {SignUpType, DbTable, ClientStatusCode} from 'server/types/consts';
import {DBTableUsers} from 'server/types/db/users';
import {logger} from 'server/lib/logger';

interface Params {
    email: string;
    name: string;
    type: SignUpType;
    password: string;
}

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

export async function createUser(params: Params): Promise<User> {
	const existedUser = await UserDbProvider.getUserByEmail(params.email);
	if (existedUser) {
		throw Boom.badRequest(ClientStatusCode.USER_EMAIL_EXIST);
	}

	const query = knex(DbTable.USERS)
		.insert({
			email: params.email,
			display_name: params.name,
			password: params.password,
			sign_up_type: params.type
		})
		.returning([
			'id',
			'email',
			'display_name as displayName',
			'password',
			'sign_up_type as signUpType',
			'created_at as createdAt',
			'verified'
		]);

	const {rows: [user]} = await dbManager.executeModifyQuery(query.toString());

	if (!user) {
		logger.error(`[create user] user did not create: ${JSON.stringify(omit(params, 'password'))}`);
		throw Boom.badRequest();
	}

	return user;
}
