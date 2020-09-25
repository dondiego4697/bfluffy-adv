export const NEW_ITEM = 'new';

export enum FieldErrors {
    REQUIRED = 'Обязательное поле',
    WRONG_EMAIL = 'Некорректный email',
    MIN_NUMBER = 'Больше или равно ${min}'
}

function isValidEmail(email: string) {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validateEmail(email?: string): string | undefined {
    if (!email) {
        return FieldErrors.REQUIRED;
    } else if (!isValidEmail(email)) {
        return FieldErrors.WRONG_EMAIL;
    }
}
