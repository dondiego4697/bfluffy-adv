export namespace DBTableUsers {

    export interface FieldContacts {
        phone?: string;
        email?: string;
    }

    export interface Schema {
        id: number;
        email: string;
        verified_code: string;
        verified: boolean;
        avatar?: string;
        name?: string;
        contacts: FieldContacts;
        created_at: Date;
        updated_at: Date;
    }
}
