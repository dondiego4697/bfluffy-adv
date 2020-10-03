import {ClientDataModel} from 'client/models/client-data';
import {AdEditPageModel} from 'client/models/ad/edit';
import {GeoModel} from 'client/models/geo';
import {AnimalModel} from 'client/models/animal';
import {UIGlobal} from 'client/models/ui-global';

export const uiGlobal = new UIGlobal();

export const clientDataModel = new ClientDataModel();
export const geoModel = new GeoModel();
export const animalModel = new AnimalModel();

export const adEditPageModel = new AdEditPageModel();
