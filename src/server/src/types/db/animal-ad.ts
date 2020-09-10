export namespace DBTableAnimalAd {
    export interface FieldDocuments {
        vetPassport?: boolean; // ветеринарный паспорт
        genericMark?: boolean; // родовая метка
        pedigree?: boolean; // родословная
        contractOfSale?: boolean; // договор купли продажи
        withoutDocuments?: boolean; // без документов
    }

    export interface Schema {
        id: number;
        public_id: string;
        animal_breed_id: number;
        sex: boolean;
        cost: number;
        name: string;
        description?: string;
        address?: string;
        is_archive: boolean;
        is_basic_vaccinations: boolean;
        documents: FieldDocuments;
        views_count: number;
        owner_id: number;
        created_at: Date;
        updated_at: Date;
    }
}

export namespace DBTableAnimalAdGallary {
    export interface Schema {
        animal_ad_id: number;
        url: string;
    }
}
