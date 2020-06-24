import {postRequest} from 'client/lib/request';

interface CreateFarmResponse {
	publicId: string;
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

export const FarmRequestBookV1 = {
	createFarm
};
