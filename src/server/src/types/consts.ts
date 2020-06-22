export enum SignUpType {
    GOOGLE = 'google',
    YANDEX = 'yandex',
    MAILRU = 'mailru',
    EMAIL = 'email'
}

export enum DbTable {
    ALEMBIC_VERSION = 'alembic_version',
    USERS = 'users',
    ANIMAL_CATEGORY = 'animal_category',
    ANIMAL_BREED = 'animal_breed',
    CITY = 'city',
    REGION = 'region',
}

export enum ClientStatusCode {
    USER_EMAIL_EXIST = 'USER_EMAIL_EXIST',
    USER_NOT_EXIST = 'USER_NOT_EXIST',
    USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
    USER_INVALID_TOKEN = 'USER_INVALID_TOKEN'
}
