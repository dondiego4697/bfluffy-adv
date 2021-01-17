export enum FarmType {
    FARM = 'farm', // питомник
    BREEDER = 'breeder', // частный разводчик
    SHELTER = 'shelter', // приют
    SHOP = 'shop' // магазин
}

export enum DbTable {
    ALEMBIC_VERSION = 'alembic_version',
    USERS = 'users',
    ANIMAL_CATEGORY = 'animal_category',
    ANIMAL_BREED = 'animal_breed',
    CITY = 'city',
    REGION = 'region',
    ANIMAL_AD = 'animal_ad',
    ANIMAL_AD_GALLARY = 'animal_ad_gallery'
}

export enum ClientStatusCode {
    USER_EMAIL_EXIST = 'USER_EMAIL_EXIST',
    USER_NOT_EXIST = 'USER_NOT_EXIST',
    USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
    USER_INVALID_TOKEN = 'USER_INVALID_TOKEN',
    USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED',
    USER_INFO_FORBIDDEN = 'USER_INFO_FORBIDDEN',
    ANIMAL_AD_FORBIDDEN = 'ANIMAL_AD_FORBIDDEN',
    USER_WRONG_VERIFIED_CODE = 'USER_WRONG_VERIFIED_CODE'
}
