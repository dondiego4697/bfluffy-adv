/* eslint-disable @typescript-eslint/no-non-null-assertion,
	max-classes-per-file,no-underscore-dangle,
	prefer-promise-reject-errors,no-param-reassign,no-await-in-loop,
	no-restricted-syntax
*/
import * as pg from 'pg';
import * as events from 'events';

const QUERY_INFO_REPLICA = 'SELECT pg_is_in_recovery()';
const FAIL_COUNT_LIMIT = 1;
const TIME_CHECK_POOL = 3000;
const MAX_EXECUTE_TIME = 3000;

interface PgClientConfig {
    pgPoolSettings: pg.PoolConfig;
    settings?: Settings;
    hosts: string[];
    checkPoolInterval?: number;
    dbErrorHandler: (error: Error) => void;
}

interface Settings {
    failCountLimit: number;
    checkPoolTime: number;
    maxExecuteTime: number;
}

interface ExecuteResult<T> {
    data: T;
    connectionTime: number;
    executeTime: number;
}

interface PoolInfo {
    pool?: pg.Pool;
    host: string;
    executeTime: number;
    failCount: number;
    isMaster: boolean;
    isFastest: boolean;
}

enum EventType {
    INITIALIZED = 'initialized'
}

declare type ClientCallback<T> = (client: pg.PoolClient) => Promise<T>;
declare type ClientValue = string | pg.QueryConfig;
declare type ClientResult = pg.QueryResult;
declare type EventCallback = () => void;
declare type ErrorHandler = (error: Error) => void;

enum DbErrorType {
    DB_ERROR = 'db-error',
    NO_POOL = 'no-pool',
    POOL_ERROR = 'pool-error'
}

export class PgClientError extends Error {
    type: DbErrorType;

    constructor(type: DbErrorType, message: string) {
        super(message);
        this.type = type;
        this.name = new.target.name;
        Error.captureStackTrace(this, new.target);
    }
}

class PgClient {
    private _isInitialized = false;

    private _initializePromise: Promise<void>;

    private _eventEmitter: events.EventEmitter;

    private _pgPoolSettings: pg.PoolConfig;

    private _settings: Settings;

    private _poolsInfo: PoolInfo[] = [];

    private _isPoolsManagerActive = false;

    private _dbErrorHandler: ErrorHandler;

    private _masterPoolInfo?: PoolInfo;

    private _replicaPoolInfo?: PoolInfo;

    constructor(config: PgClientConfig) {
        this._pgPoolSettings = config.pgPoolSettings;

        this._settings = {
            failCountLimit: FAIL_COUNT_LIMIT,
            checkPoolTime: TIME_CHECK_POOL,
            maxExecuteTime: MAX_EXECUTE_TIME,
            ...(config.settings || {})
        };

        this._eventEmitter = new events.EventEmitter();
        this._initializePromise = new Promise((resolve) => {
            this._eventEmitter.on(EventType.INITIALIZED, resolve);
        });

        const hosts = [...new Set(config.hosts)];
        this._dbErrorHandler = config.dbErrorHandler;

        if (!hosts.length) {
            throw new Error('No hosts provided.');
        }

        this._poolsInfo = hosts.map((host) => ({
            host,
            executeTime: Infinity,
            failCount: 0,
            isMaster: false,
            isFastest: false
        }));
        this._isPoolsManagerActive = true;
        this._startPoolsManager();
    }

    async executeReadQuery(value: ClientValue): Promise<ExecuteResult<ClientResult>> {
        await this._assertPoolManagerIsActive();
        const replicaPoolInfo = this._replicaPoolInfo;
        if (!replicaPoolInfo || !replicaPoolInfo.pool) {
            throw new PgClientError(DbErrorType.NO_POOL, `There isn't an active pool for executeReadQuery: ${value}`);
        }
        const {pool} = replicaPoolInfo;
        const result = await execute<ClientResult>(async (client: pg.PoolClient) => client.query(value), pool);
        return result;
    }

    async executeReadCallback<T>(callback: ClientCallback<T>): Promise<ExecuteResult<T>> {
        await this._assertPoolManagerIsActive();
        const replicaPoolInfo = this._replicaPoolInfo;
        if (!replicaPoolInfo || !replicaPoolInfo.pool) {
            throw new PgClientError(
                DbErrorType.NO_POOL,
                `There isn't an active pool for executeReadCallback: ${callback}`
            );
        }
        const {pool} = replicaPoolInfo;
        const result = await execute<T>(async (client: pg.PoolClient) => callback(client), pool);
        return result;
    }

    async executeWriteQuery(value: ClientValue): Promise<ExecuteResult<ClientResult>> {
        await this._assertPoolManagerIsActive();
        const masterPoolInfo = this._masterPoolInfo;
        if (!masterPoolInfo || !masterPoolInfo.pool) {
            throw new PgClientError(DbErrorType.NO_POOL, `There isn't an active pool for executeWriteQuery: ${value}`);
        }
        const {pool} = masterPoolInfo;
        const result = await execute<ClientResult>(async (client: pg.PoolClient) => client.query(value), pool);
        return result;
    }

