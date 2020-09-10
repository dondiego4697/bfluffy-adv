import {createAnimalAd} from 'server/v1/db-provider/animal-ad/api/create-animal-ad';
import {getAnimalAdByPublicId} from 'server/v1/db-provider/animal-ad/api/get-animal-ad-by-public-id';
import {getAnimalAdImages} from 'server/v1/db-provider/animal-ad/api/get-animal-ad-images';
import {updateAnimalAd} from 'server/v1/db-provider/animal-ad/api/update-animal-ad';
import {updateAnimalAdImages} from 'server/v1/db-provider/animal-ad/api/update-animal-ad-images';

export const AnimalAdDbProvider = {
    createAnimalAd,
    getAnimalAdByPublicId,
    updateAnimalAd,
    getAnimalAdImages,
    updateAnimalAdImages
};
