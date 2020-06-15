import {SignUpType} from 'server/types/consts';

export namespace DBTableUsers {
    export interface Schema {
        id: number;
        email: string;
        display_name: string;
        password: string;
        sign_up_type: SignUpType;
        created_at: Date;
        verified: boolean;
    }
}
