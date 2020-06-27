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
        description?: string;
        owner_id: number;
        address: string;
        rating: number;
        archive: boolean;
        created_at: Date;
        updated_at: Date;
        public_id: string;
    }
}
