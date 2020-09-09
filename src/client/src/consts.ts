import {RuleObject} from 'rc-field-form/lib/interface';

export interface Meta {
    limit: number;
    offset: number;
    total: number;
}

export enum DataState {
    LOADING = 'loading',
    READY = 'ready'
}

export const NEW_ITEM = 'new';

export const FORM_VALIDATE_MESSAGES = {
    required: 'Обязательное поле',
    types: {
        email: 'Невалидный email'
    }
};

export const FORM_ITEM_REQUIRED: RuleObject = {
    required: true
};

export const FORM_EMAIL_REQUIRED: RuleObject = {
    required: true,
    type: 'email'
};
