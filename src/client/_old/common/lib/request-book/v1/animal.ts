import {getRequest} from 'common/lib/request';

export interface AnimalBreed {
    breedCode: string;
    breedDisplayName: string;
    categoryCode: string;
    categoryDisplayName: string;
}

async function getBreedList() {
    return getRequest<AnimalBreed[]>('/api/v1/public/animal/breed_list', {
        responseType: 'json'
    });
}

export const AnimalRequestBookV1 = {
    getBreedList
};
