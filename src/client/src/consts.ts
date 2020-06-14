export interface Meta {
    limit: number;
    offset: number;
    total: number;
}

export enum DataState {
    LOADING = 'loading',
    READY = 'ready'
}

export const NEW_ITEM = 'new';
