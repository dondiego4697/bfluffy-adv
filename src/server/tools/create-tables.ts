/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();

import * as Knex from 'knex';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import {sortBy} from 'lodash';
import {dbManager} from 'server/lib/db-manager';
import {logger} from 'server/lib/logger';
import {DbTable} from 'server/types/consts';

interface Version {
    current?: string;
    next: string;
}

interface SqlByVersion {
    version: string;
    cmd: string[];
}

const TABLE_ALEMBIC_VERSION = DbTable.ALEMBIC_VERSION;

const knex = Knex({client: 'pg'});
const queryAlembicVersion = knex
	.select({version: 'version_num'})
	.from(TABLE_ALEMBIC_VERSION);

async function createTables() {
	logger.info(`ENVIRONMENT=${process.env.ENVIRONMENT}`);
	await createDbTables();
}

async function createDbTables() {
	logger.info('Start migration');

	try {
		const currentVersion = await getCurrentVersion();
		let sqlByVersion = getSqlByVersion();

		let prevVersion = '';

		if (currentVersion) {
			const index = sqlByVersion.findIndex((item) => item.version === currentVersion);
			if (index === -1) {
				return;
			}

			sqlByVersion = sqlByVersion.slice(index);
			prevVersion = sqlByVersion[0].version;
			sqlByVersion = sqlByVersion.slice(1);
		}

		for (const sql of sqlByVersion) {
			logger.info(`Running upgrade ${prevVersion} -> ${sql.version}`);
			await insertRows(sql.cmd, {
				current: prevVersion,
				next: sql.version
			});
			prevVersion = sql.version;
		}
	} catch (error) {
		logger.error(error);
	}
}

async function getCurrentVersion(): Promise<string | null> {
	try {
		const {rows} = await dbManager.executeModifyQuery(queryAlembicVersion.toString());
		if (!rows[0]) {
			return null;
		}

		return rows[0].version;
	} catch (error) {
		if (error.message === `relation "${TABLE_ALEMBIC_VERSION}" does not exist`) {
			return null;
		}

		throw error;
	}
}

async function insertRows(queries: string[], version: Version) {
	await dbManager.executeInTransaction(async (client) => {
		for (const query of queries) {
			await client.query(query);
		}

		if (version.current) {
			const query = knex(TABLE_ALEMBIC_VERSION)
				.update({version_num: version.next})
				.where({version_num: version.current});

			await client.query(query.toString());
		} else {
			const query = knex(TABLE_ALEMBIC_VERSION)
				.insert({version_num: version.next});

			await client.query(query.toString());
		}
	});
}

function getSqlByVersion(): SqlByVersion[] {
	const folder = glob.sync(path.resolve('src/resources/db/versions/*.sql'));
	return sortBy(folder.map((filePath: string) => ({
		version: filePath.replace('.sql', '').split('/').pop()!,
		cmd: fs.readFileSync(filePath, 'utf-8').split(';\n\n')
	}), 'version'));
}

createTables().then(() => {
	logger.info('Migration was completed!');
	dbManager.forceCloseConnection();
});
