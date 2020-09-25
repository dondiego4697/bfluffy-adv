import {postRequest} from 'client/lib/request';

interface CreateAdResponse {
    publicId: string;
}

export interface CreateAdParams {
    name: string;
    animalBreedCode: string;
    cityCode: string;
    imageUrls: string[];
    documents: {
        vetPassport?: boolean;
        genericMark?: boolean;
        pedigree?: boolean;
        contractOfSale?: boolean;
        withoutDocuments?: boolean;
    };
    price: number;
    sex?: boolean;
    description?: string;
    address?: string;
    isBasicVaccinations?: boolean;
}

async function createAd(params: CreateAdParams) {
    const {
        name,
        description,
        address,
        cityCode,
        animalBreedCode,
        imageUrls,
        documents,
        sex,
        isBasicVaccinations,
        price
    } = params;

    return postRequest<CreateAdResponse>(
        '/api/v1/edit/animal_ad/create',
        {
            name,
            description,
            address,
            animalBreedCode,
            cityCode,
            imageUrls,
            documents,
            sex,
            isBasicVaccinations,
            cost: price
        },
        {
            responseType: 'json'
        }
    );
}

// async function updateFarm(publicId: string, params: CreateFarmParams) {
//     const {cityCode, contacts, name, description, address} = params;

//     return postRequest<CreateFarmResponse>(
//         '/api/v1/farm/update',
//         {
//             cityCode,
//             contacts,
//             name,
//             description,
//             address
//         },
//         {
//             responseType: 'json',
//             params: {publicId}
//         }
//     );
// }

export const AdRequestBookV1 = {
    createAd
};