    async executeWriteCallback<T>(callback: ClientCallback<T>): Promise<ExecuteResult<T>> {
        await this._assertPoolManagerIsActive();
        const masterPoolInfo = this._masterPoolInfo;
        if (!masterPoolInfo || !masterPoolInfo.pool) {
            throw new PgClientError(
                DbErrorType.NO_POOL,
                `There isn't an active pool for executeWriteCallback: ${callback}`
            );
        }
        const {pool} = masterPoolInfo;
        return execute<T>(async (client: pg.PoolClient) => {
            let result;
            try {
                await client.query('BEGIN');
                result = await callback(client);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }

            return result;
        }, pool);
    }

    async _assertPoolManagerIsActive(): Promise<void> {
        await this._initializePromise;
        if (!this._isPoolsManagerActive) {
            throw new PgClientError(DbErrorType.POOL_ERROR, 'Pool manager is inactive. Cannot provide database client');
        }
    }

    async terminate(): Promise<void> {
        this._isPoolsManagerActive = false;
        const poolList: pg.Pool[] = [];

        this._poolsInfo.forEach((poolInfo) => {
            if (poolInfo.pool) {
                poolList.push(poolInfo.pool);
            }
        });

        await Promise.all(poolList.map((pool) => pool.end()));
    }

    private async _startPoolsManager(): Promise<void> {
        if (!this._isPoolsManagerActive) {
            return;
        }

        try {
            await this._managePools();

            if (!this._isInitialized) {
                this._isInitialized = true;
                this._eventEmitter.emit(EventType.INITIALIZED);
            }
        } catch (err) {
            this._dbErrorHandler(err);
        }
        await sleep(this._settings.checkPoolTime);
        this._startPoolsManager();
    }

    private async _managePools(): Promise<void> {
        for (const poolInfo of this._poolsInfo) {
            if (!poolInfo.pool) {
                poolInfo.pool = this._getNewPool(poolInfo.host);
            }

            try {
                await this._managePool(poolInfo);
                this._updateMasterAndReplicaPools();
            } catch (err) {
                poolInfo.executeTime = Infinity;
                poolInfo.failCount += 1;
                const messageError = `${err.message} => Fail count: ${poolInfo.failCount} for ${poolInfo.host}`;

                this._updateMasterAndReplicaPools();

                if (poolInfo.failCount > this._settings.failCountLimit) {
                    this._dbErrorHandler(new Error(`Pool should restart. ${messageError}`));
                    poolInfo.failCount = 0;
                    if (poolInfo.pool) {
                        this._dbErrorHandler(new Error(`Pool restart. ${messageError}`));
                        await poolInfo.pool.end();
                        poolInfo.pool = this._getNewPool(poolInfo.host);
                        this._dbErrorHandler(new Error(`Pool has restarted. ${messageError}`));
                    }
                } else {
                    this._dbErrorHandler(new Error(messageError));
                }
            }
        }
    }

    private _getNewPool(host: string): pg.Pool {
        const newPool = new pg.Pool({
            ...this._pgPoolSettings,
            host
        });

        newPool.on('error', (err) => {
            const messageError = (err && err.message) || 'unknown db error';
            this._dbErrorHandler(new PgClientError(DbErrorType.DB_ERROR, messageError));
        });

        return newPool;
    }

    private _managePool(poolInfo: PoolInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            let isReject = false;
            /* Additional time check */
            const timerCheckExecute = setTimeout(() => {
                isReject = true;
                clearTimeout(timerCheckExecute);
                reject({message: 'Long request.'});
            }, this._settings.maxExecuteTime);

            execute<ClientResult>(async (client: pg.PoolClient) => client.query(QUERY_INFO_REPLICA), poolInfo.pool!)
                .then(({data, executeTime}) => {
                    clearTimeout(timerCheckExecute);
                    if (isReject) {
                        return;
                    }

                    const isReplica = data && data.rows[0].pg_is_in_recovery;
                    poolInfo.isMaster = !isReplica;
                    poolInfo.executeTime = executeTime;
                    poolInfo.failCount = 0;
                    resolve();
                })
                .catch(() => {
                    isReject = true;
                    clearTimeout(timerCheckExecute);
                    reject({message: 'Long request.'});
                });
        });
    }

    private _updateMasterAndReplicaPools() {
        // Set Master pool
        this._masterPoolInfo = this._poolsInfo.find((poolInfo) => poolInfo.isMaster);

        // Set Replica pool
        const sizePoolsInfo = this._poolsInfo.length;
        let fastestExecuteTime = Infinity;
        let newReplicaPool: PoolInfo | undefined;

        for (let i = 0; i < sizePoolsInfo; i++) {
            const poolInfo = this._poolsInfo[i];
            if (poolInfo.executeTime <= fastestExecuteTime) {
                fastestExecuteTime = poolInfo.executeTime;
                newReplicaPool = poolInfo;
            }
        }

        this._replicaPoolInfo = newReplicaPool;
    }
}

async function execute<T>(callback: ClientCallback<T>, pool: pg.Pool): Promise<ExecuteResult<T>> {
    let client;
    let data;

    let time = Date.now();
    let connectionTime = Infinity;
    let executeTime = Infinity;

    try {
        client = await pool.connect();
        connectionTime = Date.now() - time;
        time = Date.now();
        data = await callback(client);
        executeTime = Date.now() - time;
    } finally {
        if (client) {
            client.release();
        }
    }

    return {
        data,
        connectionTime,
        executeTime
    };
}

async function sleep(time: number): Promise<void> {
    await new Promise((resolve) => setTimeout(() => resolve(), time));
}

export {PgClient, PgClientConfig, ClientCallback, ClientValue, ClientResult, ExecuteResult, EventType, EventCallback};
