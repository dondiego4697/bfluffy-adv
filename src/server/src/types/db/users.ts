export namespace DBTableUsers {

    export interface Schema {
        id: number;
        email: string;
        verified_code: string;
        verified: boolean;
        created_at: Date;
        updated_at: Date;
    }
}
