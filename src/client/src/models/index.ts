import {ClientDataModel} from 'client/models/client-data';
import {FarmEditModel} from 'client/models/farm/edit';
import {GeoModel} from 'client/models/geo';
import {CabinetPageModel} from 'client/models/cabinet';
import {AnimalModel} from 'client/models/animal';

export const clientDataModel = new ClientDataModel();
export const geoModel = new GeoModel();
export const animalModel = new AnimalModel();

export const farmEditModel = new FarmEditModel();
export const cabinetPageModel = new CabinetPageModel();
