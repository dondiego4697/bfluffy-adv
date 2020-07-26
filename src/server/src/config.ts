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
	'auth.privateKey': string;
	'auth.token.ttl': number;
	'host.app': string;
	'email.mock': boolean;
	'email.enable': boolean;
	'email.login': string;
	'email.password': string;
	'client.bundlesRootFolder': string;
	'emulation.request': boolean;
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
	'db.poolSettings.connectionTimeoutMillis': 1000 * 10, // 10s
	'db.poolSettings.max': 16,
	'db.poolSettings.idleTimeoutMillis': 1000 * 60 * 60 * 2, // 2h
	'db.hosts': [],
	'auth.token.ttl': 24 * 3600 * 1000, // 24h
	'auth.privateKey': process.env.AUTH_PRIVATE_KEY!,
	'email.mock': false,
	'email.enable': true,
	'email.login': 'be.fluffy@yandex.ru',
	'email.password': process.env.EMAIL_PASSWORD!,
	'host.app': 'TODO',
	'client.bundlesRootFolder': '/bundles/',
	'emulation.request': false
};

const testing: Config = {
	...production,
};

const development: Config = {
	...testing,
	'logger.colorize': true,
	'logger.level': 'silly',
	'db.hosts': ['localhost'],
	'db.useCert': false,
	'auth.token.ttl': 10 * 60 * 1000, // 10m
	'host.app': 'http://localhost:8080',
	'emulation.request': true
};

const tests: Config = {
	...development,
	'db.database': 'petstore_test',
	'db.password': 'password',
	'db.user': 'postgres',
	'auth.privateKey': 'some_value',
	'email.password': 'password',
	'email.enable': false,
	'emulation.request': false
};

const configs = new Map<string, Readonly<Config>>([
	['production', production],
	['testing', testing],
	['development', development],
	['tests', tests]
]);

const env = process.env.ENVIRONMENT || 'development';
const configForEnv = configs.get(env);
export const config = configForEnv!;

assert(config, `there is no configuration for environment "${env}"`);

assert(config['db.user'], 'there is no db user');
assert(config['db.password'], 'there is no db password');
assert(config['db.database'], 'there is no db database');

assert(config['auth.privateKey'], 'there is no auth private key');

assert(config['email.password'], 'there is no email password');
