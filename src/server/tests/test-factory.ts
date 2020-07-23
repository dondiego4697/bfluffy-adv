import * as slugify from '@sindresorhus/slugify';
import * as Knex from 'knex';
import * as faker from 'faker';
import {dbManager} from 'server/lib/db-manager';
import {AuthToken} from 'server/lib/auth-token';
import {getPasswordHash} from 'server/lib/crypto';
import {SignUpType, DbTable, FarmType} from 'server/types/consts';
import {DBTableFarm} from 'server/types/db/farm';
import {DBTableUsers} from 'server/types/db/users';
import {DBTableCity} from 'server/types/db/city';
import {DBTableRegion} from 'server/types/db/region';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';

const knex = Knex({client: 'pg'});

// ####################################################################################################################

interface City {
	id: DBTableCity.Schema['id'];
	code: DBTableCity.Schema['code'];
	displayName: DBTableCity.Schema['display_name'];
	regionId: DBTableCity.Schema['region_id'];
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

async function createCity(regionId: number): Promise<City> {
	const city = faker.address.city();

	const query = knex(DbTable.CITY)
		.insert({
			code: slugify(city),
			display_name: city,
			region_id: regionId
		})
		.returning([
			'id',
			'code',
			'display_name as displayName',
			'region_id as regionId'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

interface CreateUserParams {
    signUpType: SignUpType;
    password?: string;
    verified?: boolean;
    email?: string;
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

const USER_COLUMNS = [
	knex.raw('id'),
	knex.raw('email'),
	knex.raw('display_name as "displayName"'),
	knex.raw('password'),
	knex.raw('sign_up_type as "signUpType"'),
	knex.raw('created_at as "createdAt"'),
	knex.raw('verified')
];

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

async function createUserWithToken(params: CreateUserParams) {
	const user = await createUser({
		...params,
		password: params.password || 'password'
	});

	const authToken = AuthToken.encode({
		email: user.email,
		password: 'password'
	});

	return {user, authToken};
}

async function createUser(params: CreateUserParams): Promise<User> {
	const query = knex(DbTable.USERS)
		.insert({
			email: params.email || faker.internet.email(),
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

// ####################################################################################################################

interface Farm {
	id: DBTableFarm.Schema['id'];
	cityId: DBTableFarm.Schema['city_id'];
	contacts: DBTableFarm.Schema['contacts'];
	name: DBTableFarm.Schema['name'];
	type: DBTableFarm.Schema['type'];
	description: DBTableFarm.Schema['description'];
	ownerId: DBTableFarm.Schema['owner_id'];
	address: DBTableFarm.Schema['address'];
	rating: DBTableFarm.Schema['rating'];
	isArchive: DBTableFarm.Schema['is_archive'];
	createdAt: DBTableFarm.Schema['created_at'];
	updatedAt: DBTableFarm.Schema['updated_at'];
	publicId: DBTableFarm.Schema['public_id'];
}

interface CreateFarmParams {
	cityId: number;
	ownerId: number;
	type: FarmType;
	isArchive?: boolean;
}

async function getAllFarms(): Promise<Farm[]> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('city_id as "cityId"'),
			knex.raw('contacts'),
			knex.raw('name'),
			knex.raw('type'),
			knex.raw('description'),
			knex.raw('owner_id as "ownerId"'),
			knex.raw('address'),
			knex.raw('rating'),
			knex.raw('is_archive as "isArchive"'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('updated_at as "updatedAt"'),
			knex.raw('public_id as "publicId"')
		])
		.from(DbTable.FARM);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function createFarm(params: CreateFarmParams): Promise<Farm> {
	const query = knex(DbTable.FARM)
		.insert({
			city_id: params.cityId,
	        contacts: JSON.stringify({
				email: faker.internet.email(),
				phone: faker.phone.phoneNumber()
			}),
			type: params.type,
			owner_id: params.ownerId,
			is_archive: params.isArchive,
	        name: faker.company.companyName(),
	        description: faker.company.catchPhrase(),
			address: faker.address.streetAddress()
		})
		.returning([
			'id',
			'city_id as cityId',
			'contacts',
			'name',
			'description',
			'owner_id as ownerId',
			'address',
			'rating',
			'is_archive as isArchive',
			'created_at as createdAt',
			'updated_at as updatedAt',
			'public_id as publicId'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

interface Region {
	id: DBTableRegion.Schema['id'];
	code: DBTableRegion.Schema['code'];
	displayName: DBTableRegion.Schema['display_name'];
}

async function createRegion(): Promise<Region> {
	const query = knex(DbTable.REGION)
		.insert({
			code: faker.address.stateAbbr(),
			display_name: faker.address.state()
		})
		.returning([
			'id',
			'code',
			'display_name as displayName'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

interface AnimalBreed {
	id: DBTableAnimalBreed.Schema['id'];
	code: DBTableAnimalBreed.Schema['code'];
	displayName: DBTableAnimalBreed.Schema['display_name'];
	animalCategoryId: DBTableAnimalBreed.Schema['animal_category_id'];
}

async function createAnimalBreed(animalCategoryId: number): Promise<AnimalBreed> {
	const breed = faker.random.word();

	const query = knex(DbTable.ANIMAL_BREED)
		.insert({
			code: slugify(breed),
			display_name: breed,
			animal_category_id: animalCategoryId
		})
		.returning([
			'id',
			'code',
			'display_name as displayName',
			'animal_category_id as animalCategoryId'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

interface AnimalCategory {
	id: DBTableAnimalCategory.Schema['id'];
	code: DBTableAnimalCategory.Schema['code'];
	displayName: DBTableAnimalCategory.Schema['display_name'];
}

async function createAnimaCategory(): Promise<AnimalCategory> {
	const category = faker.random.word();

	const query = knex(DbTable.ANIMAL_CATEGORY)
		.insert({
			code: slugify(category),
			display_name: category
		})
		.returning([
			'id',
			'code',
			'display_name as displayName'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

export const TestFactory = {
	createUser,
	createUserWithToken,
	getUserByCredentials,
	getAllUsers,
	// ----
	createRegion,
	// ----
	createCity,
	getAllCities,
	// ----
	createAnimalBreed,
	// ----
	createAnimaCategory,
	// ----
	createFarm,
	getAllFarms
};
