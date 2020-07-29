import {FarmType} from 'server/types/consts';

export namespace DBTableUserCard {

    export interface FieldContacts {
        phone?: string;
        email?: string;
    }

    export interface Schema {
        id: number;
        public_id: string;
        user_id: number;
        city_id: number;
        contacts: FieldContacts;
        farm_type: FarmType;
        name: string;
        description?: string;
        address?: string;
        owner_id: number;
        created_at: Date;
        updated_at: Date;
    }
}
