import * as slugify from '@sindresorhus/slugify';
import * as Knex from 'knex';
import * as faker from 'faker';
import {dbManager} from 'server/lib/db-manager';
import {AuthToken} from 'server/lib/auth-token';
import {DbTable, FarmType} from 'server/types/consts';
import {DBTableUserCard} from 'server/types/db/user-card';
import {DBTableUsers} from 'server/types/db/users';
import {DBTableCity} from 'server/types/db/city';
import {DBTableRegion} from 'server/types/db/region';
import {DBTableAnimalCategory} from 'server/types/db/animal-category';
import {DBTableAnimalBreed} from 'server/types/db/animal-breed';
import {DBTableAnimalAd} from 'server/types/db/animal-ad';

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
    verified?: boolean;
	email?: string;
	verifiedCode?: string;
}

interface User {
    id: DBTableUsers.Schema['id'];
    email: DBTableUsers.Schema['email'];
    verifiedCode: DBTableUsers.Schema['verified_code'];
    createdAt: DBTableUsers.Schema['created_at'];
    updatedAt: DBTableUsers.Schema['updated_at'];
    verified: DBTableUsers.Schema['verified'];
}

const USER_COLUMNS = [
	knex.raw('id'),
	knex.raw('email'),
	knex.raw('verified_code as "verifiedCode"'),
	knex.raw('created_at as "createdAt"'),
	knex.raw('updated_at as "updatedAt"'),
	knex.raw('verified')
];

async function getAllUsers(): Promise<User[]> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function getUserByEmail(email: string): Promise<User | undefined> {
	const query = knex
		.select(USER_COLUMNS)
		.from(DbTable.USERS)
		.where({email});

	const {rows: [row]} = await dbManager.executeReadQuery(query.toString());
	return row;
}

async function createUser(params: CreateUserParams = {}): Promise<{
	user: User,
	authToken: string
}> {
	const query = knex(DbTable.USERS)
		.insert({
			email: params.email || faker.internet.email(),
			verified_code: params.verifiedCode || String(faker.random.number()),
			verified: params.verified
		})
		.returning([
			'id',
			'email',
			'verified_code as verifiedCode',
			'created_at as createdAt',
			'updated_at as updatedAt',
			'verified'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return {
		user: row,
		authToken: AuthToken.encode({
			email: row.email,
			verifiedCode: row.verifiedCode
		})
	};
}

// ####################################################################################################################

interface UserCard {
	id: DBTableUserCard.Schema['id'];
	userId: DBTableUserCard.Schema['user_id'];
	publicId: DBTableUserCard.Schema['public_id'];
	cityId: DBTableUserCard.Schema['city_id'];
	contacts: DBTableUserCard.Schema['contacts'];
	name: DBTableUserCard.Schema['name'];
	description: DBTableUserCard.Schema['description'];
	farmType: DBTableUserCard.Schema['farm_type'];
	address: DBTableUserCard.Schema['address'];
	createdAt: DBTableUserCard.Schema['created_at'];
	updatedAt: DBTableUserCard.Schema['updated_at'];
}

interface CreateUserCardParams {
	cityId: number;
	userId: number;
	farmType: FarmType;
}

async function getAllUserCards(): Promise<UserCard[]> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('city_id as "cityId"'),
			knex.raw('user_id as "userId"'),
			knex.raw('public_id as "publicId"'),
			knex.raw('contacts'),
			knex.raw('name'),
			knex.raw('description'),
			knex.raw('farm_type as "farmType"'),
			knex.raw('address'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('updated_at as "updatedAt"')
		])
		.from(DbTable.USER_CARD);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function createUserCard(params: CreateUserCardParams): Promise<UserCard> {
	const query = knex(DbTable.USER_CARD)
		.insert({
			city_id: params.cityId,
	        contacts: JSON.stringify({
				email: faker.internet.email(),
				phone: faker.phone.phoneNumber()
			}),
			farm_type: params.farmType,
			user_id: params.userId,
	        name: faker.company.companyName(),
	        description: faker.company.catchPhrase(),
			address: faker.address.streetAddress()
		})
		.returning([
			'id',
			'city_id as cityId',
			'user_id as userId',
			'public_id as publicId',
			'contacts',
			'name',
			'description',
			'farm_type as farmType',
			'address',
			'created_at as createdAt',
			'updated_at as updatedAt'
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

interface CreateAnimalAdParams {
	breedId: number;
	ownerId: number;
	isArchive?: boolean;
	isBasicVaccinations?: boolean;
}

interface AnimalAd {
	id: DBTableAnimalAd.Schema['id'];
	publicId: DBTableAnimalAd.Schema['public_id'];
	animalBreedId: DBTableAnimalAd.Schema['animal_breed_id'];
	sex: DBTableAnimalAd.Schema['sex'];
	cost: DBTableAnimalAd.Schema['cost'];
	name: DBTableAnimalAd.Schema['name'];
	description: DBTableAnimalAd.Schema['description'];
	documents: DBTableAnimalAd.Schema['documents'];
	isArchive: DBTableAnimalAd.Schema['is_archive'];
	isBasicVaccinations: DBTableAnimalAd.Schema['is_basic_vaccinations'];
	viewsCount: DBTableAnimalAd.Schema['views_count'];
	ownerId: DBTableAnimalAd.Schema['owner_id'];
	createdAt: DBTableAnimalAd.Schema['created_at'];
	updatedAt: DBTableAnimalAd.Schema['updated_at'];
}

async function getAllAnimalAds(): Promise<AnimalAd[]> {
	const query = knex
		.select([
			knex.raw('id'),
			knex.raw('public_id as "publicId"'),
			knex.raw('animal_breed_id as "animalBreedId"'),
			knex.raw('sex'),
			knex.raw('cost'),
			knex.raw('name'),
			knex.raw('description'),
			knex.raw('is_archive as "isArchive"'),
			knex.raw('is_basic_vaccinations as "isBasicVaccinations"'),
			knex.raw('documents'),
			knex.raw('views_count as "viewsCount"'),
			knex.raw('owner_id as "ownerId"'),
			knex.raw('created_at as "createdAt"'),
			knex.raw('updated_at as "updatedAt"')
		])
		.from(DbTable.ANIMAL_AD);

	const {rows} = await dbManager.executeReadQuery(query.toString());
	return rows;
}

async function createAnimalAd(params: CreateAnimalAdParams): Promise<AnimalAd> {
	const {
		breedId, ownerId, isBasicVaccinations, isArchive
	} = params;

	const query = knex(DbTable.ANIMAL_AD)
		.insert({
			animal_breed_id: breedId,
			sex: faker.random.boolean(),
			cost: faker.commerce.price(),
			name: faker.company.companyName(),
			description: faker.company.catchPhrase(),
			is_archive: 'isArchive' in params ? isArchive : false,
			is_basic_vaccinations: 'isBasicVaccinations' in params ? isBasicVaccinations : false,
			owner_id: ownerId
		})
		.returning([
			'id',
			'public_id as publicId',
			'animal_breed_id as animalBreedId',
			'sex',
			'cost',
			'name',
			'description',
			'is_archive as isArchive',
			'is_basic_vaccinations as isBasicVaccinations',
			'documents',
			'views_count as viewsCount',
			'owner_id as ownerId',
			'created_at as createdAt',
			'updated_at as updatedAt'
		]);

	const {rows: [row]} = await dbManager.executeModifyQuery(query.toString());
	return row;
}

// ####################################################################################################################

export const TestFactory = {
	createUser,
	getUserByEmail,
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
	createUserCard,
	getAllUserCards,
	// ----
	createAnimalAd,
	getAllAnimalAds
};
