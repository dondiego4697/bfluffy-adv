import {ClientDataModel} from 'client/models/client-data';
import {AdEditPageModel} from 'client/models/ad/edit';
import {GeoModel} from 'client/models/geo';
import {UserCabinetPageModel} from 'client/models/user-cabinet';
import {AnimalModel} from 'client/models/animal';
import {UIModalMessage} from 'client/models/ui-modal-message';
import {UIGlobal} from 'client/models/ui-global';

export const clientDataModel = new ClientDataModel();
export const geoModel = new GeoModel();
export const animalModel = new AnimalModel();

export const adEditPageModel = new AdEditPageModel();
export const userCabinetPageModel = new UserCabinetPageModel();

export const uiModalMessage = new UIModalMessage();
export const uiGlobal = new UIGlobal();
