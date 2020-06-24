import * as Knex from 'knex';
import * as faker from 'faker';
import {SignUpType, DbTable} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';
import {DBTableUsers} from 'server/types/db/users';
import {dbManager} from 'server/lib/db-manager';
import {getPasswordHash} from 'server/lib/crypto';
import {DBTableCity} from 'server/types/db/city';

interface CreateUserParams {
    signUpType: SignUpType;
    password?: string;
    verified?: boolean;
}

interface City {
	id: DBTableCity.Schema['display_name'];
	code: DBTableCity.Schema['display_name'];
	displayName: DBTableCity.Schema['display_name'];
	regionId: DBTableCity.Schema['region_id'];
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

interface Farm {
	id: DBTableFarm.Schema['id'];
	cityId: DBTableFarm.Schema['city_id'];
	contacts: DBTableFarm.Schema['contacts'];
	name: DBTableFarm.Schema['name'];
	description: DBTableFarm.Schema['description'];
	ownerId: DBTableFarm.Schema['owner_id'];
	address: DBTableFarm.Schema['address'];
	rating: DBTableFarm.Schema['rating'];
	archive: DBTableFarm.Schema['archive'];
	createdAt: DBTableFarm.Schema['created_at'];
	updatedAt: DBTableFarm.Schema['updated_at'];
	publicId: DBTableFarm.Schema['public_id'];
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

async function getAllCities(): Promise<City[]> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('code'),
			knex.raw('display_name as "displayName"'),
			knex.raw('region_id as "regionId"')
		])
		.from(DbTable.CITY);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function getAllUsers(): Promise<User[]> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function getUserByCredentials(email: string, password: string): Promise<User> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS)
		.where({email, password});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	return row;
}

async function getAllFarms(): Promise<Farm[]> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('city_id as "cityId"'),
			knex.raw('contacts'),
			knex.raw('name'),
			knex.raw('description'),
			knex.raw('owner_id as "ownerId"'),
			knex.raw('address'),
			knex.raw('rating'),
			knex.raw('archive'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('updated_at as "updatedAt"'),
			knex.raw('public_id as "publicId"')
		])
		.from(DbTable.FARM);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

export const TestFactory = {
	createUser,
	getAllUsers,
	getUserByCredentials,
	getAllFarms,
	getAllCities
};
