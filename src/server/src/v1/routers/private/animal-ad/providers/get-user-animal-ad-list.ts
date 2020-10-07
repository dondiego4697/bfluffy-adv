import * as moment from 'moment';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {AnimalAdDbProvider} from 'server/v1/db-provider/animal-ad';

export const getUserAnimalAdList = wrap<Request, Response>(async (req, res) => {
    const animalAds = await AnimalAdDbProvider.getAnimalAdByOwnerId(req.userData.id);

    moment.locale('ru');
    res.json(
        animalAds.map((item) => ({
            publicId: item.publicId,
            cost: item.cost,
            sex: item.sex,
            title: item.title,
            description: item.description,
            address: item.address,
            documents: item.documents,
            viewsCount: item.viewsCount,
            createdAt: item.createdAt,
            updatedAt: moment(item.updatedAt).startOf('day').fromNow(),
            animalBreedDisplayName: item.animalBreedDisplayName,
            cityDisplayName: item.cityDisplayName,
            animalCategoryDisplayName: item.animalCategoryDisplayName,
            imageUrls: item.imageUrls.filter(Boolean)
        }))
    );
});
