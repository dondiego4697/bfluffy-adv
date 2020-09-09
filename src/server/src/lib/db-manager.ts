import {ClientValue, ClientCallback, PgClient, PgClientConfig} from 'server/lib/pg-client';
import {types} from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import {logger} from 'server/lib/logger';
import {config} from 'server/config';

function parseDbInt8(value: any) {
    return value === null ? null : parseInt(value, 10);
}
types.setTypeParser(types.builtins.INT8, parseDbInt8);

export class DBManager {
    private dbClient: PgClient;

    constructor(dbClient: PgClient) {
        this.dbClient = dbClient;
    }

    async executeReadQuery(query: ClientValue) {
        const result = await this.dbClient.executeReadQuery(query);
        return result.data;
    }

    async executeReadCallback<T>(query: ClientCallback<T>) {
        const result = await this.dbClient.executeReadCallback(query);
        return result.data;
    }

    async executeModifyQuery(query: ClientValue) {
        const result = await this.dbClient.executeWriteQuery(query);
        return result.data;
    }

    async executeModifyCallback<T>(query: ClientCallback<T>) {
        const result = await this.dbClient.executeWriteCallback(query);
        return result.data;
    }

    async executeInTransaction<T>(callback: ClientCallback<T>) {
        const result = await this.dbClient.executeWriteCallback(callback);
        return result.data;
    }

    async forceCloseConnection() {
        await this.dbClient.terminate();
    }
}

const dbClientConfig: PgClientConfig = {
    pgPoolSettings: {
        user: config['db.user'],
        password: config['db.password'],
        database: config['db.database'],
        port: config['db.port'],
        connectionTimeoutMillis: config['db.poolSettings.connectionTimeoutMillis'],
        max: config['db.poolSettings.max'],
        idleTimeoutMillis: config['db.poolSettings.idleTimeoutMillis'],
        ssl: config['db.useCert']
            ? {
                  cert: fs.readFileSync(path.resolve('src/resources/db/db.crt')).toString()
              }
            : undefined
    },
    hosts: config['db.hosts'],
    dbErrorHandler
};

function dbErrorHandler(error: Error): void {
    logger.error(`[DB] CONNECTION ERROR: ${error.message}`);
}

const dbClient = new PgClient(dbClientConfig);
export const dbManager = new DBManager(dbClient);
