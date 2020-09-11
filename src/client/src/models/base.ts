import {uiGlobal} from 'client/models';

export class BasePageModel {
    public setLoading() {
        uiGlobal.showSpinner();
    }

    public setReady() {
        uiGlobal.destroySpinner();
    }
}
