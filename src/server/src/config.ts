/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as assert from 'assert';

export interface Config {
    'logger.colorize': boolean;
    'logger.level': string;
    'db.pingTimeoutMs': number;
    'db.useCert': boolean;
    'db.user': string;
    'db.password': string;
    'db.database': string;
    'db.port': number;
    'db.hosts': string[];
    'db.poolSettings.connectionTimeoutMillis': number;
    'db.poolSettings.max': number;
    'db.poolSettings.idleTimeoutMillis': number;
}

const production: Config = {
	'logger.colorize': false,
	'logger.level': 'info',
	'db.pingTimeoutMs': 1_000 * 2, // 2s
	'db.useCert': true,
	'db.user': process.env.DB_USER!,
	'db.password': process.env.DB_PASSWORD!,
	'db.database': process.env.DB_DATABASE!,
	'db.port': 6432,
	'db.poolSettings.connectionTimeoutMillis': 1_000 * 10, // 10s
	'db.poolSettings.max': 16,
	'db.poolSettings.idleTimeoutMillis': 1_000 * 60 * 60 * 2, // 2h
	'db.hosts': [],
};

const testing: Config = {
	...production,
};

const development: Config = {
	...testing,
	'logger.colorize': true,
	'logger.level': 'silly',
	'db.hosts': ['localhost'],
	'db.useCert': false
};

const configs = new Map<string, Readonly<Config>>([
	['production', production],
	['testing', testing],
	['development', development],
]);

const env = process.env.ENVIRONMENT || 'development';
const configForEnv = configs.get(env);
export const config = configForEnv!;

assert(config, `There is no configuration for environment "${env}"`);
