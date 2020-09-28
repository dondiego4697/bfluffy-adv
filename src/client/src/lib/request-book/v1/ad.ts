import {postRequest, getRequest} from 'client/lib/request';

interface CreateAdResponse {
    publicId: string;
}

interface Documents {
    vetPassport?: boolean;
    genericMark?: boolean;
    pedigree?: boolean;
    contractOfSale?: boolean;
    withoutDocuments?: boolean;
}

export interface CreateAdParams {
    name: string;
    animalBreedCode: string;
    cityCode: string;
    imageUrls: string[];
    documents: Documents;
    price: number;
    sex?: boolean;
    description?: string;
    address?: string;
    isBasicVaccinations?: boolean;
}

export interface AdInfoResponse {
    cost: number;
    sex: boolean;
    name: string;
    description?: string;
    address?: string;
    documents: Documents;
    imageUrls: string[];
    animalBreedCode: string;
    animalCategoryCode: string;
    cityCode: string;
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

async function getAd(publicId: string) {
    return getRequest<AdInfoResponse>('/api/v1/edit/animal_ad/info', {
        params: {publicId},
        responseType: 'json'
    });
}

async function updateAd(publicId: string, params: CreateAdParams) {
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
        '/api/v1/edit/animal_ad/update',
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
            responseType: 'json',
            params: {publicId}
        }
    );
}

export const AdRequestBookV1 = {
    createAd,
    getAd,
    updateAd
};
