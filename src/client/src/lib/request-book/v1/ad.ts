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

interface UploadImageResponse {
    url: string;
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

export interface AdInfo {
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

export interface AdItem {
    publicId: string;
    cost: number;
    sex: boolean;
    name: string;
    description?: string;
    address?: string;
    documents: Documents;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    animalBreedDisplayName: string;
    cityDisplayName: string;
    animalCategoryDisplayName: string;
    imageUrls: string[];
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

async function getUserAd(publicId: string) {
    return getRequest<AdInfo>('/api/v1/edit/animal_ad/info', {
        params: {publicId},
        responseType: 'json'
    });
}

async function getUserAds() {
    return getRequest<AdItem[]>('/api/v1/edit/animal_ad/list', {
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

async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return postRequest<UploadImageResponse>('/api/v1/edit/s3_storage/upload_ad_image', formData, {
        responseType: 'json',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const AdRequestBookV1 = {
    createAd,
    getUserAd,
    getUserAds,
    updateAd,
    uploadImage
};
