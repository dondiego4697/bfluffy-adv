export enum SignUpType {
    GOOGLE = 'google',
    YANDEX = 'yandex',
    MAILRU = 'mailru',
    EMAIL = 'email'
}

export enum FarmType {
    FARM = 'farm',
    BREEDER = 'breeder',
    SHOP = 'shop'
}


export enum DbTable {
    ALEMBIC_VERSION = 'alembic_version',
    USERS = 'users',
    ANIMAL_CATEGORY = 'animal_category',
    ANIMAL_BREED = 'animal_breed',
    CITY = 'city',
    REGION = 'region',
    FARM = 'farm',
    ANIMAL_AD = 'animal_ad',
    ANIMAL_AD_GALLERY = 'animal_ad_gallery',
    ANIMAL_DOCUMENT = 'animal_document',
    ANIMAL_AD_DOCUMENT = 'animal_ad_document'
}

export enum ClientStatusCode {
    USER_EMAIL_EXIST = 'USER_EMAIL_EXIST',
    USER_NOT_EXIST = 'USER_NOT_EXIST',
    USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
    USER_INVALID_TOKEN = 'USER_INVALID_TOKEN',
    USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED',
    EDIT_FARM_FORBIDDEN = 'EDIT_FARM_FORBIDDEN'
}
