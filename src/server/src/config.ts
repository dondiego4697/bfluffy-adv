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
	'host.app': string;
	'email.mock': boolean;
	'email.enable': boolean;
	'email.login': string;
	'email.password': string;
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
	'auth.privateKey': process.env.AUTH_PRIVATE_KEY!,
	'email.mock': false,
	'email.enable': true,
	'email.login': '',
	'email.password': process.env.EMAIL_PASSWORD!,
	'host.app': 'unknown'
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
	'host.app': 'http://localhost:8080',
	'email.login': 'testmock@mail.ru',
	'email.mock': true
};

const tests: Config = {
	...development,
	'db.database': 'petstore_test',
	'db.password': 'password',
	'db.user': 'postgres',
	'auth.privateKey': 'some_value',
	'email.password': 'password',
	'email.enable': false
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

assert(config, `There is no configuration for environment "${env}"`);

assert(config['db.user'], 'There is no db user');
assert(config['db.password'], 'There is no db password');
assert(config['db.database'], 'There is no db database');

assert(config['auth.privateKey'], 'There is no auth private key');

assert(config['email.password'], 'There is no email password');
