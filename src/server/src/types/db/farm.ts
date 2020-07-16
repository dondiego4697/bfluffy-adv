import {FarmType} from 'server/types/consts';

export namespace DBTableFarm {

    export interface FieldContacts {
        phone?: string;
        email?: string;
    }

    export interface Schema {
        id: number;
        city_id: number;
        contacts: FieldContacts;
        name: string;
        type: FarmType;
        description?: string;
        owner_id: number;
        address: string;
        rating: number;
        is_archive: boolean;
        created_at: Date;
        updated_at: Date;
        public_id: string;
    }
}
