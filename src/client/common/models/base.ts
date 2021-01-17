import {uiModel} from 'common/models';

export class BasePageModel {
    public setLoading() {
        uiModel.showSpinner();
    }

    public setReady() {
        uiModel.destroySpinner();
    }
}
