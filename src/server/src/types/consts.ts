export enum FarmType {
    FARM = 'farm', // питомник
    BREEDER = 'breeder', // частный разводчик
    SHELTER = 'shelter', // приют
    SHOP = 'shop' // магазин
}

export enum DbTable {
    ALEMBIC_VERSION = 'alembic_version',
    USERS = 'users',
    USER_CARD = 'user_card',
    ANIMAL_CATEGORY = 'animal_category',
    ANIMAL_BREED = 'animal_breed',
    CITY = 'city',
    REGION = 'region',
    ANIMAL_AD = 'animal_ad'
}

export enum ClientStatusCode {
    USER_EMAIL_EXIST = 'USER_EMAIL_EXIST',
    USER_NOT_EXIST = 'USER_NOT_EXIST',
    USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
    USER_INVALID_TOKEN = 'USER_INVALID_TOKEN',
    USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED',
    USER_CARD_FORBIDDEN = 'USER_CARD_FORBIDDEN',
    ANIMAL_AD_FORBIDDEN = 'ANIMAL_AD_FORBIDDEN',
    USER_WRONG_VERIFIED_CODE = 'USER_WRONG_VERIFIED_CODE'
}
