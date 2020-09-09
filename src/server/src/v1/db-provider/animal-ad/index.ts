import {createAnimalAd} from 'server/v1/db-provider/animal-ad/api/create-animal-ad';
import {getAnimalAdByPublicId} from 'server/v1/db-provider/animal-ad/api/get-animal-ad-by-public-id';
import {updateAnimalAd} from 'server/v1/db-provider/animal-ad/api/update-animal-ad';

export const AnimalAdDbProvider = {
    createAnimalAd,
    getAnimalAdByPublicId,
    updateAnimalAd
};
