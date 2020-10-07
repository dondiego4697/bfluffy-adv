import * as Yup from 'yup';

export const NEW_ITEM = 'new';

export enum FieldErrors {
    REQUIRED = 'Обязательное поле',
    WRONG_EMAIL = 'Некорректный email',
    MIN_NUMBER = 'Больше или равно ${min}'
}

export const YupLocaleObject: Yup.LocaleObject = {
    mixed: {
        required: FieldErrors.REQUIRED
    },
    number: {
        min: FieldErrors.MIN_NUMBER
    },
    string: {
        email: FieldErrors.WRONG_EMAIL
    }
};
