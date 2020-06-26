import {postRequest, getRequest} from 'client/lib/request';

interface CreateFarmResponse {
	publicId: string;
}

export interface FarmInfoResponse {
	contacts: {
		phone?: string;
		email: string;
	};
	name: string;
	description: string;
	address: string;
	rating: number;
	createdAt: string;
	updatedAt: string;
	farmPublicId: string;
	cityCode: string;
}

export interface CreateFarmParams {
    cityCode: string;
	contacts?: {
        email?: string;
        phone?: string;
    };
	name: string;
	description?: string;
	address: string;
}

async function createFarm(params: CreateFarmParams) {
	const {
		cityCode, contacts, name, description, address
	} = params;

	return postRequest<CreateFarmResponse>(
		'/api/v1/farm/create',
		{
			cityCode,
			contacts,
			name,
			description,
			address
		},
		{
			responseType: 'json'
		}
	);
}

async function updateFarm(publicId: string, params: CreateFarmParams) {
	const {
		cityCode, contacts, name, description, address
	} = params;

	return postRequest<CreateFarmResponse>(
		'/api/v1/farm/update',
		{
			cityCode,
			contacts,
			name,
			description,
			address
		},
		{
			responseType: 'json',
			params: {publicId}
		}
	);
}

async function deleteFarm(publicId: string) {
	return postRequest<CreateFarmResponse>(
		'/api/v1/farm/delete',
		{
			publicId
		},
		{
			responseType: 'json'
		}
	);
}

async function getFarmInfo(publicId: string) {
	return getRequest<FarmInfoResponse>(
		'/api/v1/farm/info',
		{
			params: {publicId},
			responseType: 'json'
		}
	);
}

export const FarmRequestBookV1 = {
	createFarm,
	updateFarm,
	deleteFarm,
	getFarmInfo
};
